"use client";
import { useState } from 'react';
import { Settings, X, Target, User, TrendingUp, Plus, Trash2, ClipboardCheck, HelpCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

// Lista completa de activos disponibles para sugerir
const ACTIVOS_DISPONIBLES = [
  // Índices US
  { symbol: 'MNQ', name: 'Micro Nasdaq' },
  { symbol: 'MES', name: 'Micro S&P 500' },
  { symbol: 'NQ', name: 'Nasdaq 100' },
  { symbol: 'ES', name: 'S&P 500' },
  { symbol: 'YM', name: 'Dow Jones' },
  { symbol: 'MYM', name: 'Micro Dow' },
  { symbol: 'RTY', name: 'Russell 2000' },
  { symbol: 'M2K', name: 'Micro Russell' },
  // Índices Globales
  { symbol: 'DAX', name: 'DAX 40' },
  { symbol: 'FTSE', name: 'FTSE 100' },
  { symbol: 'CAC', name: 'CAC 40' },
  { symbol: 'NIKKEI', name: 'Nikkei 225' },
  { symbol: 'HSI', name: 'Hang Seng' },
  // Forex Majors
  { symbol: 'EUR/USD', name: 'Euro/Dólar' },
  { symbol: 'GBP/USD', name: 'Libra/Dólar' },
  { symbol: 'USD/JPY', name: 'Dólar/Yen' },
  { symbol: 'USD/CHF', name: 'Dólar/Franco' },
  { symbol: 'AUD/USD', name: 'Aussie/Dólar' },
  { symbol: 'USD/CAD', name: 'Dólar/Canadá' },
  { symbol: 'NZD/USD', name: 'Kiwi/Dólar' },
  // Forex Crosses
  { symbol: 'EUR/GBP', name: 'Euro/Libra' },
  { symbol: 'EUR/JPY', name: 'Euro/Yen' },
  { symbol: 'GBP/JPY', name: 'Libra/Yen' },
  { symbol: 'AUD/JPY', name: 'Aussie/Yen' },
  // Forex Exóticos
  { symbol: 'USD/MXN', name: 'Dólar/Peso MX' },
  { symbol: 'EUR/MXN', name: 'Euro/Peso MX' },
  { symbol: 'USD/BRL', name: 'Dólar/Real' },
  // Metales
  { symbol: 'XAU/USD', name: 'Oro' },
  { symbol: 'XAG/USD', name: 'Plata' },
  { symbol: 'GC', name: 'Oro Futuros' },
  { symbol: 'MGC', name: 'Micro Oro' },
  // Energía
  { symbol: 'WTI', name: 'Petróleo WTI' },
  { symbol: 'BRENT', name: 'Petróleo Brent' },
  { symbol: 'CL', name: 'Crudo Futuros' },
  { symbol: 'NG', name: 'Gas Natural' },
  // Crypto
  { symbol: 'BTC/USD', name: 'Bitcoin' },
  { symbol: 'ETH/USD', name: 'Ethereum' },
  { symbol: 'SOL/USD', name: 'Solana' },
  { symbol: 'XRP/USD', name: 'Ripple' },
];

export default function SettingsModal({ isOpen, onClose, config, setConfig, onSaveToCloud, onRestartTour }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [nuevoActivo, setNuevoActivo] = useState('');
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [nuevaRegla, setNuevaRegla] = useState('');

  const labels = {
    es: {
      title: 'Ajustes',
      personalization: 'Personalizacion',
      traderName: 'Tu nombre de trader',
      traderNamePlaceholder: 'Ej: Carlos, El Trader, etc.',
      initialCapital: 'Capital Inicial',
      dailyGoal: 'Meta Diaria',
      myAssets: 'Mis Activos',
      assetsDescription: 'Agrega los pares o activos que operas frecuentemente',
      searchAsset: 'Escribe o busca un activo...',
      noAssetsYet: 'No has agregado activos aun',
      setupRules: 'Reglas de Setup',
      rulesDescription: 'Define tus criterios para tomar un trade. Se usaran como checklist antes de operar.',
      rulePlaceholder: 'Ej: Confluencia de soportes...',
      noRulesYet: 'No has agregado reglas de setup aun',
      viewTour: 'Ver tour de la app',
      saveConfig: 'Guardar Configuracion',
    },
    en: {
      title: 'Settings',
      personalization: 'Personalization',
      traderName: 'Your trader name',
      traderNamePlaceholder: 'Ex: Carlos, The Trader, etc.',
      initialCapital: 'Initial Capital',
      dailyGoal: 'Daily Goal',
      myAssets: 'My Assets',
      assetsDescription: 'Add the pairs or assets you trade frequently',
      searchAsset: 'Type or search for an asset...',
      noAssetsYet: 'You haven\'t added any assets yet',
      setupRules: 'Setup Rules',
      rulesDescription: 'Define your criteria to take a trade. They will be used as a checklist before trading.',
      rulePlaceholder: 'Ex: Support confluence...',
      noRulesYet: 'You haven\'t added any setup rules yet',
      viewTour: 'View app tour',
      saveConfig: 'Save Settings',
    },
  };
  const t = labels[language];

  if (!isOpen) return null;

  // Filtrar sugerencias basadas en el input
  const sugerenciasFiltradas = nuevoActivo.length > 0
    ? ACTIVOS_DISPONIBLES.filter(a =>
        (a.symbol.toLowerCase().includes(nuevoActivo.toLowerCase()) ||
        a.name.toLowerCase().includes(nuevoActivo.toLowerCase())) &&
        !(config.activosFavoritos || []).includes(a.symbol)
      ).slice(0, 6)
    : [];

  const agregarActivo = (symbol) => {
    const actuales = config.activosFavoritos || [];
    if (!actuales.includes(symbol)) {
      setConfig({ ...config, activosFavoritos: [...actuales, symbol] });
    }
    setNuevoActivo('');
    setShowSugerencias(false);
  };

  const agregarActivoManual = () => {
    const symbol = nuevoActivo.trim().toUpperCase();
    if (symbol && !(config.activosFavoritos || []).includes(symbol)) {
      setConfig({ ...config, activosFavoritos: [...(config.activosFavoritos || []), symbol] });
    }
    setNuevoActivo('');
    setShowSugerencias(false);
  };

  const eliminarActivo = (symbol) => {
    const actuales = config.activosFavoritos || [];
    setConfig({ ...config, activosFavoritos: actuales.filter(a => a !== symbol) });
  };

  const agregarRegla = () => {
    const regla = nuevaRegla.trim();
    if (!regla) return;
    const actuales = config.reglasSetup || [];
    if (actuales.includes(regla)) return;
    setConfig({ ...config, reglasSetup: [...actuales, regla] });
    setNuevaRegla('');
  };

  const eliminarRegla = (index) => {
    const actuales = config.reglasSetup || [];
    setConfig({ ...config, reglasSetup: actuales.filter((_, i) => i !== index) });
  };
  
  const handleMetaUSD = (usd) => setConfig({ ...config, metaDiaria: Number(usd) });
  
  const handleMetaPercent = (pct) => { 
    const usd = (config.capitalInicial * (pct / 100)).toFixed(0); 
    setConfig({ ...config, metaDiaria: Number(usd) }); 
  };
  
  const metaPercentDisplay = config.capitalInicial > 0 
    ? ((config.metaDiaria / config.capitalInicial) * 100).toFixed(2) 
    : 0;
  
  const handleSave = () => {
    onSaveToCloud();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`rounded-2xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Settings size={20} className="text-blue-500"/> {t.title}
          </h3>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            <X size={20}/>
          </button>
        </div>
        
        <div className="space-y-5">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-blue-50 border-blue-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-3 block flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <User size={14}/> {t.personalization}
            </label>

            <div className="mb-4">
              <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.traderName}
              </label>
              <input
                type="text"
                placeholder={t.traderNamePlaceholder}
                className={`w-full p-2.5 border rounded-xl font-medium outline-none focus:border-blue-500 transition-colors text-sm ${
                  isDark 
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={config.nombreTrader || ''} 
                onChange={e => setConfig({...config, nombreTrader: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              {t.initialCapital}
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-3 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
              <input
                type="number"
                placeholder="1000"
                className={`w-full pl-8 p-2.5 border rounded-xl font-mono font-bold outline-none focus:border-blue-500 transition-colors ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400'
                }`}
                value={config.capitalInicial || ''}
                onChange={e => setConfig({...config, capitalInicial: e.target.value === '' ? 0 : Number(e.target.value)})}
              />
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-3 block flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              <Target size={14} className="text-blue-500"/> {t.dailyGoal}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className={`absolute left-3 top-2.5 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
                <input
                  type="number"
                  placeholder="50"
                  className={`w-full pl-7 p-2 border rounded-lg font-bold outline-none focus:border-blue-500 text-sm ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400'
                  }`}
                  value={config.metaDiaria || ''}
                  onChange={e => handleMetaUSD(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="5"
                  className={`w-full pr-7 p-2 border rounded-lg font-bold text-blue-500 outline-none focus:border-blue-500 text-sm ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 placeholder:text-slate-500'
                      : 'bg-white border-slate-200 placeholder:text-slate-400'
                  }`}
                  value={metaPercentDisplay || ''}
                  onChange={e => handleMetaPercent(e.target.value)}
                />
                <span className={`absolute right-3 top-2.5 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>%</span>
              </div>
            </div>
          </div>

          {/* Mis Activos / Pares */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-green-50 border-green-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-3 block flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <TrendingUp size={14}/> {t.myAssets}
            </label>
            <p className={`text-[10px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.assetsDescription}
            </p>

            {/* Input para agregar nuevo activo */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder={t.searchAsset}
                className={`w-full p-2.5 pr-10 border rounded-xl font-medium outline-none focus:border-green-500 transition-colors text-sm ${
                  isDark
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={nuevoActivo}
                onChange={e => {
                  setNuevoActivo(e.target.value);
                  setShowSugerencias(true);
                }}
                onFocus={() => setShowSugerencias(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    agregarActivoManual();
                  }
                }}
              />
              <button
                type="button"
                onClick={agregarActivoManual}
                disabled={!nuevoActivo.trim()}
                className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${
                  nuevoActivo.trim()
                    ? isDark ? 'hover:bg-slate-500 text-green-400' : 'hover:bg-green-100 text-green-500'
                    : 'opacity-30 cursor-not-allowed'
                } ${isDark ? 'text-slate-400' : 'text-slate-400'}`}
                title="Agregar activo"
              >
                <Plus size={16}/>
              </button>

              {/* Sugerencias dropdown */}
              {showSugerencias && sugerenciasFiltradas.length > 0 && (
                <div className={`absolute z-10 w-full mt-1 rounded-xl border shadow-lg max-h-48 overflow-y-auto ${
                  isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                }`}>
                  {sugerenciasFiltradas.map((activo) => (
                    <button
                      key={activo.symbol}
                      type="button"
                      onClick={() => agregarActivo(activo.symbol)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex justify-between items-center ${
                        isDark
                          ? 'hover:bg-slate-600 text-white'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold">{activo.symbol}</span>
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activo.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lista de activos guardados */}
            {(config.activosFavoritos || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(config.activosFavoritos || []).map((symbol) => (
                  <div
                    key={symbol}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                      isDark
                        ? 'bg-slate-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{symbol}</span>
                    <button
                      type="button"
                      onClick={() => eliminarActivo(symbol)}
                      className={`p-0.5 rounded transition-colors ${
                        isDark ? 'hover:bg-red-500/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <Trash2 size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs text-center py-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.noAssetsYet}
              </p>
            )}
          </div>

          {/* Reglas de Setup / Checklist */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-amber-50 border-amber-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              <ClipboardCheck size={14}/> {t.setupRules}
            </label>
            <p className={`text-[10px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.rulesDescription}
            </p>

            {/* Input para agregar regla */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder={t.rulePlaceholder}
                className={`flex-1 p-2.5 border rounded-xl font-medium outline-none focus:border-amber-500 transition-colors text-sm ${
                  isDark
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={nuevaRegla}
                onChange={e => setNuevaRegla(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    agregarRegla();
                  }
                }}
              />
              <button
                type="button"
                onClick={agregarRegla}
                disabled={!nuevaRegla.trim()}
                className={`px-3 rounded-xl font-bold text-sm transition-colors ${
                  nuevaRegla.trim()
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : isDark ? 'bg-slate-600 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus size={18}/>
              </button>
            </div>

            {/* Lista de reglas */}
            {(config.reglasSetup || []).length > 0 ? (
              <div className="space-y-2">
                {(config.reglasSetup || []).map((regla, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm ${
                      isDark ? 'bg-slate-600' : 'bg-white border border-slate-200'
                    }`}
                  >
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                      {index + 1}. {regla}
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarRegla(index)}
                      className={`p-1 rounded transition-colors flex-shrink-0 ${
                        isDark ? 'hover:bg-red-500/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs text-center py-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.noRulesYet}
              </p>
            )}
          </div>

          {/* Botón para ver tour */}
          {onRestartTour && (
            <button
              onClick={() => {
                onRestartTour();
                onClose();
              }}
              className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <HelpCircle size={18} />
              {t.viewTour}
            </button>
          )}

          <button
            onClick={handleSave}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold active:scale-[0.98] transition-all shadow-lg"
          >
            {t.saveConfig}
          </button>
        </div>
      </div>
    </div>
  );
}