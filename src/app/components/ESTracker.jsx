"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { db } from '../../firebase';
import { doc, setDoc, onSnapshot, collection, query, where, orderBy, getDocs, deleteDoc } from 'firebase/firestore';
import {
  X, Plus, RotateCcw, Trash2, BarChart3, Lock,
  Upload, FileDown, Brain, Loader2, ChevronUp, ChevronDown, Pencil, Clock
} from 'lucide-react';
import {
  LineChart, Line, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// ── Asset presets ──────────────────────────────────────────────
const ASSET_PRESETS = [
  { id: 'ES',  name: 'S&P 500 (ES)',     ticker: 'ES',  exchange: 'CME',    color: '#3b82f6', step: 0.25, placeholders: { o:'5620.00', h:'5648.00', l:'5595.00', c:'5635.00', v:'2040147', oi:'2351003', foi:'1866397' } },
  { id: 'NQ',  name: 'Nasdaq 100 (NQ)',   ticker: 'NQ',  exchange: 'CME',    color: '#8b5cf6', step: 0.25, placeholders: { o:'20180.00', h:'20350.00', l:'20100.00', c:'20290.00', v:'895400', oi:'312500', foi:'290000' } },
  { id: 'CL',  name: 'Crude Oil (CL)',    ticker: 'CL',  exchange: 'NYMEX',  color: '#f59e0b', step: 0.01, placeholders: { o:'68.50', h:'69.80', l:'67.90', c:'69.20', v:'485000', oi:'1890000', foi:'1450000' } },
  { id: 'GC',  name: 'Gold (GC)',         ticker: 'GC',  exchange: 'COMEX',  color: '#eab308', step: 0.10, placeholders: { o:'2340.00', h:'2365.00', l:'2328.00', c:'2358.00', v:'215000', oi:'520000', foi:'410000' } },
  { id: 'YM',  name: 'Dow Jones (YM)',    ticker: 'YM',  exchange: 'CBOT',   color: '#06b6d4', step: 1.00, placeholders: { o:'41200', h:'41450', l:'41050', c:'41380', v:'120000', oi:'95000', foi:'82000' } },
  { id: 'RTY', name: 'Russell 2000 (RTY)',ticker: 'RTY', exchange: 'CME',    color: '#ec4899', step: 0.10, placeholders: { o:'2080.00', h:'2098.00', l:'2065.00', c:'2092.00', v:'185000', oi:'310000', foi:'265000' } },
  { id: 'SI',  name: 'Silver (SI)',       ticker: 'SI',  exchange: 'COMEX',  color: '#94a3b8', step: 0.005,placeholders: { o:'29.50', h:'30.10', l:'29.20', c:'29.85', v:'95000', oi:'180000', foi:'145000' } },
  { id: 'NG',  name: 'Natural Gas (NG)',  ticker: 'NG',  exchange: 'NYMEX',  color: '#22d3ee', step: 0.001,placeholders: { o:'2.180', h:'2.250', l:'2.150', c:'2.230', v:'310000', oi:'1250000', foi:'980000' } },
];

const SAMPLE_DATA = {
  ES: [
    { date:'2026-03-10', open:5620.00, high:5648.00, low:5595.00, close:5635.00, vol:2040147, oi:2351003, foi:1866397 },
    { date:'2026-03-11', open:5635.00, high:5670.25, low:5622.50, close:5661.75, vol:2185320, oi:2378450, foi:1892100 },
    { date:'2026-03-12', open:5661.75, high:5675.00, low:5640.00, close:5645.50, vol:1890200, oi:2345600, foi:1878200 },
    { date:'2026-03-13', open:5645.50, high:5682.00, low:5632.25, close:5678.00, vol:2310400, oi:2402100, foi:1905800 },
    { date:'2026-03-14', open:5678.00, high:5695.50, low:5660.00, close:5688.25, vol:1975600, oi:2389500, foi:1898400 },
  ],
  NQ: [
    { date:'2026-03-10', open:20180.00, high:20350.00, low:20100.00, close:20290.00, vol:895400, oi:312500, foi:290000 },
    { date:'2026-03-11', open:20290.00, high:20480.00, low:20250.00, close:20440.00, vol:920100, oi:318700, foi:295600 },
    { date:'2026-03-12', open:20440.00, high:20510.00, low:20320.00, close:20370.00, vol:845000, oi:310200, foi:288400 },
    { date:'2026-03-13', open:20370.00, high:20550.00, low:20310.00, close:20520.00, vol:980300, oi:325100, foi:302100 },
    { date:'2026-03-14', open:20520.00, high:20600.00, low:20460.00, close:20565.00, vol:878200, oi:320800, foi:298700 },
  ],
  CL: [
    { date:'2026-03-10', open:68.50, high:69.80, low:67.90, close:69.20, vol:485000, oi:1890000, foi:1450000 },
    { date:'2026-03-11', open:69.20, high:70.15, low:68.75, close:69.45, vol:510200, oi:1905000, foi:1462000 },
    { date:'2026-03-12', open:69.45, high:69.90, low:68.20, close:68.60, vol:478000, oi:1878000, foi:1440000 },
    { date:'2026-03-13', open:68.60, high:70.40, low:68.30, close:70.10, vol:545000, oi:1920000, foi:1475000 },
    { date:'2026-03-14', open:70.10, high:70.85, low:69.50, close:70.45, vol:498000, oi:1912000, foi:1468000 },
  ],
};

// ── Helpers ────────────────────────────────────────────────────
function classifyDay(r, prev5) {
  const body = Math.abs(r.close - r.open);
  const range = r.high - r.low;
  const eff = range > 0 ? body / range : 0;
  if (!prev5 || !prev5.length) return { type:'normal', label:'Normal', color:'blue', body, range, eff, ratio:1 };
  const avgRange = prev5.reduce((s, p) => s + (p.high - p.low), 0) / prev5.length;
  const ratio = avgRange > 0 ? range / avgRange : 1;
  if (ratio < 0.70 || eff < 0.35) return { type:'range', label:'Rango', color:'amber', body, range, eff, ratio };
  if (ratio > 1.30 && eff > 0.55) return { type:'trend', label:'Tendencial', color:'purple', body, range, eff, ratio };
  return { type:'normal', label:'Normal', color:'blue', body, range, eff, ratio };
}

function getSignal(r, prev, lang) {
  if (!prev) return null;
  const dir = r.close > r.open ? 'up' : 'down';
  const vUp = r.vol > prev.vol, oUp = r.oi > prev.oi;
  const l = lang === 'en';
  if (dir==='up'  &&  vUp &&  oUp) return { label: l?'Strong Bull':'Alcista fuerte', icon:'▲', type:'bull' };
  if (dir==='down'&&  vUp &&  oUp) return { label: l?'Strong Bear':'Bajista fuerte', icon:'▼', type:'bear' };
  if (dir==='up'  && !vUp && !oUp) return { label: l?'Weak Rally':'Rally débil',     icon:'↑', type:'warn' };
  if (dir==='down'&& !vUp && !oUp) return { label: l?'Weak Drop':'Caída débil',      icon:'↓', type:'warn' };
  return { label: l?'Mixed':'Mixta', icon:'~', type:'neutral' };
}

const sigStyles = {
  bull:   { bg:'bg-green-500/10',  border:'border-green-500/30',  text:'text-green-500',  badge:'bg-green-500/15 text-green-500' },
  bear:   { bg:'bg-red-500/10',    border:'border-red-500/30',    text:'text-red-500',    badge:'bg-red-500/15 text-red-500' },
  warn:   { bg:'bg-amber-500/10',  border:'border-amber-500/30',  text:'text-amber-500',  badge:'bg-amber-500/15 text-amber-500' },
  neutral:{ bg:'bg-slate-500/10',  border:'border-slate-500/30',  text:'text-slate-400',  badge:'bg-slate-500/15 text-slate-400' },
};

const dayColorMap = {
  amber:  { badge:'bg-amber-500/15 text-amber-500',   text:'text-amber-500' },
  blue:   { badge:'bg-blue-500/15 text-blue-400',     text:'text-blue-400' },
  purple: { badge:'bg-purple-500/15 text-purple-400', text:'text-purple-400' },
};

function fmtVol(n) { return n >= 1e6 ? (n/1e6).toFixed(2)+'M' : n >= 1e3 ? (n/1e3).toFixed(0)+'K' : String(n); }
function pct(n) { return n.toFixed(1) + '%'; }
function delta(curr, prev) {
  if (prev == null) return '—';
  const d = (curr - prev) / prev * 100;
  return (d >= 0 ? '+' : '') + d.toFixed(1) + '%';
}
function deltaIsUp(curr, prev) { return prev == null ? null : curr >= prev; }

// ── Component ──────────────────────────────────────────────────
export default function ESTracker({ onClose, isAdmin, estrategias = [] }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const [allData, setAllData] = useState({});       // { ES: [...], NQ: [...], ... }
  const [selectedAsset, setSelectedAsset] = useState('ES');
  const [loading, setLoading] = useState(true);
  const [formDate, setFormDate] = useState('');
  const [formOpen, setFormOpen] = useState('');
  const [formHigh, setFormHigh] = useState('');
  const [formLow, setFormLow] = useState('');
  const [formClose, setFormClose] = useState('');
  const [formVol, setFormVol] = useState('');
  const [formOi, setFormOi] = useState('');
  const [formFoi, setFormFoi] = useState('');
  const [formPoc, setFormPoc] = useState('');
  const [formVah, setFormVah] = useState('');
  const [formVal, setFormVal] = useState('');
  const [formDelta, setFormDelta] = useState('');
  const [formVwap, setFormVwap] = useState('');
  const [importing, setImporting] = useState(false);
  const [chartRange, setChartRange] = useState(60); // days to show in charts
  const [tablePage, setTablePage] = useState(0);
  const TABLE_PAGE_SIZE = 20;
  const [importResult, setImportResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiAnalysisDate, setAiAnalysisDate] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiHistory, setAiHistory] = useState([]); // [{ id, date, asset, analysis, createdAt }]
  const [showAiHistory, setShowAiHistory] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const fileInputRef = useRef(null);
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0, visible: false, chartId: null });

  const asset = ASSET_PRESETS.find(a => a.id === selectedAsset) || ASSET_PRESETS[0];
  const ph = asset.placeholders;

  // ── Firestore: real-time listener on shared document ──
  useEffect(() => {
    const docRef = doc(db, 'market_tracker', 'data');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setAllData(snap.data() || {});
      } else {
        setAllData({});
      }
      setLoading(false);
    }, () => setLoading(false));

    setFormDate(new Date().toISOString().slice(0, 10));
    return () => unsub();
  }, []);

  const records = allData[selectedAsset] || [];
  const sorted = useMemo(() => [...records].sort((a, b) => a.date.localeCompare(b.date)), [records]);

  // ── Firestore: persist (admin only) ──
  const persistToFirestore = useCallback(async (newAllData) => {
    if (!isAdmin) return;
    try {
      await setDoc(doc(db, 'market_tracker', 'data'), newAllData, { merge: true });
    } catch (err) {
      console.error('Error saving tracker data:', err);
    }
  }, [isAdmin]);

  const setRecords = useCallback((updater) => {
    setAllData(prev => {
      const current = prev[selectedAsset] || [];
      const next = typeof updater === 'function' ? updater(current) : updater;
      const newAllData = { ...prev, [selectedAsset]: next };
      persistToFirestore(newAllData);
      return newAllData;
    });
  }, [selectedAsset, persistToFirestore]);

  const resetToSample = useCallback(() => {
    if (!isAdmin) return;
    const es = language === 'es';
    const msg = es ? `¿Restaurar datos demo para ${asset.ticker}?` : `Restore demo data for ${asset.ticker}?`;
    if (!confirm(msg)) return;
    const sample = SAMPLE_DATA[selectedAsset];
    if (sample) {
      setRecords(sample.map(d => ({ ...d })));
    } else {
      alert(es ? `No hay datos demo para ${asset.ticker}.` : `No demo data for ${asset.ticker}.`);
    }
  }, [isAdmin, language, selectedAsset, asset, setRecords]);

  const addEntry = useCallback(() => {
    if (!isAdmin) return;
    const open = parseFloat(formOpen);
    const high = parseFloat(formHigh);
    const low = parseFloat(formLow);
    const close = parseFloat(formClose);
    const vol = parseInt(formVol);
    const oi = parseInt(formOi);
    const foi = formFoi !== '' ? parseInt(formFoi) : null;

    if (!formDate || isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close) || isNaN(vol) || isNaN(oi)) {
      alert(language === 'es'
        ? 'Completa todos los campos obligatorios: Fecha, OHLC, Volumen y OI total.'
        : 'Complete all required fields: Date, OHLC, Volume and Total OI.');
      return;
    }
    if (high < open || high < close || low > open || low > close || high < low) {
      alert(language === 'es'
        ? 'Error en precios: verifica que Máximo sea el valor más alto y Mínimo el más bajo.'
        : 'Price error: verify that High is the highest value and Low is the lowest.');
      return;
    }

    const poc = formPoc !== '' ? parseFloat(formPoc) : null;
    const vah = formVah !== '' ? parseFloat(formVah) : null;
    const val = formVal !== '' ? parseFloat(formVal) : null;
    const dlt = formDelta !== '' ? parseInt(formDelta) : null;
    const vwapVal = formVwap !== '' ? parseFloat(formVwap) : null;

    setRecords(prev => {
      const filtered = prev.filter(r => r.date !== formDate);
      return [...filtered, { date: formDate, open, high, low, close, vol, oi, foi, poc, vah, val, delta: dlt, vwap: vwapVal }];
    });
    setFormOpen(''); setFormHigh(''); setFormLow(''); setFormClose('');
    setFormVol(''); setFormOi(''); setFormFoi('');
    setFormPoc(''); setFormVah(''); setFormVal(''); setFormDelta(''); setFormVwap('');
  }, [isAdmin, formDate, formOpen, formHigh, formLow, formClose, formVol, formOi, formFoi, formPoc, formVah, formVal, formDelta, formVwap, language, setRecords]);

  const deleteEntry = useCallback((date) => {
    if (!isAdmin) return;
    setRecords(prev => prev.filter(r => r.date !== date));
  }, [isAdmin, setRecords]);

  const editEntry = useCallback((record) => {
    if (!isAdmin) return;
    setFormDate(record.date);
    setFormOpen(String(record.open));
    setFormHigh(String(record.high));
    setFormLow(String(record.low));
    setFormClose(String(record.close));
    setFormVol(String(record.vol));
    setFormOi(String(record.oi));
    setFormFoi(record.foi != null ? String(record.foi) : '');
    setFormPoc(record.poc != null ? String(record.poc) : '');
    setFormVah(record.vah != null ? String(record.vah) : '');
    setFormVal(record.val != null ? String(record.val) : '');
    setFormDelta(record.delta != null ? String(record.delta) : '');
    setFormVwap(record.vwap != null ? String(record.vwap) : '');
    // Scroll to form
    document.getElementById('tracker-entry-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isAdmin]);

  // ── Import CSV/Excel (Admin only) ─────────────────────────
  const handleFileImport = useCallback((e) => {
    if (!isAdmin) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);

    const ext = file.name.split('.').pop().toLowerCase();

    const processRows = (rows) => {
      let imported = 0;
      const newRecords = [];

      for (const row of rows) {
        // Map common Barchart column names to our fields
        const dateRaw = row['Time'] || row['Date'] || row['date'] || row['Fecha'] || row['DATE'] || '';
        const openRaw = row['Open'] || row['open'] || row['OPEN'] || row['Apertura'] || '';
        const highRaw = row['High'] || row['high'] || row['HIGH'] || row['Máximo'] || row['Maximo'] || '';
        const lowRaw  = row['Low'] || row['low'] || row['LOW'] || row['Mínimo'] || row['Minimo'] || '';
        const closeRaw = row['Last'] || row['Latest'] || row['Close'] || row['close'] || row['CLOSE'] || row['Cierre'] || row['Settle'] || row['Adj Close'] || '';
        const volRaw = row['Volume'] || row['volume'] || row['VOLUME'] || row['Vol'] || row['Volumen'] || '';
        const oiRaw  = row['Open Int'] || row['Open Interest'] || row['OI'] || row['oi'] || row['OpenInt'] || row['Prev. Day Open Interest'] || '';

        if (!dateRaw || !closeRaw) continue;

        // Parse date - handle formats: MM/DD/YYYY, YYYY-MM-DD, DD/MM/YYYY, etc.
        let date = '';
        const dateStr = String(dateRaw).trim();
        if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
          date = dateStr.slice(0, 10);
        } else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
          const parts = dateStr.split('/');
          date = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        } else if (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(dateStr)) {
          const parts = dateStr.split('/');
          const year = parseInt(parts[2]) > 50 ? '19' + parts[2] : '20' + parts[2];
          date = `${year}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        } else {
          const parsed = new Date(dateStr);
          if (!isNaN(parsed)) date = parsed.toISOString().slice(0, 10);
        }
        if (!date) continue;

        const parseNum = (v) => {
          if (v === '' || v == null) return NaN;
          return parseFloat(String(v).replace(/,/g, ''));
        };

        const open = parseNum(openRaw);
        const high = parseNum(highRaw);
        const low = parseNum(lowRaw);
        const close = parseNum(closeRaw);
        const vol = parseInt(String(volRaw).replace(/,/g, '')) || 0;
        const oi = parseInt(String(oiRaw).replace(/,/g, '')) || 0;

        if (isNaN(close)) continue;

        newRecords.push({
          date,
          open: isNaN(open) ? close : open,
          high: isNaN(high) ? close : high,
          low: isNaN(low) ? close : low,
          close,
          vol,
          oi,
          foi: null,
        });
        imported++;
      }

      if (imported > 0) {
        setRecords(prev => {
          const existingDates = new Set(prev.map(r => r.date));
          const onlyNew = newRecords.filter(r => !existingDates.has(r.date));
          return [...prev, ...onlyNew];
        });
      }

      setImportResult({ count: imported, filename: file.name });
      setImporting(false);
      setTimeout(() => setImportResult(null), 4000);
    };

    if (ext === 'xlsx' || ext === 'xls') {
      // Excel file
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const wb = XLSX.read(evt.target.result, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws);
          processRows(rows);
        } catch (_) {
          setImporting(false);
          alert('Error parsing Excel file');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Try CSV/text for everything else (csv, txt, tsv, or unknown extensions)
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            processRows(results.data);
          } else {
            setImporting(false);
            alert(language === 'es' ? 'No se encontraron datos en el archivo.' : 'No data found in file.');
          }
        },
        error: () => { setImporting(false); alert('Error parsing file'); }
      });
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [isAdmin, language, setRecords]);

  // ── Computed ───────────────────────────────────────────────
  const metrics = useMemo(() => {
    if (!sorted.length) return null;
    const last = sorted[sorted.length - 1];
    const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
    const prev5 = sorted.slice(-6, -1);
    const day = classifyDay(last, prev5);
    const avgR5 = prev5.length ? prev5.reduce((a, r) => a + (r.high - r.low), 0) / prev5.length : 0;
    const foiPct = last.foi && last.oi ? last.foi / last.oi * 100 : null;
    return { last, prev, day, avgR5, foiPct };
  }, [sorted]);

  const alerts = useMemo(() => {
    if (sorted.length < 2) return [];
    const last = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    const prev5 = sorted.slice(-6, -1);
    const sig = getSignal(last, prev, language);
    const day = classifyDay(last, prev5);
    const foiPct = last.foi && last.oi ? last.foi / last.oi * 100 : null;
    const result = [];
    if (sig) {
      const s = sigStyles[sig.type];
      const went = language === 'es' ? (last.close >= last.open ? 'Subió' : 'Bajó') : (last.close >= last.open ? 'Up' : 'Down');
      result.push({
        key:'signal', styles:s, icon:sig.icon,
        title:`${language === 'es' ? 'Señal vol/OI' : 'Vol/OI Signal'} · ${sig.label}`,
        detail:`${last.date} · ${went} ${Math.abs(last.close - last.open).toFixed(2)} pts · ${language==='es'?'Rango':'Range'} ${(last.high-last.low).toFixed(0)} pts (${day.label}) · Vol ${delta(last.vol,prev?.vol)} · OI ${delta(last.oi,prev?.oi)}`
      });
    }
    if (foiPct != null && foiPct < 70) {
      result.push({
        key:'roll',
        styles:{ bg:'bg-purple-500/10', border:'border-purple-500/30', text:'text-purple-400' },
        icon:'⚠',
        title:`Roll ${language==='es'?'activo':'active'} · Front month OI = ${pct(foiPct)}`,
        detail: language==='es'
          ? `Señales vol/OI menos confiables · Verificar contrato correcto de ${asset.ticker}`
          : `Vol/OI signals less reliable · Verify correct ${asset.ticker} contract`
      });
    }
    return result;
  }, [sorted, language, asset]);

  // Chart data filtered by range
  const chartSorted = useMemo(() =>
    chartRange === 0 ? sorted : sorted.slice(-chartRange),
    [sorted, chartRange]
  );
  const volChartData = useMemo(() =>
    chartSorted.map(r => ({ name: r.date.slice(5), vol: r.vol, oi: r.oi })), [chartSorted]
  );

  const deltaChartData = useMemo(() => {
    const withDelta = chartSorted.filter(r => r.delta != null);
    if (withDelta.length === 0) return null;
    return chartSorted.map(r => ({
      name: r.date.slice(5),
      delta: r.delta != null ? Math.abs(r.delta) : null,
      rawDelta: r.delta != null ? r.delta : null,
      isPositive: r.delta != null ? r.delta >= 0 : null,
    }));
  }, [chartSorted]);

  // Table rows (all, reversed) + pagination
  const tableRows = useMemo(() => {
    return [...sorted].reverse().map((r, revIdx) => {
      const idx = sorted.length - 1 - revIdx;
      const prev = idx > 0 ? sorted[idx - 1] : null;
      const prev5 = sorted.slice(Math.max(0, idx - 5), idx);
      const day = classifyDay(r, prev5);
      const sig = getSignal(r, prev, language);
      const foiPct = r.foi && r.oi ? r.foi / r.oi * 100 : null;
      return { r, prev, day, sig, foiPct };
    });
  }, [sorted, language]);

  const totalPages = Math.ceil(tableRows.length / TABLE_PAGE_SIZE);
  const pagedRows = useMemo(() =>
    tableRows.slice(tablePage * TABLE_PAGE_SIZE, (tablePage + 1) * TABLE_PAGE_SIZE),
    [tableRows, tablePage]
  );

  // Reset page when switching asset
  // Reset state when switching asset
  useEffect(() => {
    setTablePage(0);
    setAiAnalysis('');
    setAiAnalysisDate('');
    setShowAiPanel(false);
    setShowAiHistory(false);
  }, [selectedAsset]);

  const assetCounts = useMemo(() => {
    const counts = {};
    ASSET_PRESETS.forEach(a => { counts[a.id] = (allData[a.id] || []).length; });
    return counts;
  }, [allData]);

  // ── VWAP (manual from ATAS — session VWAP per day) ─────
  const vwapData = useMemo(() => {
    if (chartSorted.length < 2) return null;

    const hasAny = chartSorted.some(r => r.vwap != null);
    if (!hasAny) return null;

    const points = chartSorted.map(r => ({
      name: r.date.slice(5),
      vwap: r.vwap != null ? parseFloat(r.vwap.toFixed(2)) : null,
    }));

    const lastWithVwap = [...chartSorted].reverse().find(r => r.vwap != null);
    const last = lastWithVwap ? { vwap: parseFloat(lastWithVwap.vwap.toFixed(2)) } : null;

    return { points, last };
  }, [chartSorted]);

  const priceChartData = useMemo(() =>
    chartSorted.map((r, i) => ({
      name: r.date.slice(5),
      open: r.open,
      high: r.high,
      low: r.low,
      close: r.close,
      // For candlestick body: [min(open,close), max(open,close)]
      body: [Math.min(r.open, r.close), Math.max(r.open, r.close)],
      // For wick: [low, high]
      wick: [r.low, r.high],
      bullish: r.close >= r.open,
      poc: r.poc || null,
      vah: r.vah || null,
      val: r.val || null,
      delta: r.delta != null ? r.delta : null,
      deltaAbs: r.delta != null ? Math.abs(r.delta) : null,
      deltaPositive: r.delta != null ? r.delta >= 0 : null,
      vwap: vwapData?.points[i]?.vwap || null,
    })), [chartSorted, vwapData]
  );

  // ── Technical Levels (52-week based) ──────────────────────
  const [showFib, setShowFib] = useState(true);
  const [showPivots, setShowPivots] = useState(true);
  const [showVwap, setShowVwap] = useState(true);
  const [tradingTimeframe, setTradingTimeframe] = useState('5m');
  const [techPeriod, setTechPeriod] = useState(260); // trading days (260≈52w)

  const techLevels = useMemo(() => {
    if (sorted.length < 2) return null;

    // Use selected period (0 = all data)
    const data52w = techPeriod === 0 ? sorted : sorted.slice(-techPeriod);
    const high52 = Math.max(...data52w.map(r => r.high));
    const low52 = Math.min(...data52w.map(r => r.low));
    const range52 = high52 - low52;
    const last = sorted[sorted.length - 1];

    // Fibonacci retracements (52w Low → High)
    // 0% = Low (inicio del impulso), 100% = High (fin del impulso)
    // Retrocesos desde el High: 23.6%, 38.2%, 50%, 61.8%, 78.6%
    const fibLevels = [
      { pct: 0,     level: low52,                    label: '0% (Low)',   color: '#22c55e' },
      { pct: 23.6,  level: low52 + range52 * 0.236,  label: '23.6%',     color: '#14b8a6' },
      { pct: 38.2,  level: low52 + range52 * 0.382,  label: '38.2%',     color: '#3b82f6' },
      { pct: 50,    level: low52 + range52 * 0.5,    label: '50%',       color: '#a855f7' },
      { pct: 61.8,  level: low52 + range52 * 0.618,  label: '61.8%',     color: '#f59e0b' },
      { pct: 78.6,  level: low52 + range52 * 0.786,  label: '78.6%',     color: '#f97316' },
      { pct: 100,   level: high52,                    label: '100% (High)', color: '#ef4444' },
    ];

    // Classic Pivot Points (last session)
    const pp = (last.high + last.low + last.close) / 3;
    const r1 = 2 * pp - last.low;
    const s1 = 2 * pp - last.high;
    const r2 = pp + (last.high - last.low);
    const s2 = pp - (last.high - last.low);
    const r3 = last.high + 2 * (pp - last.low);
    const s3 = last.low - 2 * (last.high - pp);

    const pivotLevels = [
      { label: 'R3', level: r3, color: '#ef4444', type: 'resistance' },
      { label: 'R2', level: r2, color: '#f97316', type: 'resistance' },
      { label: 'R1', level: r1, color: '#f59e0b', type: 'resistance' },
      { label: 'PP', level: pp, color: '#a855f7', type: 'pivot' },
      { label: 'S1', level: s1, color: '#22c55e', type: 'support' },
      { label: 'S2', level: s2, color: '#14b8a6', type: 'support' },
      { label: 'S3', level: s3, color: '#06b6d4', type: 'support' },
    ];

    // Key S/R from price action (52w high/low, recent swing)
    const last20 = sorted.slice(-20);
    const high20 = Math.max(...last20.map(r => r.high));
    const low20 = Math.min(...last20.map(r => r.low));

    // Position: how far price is from 52w low (0%) to high (100%)
    const position52 = range52 > 0 ? ((last.close - low52) / range52 * 100).toFixed(1) : '50.0';

    return {
      fib: fibLevels,
      pivots: pivotLevels,
      high52, low52, range52,
      high20, low20,
      pp,
      position52,
      lastClose: last.close,
      lastDate: last.date,
      lastHigh: last.high,
      lastLow: last.low,
      lastCloseVal: last.close,
      periodDays: data52w.length,
    };
  }, [sorted, techPeriod]);

  // ── Export PDF ─────────────────────────────────────────────
  const exportPDF = useCallback(async () => {
    if (!sorted.length) return;
    setExportingPdf(true);

    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const es = language === 'es';
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentW = pageW - margin * 2;
      const dec = asset.step < 0.01 ? 3 : 2;

      // ── Helper: clean text for PDF (ASCII only) ──
      const pdfSafe = (text) => String(text).replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '-');

      // ── Helper: section title ──
      const sectionTitle = (text, yPos) => {
        pdf.setFillColor(37, 99, 235);
        pdf.rect(margin, yPos, contentW, 7, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text.toUpperCase(), margin + 3, yPos + 5);
        return yPos + 10;
      };

      // ── Helper: key-value row ──
      const kvRow = (label, value, yPos, valueColor) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(label, margin + 2, yPos);
        pdf.setFont('helvetica', 'bold');
        if (valueColor) pdf.setTextColor(...valueColor);
        else pdf.setTextColor(30, 30, 30);
        pdf.text(String(value), margin + 65, yPos);
        return yPos + 5;
      };

      // ── Data computations ──
      const last = sorted[sorted.length - 1];
      const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
      const last5 = sorted.slice(-5);
      const last10 = sorted.slice(-10);
      const last20 = sorted.slice(-20);
      const avgR5 = last5.reduce((s, r) => s + (r.high - r.low), 0) / last5.length;
      const avgR20 = last20.length ? last20.reduce((s, r) => s + (r.high - r.low), 0) / last20.length : avgR5;
      const avgV5 = last5.reduce((s, r) => s + r.vol, 0) / last5.length;
      const avgV20 = last20.length ? last20.reduce((s, r) => s + r.vol, 0) / last20.length : avgV5;
      const high20 = last20.length ? Math.max(...last20.map(r => r.high)) : last.high;
      const low20 = last20.length ? Math.min(...last20.map(r => r.low)) : last.low;
      const weekChange = last5.length >= 2 ? last5[last5.length - 1].close - last5[0].open : 0;
      const weekChangePct = last5.length >= 2 ? (weekChange / last5[0].open * 100) : 0;
      const bullDays = last10.filter(r => r.close >= r.open).length;
      const bearDays = last10.length - bullDays;
      const foiPct = last.foi && last.oi ? last.foi / last.oi * 100 : null;
      const lastDay = classifyDay(last, sorted.slice(-6, -1));
      const lastSig = getSignal(last, prev, language);

      // ── Helper: page header ──
      let logoImgCache = null;
      try {
        const logoImg = new Image();
        logoImg.src = '/iconoapp.png';
        await new Promise((resolve) => { logoImg.onload = resolve; logoImg.onerror = resolve; setTimeout(resolve, 2000); });
        if (logoImg.complete && logoImg.naturalWidth > 0) logoImgCache = logoImg;
      } catch (_) {}

      const addPageHeader = (pageTitle) => {
        const hY = 8;
        if (logoImgCache) {
          const lH = 14, lW = lH * (logoImgCache.naturalWidth / logoImgCache.naturalHeight);
          pdf.addImage(logoImgCache, 'PNG', margin, hY, lW, lH);
        }
        pdf.setTextColor(30, 30, 30);
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${asset.ticker}  ·  ${pageTitle}`, pageW / 2, hY + 6, { align: 'center' });
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(120);
        pdf.text(`${asset.exchange}  |  ${new Date().toLocaleDateString(es ? 'es-MX' : 'en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}  |  ${sorted.length} ${es ? 'sesiones' : 'sessions'}`, pageW / 2, hY + 12, { align: 'center' });
        pdf.setFontSize(7);
        pdf.setTextColor(130);
        pdf.text('www.tjpromx.app', pageW - margin, hY + 6, { align: 'right' });
        pdf.setDrawColor(200);
        pdf.line(margin, hY + 16, pageW - margin, hY + 16);
        return hY + 21;
      };

      // ══════════════════════════════════════════════════════
      // PAGE 1: INFORMACIÓN TÉCNICA
      // ══════════════════════════════════════════════════════
      let y = addPageHeader(es ? 'Reporte Institucional' : 'Institutional Report');

      // ── SECCIÓN: SNAPSHOT ──
      y = sectionTitle(es ? 'Snapshot del mercado' : 'Market Snapshot', y);
      const isUp = last.close >= last.open;
      y = kvRow(es ? 'Último cierre' : 'Last close', `${last.close.toFixed(dec)}  ${isUp ? '▲' : '▼'} ${Math.abs(last.close - last.open).toFixed(dec)} pts`, y, isUp ? [34, 197, 94] : [239, 68, 68]);
      y = kvRow(es ? 'Rango de la sesión' : 'Session range', `${(last.high - last.low).toFixed(dec)} pts  (H: ${last.high.toFixed(dec)}  L: ${last.low.toFixed(dec)})`, y);
      y = kvRow(es ? 'Tipo de día' : 'Day type', `${lastDay.label}  —  ${es ? 'eficiencia' : 'efficiency'}: ${(lastDay.eff * 100).toFixed(1)}%`, y);
      y = kvRow(es ? 'Señal vol/OI' : 'Vol/OI signal', lastSig ? `${lastSig.icon} ${lastSig.label}` : '—', y,
        lastSig?.type === 'bull' ? [34,197,94] : lastSig?.type === 'bear' ? [239,68,68] : lastSig?.type === 'warn' ? [245,158,11] : null);
      y = kvRow(es ? 'Volumen' : 'Volume', `${fmtVol(last.vol)}  (${delta(last.vol, prev?.vol)} vs ${es ? 'anterior' : 'prev'})`, y);
      y = kvRow('Open Interest', `${fmtVol(last.oi)}  (${delta(last.oi, prev?.oi)} vs ${es ? 'anterior' : 'prev'})`, y);
      if (foiPct != null) {
        y = kvRow('Front Month OI', `${foiPct.toFixed(1)}%  ${foiPct < 70 ? (es ? '⚠ Roll activo' : '⚠ Active roll') : foiPct < 80 ? (es ? 'Roll iniciando' : 'Roll starting') : 'OK'}`, y,
          foiPct < 70 ? [239,68,68] : foiPct < 80 ? [245,158,11] : [34,197,94]);
      }
      y += 3;

      // ── SECCIÓN: ESTADÍSTICAS ──
      y = sectionTitle(es ? 'Estadísticas clave' : 'Key Statistics', y);
      y = kvRow(es ? 'Cambio semanal (5d)' : 'Weekly change (5d)', `${weekChange >= 0 ? '+' : ''}${weekChange.toFixed(dec)} (${weekChangePct >= 0 ? '+' : ''}${weekChangePct.toFixed(2)}%)`, y, weekChange >= 0 ? [34,197,94] : [239,68,68]);
      y = kvRow(es ? 'Rango promedio 5d' : 'Avg range 5d', `${avgR5.toFixed(dec)} pts`, y);
      y = kvRow(es ? 'Rango promedio 20d' : 'Avg range 20d', `${avgR20.toFixed(dec)} pts`, y);
      y = kvRow(es ? 'Volumen promedio 5d' : 'Avg volume 5d', fmtVol(avgV5), y);
      y = kvRow(es ? 'Volumen promedio 20d' : 'Avg volume 20d', fmtVol(avgV20), y);
      y = kvRow(es ? 'Máximo 20d' : '20d high', last.high === high20 ? `${high20.toFixed(dec)} ← HOY` : high20.toFixed(dec), y);
      y = kvRow(es ? 'Mínimo 20d' : '20d low', last.low === low20 ? `${low20.toFixed(dec)} ← HOY` : low20.toFixed(dec), y);
      y = kvRow(es ? 'Sesiones alcistas / bajistas (10d)' : 'Bull / bear sessions (10d)', `${bullDays} / ${bearDays}`, y);
      y += 3;

      // ── SECCIÓN: NIVELES TÉCNICOS ──
      if (techLevels) {
        if (y > pageH - 80) { pdf.addPage(); y = 15; }
        y = sectionTitle(es ? 'Niveles técnicos (52 semanas)' : 'Technical Levels (52 weeks)', y);

        const col1X = margin + 2;
        const col2X = margin + contentW / 2 + 5;

        // Fibonacci
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(147, 51, 234);
        pdf.text(`Fibonacci (${es ? 'Retrocesos' : 'Retracements'})`, col1X, y);
        // Pivots
        pdf.setTextColor(59, 130, 246);
        pdf.text('Pivot Points', col2X, y);
        y += 5;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);

        const maxRows = Math.max(techLevels.fib.length, techLevels.pivots.length + 2);
        const pivotAll = [
          { label: es ? 'Máx 52s' : '52w High', level: techLevels.high52 },
          ...techLevels.pivots,
          { label: es ? 'Mín 52s' : '52w Low', level: techLevels.low52 },
        ];

        for (let i = 0; i < maxRows; i++) {
          if (i < techLevels.fib.length) {
            const f = techLevels.fib[i];
            pdf.setTextColor(100);
            pdf.text(f.label, col1X, y);
            pdf.setTextColor(30, 30, 30);
            pdf.text(f.level.toFixed(dec), col1X + 25, y);
          }
          if (i < pivotAll.length) {
            const p = pivotAll[i];
            pdf.setTextColor(100);
            pdf.text(p.label, col2X, y);
            pdf.setTextColor(30, 30, 30);
            pdf.text(p.level.toFixed(dec), col2X + 25, y);
          }
          y += 4;
        }

        // Position
        pdf.setTextColor(100);
        pdf.text(`${es ? 'Posición en rango 52s' : 'Position in 52w range'}: ${techLevels.position52}%`, col1X, y);
        y += 6;
      }

      // ── SECCIÓN: VWAP & VOLUME PROFILE ──
      if (vwapData?.last) {
        if (y > pageH - 50) { pdf.addPage(); y = 15; }
        y = sectionTitle('VWAP & Volume Profile', y);

        const col1X = margin + 2;
        const col2X = margin + contentW / 2 + 5;

        // VWAP column
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(245, 158, 11);
        pdf.text('VWAP', col1X, y);
        pdf.setTextColor(147, 51, 234);
        pdf.text('Volume Profile', col2X, y);
        y += 5;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);

        const vw = vwapData.last;
        const vwapRows = [
          { label: 'VWAP (ATAS)', value: vw.vwap.toFixed(dec) },
          { label: es ? 'Precio vs VWAP' : 'Price vs VWAP', value: last.close > vw.vwap ? `+${(last.close - vw.vwap).toFixed(dec)} ${es ? 'arriba' : 'above'}` : `${(last.close - vw.vwap).toFixed(dec)} ${es ? 'abajo' : 'below'}` },
        ];

        // Volume Profile: last 5 sessions with POC data
        const vpRecent = sorted.filter(r => r.poc).slice(-5).reverse();

        const maxVpRows = Math.max(vwapRows.length, vpRecent.length > 0 ? vpRecent.length + 1 : 1);

        for (let i = 0; i < maxVpRows; i++) {
          if (i < vwapRows.length) {
            pdf.setTextColor(100);
            pdf.text(vwapRows[i].label, col1X, y);
            pdf.setTextColor(30, 30, 30);
            pdf.text(vwapRows[i].value, col1X + 30, y);
          }
          if (vpRecent.length > 0) {
            if (i === 0) {
              // Header row
              pdf.setTextColor(100);
              pdf.text(es ? 'Fecha' : 'Date', col2X, y);
              pdf.text('POC', col2X + 22, y);
              pdf.text('VAH', col2X + 42, y);
              pdf.text('VAL', col2X + 62, y);
            } else if (i - 1 < vpRecent.length) {
              const vp = vpRecent[i - 1];
              pdf.setTextColor(100);
              pdf.text(vp.date, col2X, y);
              pdf.setTextColor(147, 51, 234);
              pdf.text(vp.poc ? vp.poc.toFixed(dec) : '—', col2X + 22, y);
              pdf.setTextColor(251, 113, 133);
              pdf.text(vp.vah ? vp.vah.toFixed(dec) : '—', col2X + 42, y);
              pdf.setTextColor(52, 211, 153);
              pdf.text(vp.val ? vp.val.toFixed(dec) : '—', col2X + 62, y);
            }
          } else if (i === 0) {
            pdf.setTextColor(140);
            pdf.text(es ? 'Sin datos de Volume Profile' : 'No Volume Profile data', col2X, y);
          }
          y += 4;
        }
        y += 3;
      }

      // ══════════════════════════════════════════════════════
      // PAGE 2: GRÁFICAS
      // ══════════════════════════════════════════════════════
      pdf.addPage();
      y = addPageHeader(es ? 'Gráficas' : 'Charts');

      const captureChart = (elementId) => {
        return new Promise((resolve) => {
          const container = document.getElementById(elementId);
          if (!container) { resolve(null); return; }
          const svg = container.querySelector('svg');
          if (!svg) { resolve(null); return; }
          const clone = svg.cloneNode(true);
          const rect = svg.getBoundingClientRect();
          clone.setAttribute('width', rect.width);
          clone.setAttribute('height', rect.height);
          const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          bg.setAttribute('width', '100%');
          bg.setAttribute('height', '100%');
          bg.setAttribute('fill', isDark ? '#1e293b' : '#ffffff');
          clone.insertBefore(bg, clone.firstChild);
          const svgData = new XMLSerializer().serializeToString(clone);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = 2;
            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0, rect.width, rect.height);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
          img.src = url;
        });
      };

      const priceImg = await captureChart('tracker-price-chart');
      const volImg = await captureChart('tracker-vol-chart');

      // Price chart — top half
      const chartH = (pageH - y - 20) / 2;
      if (priceImg) {
        const chartPeriodLabel = chartRange === 0 ? (es ? 'Todo' : 'All') : chartRange <= 30 ? '30d' : chartRange <= 60 ? '60d' : chartRange <= 90 ? '90d' : chartRange <= 130 ? '6m' : chartRange <= 195 ? '9m' : chartRange <= 260 ? '1y' : chartRange <= 520 ? '2y' : chartRange <= 780 ? '3y' : '5y';
        y = sectionTitle(`${asset.ticker} · 1D · ${chartPeriodLabel} (${chartSorted.length} ${es ? 'sesiones' : 'sessions'})`, y);
        pdf.addImage(priceImg, 'PNG', margin, y, contentW, chartH - 14);
        y += chartH - 10;
      }
      // Volume chart — bottom half
      if (volImg) {
        y = sectionTitle(es ? 'Volumen & Open Interest' : 'Volume & Open Interest', y);
        pdf.addImage(volImg, 'PNG', margin, y, contentW, chartH - 14);
      }

      // ══════════════════════════════════════════════════════
      // PAGE 3: ÚLTIMAS 30 SESIONES (landscape)
      // ══════════════════════════════════════════════════════
      pdf.addPage('landscape');
      y = addPageHeader(es ? 'Últimas 30 sesiones' : 'Last 30 Sessions');

      const recentHeaders = [
        [es ? 'Fecha' : 'Date', 'Open', 'High', 'Low', 'Close',
         es ? 'Rango' : 'Range', es ? 'Efic.' : 'Eff.',
         es ? 'Tipo' : 'Type', es ? 'Vol' : 'Vol', 'Vol Δ',
         'OI', 'OI Δ', 'POC', 'VAH', 'VAL',
         es ? 'Señal' : 'Signal']
      ];

      const recentData = sorted.slice(-30).reverse().map((r, revI) => {
        const idx = sorted.length - 1 - revI;
        const p = idx > 0 ? sorted[idx - 1] : null;
        const p5 = sorted.slice(Math.max(0, idx - 5), idx);
        const d = classifyDay(r, p5);
        const s = getSignal(r, p, language);
        return [
          r.date, r.open.toFixed(dec), r.high.toFixed(dec), r.low.toFixed(dec), r.close.toFixed(dec),
          d.range.toFixed(dec), (d.eff * 100).toFixed(0) + '%',
          d.label, fmtVol(r.vol), pdfSafe(delta(r.vol, p?.vol)),
          fmtVol(r.oi), pdfSafe(delta(r.oi, p?.oi)),
          r.poc ? r.poc.toFixed(dec) : '-', r.vah ? r.vah.toFixed(dec) : '-', r.val ? r.val.toFixed(dec) : '-',
          s ? s.label : '-'
        ];
      });

      autoTable(pdf, {
        startY: y,
        head: recentHeaders,
        body: recentData,
        styles: { fontSize: 6.5, cellPadding: 1.5, font: 'helvetica', halign: 'center' },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 6, halign: 'center' },
        columnStyles: { 0: { halign: 'left' }, 7: { halign: 'left' }, 15: { halign: 'left' } },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: margin, right: margin },
      });

      // ══════════════════════════════════════════════════════
      // PAGE 2: AI ANALYSIS (si disponible)
      // ══════════════════════════════════════════════════════
      // ══════════════════════════════════════════════════════
      // PAGE 4: ANÁLISIS TÉCNICO IA
      // ══════════════════════════════════════════════════════
      if (aiAnalysis) {
        pdf.addPage('portrait');
        let ay = addPageHeader(es ? 'Análisis Técnico IA' : 'AI Technical Analysis');

        pdf.setTextColor(40, 40, 40);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');

        const currentPageW = pdf.internal.pageSize.getWidth();
        const currentContentW = currentPageW - margin * 2;
        const currentPageH = pdf.internal.pageSize.getHeight();

        // Strip emojis and any non-Latin1 characters for jsPDF compatibility
        const cleanText = aiAnalysis
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/^#{1,3}\s*/gm, '')
          .replace(/\n{3,}/g, '\n\n')
          .replace(/[^\x00-\xFF]/g, '')
          .replace(/  +/g, ' ');

        const lines = pdf.splitTextToSize(cleanText, currentContentW);
        for (const line of lines) {
          if (ay > currentPageH - 15) {
            pdf.addPage('portrait');
            ay = 15;
          }
          if (/^[A-ZÁÉÍÓÚÑ0-9\s.,:()\/&]{10,}$/.test(line.trim()) || /^\d+\.\s+[A-ZÁÉÍÓÚÑ]/.test(line.trim())) {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9);
            pdf.setTextColor(37, 99, 235);
            ay += 2;
          } else {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(40, 40, 40);
          }
          pdf.text(line, margin, ay);
          ay += 4;
        }
      }

      // ── Disclaimer (last page) ──
      const lastPage = pdf.internal.getNumberOfPages();
      pdf.setPage(lastPage);
      const disclaimerY = pdf.internal.pageSize.getHeight() - 28;

      pdf.setDrawColor(200);
      pdf.line(margin, disclaimerY, pageW - margin, disclaimerY);

      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(120);
      pdf.text(es ? 'AVISO DE RESPONSABILIDAD' : 'DISCLAIMER', margin, disclaimerY + 4);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(5.5);
      pdf.setTextColor(140);
      const disclaimerText = es
        ? 'Este reporte es generado con fines informativos y educativos. No constituye asesoría financiera, recomendación de inversión ni solicitud de compra o venta de instrumentos financieros. El trading de futuros implica un alto nivel de riesgo y puede no ser adecuado para todos los inversionistas. Los datos presentados provienen de fuentes públicas y pueden contener errores o retrasos. El análisis AI es generado por inteligencia artificial y no debe considerarse como consejo profesional. Consulte a un asesor financiero autorizado antes de tomar decisiones de inversión. Trading Journal PRO y sus operadores no se hacen responsables por pérdidas derivadas del uso de esta información.'
        : 'This report is generated for informational and educational purposes only. It does not constitute financial advice, investment recommendation, or solicitation to buy or sell financial instruments. Futures trading involves a high level of risk and may not be suitable for all investors. Data presented comes from public sources and may contain errors or delays. AI analysis is generated by artificial intelligence and should not be considered professional advice. Consult a licensed financial advisor before making investment decisions. Trading Journal PRO and its operators are not liable for losses arising from the use of this information.';
      const disclaimerLines = pdf.splitTextToSize(disclaimerText, contentW);
      pdf.text(disclaimerLines, margin, disclaimerY + 8);

      // ── Footer on all pages ──
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(6);
        pdf.setTextColor(150);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Trading Journal PRO  ·  www.tjpromx.app  ·  ${asset.ticker} ${es ? 'Reporte' : 'Report'}  ·  ${es ? 'Pág' : 'Page'} ${i}/${pageCount}`, pageW / 2, pageH - 4, { align: 'center' });
      }

      pdf.save(`${asset.ticker}_reporte_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Error generating PDF');
    }
    setExportingPdf(false);
  }, [sorted, metrics, language, asset, aiAnalysis]);

  // ── AI Analysis: load history for current asset ──────────
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const q = query(
          collection(db, 'tracker_analyses'),
          where('asset', '==', selectedAsset),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAiHistory(items);
      } catch (_) { /* collection may not exist yet */ }
    };
    if (selectedAsset) loadHistory();
  }, [selectedAsset]);

  // ── AI Technical Analysis ──────────────────────────────────
  const requestAiAnalysis = useCallback(async () => {
    if (!sorted.length) return;
    setAiLoading(true);
    setShowAiPanel(true);
    setShowAiHistory(false);
    setAiAnalysis('');

    try {
      const res = await fetch('/api/tracker-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetData: chartSorted,
          totalSessions: sorted.length,
          assetTicker: asset.ticker,
          language,
          calculatedVwap: vwapData?.last ? {
            vwap: vwapData.last.vwap,
            chartPeriod: chartRange || sorted.length,
          } : null,
          calculatedLevels: techLevels ? {
            high52: techLevels.high52,
            low52: techLevels.low52,
            position52: techLevels.position52,
            pp: techLevels.pp,
            fib: techLevels.fib.map(f => ({ label: f.label, level: f.level })),
            pivots: techLevels.pivots.map(p => ({ label: p.label, level: p.level })),
            techPeriodDays: techLevels.periodDays,
          } : null,
          tradingTimeframe,
          userStrategies: estrategias.map(s => ({
            nombre: s.nombre,
            reglas: (s.reglas || []).map(r => ({ texto: r.texto, descripcion: r.descripcion || '' })),
          })),
        }),
      });

      const data = await res.json();
      if (data.error) {
        setAiAnalysis(`Error: ${data.error}`);
      } else {
        const today = new Date().toISOString().slice(0, 10);
        setAiAnalysis(data.analysis);
        setAiAnalysisDate(today);

        // Save to Firestore
        try {
          const docId = `${selectedAsset}_${today}`;
          await setDoc(doc(db, 'tracker_analyses', docId), {
            asset: selectedAsset,
            ticker: asset.ticker,
            date: today,
            analysis: data.analysis,
            language,
            sessionsCount: sorted.length,
            lastClose: sorted[sorted.length - 1]?.close,
            createdAt: new Date(),
          });
          // Refresh history
          const q = query(
            collection(db, 'tracker_analyses'),
            where('asset', '==', selectedAsset),
            orderBy('createdAt', 'desc')
          );
          const snap = await getDocs(q);
          setAiHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (saveErr) {
          console.error('Error saving analysis:', saveErr);
        }
      }
    } catch (err) {
      setAiAnalysis(`Error: ${err.message}`);
    }
    setAiLoading(false);
  }, [sorted, chartSorted, chartRange, vwapData, techLevels, asset, selectedAsset, language]);

  const loadAnalysis = useCallback((item) => {
    setAiAnalysis(item.analysis);
    setAiAnalysisDate(item.date);
    setShowAiHistory(false);
    setShowAiPanel(true);
  }, []);

  const deleteAnalysis = useCallback(async (id) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, 'tracker_analyses', id));
      setAiHistory(prev => prev.filter(h => h.id !== id));
      if (aiHistory.find(h => h.id === id)?.analysis === aiAnalysis) {
        setAiAnalysis('');
        setAiAnalysisDate('');
      }
    } catch (_) { /* ignore */ }
  }, [isAdmin, aiHistory, aiAnalysis]);

  // ── i18n ───────────────────────────────────────────────────
  const es = language === 'es';
  const t = {
    title:       es ? 'Análisis Institucional' : 'Institutional Analysis',
    subtitle:    es ? 'Volumen · Open Interest · OHLC · Clasificación de jornada' : 'Volume · Open Interest · OHLC · Session Classification',
    demo:        'Demo',
    lastClose:   es ? 'Último cierre' : 'Last close',
    dayRange:    es ? 'Rango jornada' : 'Day range',
    dayType:     es ? 'Tipo de día' : 'Day type',
    volume:      es ? 'Volumen' : 'Volume',
    frontOI:     'Front month OI',
    pts:         'pts',
    avg5d:       es ? 'prom 5d' : 'avg 5d',
    eff:         es ? 'efic.' : 'eff.',
    range:       es ? 'rango' : 'range',
    priceChart:  es ? `Precio de cierre ${asset.ticker}` : `${asset.ticker} Close Price`,
    volChart:    es ? 'Volumen & Open Interest' : 'Volume & Open Interest',
    register:    es ? 'Registrar sesión' : 'Register session',
    source:      es ? `datos ${asset.exchange} — diario` : `${asset.exchange} data — daily`,
    date:        es ? 'Fecha' : 'Date',
    open:        es ? 'Apertura' : 'Open',
    high:        es ? 'Máximo' : 'High',
    low:         es ? 'Mínimo' : 'Low',
    close:       es ? 'Cierre' : 'Close',
    totalVol:    es ? 'Volumen total' : 'Total volume',
    totalOI:     'OI total',
    frontOILbl:  'OI front month',
    optional:    es ? 'opcional' : 'optional',
    add:         es ? 'Agregar' : 'Add',
    history:     es ? 'Historial' : 'History',
    body:        es ? 'Cuerpo' : 'Body',
    effShort:    es ? 'Efic.' : 'Eff.',
    signal:      es ? 'Señal' : 'Signal',
    noData:      es ? 'Sin datos aún.' : 'No data yet.',
    guide:       es ? 'Guía de clasificación' : 'Classification guide',
    rangeDay:    es ? 'Día Rango' : 'Range Day',
    rangeCond:   es ? 'Rango < 70% del promedio 5 días\nó cuerpo < 35% del rango\nMercado en balance — evitar breakouts falsos' : 'Range < 70% of 5-day avg\nor body < 35% of range\nMarket in balance — avoid false breakouts',
    normalDay:   es ? 'Día Normal' : 'Normal Day',
    normalCond:  es ? 'Rango y cuerpo dentro de promedios\nContexto estándar\nOperar según bias de orden de flujo' : 'Range and body within averages\nStandard context\nTrade according to order flow bias',
    trendDay:    es ? 'Día Tendencial' : 'Trend Day',
    trendCond:   es ? 'Rango > 130% del promedio 5 días\nY cuerpo > 55% del rango total\nDesequilibrio real — seguir dirección' : 'Range > 130% of 5-day avg\nAnd body > 55% of total range\nReal imbalance — follow direction',
    bullStrong:  es ? 'Alcista fuerte' : 'Strong Bull',
    bullCond:    es ? 'Cierre > Apertura · Vol ↑ · OI ↑\nDinero nuevo entrando largo\nTendencia con combustible institucional' : 'Close > Open · Vol ↑ · OI ↑\nNew money going long\nTrend with institutional fuel',
    bearStrong:  es ? 'Bajista fuerte' : 'Strong Bear',
    bearCond:    es ? 'Cierre < Apertura · Vol ↑ · OI ↑\nDinero nuevo entrando corto\nTendencia bajista institucional' : 'Close < Open · Vol ↑ · OI ↑\nNew money going short\nInstitutional bearish trend',
    rollActive:  es ? 'Roll activo' : 'Active Roll',
    rollCond:    es ? 'Front month OI < 70% del total\nSeñales menos confiables esa semana\nVerificar contrato activo' : 'Front month OI < 70% of total\nSignals less reliable that week\nVerify active contract',
    rollStarting:es ? 'Roll iniciando' : 'Roll starting',
    contractOk:  es ? 'Contrato OK' : 'Contract OK',
    noInfo:      es ? 'Sin dato' : 'No data',
    selectAsset: es ? 'Activo' : 'Asset',
    sessions:    es ? 'sesiones' : 'sessions',
    adminOnly:   es ? 'Solo el administrador puede editar datos' : 'Only admin can edit data',
    loading:     es ? 'Cargando datos...' : 'Loading data...',
  };

  const handleChartMouseMove = useCallback((chartId) => (e) => {
    const container = e?.currentTarget;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setCrosshair({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
      chartId,
    });
  }, []);

  const handleChartMouseLeave = useCallback(() => {
    setCrosshair(prev => ({ ...prev, visible: false }));
  }, []);


  const inputBase = `w-full h-9 px-3 text-sm font-mono rounded-lg border outline-none transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
  }`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`px-3 py-2 rounded-lg border shadow-lg text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
        <p className="font-bold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.value > 10000 ? fmtVol(p.value) : p.value?.toFixed?.(2) ?? p.value}
          </p>
        ))}
      </div>
    );
  };


  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      {/* ── Header (sticky nav) ─────────────────────────── */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              title={es ? 'Volver' : 'Back'}
            >
              <X size={18} />
            </button>
            <div className="min-w-0">
              <h1 className={`font-bold text-sm sm:text-base truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {asset.ticker} · {es ? 'Análisis Institucional' : 'Institutional Analysis'}
              </h1>
              <p className={`text-[10px] sm:text-xs hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* AI Analysis */}
            <button
              onClick={requestAiAnalysis}
              disabled={aiLoading || !sorted.length}
              className="text-xs font-bold rounded-lg px-2 sm:px-3 py-1.5 transition-colors flex items-center gap-1 disabled:opacity-40 ${isDark ? 'text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500' : 'text-slate-500 hover:text-slate-800 border border-slate-300 hover:border-slate-400'}"
            >
              {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Brain size={12} />}
              <span className="hidden sm:inline">{es ? 'Análisis IA' : 'AI Analysis'}</span>
            </button>
            {/* AI History */}
            {aiHistory.length > 0 && (
              <button
                onClick={() => { setShowAiHistory(true); setShowAiPanel(false); }}
                className="text-xs text-blue-200 hover:text-white border border-blue-400/40 hover:border-white/60 rounded-lg px-2 sm:px-3 py-1.5 transition-colors flex items-center gap-1"
              >
                <Clock size={12} />
                {aiHistory.length}
              </button>
            )}
            {/* Export PDF */}
            <button
              onClick={exportPDF}
              disabled={exportingPdf || !sorted.length}
              className="text-xs font-bold rounded-lg px-2 sm:px-3 py-1.5 transition-colors flex items-center gap-1 disabled:opacity-40 ${isDark ? 'text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500' : 'text-slate-500 hover:text-slate-800 border border-slate-300 hover:border-slate-400'}"
            >
              {exportingPdf ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
              <span className="hidden sm:inline">PDF</span>
            </button>
            {/* Import CSV/Excel (Admin only) */}
            {isAdmin && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt,.tsv,text/csv,text/plain,application/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                  className="text-xs text-blue-200 hover:text-white border border-blue-400/40 hover:border-white/60 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1 disabled:opacity-40"
                >
                  {importing ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  <span className="hidden sm:inline">{es ? 'Importar' : 'Import'}</span>
                </button>
              </>
            )}
            {!isAdmin && (
              <span className={`text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded ${isDark ? 'text-slate-500 bg-slate-800' : 'text-slate-400 bg-slate-100'}`}>
                <Lock size={10} /> {es ? 'Lectura' : 'View'}
              </span>
            )}
            {/* Trading timeframe selector */}
            <select
              value={tradingTimeframe}
              onChange={e => setTradingTimeframe(e.target.value)}
              className={`text-[10px] font-bold rounded-lg px-2 py-1.5 border outline-none cursor-pointer ${
                isDark ? 'bg-slate-700 border-slate-600 text-cyan-400' : 'bg-slate-50 border-slate-300 text-cyan-600'
              }`}
              title={es ? 'Temporalidad operativa' : 'Trading timeframe'}
            >
              <option value="1m">1 min</option>
              <option value="3m">3 min</option>
              <option value="5m">5 min</option>
              <option value="15m">15 min</option>
              <option value="30m">30 min</option>
              <option value="1H">1 hora</option>
              <option value="4H">4 horas</option>
              <option value="1D">1 día</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">

          {/* Loading */}
          {loading && (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm">{t.loading}</p>
            </div>
          )}

          {!loading && (
            <>
              {/* ── Asset Selector ────────────────────────────── */}
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-[9px] font-bold uppercase tracking-wider mb-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.selectAsset}</p>
                <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                  {ASSET_PRESETS.map(a => {
                    const isActive = a.id === selectedAsset;
                    const count = assetCounts[a.id] || 0;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelectedAsset(a.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                          isActive
                            ? 'text-white shadow-md scale-[1.02]'
                            : isDark
                              ? 'bg-slate-700/50 border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                        }`}
                        style={isActive ? { background: a.color, borderColor: a.color } : undefined}
                      >
                        <span>{a.ticker}</span>
                        {count > 0 && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white/20 text-white' : isDark ? 'bg-slate-600 text-slate-400' : 'bg-slate-200 text-slate-500'
                          }`}>{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Metrics ──────────────────────────────────── */}
              {metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.lastClose}</p>
                    <p className={`text-xl font-bold tabular-nums ${metrics.last.close >= metrics.last.open ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.last.close.toFixed(2)}
                    </p>
                    <p className={`text-[10px] font-medium mt-0.5 ${metrics.last.close >= metrics.last.open ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.last.close >= metrics.last.open ? '▲' : '▼'} {Math.abs(metrics.last.close - metrics.last.open).toFixed(2)} {t.pts}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.dayRange}</p>
                    <p className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {(metrics.last.high - metrics.last.low).toFixed(asset.step < 0.1 ? 3 : asset.step < 1 ? 2 : 0)}
                      <span className={`text-xs ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.pts}</span>
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.avg5d}: {metrics.avgR5.toFixed(asset.step < 0.1 ? 3 : asset.step < 1 ? 2 : 0)} {t.pts}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.dayType}</p>
                    <p className={`text-sm font-bold ${dayColorMap[metrics.day.color]?.text || 'text-blue-400'}`}>{metrics.day.label}</p>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.eff} {pct(metrics.day.eff * 100)} · {pct((metrics.day.ratio || 1) * 100)} {t.range}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.volume}</p>
                    <p className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-800'}`}>{fmtVol(metrics.last.vol)}</p>
                    <p className={`text-[10px] font-medium mt-0.5 ${
                      deltaIsUp(metrics.last.vol, metrics.prev?.vol) === null ? (isDark ? 'text-slate-500' : 'text-slate-400')
                      : deltaIsUp(metrics.last.vol, metrics.prev?.vol) ? 'text-green-500' : 'text-red-500'
                    }`}>{delta(metrics.last.vol, metrics.prev?.vol)}</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.frontOI}</p>
                    <p className={`text-xl font-bold tabular-nums ${
                      metrics.foiPct != null ? metrics.foiPct < 70 ? 'text-red-500' : metrics.foiPct < 80 ? 'text-amber-500' : 'text-green-500'
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>{metrics.foiPct != null ? pct(metrics.foiPct) : '—'}</p>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {metrics.foiPct != null ? (metrics.foiPct < 70 ? '⚠ Roll activo' : metrics.foiPct < 80 ? t.rollStarting : t.contractOk) : t.noInfo}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Alerts ────────────────────────────────────── */}
              {alerts.length > 0 && (
                <div className="space-y-2">
                  {alerts.map(a => (
                    <div key={a.key} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${a.styles.bg} ${a.styles.border}`}>
                      <span className={`text-lg font-bold min-w-[22px] ${a.styles.text}`}>{a.icon}</span>
                      <div>
                        <p className={`text-sm font-bold ${a.styles.text}`}>{a.title}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{a.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Import Result Banner ────────────────────── */}
              {importResult && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm font-bold">
                  <Upload size={14} />
                  {es ? `${importResult.count} sesiones importadas de ${importResult.filename}` : `${importResult.count} sessions imported from ${importResult.filename}`}
                </div>
              )}

              {/* ── AI Analysis Panel ─────────────────────────── */}
              {(showAiPanel || showAiHistory) && (
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  {/* Header */}
                  <div className={`flex items-center justify-between px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <span className={`flex items-center gap-2 font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      <Brain size={16} className="text-purple-500" />
                      {es ? 'Análisis Técnico IA' : 'AI Technical Analysis'} — {asset.ticker}
                      {aiAnalysisDate && (
                        <span className={`text-[10px] font-normal px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                          {aiAnalysisDate}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      {aiHistory.length > 0 && (
                        <button
                          onClick={() => { setShowAiHistory(!showAiHistory); setShowAiPanel(!showAiHistory ? false : showAiPanel); }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                            showAiHistory
                              ? 'bg-purple-500 text-white'
                              : isDark ? 'bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {es ? 'Historial' : 'History'} ({aiHistory.length})
                        </button>
                      )}
                      <button
                        onClick={() => { setShowAiPanel(false); setShowAiHistory(false); }}
                        className={`p-1 rounded-lg transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* History list */}
                  {showAiHistory && (
                    <div className={`px-4 py-3 space-y-2 max-h-[300px] overflow-y-auto ${isDark ? 'bg-slate-800/30' : 'bg-slate-50/50'}`}>
                      {aiHistory.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            aiAnalysisDate === item.date
                              ? isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                              : isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => loadAnalysis(item)}
                        >
                          <div>
                            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                              {item.date}
                            </p>
                            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {item.ticker} · {item.sessionsCount || '?'} {es ? 'sesiones' : 'sessions'}
                              {item.lastClose ? ` · ${es ? 'Cierre' : 'Close'}: ${item.lastClose.toFixed(2)}` : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {isAdmin && (
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteAnalysis(item.id); }}
                                className={`p-1 rounded transition-colors ${isDark ? 'text-slate-600 hover:text-red-500' : 'text-slate-300 hover:text-red-500'}`}
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Analysis content */}
                  {showAiPanel && (
                    <div className={`px-4 py-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      {aiLoading ? (
                        <div className="flex items-center gap-3 py-6 justify-center">
                          <Loader2 size={20} className="animate-spin text-purple-500" />
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {es ? 'Analizando datos del mercado...' : 'Analyzing market data...'}
                          </p>
                        </div>
                      ) : aiAnalysis ? (
                        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {aiAnalysis.split('\n').map((line, i) => {
                            if (line.startsWith('### ')) return <h3 key={i} className={`text-sm font-bold mt-4 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{line.replace(/^###\s*/, '')}</h3>;
                            if (line.startsWith('## ')) return <h2 key={i} className={`text-base font-bold mt-4 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{line.replace(/^##\s*/, '')}</h2>;
                            if (line.startsWith('- ')) return <p key={i} className="ml-3 my-0.5">• {line.slice(2)}</p>;
                            if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold mt-2">{line.replace(/\*\*/g, '')}</p>;
                            if (!line.trim()) return <br key={i} />;
                            return <p key={i} className="my-0.5">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                          })}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* ── Charts ────────────────────────────────────── */}
              {sorted.length > 1 && (
                <div className="space-y-3">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:overflow-visible sm:flex-wrap">
                  {[
                    { label: '30d', value: 30 },
                    { label: '60d', value: 60 },
                    { label: '90d', value: 90 },
                    { label: '6m', value: 130 },
                    { label: '9m', value: 195 },
                    { label: '1y', value: 260 },
                    { label: '2y', value: 520 },
                    { label: '3y', value: 780 },
                    { label: '4y', value: 1040 },
                    { label: '5y', value: 1300 },
                    { label: es ? 'Todo' : 'All', value: 0 },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setChartRange(opt.value)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        chartRange === opt.value
                          ? 'bg-blue-500 text-white'
                          : isDark ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  {techLevels && (
                    <>
                      <button
                        onClick={() => setShowFib(!showFib)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          showFib
                            ? 'bg-purple-500 text-white'
                            : isDark ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                        }`}
                      >
                        Fib
                      </button>
                      <button
                        onClick={() => setShowPivots(!showPivots)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          showPivots
                            ? 'bg-blue-500 text-white'
                            : isDark ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                        }`}
                      >
                        S/R
                      </button>
                    </>
                  )}
                  {vwapData && (
                    <button
                      onClick={() => setShowVwap(!showVwap)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        showVwap
                          ? 'bg-amber-500 text-white'
                          : isDark ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                      }`}
                    >
                      VWAP
                    </button>
                  )}
                  <span className={`text-[10px] ml-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {chartSorted.length} / {sorted.length} {es ? 'sesiones' : 'sessions'}
                  </span>
                </div>
                <div className="space-y-4">
                  {/* Price Chart */}
                  <div
                    id="tracker-price-chart"
                    className={`p-4 rounded-xl border relative ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                    style={{ cursor:'crosshair' }}
                    onMouseMove={handleChartMouseMove('price')}
                    onMouseLeave={handleChartMouseLeave}
                  >
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.priceChart}</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={priceChartData} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize:9, fill:isDark?'#64748b':'#94a3b8' }} axisLine={false} tickLine={false} interval={chartSorted.length > 90 ? Math.floor(chartSorted.length / 20) : 'preserveStartEnd'} />
                        <YAxis yAxisId="price" orientation="right" tick={{ fontSize:9, fill:isDark?'#64748b':'#94a3b8', fontFamily:'monospace' }} axisLine={false} tickLine={false} domain={['dataMin','dataMax']} tickFormatter={v=>v.toFixed(0)} padding={{ top: 10, bottom: 10 }} tickCount={12} />
                        <Tooltip content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0]?.payload;
                          if (!d) return null;
                          return (
                            <div className={`px-3 py-2 rounded-lg border shadow-lg text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                              <p className="font-bold mb-1">{label}</p>
                              <p>O: {d.open?.toFixed(2)} <span style={{ color: d.bullish ? '#22c55e' : '#ef4444' }}>C: {d.close?.toFixed(2)}</span></p>
                              <p>H: <span className="text-green-500">{d.high?.toFixed(2)}</span> L: <span className="text-red-500">{d.low?.toFixed(2)}</span></p>
                              {d.vwap && <p style={{ color:'#f59e0b' }}>VWAP: {d.vwap}</p>}
                              {d.poc && <p style={{ color:'#e879f9' }}>POC: {d.poc?.toFixed(2)}</p>}
                              {d.vah && <p style={{ color:'#fb7185' }}>VAH: {d.vah?.toFixed(2)}</p>}
                              {d.val && <p style={{ color:'#34d399' }}>VAL: {d.val?.toFixed(2)}</p>}
                              {d.delta != null && <p style={{ color: d.delta >= 0 ? '#22c55e' : '#ef4444' }}>Delta: {d.delta?.toLocaleString()}</p>}
                            </div>
                          );
                        }} cursor={false} />
                        {/* Candlesticks (up to 90d) or Line (6m+) */}
                        {chartSorted.length <= 90 ? (
                        <Bar yAxisId="price" dataKey="wick" isAnimationActive={false} shape={(props) => {
                          const { x, y, width, height, payload } = props;
                          if (!payload?.wick || !payload?.body) return null;
                          const color = payload.bullish ? '#22c55e' : '#ef4444';
                          const strokeColor = payload.bullish ? '#16a34a' : '#dc2626';
                          const wickX = x + width / 2;
                          const wickTop = y;
                          const wickBottom = y + height;
                          const wickRange = payload.wick[1] - payload.wick[0];
                          if (wickRange <= 0) return null;
                          const pxPerUnit = height / wickRange;
                          const bodyTop = wickTop + (payload.wick[1] - payload.body[1]) * pxPerUnit;
                          const bodyBottom = wickTop + (payload.wick[1] - payload.body[0]) * pxPerUnit;
                          const bodyH = Math.max(bodyBottom - bodyTop, 1);
                          const n = chartSorted.length;
                          const bodyW = n > 120 ? 3 : n > 60 ? 5 : 8;
                          // POC marker on the candle
                          const pocY = payload.poc && payload.poc >= payload.wick[0] && payload.poc <= payload.wick[1]
                            ? wickTop + (payload.wick[1] - payload.poc) * pxPerUnit
                            : null;
                          const pocW = bodyW + 4;
                          return (
                            <g>
                              <line x1={wickX} y1={wickTop} x2={wickX} y2={wickBottom} stroke={color} strokeWidth={1} />
                              <rect
                                x={wickX - bodyW / 2}
                                y={bodyTop}
                                width={bodyW}
                                height={bodyH}
                                fill={color}
                                stroke={strokeColor}
                                strokeWidth={0.5}
                                rx={0.5}
                              />
                              {pocY != null && (
                                <line
                                  x1={wickX - pocW / 2} y1={pocY}
                                  x2={wickX + pocW / 2} y2={pocY}
                                  stroke="#3b82f6" strokeWidth={2} strokeLinecap="round"
                                />
                              )}
                            </g>
                          );
                        }} />
                        ) : (
                          <Line yAxisId="price" type="monotone" dataKey="close" name={t.close} stroke={asset.color} strokeWidth={1.5} dot={false} activeDot={{ r:3 }} />
                        )}
                        {/* Fibonacci levels */}
                        {showFib && techLevels && techLevels.fib.map(f => (
                          <ReferenceLine yAxisId="price" key={`fib-${f.pct}`} y={f.level} stroke={f.color} strokeDasharray="10 5" strokeWidth={0.8} strokeOpacity={0.65}
                            label={{ value: `F ${f.label}  ${f.level.toFixed(0)}`, position: 'insideTopLeft', fontSize: 7, fill: f.color, fontWeight: 700 }} />
                        ))}
                        {/* Pivot S/R levels */}
                        {showPivots && techLevels && techLevels.pivots.map(p => (
                          <ReferenceLine yAxisId="price" key={`pv-${p.label}`} y={p.level} stroke={p.color} strokeDasharray="4 3" strokeWidth={1} strokeOpacity={0.75}
                            label={{ value: `${p.label}  ${p.level.toFixed(0)}`, position: 'insideTopRight', fontSize: 7, fill: p.color, fontWeight: 700 }} />
                        ))}
                        {/* VWAP */}
                        {showVwap && (
                          <Line yAxisId="price" type="monotone" dataKey="vwap" name="VWAP" stroke="#f59e0b" strokeWidth={2} dot={false} strokeOpacity={0.9} />
                        )}
                        {/* POC / VAH / VAL */}
                        <Line yAxisId="price" type="stepAfter" dataKey="vah" name="VAH" stroke="#fb7185" strokeWidth={0.8} dot={false} connectNulls={false} strokeDasharray="3 2" strokeOpacity={0.5} />
                        <Line yAxisId="price" type="stepAfter" dataKey="val" name="VAL" stroke="#34d399" strokeWidth={0.8} dot={false} connectNulls={false} strokeDasharray="3 2" strokeOpacity={0.5} />
                      </ComposedChart>
                    </ResponsiveContainer>
                    {crosshair.visible && crosshair.chartId === 'price' && (
                      <>
                        <div className="absolute pointer-events-none" style={{ left: crosshair.x, top: 0, bottom: 0, width: 1, borderLeft: `1px dashed ${isDark ? 'rgba(148,163,184,0.4)' : 'rgba(100,116,139,0.35)'}` }} />
                        <div className="absolute pointer-events-none" style={{ top: crosshair.y, left: 0, right: 0, height: 1, borderTop: `1px dashed ${isDark ? 'rgba(148,163,184,0.4)' : 'rgba(100,116,139,0.35)'}` }} />
                      </>
                    )}
                  </div>
                  {/* Delta Chart — disabled, data only in PDF/AI */}
                  {false && deltaChartData && (
                    <div
                      className={`p-4 rounded-xl border relative ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                      style={{ cursor:'crosshair' }}
                      onMouseMove={handleChartMouseMove('delta')}
                      onMouseLeave={handleChartMouseLeave}
                    >
                      <p className={`text-[9px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Delta</p>
                      <ResponsiveContainer width="100%" height={120}>
                        <ComposedChart data={deltaChartData}>
                          <XAxis dataKey="name" tick={{ fontSize:9, fill:isDark?'#64748b':'#94a3b8' }} axisLine={false} tickLine={false} interval={chartSorted.length > 90 ? Math.floor(chartSorted.length / 20) : 'preserveStartEnd'} />
                          <YAxis tick={{ fontSize:9, fill:isDark?'#64748b':'#94a3b8', fontFamily:'monospace' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v} domain={[0, 'auto']} />
                          <Tooltip content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            const raw = payload[0]?.payload?.rawDelta;
                            if (raw == null) return null;
                            return (
                              <div className={`px-3 py-2 rounded-lg border shadow-lg text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                                <p className="font-bold mb-1">{label}</p>
                                <p style={{ color: raw >= 0 ? '#22c55e' : '#ef4444' }}>Delta: {raw?.toLocaleString()}</p>
                              </div>
                            );
                          }} cursor={false} />
                          <Bar dataKey="delta" isAnimationActive={false} shape={(props) => {
                            const { x, y, width, height, payload } = props;
                            if (payload?.delta == null) return null;
                            const color = payload.isPositive ? '#22c55e' : '#ef4444';
                            const n = chartSorted.length;
                            const barW = n > 200 ? 1.5 : n > 120 ? 3 : n > 60 ? 5 : 7;
                            return (
                              <rect
                                x={x + width / 2 - barW / 2}
                                y={y}
                                width={barW}
                                height={Math.abs(height) || 1}
                                fill={color}
                                opacity={0.75}
                                rx={0.5}
                              />
                            );
                          }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                      {crosshair.visible && crosshair.chartId === 'delta' && (
                        <>
                          <div className="absolute pointer-events-none" style={{ left: crosshair.x, top: 0, bottom: 0, width: 1, borderLeft: `1px dashed ${isDark ? 'rgba(148,163,184,0.4)' : 'rgba(100,116,139,0.35)'}` }} />
                          <div className="absolute pointer-events-none" style={{ top: crosshair.y, left: 0, right: 0, height: 1, borderTop: `1px dashed ${isDark ? 'rgba(148,163,184,0.4)' : 'rgba(100,116,139,0.35)'}` }} />
                        </>
                      )}
                    </div>
                  )}
                  {/* Volume Chart */}
                  <div
                    id="tracker-vol-chart"
                    className={`p-4 rounded-xl border relative ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                    style={{ cursor:'crosshair' }}
                    onMouseMove={handleChartMouseMove('vol')}
                    onMouseLeave={handleChartMouseLeave}
                  >
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.volChart}</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <ComposedChart data={volChartData}>
                        <XAxis dataKey="name" tick={{ fontSize:9, fill:isDark?'#64748b':'#94a3b8' }} axisLine={false} tickLine={false} interval={chartSorted.length > 90 ? Math.floor(chartSorted.length / 20) : 'preserveStartEnd'} />
                        <YAxis yAxisId="vol" orientation="left" tick={{ fontSize:9, fill:'#3b82f6', fontFamily:'monospace' }} axisLine={false} tickLine={false} tickFormatter={v=>(v/1e6).toFixed(1)+'M'} tickCount={8} />
                        <YAxis yAxisId="oi" orientation="right" tick={{ fontSize:9, fill:'#f59e0b', fontFamily:'monospace' }} axisLine={false} tickLine={false} tickFormatter={v=>(v/1e6).toFixed(2)+'M'} tickCount={8} />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar yAxisId="vol" dataKey="vol" name={t.volume} fill="rgba(59,130,246,0.45)" radius={[1,1,0,0]} />
                        <Line yAxisId="oi" type="monotone" dataKey="oi" name="OI" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                    {crosshair.visible && crosshair.chartId === 'vol' && (
                      <>
                        <div className="absolute pointer-events-none" style={{ left: crosshair.x, top: 0, bottom: 0, width: 1, borderLeft: `1px dashed ${isDark ? 'rgba(148,163,184,0.4)' : 'rgba(100,116,139,0.35)'}` }} />
                        <div className="absolute pointer-events-none" style={{ top: crosshair.y, left: 0, right: 0, height: 1, borderTop: `1px dashed ${isDark ? 'rgba(148,163,184,0.4)' : 'rgba(100,116,139,0.35)'}` }} />
                      </>
                    )}
                  </div>
                </div>
                </div>
              )}

              {/* ── Technical Levels ──────────────────────────── */}
              {techLevels && (
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {es ? 'Niveles técnicos' : 'Technical Levels'}
                      </p>
                      {[
                        { label: '30d', value: 30 },
                        { label: '60d', value: 60 },
                        { label: '90d', value: 90 },
                        { label: '6m', value: 130 },
                        { label: '9m', value: 195 },
                        { label: '1y', value: 260 },
                        { label: '2y', value: 520 },
                        { label: '3y', value: 780 },
                        { label: '4y', value: 1040 },
                        { label: '5y', value: 1300 },
                        { label: es ? 'Todo' : 'All', value: 0 },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setTechPeriod(opt.value)}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${
                            techPeriod === opt.value
                              ? 'bg-purple-500 text-white'
                              : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                      <span className={`text-[9px] ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
                        ({techLevels.periodDays}d)
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      parseFloat(techLevels.position52) > 70 ? 'bg-green-500/10 text-green-500'
                      : parseFloat(techLevels.position52) < 30 ? 'bg-red-500/10 text-red-500'
                      : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {es ? 'Posición' : 'Position'}: {techLevels.position52}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Fibonacci */}
                    <div>
                      <p className={`text-[10px] font-bold mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                        Fibonacci ({es ? 'Retrocesos' : 'Retracements'})
                      </p>
                      <div className="space-y-1">
                        {techLevels.fib.map(f => {
                          const isNear = Math.abs(techLevels.lastClose - f.level) / techLevels.lastClose < 0.005;
                          return (
                            <div key={f.pct} className={`flex items-center justify-between px-2 py-1 rounded text-[11px] tabular-nums ${
                              isNear ? (isDark ? 'bg-purple-500/10' : 'bg-purple-50') : ''
                            }`}>
                              <span className="font-bold" style={{ color: f.color }}>{f.label}</span>
                              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{f.level.toFixed(2)}</span>
                              {isNear && <span className="text-[8px] text-purple-500 font-bold">← AQUÍ</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pivot Points + Key Levels */}
                    <div>
                      <p className={`text-[10px] font-bold mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        Pivot Points + {es ? 'Niveles clave' : 'Key Levels'}
                      </p>
                      <p className={`text-[9px] mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        {es ? 'Base' : 'Based on'}: {techLevels.lastDate} (H:{techLevels.lastHigh?.toFixed(2)} L:{techLevels.lastLow?.toFixed(2)} C:{techLevels.lastCloseVal?.toFixed(2)})
                      </p>
                      <div className="space-y-1">
                        {/* 52w High */}
                        <div className={`flex items-center justify-between px-2 py-1 rounded text-[11px] tabular-nums ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}>
                          <span className="font-bold text-red-500">{es ? 'Máx 52s' : '52w High'}</span>
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{techLevels.high52.toFixed(2)}</span>
                        </div>
                        {techLevels.pivots.map(p => {
                          const isNear = Math.abs(techLevels.lastClose - p.level) / techLevels.lastClose < 0.005;
                          return (
                            <div key={p.label} className={`flex items-center justify-between px-2 py-1 rounded text-[11px] tabular-nums ${
                              isNear ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50') : ''
                            }`}>
                              <span className="font-bold" style={{ color: p.color }}>{p.label}</span>
                              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{p.level.toFixed(2)}</span>
                              {isNear && <span className="text-[8px] text-blue-500 font-bold">← AQUÍ</span>}
                            </div>
                          );
                        })}
                        {/* 52w Low */}
                        <div className={`flex items-center justify-between px-2 py-1 rounded text-[11px] tabular-nums ${isDark ? 'bg-green-500/5' : 'bg-green-50'}`}>
                          <span className="font-bold text-green-500">{es ? 'Mín 52s' : '52w Low'}</span>
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{techLevels.low52.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Position bar */}
                  <div className="mt-4">
                    <div className={`flex justify-between text-[9px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>{techLevels.low52.toFixed(0)}</span>
                      <span>{es ? 'Precio en rango del período' : 'Price in period range'}</span>
                      <span>{techLevels.high52.toFixed(0)}</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500" style={{ width: `${techLevels.position52}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Entry Form (Admin only) ───────────────────── */}
              {isAdmin && (
                <div id="tracker-entry-form" className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.register}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{t.source}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ background: asset.color + '20', color: asset.color }}>{asset.ticker}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3 items-end">
                    <div className="col-span-2 sm:col-span-1">
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.date}</label>
                      <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className={inputBase} />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.open}</label>
                      <input type="number" value={formOpen} onChange={e => setFormOpen(e.target.value)} placeholder={ph.o} step={asset.step} className={inputBase} />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.high}</label>
                      <input type="number" value={formHigh} onChange={e => setFormHigh(e.target.value)} placeholder={ph.h} step={asset.step} className={inputBase} />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.low}</label>
                      <input type="number" value={formLow} onChange={e => setFormLow(e.target.value)} placeholder={ph.l} step={asset.step} className={inputBase} />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.close}</label>
                      <input type="number" value={formClose} onChange={e => setFormClose(e.target.value)} placeholder={ph.c} step={asset.step} className={inputBase} />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.totalVol}</label>
                      <input type="number" value={formVol} onChange={e => setFormVol(e.target.value)} placeholder={ph.v} className={inputBase} />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.totalOI}</label>
                      <input type="number" value={formOi} onChange={e => setFormOi(e.target.value)} placeholder={ph.oi} className={inputBase} />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t.frontOILbl} <span className={`text-[8px] ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>({t.optional})</span>
                      </label>
                      <input type="number" value={formFoi} onChange={e => setFormFoi(e.target.value)} placeholder={ph.foi} className={inputBase} />
                    </div>
                    <div>
                      <button onClick={addEntry} className="w-full h-9 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1 hover:brightness-110" style={{ background: asset.color }}>
                        <Plus size={14} /> {t.add}
                      </button>
                    </div>
                  </div>
                  {/* Volume Profile inputs (ATAS) */}
                  <div className={`mt-3 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Volume Profile
                      <span className={`text-[8px] font-normal ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>({t.optional})</span>
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className={`text-[10px] font-bold uppercase block mb-1 text-purple-400`}>POC</label>
                        <input type="number" value={formPoc} onChange={e => setFormPoc(e.target.value)} placeholder={ph.c} step={asset.step} className={inputBase} />
                      </div>
                      <div>
                        <label className={`text-[10px] font-bold uppercase block mb-1 text-rose-400`}>VAH</label>
                        <input type="number" value={formVah} onChange={e => setFormVah(e.target.value)} placeholder={ph.h} step={asset.step} className={inputBase} />
                      </div>
                      <div>
                        <label className={`text-[10px] font-bold uppercase block mb-1 text-emerald-400`}>VAL</label>
                        <input type="number" value={formVal} onChange={e => setFormVal(e.target.value)} placeholder={ph.l} step={asset.step} className={inputBase} />
                      </div>
                      <div>
                        <label className={`text-[10px] font-bold uppercase block mb-1 text-sky-400`}>DELTA</label>
                        <input type="number" value={formDelta} onChange={e => setFormDelta(e.target.value)} placeholder="-25000" className={inputBase} />
                      </div>
                      <div>
                        <label className={`text-[10px] font-bold uppercase block mb-1 text-amber-400`}>VWAP</label>
                        <input type="number" value={formVwap} onChange={e => setFormVwap(e.target.value)} placeholder={ph.c} step={asset.step} className={inputBase} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── History Table ─────────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.history}</p>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{sorted.length} {t.sessions}</p>
                </div>
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[900px]">
                      <thead>
                        <tr className={isDark ? 'bg-slate-800/80' : 'bg-slate-50'}>
                          {[t.date,t.open,t.high,t.low,t.close,t.body,t.range,t.effShort,t.dayType,t.volume,'Vol Δ','OI','OI Δ','Front%',t.signal, ...(isAdmin ? [''] : [])].map((h,i) => (
                            <th key={i} className={`text-left ${i===0?'px-3':'px-2'} py-2.5 text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pagedRows.length === 0 ? (
                          <tr><td colSpan={isAdmin ? 16 : 15} className={`text-center py-8 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{t.noData}</td></tr>
                        ) : (
                          pagedRows.map(({ r, prev, day, sig, foiPct }) => {
                            const dir = r.close >= r.open;
                            const sc = sig ? sigStyles[sig.type] : sigStyles.neutral;
                            const dc = dayColorMap[day.color] || dayColorMap.blue;
                            const effColor = day.eff > 0.55 ? 'text-purple-400' : day.eff < 0.35 ? 'text-amber-500' : 'text-blue-400';
                            const foiColor = foiPct != null ? foiPct < 70 ? 'text-red-500' : foiPct < 80 ? 'text-amber-500' : 'text-green-500' : isDark ? 'text-slate-600' : 'text-slate-400';
                            const decimals = asset.step < 0.01 ? 3 : 2;
                            return (
                              <tr key={r.date} className={`border-t transition-colors ${isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                                <td className={`px-3 py-2 tabular-nums ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{r.date}</td>
                                <td className={`px-2 py-2 tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{r.open.toFixed(decimals)}</td>
                                <td className="px-2 py-2 tabular-nums text-green-500">{r.high.toFixed(decimals)}</td>
                                <td className="px-2 py-2 tabular-nums text-red-500">{r.low.toFixed(decimals)}</td>
                                <td className={`px-2 py-2 tabular-nums font-bold ${dir ? 'text-green-500' : 'text-red-500'}`}>{r.close.toFixed(decimals)}</td>
                                <td className={`px-2 py-2 tabular-nums ${dir ? 'text-green-500' : 'text-red-500'}`}>{day.body.toFixed(decimals)}</td>
                                <td className={`px-2 py-2 tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{day.range.toFixed(decimals)}</td>
                                <td className={`px-2 py-2 tabular-nums ${effColor}`}>{pct(day.eff * 100)}</td>
                                <td className="px-2 py-2"><span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${dc.badge}`}>{day.label}</span></td>
                                <td className={`px-2 py-2 tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{fmtVol(r.vol)}</td>
                                <td className={`px-2 py-2 tabular-nums ${deltaIsUp(r.vol,prev?.vol)===null?(isDark?'text-slate-500':'text-slate-400'):deltaIsUp(r.vol,prev?.vol)?'text-green-500':'text-red-500'}`}>{delta(r.vol,prev?.vol)}</td>
                                <td className={`px-2 py-2 tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{fmtVol(r.oi)}</td>
                                <td className={`px-2 py-2 tabular-nums ${deltaIsUp(r.oi,prev?.oi)===null?(isDark?'text-slate-500':'text-slate-400'):deltaIsUp(r.oi,prev?.oi)?'text-green-500':'text-red-500'}`}>{delta(r.oi,prev?.oi)}</td>
                                <td className={`px-2 py-2 tabular-nums ${foiColor}`}>{foiPct != null ? pct(foiPct) : '—'}</td>
                                <td className="px-2 py-2"><span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${sc.badge}`}>{sig ? `${sig.icon} ${sig.label}` : '—'}</span></td>
                                {isAdmin && (
                                  <td className="px-2 py-2">
                                    <div className="flex items-center gap-0.5">
                                      <button onClick={() => editEntry(r)} className={`p-1 rounded transition-colors ${isDark ? 'text-slate-600 hover:text-blue-400' : 'text-slate-300 hover:text-blue-500'}`} title={es ? 'Editar' : 'Edit'}>
                                        <Pencil size={12} />
                                      </button>
                                      <button onClick={() => deleteEntry(r.date)} className={`p-1 rounded transition-colors ${isDark ? 'text-slate-600 hover:text-red-500' : 'text-slate-300 hover:text-red-500'}`} title={es ? 'Eliminar' : 'Delete'}>
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={`flex items-center justify-between px-4 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {tablePage * TABLE_PAGE_SIZE + 1}–{Math.min((tablePage + 1) * TABLE_PAGE_SIZE, tableRows.length)} {es ? 'de' : 'of'} {tableRows.length}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTablePage(0)}
                        disabled={tablePage === 0}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-colors disabled:opacity-30 ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}
                      >«</button>
                      <button
                        onClick={() => setTablePage(p => Math.max(0, p - 1))}
                        disabled={tablePage === 0}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-colors disabled:opacity-30 ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}
                      >‹</button>
                      <span className={`px-3 py-1 rounded text-[10px] font-bold ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800'}`}>
                        {tablePage + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() => setTablePage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={tablePage >= totalPages - 1}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-colors disabled:opacity-30 ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}
                      >›</button>
                      <button
                        onClick={() => setTablePage(totalPages - 1)}
                        disabled={tablePage >= totalPages - 1}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-colors disabled:opacity-30 ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}
                      >»</button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Classification Guide ─────────────────────── */}
              <div>
                <p className={`text-[9px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.guide}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { title:t.rangeDay,  color:'text-amber-500',  cond:t.rangeCond },
                    { title:t.normalDay, color:'text-blue-400',   cond:t.normalCond },
                    { title:t.trendDay,  color:'text-purple-400', cond:t.trendCond },
                    { title:t.bullStrong,color:'text-green-500',  cond:t.bullCond },
                    { title:t.bearStrong,color:'text-red-500',    cond:t.bearCond },
                    { title:t.rollActive,color:'text-purple-400', cond:t.rollCond },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <p className={`text-xs font-bold mb-1 ${item.color}`}>{item.title}</p>
                      <p className={`text-[10px] leading-relaxed whitespace-pre-line ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.cond}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
}