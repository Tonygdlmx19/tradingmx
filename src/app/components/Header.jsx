"use client";
import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Settings, LogOut, Sun, Moon, CloudSun, Target, Calendar, Calculator } from 'lucide-react';
import CalculatorModal from './CalculatorModal';

export default function Header({
  user,
  config,
  pnlHoy,
  metaDiaria,
  metaDiariaPct,
  progresoMeta,
  onSettings,
  onCalendar,
  onLogout
}) {
  const { isDark, toggleTheme } = useTheme();
  const [showCalculator, setShowCalculator] = useState(false);

  const displayName = config?.nombreTrader || user.displayName || user.email?.split('@')[0];
  
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { 
        text: "Buenos días", 
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
    "Disciplina sobre emoción",
    "Un trade a la vez",
    "Protege tu capital primero",
    "El proceso importa más que el resultado",
    "Opera tu plan, no tus emociones",
  ];
  const today = new Date().getDate();
  const fraseDelDia = config?.fraseMotivadora || frasesMotivadoras[today % frasesMotivadoras.length];

  return (
    <>
      {/* Header principal */}
      <nav className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center" style={{ maxWidth: '1280px' }}>
          {/* Logo */}
          <div className="w-[150px] sm:w-[160px] h-[50px] flex items-center">
            <img src="/tradingLogo.svg" alt="Trading Journal PRO" className="max-w-full max-h-full object-contain" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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
              onClick={() => setShowCalculator(true)}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-green-400' : 'hover:bg-slate-100 text-green-600'}`}
              title="Calculadora"
            >
              <Calculator size={18}/>
            </button>

            <button
              onClick={onCalendar}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-blue-400' : 'hover:bg-slate-100 text-blue-500'}`}
              title="Calendario Económico"
            >
              <Calendar size={18}/>
            </button>

            <button
              onClick={onSettings}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <Settings size={18}/>
            </button>
            
            <button 
              onClick={onLogout} 
              title="Cerrar Sesión" 
              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-colors"
            >
              <LogOut size={18}/>
            </button>
          </div>
        </div>
      </nav>

      {/* Sección de bienvenida + Target */}
      <div className={`px-4 sm:px-6 lg:px-8 py-5 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
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
                    Target del día ({metaDiariaPct}%)
                  </p>
                  <p className={`text-lg sm:text-xl font-black ${pnlHoy >= metaDiaria ? 'text-green-500' : isDark ? 'text-white' : 'text-slate-800'}`}>
                    ${pnlHoy.toFixed(2)} <span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/ ${metaDiaria}</span>
                  </p>
                </div>
              </div>
              
              {/* Barra de progreso - ancho completo en móvil */}
              <div className="w-full sm:flex-1 sm:max-w-[200px]">
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

      {/* Modal Calculadora */}
      <CalculatorModal isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
    </>
  );
}