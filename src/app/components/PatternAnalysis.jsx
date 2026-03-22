"use client";
import { useState, useMemo } from 'react';
import { Grid3x3, Clock, BarChart3, Heart, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

const DAYS = { es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] };
const DAYS_FULL = { es: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'], en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] };
const EMOTIONS = ['Neutral', 'Calmado', 'Ansioso', 'Venganza', 'Miedo', 'Eufórico', 'Frustrado'];
const EMOTION_COLORS = {
  Neutral: '#94a3b8', Calmado: '#22c55e', Ansioso: '#f59e0b',
  Venganza: '#ef4444', Miedo: '#a855f7', Eufórico: '#3b82f6', Frustrado: '#f97316',
};
const EMOTION_LABELS = {
  es: { Neutral: 'Neutral', Calmado: 'Calmado', Ansioso: 'Ansioso', Venganza: 'Venganza', Miedo: 'Miedo', Eufórico: 'Eufórico', Frustrado: 'Frustrado' },
  en: { Neutral: 'Neutral', Calmado: 'Calm', Ansioso: 'Anxious', Venganza: 'Revenge', Miedo: 'Fear', Eufórico: 'Euphoric', Frustrado: 'Frustrated' },
};

// Sessions in local time approximations for Mexico City (UTC-6)
const SESSIONS_LOCAL = [
  { id: 'asia', name: { es: 'Asia', en: 'Asia' }, startH: 18, endH: 3, color: '#ec4899' },
  { id: 'london', name: { es: 'Londres', en: 'London' }, startH: 1, endH: 10, color: '#22c55e' },
  { id: 'newyork', name: { es: 'New York', en: 'New York' }, startH: 7, endH: 16, color: '#f59e0b' },
];

function inSession(hour, session) {
  if (session.startH > session.endH) return hour >= session.startH || hour < session.endH;
  return hour >= session.startH && hour < session.endH;
}

// ── Tab definitions ───────────────────────────────────────────
const TABS = [
  { id: 'heatmap', icon: Grid3x3, label: { es: 'Heatmap', en: 'Heatmap' } },
  { id: 'sessions', icon: Clock, label: { es: 'Sesiones', en: 'Sessions' } },
  { id: 'assets', icon: BarChart3, label: { es: 'Activos', en: 'Assets' } },
  { id: 'emotions', icon: Heart, label: { es: 'Emociones', en: 'Emotions' } },
  { id: 'discipline', icon: ShieldCheck, label: { es: 'Disciplina', en: 'Discipline' } },
];

// ── Helpers ───────────────────────────────────────────────────
function getHour(trade) {
  const h = trade.hora;
  if (!h) return null;
  const parts = h.split(':');
  return parseInt(parts[0]);
}

function getDayOfWeek(trade) {
  const d = new Date(trade.fecha + 'T12:00:00');
  const day = d.getDay(); // 0=Sun, 1=Mon...6=Sat
  if (day === 0 || day === 6) return null; // skip weekends
  return day - 1; // 0=Mon...4=Fri
}

function pnl(trade) { return parseFloat(trade.res) || 0; }
function isWin(trade) { return pnl(trade) > 0; }

function colorScale(value, max, isDark) {
  if (value === null || value === undefined) return isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,1)';
  const abs = Math.abs(value);
  const intensity = max > 0 ? Math.min(abs / max, 1) : 0;
  const alpha = 0.15 + intensity * 0.7;
  if (value > 0) return `rgba(34,197,94,${alpha})`;
  if (value < 0) return `rgba(239,68,68,${alpha})`;
  return isDark ? 'rgba(51,65,85,0.3)' : 'rgba(226,232,240,1)';
}

// ── Main Component ────────────────────────────────────────────
export default function PatternAnalysis({ trades, currencySymbol = '$' }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('heatmap');

  const labels = {
    es: {
      title: 'Análisis de Patrones',
      noData: 'Registra trades para ver patrones',
      winRate: 'Win Rate',
      avgPnl: 'Prom. P&L',
      trades: 'Trades',
      totalPnl: 'P&L Total',
      bestHour: 'Mejor Hora',
      worstHour: 'Peor Hora',
      bestDay: 'Mejor Día',
      worstDay: 'Peor Día',
      followedPlan: 'Siguió Plan',
      didntFollow: 'No Siguió',
      respectedRisk: 'Respetó Riesgo',
      didntRespect: 'No Respetó',
      count: 'Operaciones',
      session: 'Sesión',
      pnlPerTrade: 'P&L / Trade',
      noTime: 'Sin hora registrada',
    },
    en: {
      title: 'Pattern Analysis',
      noData: 'Record trades to see patterns',
      winRate: 'Win Rate',
      avgPnl: 'Avg P&L',
      trades: 'Trades',
      totalPnl: 'Total P&L',
      bestHour: 'Best Hour',
      worstHour: 'Worst Hour',
      bestDay: 'Best Day',
      worstDay: 'Worst Day',
      followedPlan: 'Followed Plan',
      didntFollow: "Didn't Follow",
      respectedRisk: 'Respected Risk',
      didntRespect: "Didn't Respect",
      count: 'Trades',
      session: 'Session',
      pnlPerTrade: 'P&L / Trade',
      noTime: 'No time recorded',
    },
  };
  const t = labels[language];
  const dayNames = DAYS[language];
  const dayNamesFull = DAYS_FULL[language];
  const emotionLabels = EMOTION_LABELS[language];

  // ── Computed data ───────────────────────────────────────────
  const tradesWithTime = useMemo(() => trades.filter(tr => tr.hora), [trades]);

  // Heatmap data: [hour][dayOfWeek] = { totalPnl, count, wins }
  const heatmapData = useMemo(() => {
    const matrix = {};
    let maxAbs = 0;
    tradesWithTime.forEach(tr => {
      const h = getHour(tr);
      const d = getDayOfWeek(tr);
      if (h === null || d === null) return;
      if (!matrix[h]) matrix[h] = {};
      if (!matrix[h][d]) matrix[h][d] = { totalPnl: 0, count: 0, wins: 0 };
      const cell = matrix[h][d];
      cell.totalPnl += pnl(tr);
      cell.count++;
      if (isWin(tr)) cell.wins++;
    });
    // Find max for color scale
    Object.values(matrix).forEach(row => Object.values(row).forEach(c => {
      const abs = Math.abs(c.totalPnl);
      if (abs > maxAbs) maxAbs = abs;
    }));
    // Find active hours range
    const hours = Object.keys(matrix).map(Number).sort((a, b) => a - b);
    const minHour = hours.length > 0 ? Math.max(hours[0] - 1, 0) : 6;
    const maxHour = hours.length > 0 ? Math.min(hours[hours.length - 1] + 1, 23) : 22;
    return { matrix, maxAbs, minHour, maxHour };
  }, [tradesWithTime]);

  // Session data
  const sessionData = useMemo(() => {
    return SESSIONS_LOCAL.map(session => {
      const sessionTrades = tradesWithTime.filter(tr => {
        const h = getHour(tr);
        return h !== null && inSession(h, session);
      });
      const total = sessionTrades.reduce((s, tr) => s + pnl(tr), 0);
      const wins = sessionTrades.filter(isWin).length;
      return {
        ...session,
        trades: sessionTrades.length,
        totalPnl: total,
        avgPnl: sessionTrades.length > 0 ? total / sessionTrades.length : 0,
        winRate: sessionTrades.length > 0 ? (wins / sessionTrades.length) * 100 : 0,
      };
    }).sort((a, b) => b.totalPnl - a.totalPnl);
  }, [tradesWithTime]);

  // Asset data
  const assetData = useMemo(() => {
    const map = {};
    trades.forEach(tr => {
      const a = tr.activo || 'Unknown';
      if (!map[a]) map[a] = { totalPnl: 0, count: 0, wins: 0 };
      map[a].totalPnl += pnl(tr);
      map[a].count++;
      if (isWin(tr)) map[a].wins++;
    });
    return Object.entries(map).map(([asset, d]) => ({
      asset, ...d,
      avgPnl: d.count > 0 ? d.totalPnl / d.count : 0,
      winRate: d.count > 0 ? (d.wins / d.count) * 100 : 0,
    })).sort((a, b) => b.totalPnl - a.totalPnl);
  }, [trades]);

  // Emotion data
  const emotionData = useMemo(() => {
    const map = {};
    trades.forEach(tr => {
      const e = tr.emo || 'Neutral';
      if (!map[e]) map[e] = { totalPnl: 0, count: 0, wins: 0 };
      map[e].totalPnl += pnl(tr);
      map[e].count++;
      if (isWin(tr)) map[e].wins++;
    });
    return EMOTIONS.filter(e => map[e]).map(e => ({
      emotion: e, ...map[e],
      avgPnl: map[e].count > 0 ? map[e].totalPnl / map[e].count : 0,
      winRate: map[e].count > 0 ? (map[e].wins / map[e].count) * 100 : 0,
    }));
  }, [trades]);

  // Discipline data
  const disciplineData = useMemo(() => {
    const plan = { yes: { total: 0, count: 0, wins: 0 }, no: { total: 0, count: 0, wins: 0 } };
    const risk = { yes: { total: 0, count: 0, wins: 0 }, no: { total: 0, count: 0, wins: 0 } };
    trades.forEach(tr => {
      const p = tr.seguiPlan ? 'yes' : 'no';
      plan[p].total += pnl(tr); plan[p].count++; if (isWin(tr)) plan[p].wins++;
      const r = tr.respetoRiesgo ? 'yes' : 'no';
      risk[r].total += pnl(tr); risk[r].count++; if (isWin(tr)) risk[r].wins++;
    });
    return { plan, risk };
  }, [trades]);

  // Best/worst hour and day
  const bestWorst = useMemo(() => {
    const hourMap = {}, dayMap = {};
    tradesWithTime.forEach(tr => {
      const h = getHour(tr);
      if (h !== null) {
        if (!hourMap[h]) hourMap[h] = 0;
        hourMap[h] += pnl(tr);
      }
    });
    trades.forEach(tr => {
      const d = getDayOfWeek(tr);
      if (d !== null) {
        if (!dayMap[d]) dayMap[d] = 0;
        dayMap[d] += pnl(tr);
      }
    });
    const hourEntries = Object.entries(hourMap).map(([h, v]) => ({ hour: parseInt(h), pnl: v }));
    const dayEntries = Object.entries(dayMap).map(([d, v]) => ({ day: parseInt(d), pnl: v }));
    return {
      bestHour: hourEntries.sort((a, b) => b.pnl - a.pnl)[0] || null,
      worstHour: hourEntries.sort((a, b) => a.pnl - b.pnl)[0] || null,
      bestDay: dayEntries.sort((a, b) => b.pnl - a.pnl)[0] || null,
      worstDay: dayEntries.sort((a, b) => a.pnl - b.pnl)[0] || null,
    };
  }, [trades, tradesWithTime]);

  if (trades.length === 0) return null;

  // ── Stat card helper ────────────────────────────────────────
  const StatCard = ({ label, value, sub, positive }) => (
    <div className={`rounded-xl p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
      <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</div>
      <div className={`text-lg font-black ${positive === true ? 'text-green-500' : positive === false ? 'text-red-500' : isDark ? 'text-white' : 'text-slate-900'}`}>{value}</div>
      {sub && <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</div>}
    </div>
  );

  // ── Bar helper ──────────────────────────────────────────────
  const PnlBar = ({ value, max }) => {
    const pct = max > 0 ? Math.min(Math.abs(value) / max * 100, 100) : 0;
    return (
      <div className="flex items-center gap-2 flex-1">
        <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: value >= 0 ? '#22c55e' : '#ef4444' }} />
        </div>
        <span className={`text-xs font-bold w-16 text-right ${value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {value >= 0 ? '+' : ''}{currencySymbol}{value.toFixed(0)}
        </span>
      </div>
    );
  };

  // ── Render tabs ─────────────────────────────────────────────
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Header + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <Grid3x3 size={16} className={isDark ? 'text-cyan-400' : 'text-cyan-500'} />
          {t.title}
        </h3>
        <div className={`flex items-center gap-0.5 p-0.5 rounded-lg overflow-x-auto ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-white'
              }`}
            >
              <tab.icon size={12} />
              {tab.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ HEATMAP TAB ═══ */}
      {activeTab === 'heatmap' && (
        <div>
          {tradesWithTime.length === 0 ? (
            <p className={`text-sm text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.noTime}</p>
          ) : (
            <>
              {/* Best/Worst summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <StatCard label={t.bestHour} value={bestWorst.bestHour ? `${bestWorst.bestHour.hour}:00` : '—'} sub={bestWorst.bestHour ? `${currencySymbol}${bestWorst.bestHour.pnl.toFixed(0)}` : ''} positive={true} />
                <StatCard label={t.worstHour} value={bestWorst.worstHour ? `${bestWorst.worstHour.hour}:00` : '—'} sub={bestWorst.worstHour ? `${currencySymbol}${bestWorst.worstHour.pnl.toFixed(0)}` : ''} positive={false} />
                <StatCard label={t.bestDay} value={bestWorst.bestDay ? dayNamesFull[bestWorst.bestDay.day] : '—'} sub={bestWorst.bestDay ? `${currencySymbol}${bestWorst.bestDay.pnl.toFixed(0)}` : ''} positive={true} />
                <StatCard label={t.worstDay} value={bestWorst.worstDay ? dayNamesFull[bestWorst.worstDay.day] : '—'} sub={bestWorst.worstDay ? `${currencySymbol}${bestWorst.worstDay.pnl.toFixed(0)}` : ''} positive={false} />
              </div>

              {/* Heatmap grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[400px]">
                  {/* Header row */}
                  <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '50px repeat(5, 1fr)' }}>
                    <div />
                    {dayNames.map(d => (
                      <div key={d} className={`text-center text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{d}</div>
                    ))}
                  </div>

                  {/* Hour rows */}
                  {Array.from({ length: heatmapData.maxHour - heatmapData.minHour + 1 }, (_, i) => heatmapData.minHour + i).map(hour => (
                    <div key={hour} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '50px repeat(5, 1fr)' }}>
                      <div className={`text-[10px] font-mono font-bold flex items-center justify-end pr-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {String(hour).padStart(2, '0')}:00
                      </div>
                      {[0, 1, 2, 3, 4].map(day => {
                        const cell = heatmapData.matrix[hour]?.[day];
                        const bg = cell ? colorScale(cell.totalPnl, heatmapData.maxAbs, isDark) : (isDark ? 'rgba(15,23,42,0.3)' : 'rgba(248,250,252,1)');
                        return (
                          <div
                            key={day}
                            className={`rounded-md h-8 flex items-center justify-center text-[10px] font-bold transition-all hover:scale-105 cursor-default border ${
                              isDark ? 'border-slate-800/50' : 'border-slate-200/50'
                            }`}
                            style={{ backgroundColor: bg }}
                            title={cell ? `${dayNames[day]} ${hour}:00\nP&L: ${currencySymbol}${cell.totalPnl.toFixed(2)}\nTrades: ${cell.count}\nWin Rate: ${((cell.wins / cell.count) * 100).toFixed(0)}%` : `${dayNames[day]} ${hour}:00 — No trades`}
                          >
                            {cell && (
                              <span className={cell.totalPnl >= 0 ? 'text-green-300' : 'text-red-300'}>
                                {cell.count}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-red-500/50" />
                      <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{language === 'es' ? 'Pérdida' : 'Loss'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                      <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{language === 'es' ? 'Sin datos' : 'No data'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-500/50" />
                      <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{language === 'es' ? 'Ganancia' : 'Profit'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══ SESSIONS TAB ═══ */}
      {activeTab === 'sessions' && (
        <div className="space-y-3">
          {tradesWithTime.length === 0 ? (
            <p className={`text-sm text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.noTime}</p>
          ) : sessionData.map(s => (
            <div key={s.id} className={`rounded-xl p-4 border ${isDark ? 'bg-slate-900/30 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{s.name[language]}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                    {s.trades} {t.trades.toLowerCase()}
                  </span>
                </div>
                <span className={`text-sm font-black ${s.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {s.totalPnl >= 0 ? '+' : ''}{currencySymbol}{s.totalPnl.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.winRate}</div>
                  <div className={`text-sm font-bold ${s.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>{s.winRate.toFixed(0)}%</div>
                </div>
                <div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.avgPnl}</div>
                  <div className={`text-sm font-bold ${s.avgPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{currencySymbol}{s.avgPnl.toFixed(2)}</div>
                </div>
                <div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.pnlPerTrade}</div>
                  <div className={`text-sm font-bold ${s.avgPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{currencySymbol}{s.avgPnl.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ ASSETS TAB ═══ */}
      {activeTab === 'assets' && (
        <div className="space-y-2">
          {assetData.map(a => {
            const maxPnl = Math.max(...assetData.map(x => Math.abs(x.totalPnl)), 1);
            return (
              <div key={a.asset} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isDark ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
                <div className="w-16 flex-shrink-0">
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{a.asset}</div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{a.count} trades</div>
                </div>
                <PnlBar value={a.totalPnl} max={maxPnl} />
                <div className="w-14 text-right flex-shrink-0">
                  <div className={`text-xs font-bold ${a.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>{a.winRate.toFixed(0)}%</div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>WR</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ EMOTIONS TAB ═══ */}
      {activeTab === 'emotions' && (
        <div className="space-y-2">
          {emotionData.map(e => {
            const maxPnl = Math.max(...emotionData.map(x => Math.abs(x.totalPnl)), 1);
            return (
              <div key={e.emotion} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isDark ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
                <div className="w-20 flex-shrink-0 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EMOTION_COLORS[e.emotion] }} />
                  <div>
                    <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{emotionLabels[e.emotion]}</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{e.count} trades</div>
                  </div>
                </div>
                <PnlBar value={e.totalPnl} max={maxPnl} />
                <div className="w-14 text-right flex-shrink-0">
                  <div className={`text-xs font-bold ${e.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>{e.winRate.toFixed(0)}%</div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>WR</div>
                </div>
              </div>
            );
          })}

          {/* Insight */}
          {emotionData.length >= 2 && (
            <div className={`rounded-xl p-3 mt-3 border ${isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {language === 'es' ? 'Insight' : 'Insight'}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {(() => {
                  const best = [...emotionData].sort((a, b) => b.avgPnl - a.avgPnl)[0];
                  const worst = [...emotionData].sort((a, b) => a.avgPnl - b.avgPnl)[0];
                  return language === 'es'
                    ? `Tu mejor estado emocional es "${emotionLabels[best.emotion]}" (prom. ${currencySymbol}${best.avgPnl.toFixed(2)}/trade). Evita operar en "${emotionLabels[worst.emotion]}" (prom. ${currencySymbol}${worst.avgPnl.toFixed(2)}/trade).`
                    : `Your best emotional state is "${emotionLabels[best.emotion]}" (avg. ${currencySymbol}${best.avgPnl.toFixed(2)}/trade). Avoid trading when "${emotionLabels[worst.emotion]}" (avg. ${currencySymbol}${worst.avgPnl.toFixed(2)}/trade).`;
                })()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══ DISCIPLINE TAB ═══ */}
      {activeTab === 'discipline' && (
        <div className="space-y-4">
          {/* Plan compliance */}
          <div>
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {language === 'es' ? 'Seguimiento del Plan' : 'Plan Compliance'}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'yes', label: t.followedPlan, data: disciplineData.plan.yes, color: 'green' },
                { key: 'no', label: t.didntFollow, data: disciplineData.plan.no, color: 'red' },
              ].map(item => (
                <div key={item.key} className={`rounded-xl p-3 border ${isDark ? 'bg-slate-900/30 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-xs font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.label}</div>
                  <div className={`text-lg font-black ${item.data.count > 0 && item.data.total >= 0 ? 'text-green-500' : item.data.count > 0 ? 'text-red-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.data.count > 0 ? `${currencySymbol}${item.data.total.toFixed(0)}` : '—'}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.data.count} trades</span>
                    {item.data.count > 0 && (
                      <span className={`text-[10px] font-bold ${(item.data.wins / item.data.count) * 100 >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                        WR: {((item.data.wins / item.data.count) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk compliance */}
          <div>
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {language === 'es' ? 'Gestión de Riesgo' : 'Risk Management'}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'yes', label: t.respectedRisk, data: disciplineData.risk.yes, color: 'green' },
                { key: 'no', label: t.didntRespect, data: disciplineData.risk.no, color: 'red' },
              ].map(item => (
                <div key={item.key} className={`rounded-xl p-3 border ${isDark ? 'bg-slate-900/30 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-xs font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.label}</div>
                  <div className={`text-lg font-black ${item.data.count > 0 && item.data.total >= 0 ? 'text-green-500' : item.data.count > 0 ? 'text-red-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.data.count > 0 ? `${currencySymbol}${item.data.total.toFixed(0)}` : '—'}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.data.count} trades</span>
                    {item.data.count > 0 && (
                      <span className={`text-[10px] font-bold ${(item.data.wins / item.data.count) * 100 >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                        WR: {((item.data.wins / item.data.count) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discipline insight */}
          {disciplineData.plan.yes.count > 0 && disciplineData.plan.no.count > 0 && (
            <div className={`rounded-xl p-3 border ${isDark ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Insight</div>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {(() => {
                  const withPlan = disciplineData.plan.yes;
                  const noPlan = disciplineData.plan.no;
                  const avgWith = withPlan.count > 0 ? withPlan.total / withPlan.count : 0;
                  const avgNo = noPlan.count > 0 ? noPlan.total / noPlan.count : 0;
                  const diff = avgWith - avgNo;
                  return language === 'es'
                    ? `Cuando sigues tu plan ganas en promedio ${currencySymbol}${avgWith.toFixed(2)}/trade vs ${currencySymbol}${avgNo.toFixed(2)} sin plan. ${diff > 0 ? `Seguir el plan te da +${currencySymbol}${diff.toFixed(2)} por trade.` : 'Revisa tu plan, los resultados no mejoran al seguirlo.'}`
                    : `Following your plan averages ${currencySymbol}${avgWith.toFixed(2)}/trade vs ${currencySymbol}${avgNo.toFixed(2)} without. ${diff > 0 ? `Following the plan gives you +${currencySymbol}${diff.toFixed(2)} per trade.` : 'Review your plan, results don\'t improve when following it.'}`;
                })()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
