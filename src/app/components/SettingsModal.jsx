"use client";
import { useState } from 'react';
import { Settings, X, Target, User, MessageSquare, Sparkles, TrendingUp, Plus, Trash2, ClipboardCheck, HelpCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';

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

const frasesSugeridas = [
  "El mercado recompensa la paciencia 📈",
  "Disciplina sobre emocion 🎯",
  "Un trade a la vez 🔥",
  "Protege tu capital primero 🛡️",
  "El proceso importa mas que el resultado 💪",
  "Menos es mas en trading 🧘",
  "Respeta tu stop loss ⛔",
  "La consistencia crea riqueza 💰",
  "Opera tu plan, no tus emociones 🧠",
  "Hoy es un buen dia para ser rentable ✨",
  "El mercado siempre tiene la razon 📊",
  "Corta las perdidas, deja correr las ganancias ✂️",
];

export default function SettingsModal({ isOpen, onClose, config, setConfig, onSaveToCloud, onRestartTour }) {
  const { isDark } = useTheme();
  const [showFrases, setShowFrases] = useState(false);
  const [nuevoActivo, setNuevoActivo] = useState('');
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [nuevaRegla, setNuevaRegla] = useState('');

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

  const selectFrase = (frase) => {
    setConfig({ ...config, fraseMotivadora: frase });
    setShowFrases(false);
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
            <Settings size={20} className="text-blue-500"/> Ajustes
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
              <User size={14}/> Personalizacion
            </label>
            
            <div className="mb-4">
              <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tu nombre de trader
              </label>
              <input 
                type="text" 
                placeholder="Ej: Carlos, El Trader, etc."
                className={`w-full p-2.5 border rounded-xl font-medium outline-none focus:border-blue-500 transition-colors text-sm ${
                  isDark 
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={config.nombreTrader || ''} 
                onChange={e => setConfig({...config, nombreTrader: e.target.value})} 
              />
            </div>
            
            <div>
              <label className={`text-[10px] font-bold uppercase mb-1 block flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <MessageSquare size={10}/> Frase motivadora
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tu frase para mantenerte enfocado..."
                  className={`w-full p-2.5 pr-10 border rounded-xl font-medium outline-none focus:border-blue-500 transition-colors text-sm ${
                    isDark 
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                  value={config.fraseMotivadora || ''} 
                  onChange={e => setConfig({...config, fraseMotivadora: e.target.value})} 
                />
                <button
                  type="button"
                  onClick={() => setShowFrases(!showFrases)}
                  className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-slate-500 text-yellow-400' 
                      : 'hover:bg-slate-100 text-yellow-500'
                  }`}
                  title="Ver sugerencias"
                >
                  <Sparkles size={16}/>
                </button>
              </div>
              
              {showFrases && (
                <div className={`mt-2 p-3 rounded-xl border max-h-40 overflow-y-auto ${
                  isDark ? 'bg-slate-600 border-slate-500' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-[10px] font-bold uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Frases sugeridas (toca para seleccionar):
                  </p>
                  <div className="space-y-1">
                    {frasesSugeridas.map((frase, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectFrase(frase)}
                        className={`w-full text-left text-xs p-2 rounded-lg transition-colors ${
                          isDark 
                            ? 'hover:bg-slate-500 text-slate-300' 
                            : 'hover:bg-white text-slate-600'
                        }`}
                      >
                        {frase}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Capital Inicial
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
              <Target size={14} className="text-blue-500"/> Meta Diaria
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
              <TrendingUp size={14}/> Mis Activos
            </label>
            <p className={`text-[10px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Agrega los pares o activos que operas frecuentemente
            </p>

            {/* Input para agregar nuevo activo */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Escribe o busca un activo..."
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
                No has agregado activos aun
              </p>
            )}
          </div>

          {/* Reglas de Setup / Checklist */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-amber-50 border-amber-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              <ClipboardCheck size={14}/> Reglas de Setup
            </label>
            <p className={`text-[10px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Define tus criterios para tomar un trade. Se usaran como checklist antes de operar.
            </p>

            {/* Input para agregar regla */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Ej: Confluencia de soportes..."
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
                No has agregado reglas de setup aun
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
              Ver tour de la app
            </button>
          )}

          <button
            onClick={handleSave}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold active:scale-[0.98] transition-all shadow-lg"
          >
            Guardar Configuracion
          </button>
        </div>
      </div>
    </div>
  );
}