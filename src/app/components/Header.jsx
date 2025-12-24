"use client";
import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { 
  Settings, Activity, Cloud, LogOut, Menu, Sun, Moon
} from 'lucide-react';

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
  const { isDark, toggleTheme } = useTheme();

  // Nombre a mostrar
  const displayName = config?.nombreTrader || user.displayName || user.email?.split('@')[0];
  
  // Frase motivadora
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
    <nav className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2 sm:p-2.5 rounded-xl shadow-lg">
            <Activity size={18} className="sm:w-[22px] sm:h-[22px]"/>
          </div>
          
          <div className="flex flex-col">
            <h1 className={`font-black text-base sm:text-xl tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              TRADING <span className="text-blue-500">PRO</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Cloud size={8} className="sm:w-[10px] sm:h-[10px] text-green-500"/>
              <p className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider truncate max-w-[100px] sm:max-w-[150px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {displayName}
              </p>
            </div>
          </div>
        </div>

        {/* Frase motivadora - Solo en desktop */}
        <div className="hidden lg:block flex-1 max-w-lg mx-8">
          <p className={`text-sm font-medium italic text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            "{fraseDelDia}"
          </p>
        </div>

        {/* Controles derecha */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Target del día - Desktop */}
          <div className={`hidden sm:block text-right pr-4 border-r ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <p className={`text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Target Hoy ({metaDiariaPct}%)
            </p>
            <div className="flex items-center justify-end gap-3">
              <span className={`text-sm font-black ${pnlHoy >= metaDiaria ? 'text-green-500' : isDark ? 'text-white' : 'text-slate-700'}`}>
                ${pnlHoy.toFixed(0)} / ${metaDiaria}
              </span>
              <div className={`w-20 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <div 
                  className={`h-full transition-all ${pnlHoy >= metaDiaria ? 'bg-green-500' : 'bg-blue-500'}`} 
                  style={{ width: `${Math.max(0, Math.min(100, progresoMeta))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Toggle Dark Mode */}
          <button 
            onClick={toggleTheme}
            className={`p-2 sm:p-2.5 rounded-full transition-all ${
              isDark 
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* Ajustes */}
          <button 
            onClick={onSettings} 
            className={`p-2 sm:p-3 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            <Settings size={18} className="sm:w-5 sm:h-5"/>
          </button>
          
          {/* Logout */}
          <button 
            onClick={onLogout} 
            title="Cerrar Sesión" 
            className="p-2 sm:p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-colors"
          >
            <LogOut size={18} className="sm:w-5 sm:h-5"/>
          </button>
          
          {/* Menú hamburguesa - Solo móvil */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`sm:hidden p-2 rounded-full ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <Menu size={20}/>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className={`sm:hidden border-t p-4 space-y-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
          {/* Frase motivadora en móvil */}
          <p className={`text-xs font-medium italic text-center py-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            "{fraseDelDia}"
          </p>
          
          {/* Target del día en móvil */}
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
      )}
    </nav>
  );
}
