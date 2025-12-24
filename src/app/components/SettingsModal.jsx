"use client";
import { useState } from 'react';
import { Settings, X, Target, User, MessageSquare, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';

// Frases sugeridas para el usuario
const frasesSugeridas = [
  "El mercado recompensa la paciencia 📈",
  "Disciplina sobre emoción 🎯",
  "Un trade a la vez 🔥",
  "Protege tu capital primero 🛡️",
  "El proceso importa más que el resultado 💪",
  "Menos es más en trading 🧘",
  "Respeta tu stop loss ⛔",
  "La consistencia crea riqueza 💰",
  "Opera tu plan, no tus emociones 🧠",
  "Hoy es un buen día para ser rentable ✨",
  "El mercado siempre tiene la razón 📊",
  "Corta las pérdidas, deja correr las ganancias ✂️",
];

export default function SettingsModal({ isOpen, onClose, config, setConfig, onSaveToCloud }) {
  const { isDark } = useTheme();
  const [showFrases, setShowFrases] = useState(false);
  
  if (!isOpen) return null;
  
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
      <div className={`rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Settings size={20} className="text-blue-500"/> Ajustes
          </h3>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            <X size={20}/>
          </button>
        </div>
        
        <div className="space-y-6">
          {/* ═══════════════════════════════════════════════════════
              SECCIÓN: Personalización del Trader
          ═══════════════════════════════════════════════════════ */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-blue-50 border-blue-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-3 block flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <User size={14}/> Personalización
            </label>
            
            {/* Nombre del Trader */}
            <div className="mb-4">
              <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tu nombre de trader
              </label>
              <input 
                type="text" 
                placeholder="Ej: Carlos, El Trader, etc."
                className={`w-full p-3 border rounded-xl font-medium outline-none focus:border-blue-500 transition-colors ${
                  isDark 
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={config.nombreTrader || ''} 
                onChange={e => setConfig({...config, nombreTrader: e.target.value})} 
              />
            </div>
            
            {/* Frase Motivadora */}
            <div>
              <label className={`text-[10px] font-bold uppercase mb-1 block flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <MessageSquare size={10}/> Frase motivadora
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tu frase para mantenerte enfocado..."
                  className={`w-full p-3 pr-10 border rounded-xl font-medium outline-none focus:border-blue-500 transition-colors ${
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
                  <Sparkles size={18}/>
                </button>
              </div>
              
              {/* Frases sugeridas */}
              {showFrases && (
                <div className={`mt-2 p-3 rounded-xl border max-h-40 overflow-y-auto ${
                  isDark ? 'bg-slate-600 border-slate-500' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-[10px] font-bold uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ✨ Frases sugeridas (toca para seleccionar):
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

          {/* ═══════════════════════════════════════════════════════
              SECCIÓN: Capital
          ═══════════════════════════════════════════════════════ */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Capital Inicial
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-3.5 font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
              <input 
                type="number" 
                className={`w-full pl-9 p-3 border rounded-xl font-mono text-lg font-bold outline-none focus:border-blue-500 transition-colors ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
                value={config.capitalInicial} 
                onChange={e => setConfig({...config, capitalInicial: Number(e.target.value)})} 
              />
            </div>
          </div>
          
          {/* ═══════════════════════════════════════════════════════
              SECCIÓN: Meta Diaria
          ═══════════════════════════════════════════════════════ */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-3 block flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              <Target size={14} className="text-blue-500"/> Meta Diaria
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className={`absolute left-3 top-2.5 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
                <input 
                  type="number" 
                  className={`w-full pl-7 p-2.5 border rounded-lg font-bold outline-none focus:border-blue-500 ${
                    isDark 
                      ? 'bg-slate-600 border-slate-500 text-white' 
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                  value={config.metaDiaria} 
                  onChange={e => handleMetaUSD(e.target.value)} 
                />
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1" 
                  className={`w-full pr-7 p-2.5 border rounded-lg font-bold text-blue-500 outline-none focus:border-blue-500 ${
                    isDark 
                      ? 'bg-slate-600 border-slate-500' 
                      : 'bg-white border-slate-200'
                  }`}
                  value={metaPercentDisplay} 
                  onChange={e => handleMetaPercent(e.target.value)} 
                />
                <span className={`absolute right-3 top-2.5 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>%</span>
              </div>
            </div>
          </div>
          
          {/* Botón Guardar */}
          <button 
            onClick={handleSave} 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold active:scale-[0.98] transition-all shadow-lg"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}
