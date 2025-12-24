"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';
import EconomicCalendar from './EconomicCalendar';
import { Settings, LogOut, Menu, Sun, Moon, CloudSun, Target, Calendar } from 'lucide-react';

export default function Header({ 
  user, 
  config,
  pnlHoy,
  metaDiaria,
  metaDiariaPct,
  progresoMeta,
  onSettings, 
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const displayName = config?.nombreTrader || user.displayName || user.email?.split('@')[0];
  
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { 
        text: "Buenos dias", 
        icon: <Sun className="text-yellow-500" size={24} />,
        bgIcon: 'bg-yellow-500/10'
      };
    }
    if (hour >= 12 && hour < 19) {
      return { 
        text: "Buenas tardes", 
        icon: <CloudSun className="text-orange-500" size={24} />,
        bgIcon: 'bg-orange-500/10'
      };
    }
    return { 
      text: "Buenas noches", 
      icon: <Moon className="text-indigo-400" size={24} />,
      bgIcon: 'bg-indigo-500/10'
    };
  };
  
  const greetingData = getGreetingData();
  
  const frasesMotivadoras = [
    "El mercado recompensa la paciencia",
    "Disciplina sobre emocion",
    "Un trade a la vez",
    "Protege tu capital primero",
    "El proceso importa mas que el resultado",
    "Opera tu plan, no tus emociones",
  ];
  const today = new Date().getDate();
  const fraseDelDia = config?.fraseMotivadora || frasesMotivadoras[today % frasesMotivadoras.length];

  return (
    <>
      {/* Header principal */}
      <nav className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="w-[100px] sm:w-[120px] h-[35px] sm:h-[40px] flex items-center">
            <Image src="/tradingLogo.png" alt="Trading Journal PRO" width={120} height={40} className="max-w-full max-h-full object-contain" priority />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setShowCalendar(true)}
              className={`p-2 rounded-full transition-all ${
                isDark 
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
              title="Calendario Económico"
            >
              <Calendar size={18} />
            </button>
            
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${
                isDark 
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button 
              onClick={onSettings} 
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <Settings size={18}/>
            </button>
            
            <button 
              onClick={onLogout} 
              title="Cerrar Sesion" 
              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-colors"
            >
              <LogOut size={18}/>
            </button>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`sm:hidden p-2 rounded-full ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              <Menu size={20}/>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`sm:hidden border-t p-4 space-y-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
            <div className="max-w-[1400px] mx-auto">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                <p className={`text-[10px] font-bold uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  Target Hoy ({metaDiariaPct}%)
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-lg font-black ${pnlHoy >= metaDiaria ? 'text-green-500' : isDark ? 'text-white' : 'text-slate-700'}`}>
                    ${pnlHoy.toFixed(0)} / ${metaDiaria}
                  </span>
                  <div className={`flex-1 h-2 rounded-full overflow-hidden max-w-[100px] ${isDark ? 'bg-slate-600' : 'bg-slate-100'}`}>
                    <div 
                      className={`h-full transition-all ${pnlHoy >= metaDiaria ? 'bg-green-500' : 'bg-blue-500'}`} 
                      style={{ width: `${Math.max(0, Math.min(100, progresoMeta))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Seccion de bienvenida + Target */}
      <div className={`px-4 sm:px-6 lg:px-8 py-5 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-5">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2 ${greetingData.bgIcon}`}>
              {greetingData.icon}
            </div>
            <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {greetingData.text}, <span className="text-blue-500">{displayName}</span>
            </h2>
            <p className={`mt-1 text-sm italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              &quot;{fraseDelDia}&quot;
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${pnlHoy >= metaDiaria ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                  <Target size={18} className={pnlHoy >= metaDiaria ? 'text-green-500' : 'text-blue-500'} />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Target del dia ({metaDiariaPct}%)
                  </p>
                  <p className={`text-lg sm:text-xl font-black ${pnlHoy >= metaDiaria ? 'text-green-500' : isDark ? 'text-white' : 'text-slate-800'}`}>
                    ${pnlHoy.toFixed(2)} <span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/ ${metaDiaria}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex-1 max-w-[200px]">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Progreso</span>
                  <span className={`font-bold ${pnlHoy >= metaDiaria ? 'text-green-500' : 'text-blue-500'}`}>
                    {Math.min(100, progresoMeta).toFixed(0)}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${pnlHoy >= metaDiaria ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ width: `${Math.max(0, Math.min(100, progresoMeta))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Calendario Económico */}
      <EconomicCalendar isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
    </>
  );
}