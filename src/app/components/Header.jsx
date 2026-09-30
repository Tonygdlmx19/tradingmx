"use client";
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { Settings, LogOut, Sun, Moon, Target, Calendar, Trophy, ShieldCheck, GraduationCap, BarChart3, User } from 'lucide-react';
import SessionBar from './SessionBar';

export default function Header({
  user,
  config,
  pnlHoy,
  metaDiaria,
  metaDiariaPct,
  progresoMeta,
  selectedAccountId,
  setSelectedAccountId,
  selectedAccount,
  currencySymbol = '$',
  onSettings,
  onCalendar,
  onFundingSimulator,
  onAcademy,
  onESTracker,
  hasTrackerAccess,
  isAdmin,
  onAdmin,
  onLogout,
  userType
}) {
  const { isDark, toggleTheme } = useTheme();
  const { language } = useLanguage();

  const displayName = config?.nombreTrader || user.displayName || user.email?.split('@')[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return language === 'es' ? "Buenos días" : "Good morning";
    if (hour >= 12 && hour < 19) return language === 'es' ? "Buenas tardes" : "Good afternoon";
    return language === 'es' ? "Buenas noches" : "Good evening";
  };
  const greeting = getGreeting();

  // Un solo estilo para todos los iconos del encabezado: gris en reposo, blanco/negro al pasar.
  const iconBtn = `p-2 rounded-lg transition-colors ${
    isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
  }`;
  
  const frasesMotivadoras = {
    es: [
      "El mercado recompensa la paciencia",
      "Disciplina sobre emoción",
      "Un trade a la vez",
      "Protege tu capital primero",
      "El proceso importa más que el resultado",
      "Opera tu plan, no tus emociones",
      "La consistencia supera a la intensidad",
      "Acepta las pérdidas como parte del juego",
      "Tu peor enemigo en el trading eres tú mismo",
      "El éxito es la suma de pequeños esfuerzos repetidos",
      "No busques tener razón, busca ser rentable",
      "La paciencia es la madre de todas las virtudes",
      "Cada día es una nueva oportunidad",
      "El mercado siempre tiene la razón",
      "Menos es más en el trading",
      "La gestión del riesgo es la clave del éxito",
      "Aprende a perder antes de ganar",
      "Tu mindset determina tu éxito",
      "El control emocional es tu mayor ventaja",
      "No persigas al mercado, deja que venga a ti",
      "La mejor operación es la que no haces",
      "Confía en tu análisis, no en tu esperanza",
      "El trading es un maratón, no un sprint",
      "Cada error es una lección valiosa",
      "La humildad te mantiene en el juego",
      "Enfócate en el proceso, no en el dinero",
      "La preparación precede al éxito",
      "Sé paciente con las ganancias, rápido con las pérdidas",
      "Tu diario de trading es tu mejor maestro",
      "El mercado no te debe nada",
      "La disciplina es libertad",
    ],
    en: [
      "The market rewards patience",
      "Discipline over emotion",
      "One trade at a time",
      "Protect your capital first",
      "The process matters more than the result",
      "Trade your plan, not your emotions",
      "Consistency beats intensity",
      "Accept losses as part of the game",
      "Your worst enemy in trading is yourself",
      "Success is the sum of small efforts repeated",
      "Don't seek to be right, seek to be profitable",
      "Patience is the mother of all virtues",
      "Every day is a new opportunity",
      "The market is always right",
      "Less is more in trading",
      "Risk management is the key to success",
      "Learn to lose before you win",
      "Your mindset determines your success",
      "Emotional control is your greatest edge",
      "Don't chase the market, let it come to you",
      "The best trade is the one you don't take",
      "Trust your analysis, not your hope",
      "Trading is a marathon, not a sprint",
      "Every mistake is a valuable lesson",
      "Humility keeps you in the game",
      "Focus on the process, not the money",
      "Preparation precedes success",
      "Be patient with profits, quick with losses",
      "Your trading journal is your best teacher",
      "The market owes you nothing",
      "Discipline is freedom",
    ],
  };
  const today = new Date().getDate();
  const frases = frasesMotivadoras[language] || frasesMotivadoras.es;
  const fraseDelDia = frases[today % frases.length];

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
              className={iconBtn}
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
              aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={onFundingSimulator}
              data-tour="funding"
              className={iconBtn}
              title="Simulador de Fondeo"
              aria-label="Simulador de Fondeo"
            >
              <Trophy size={18}/>
            </button>

            {(isAdmin || hasTrackerAccess) && (
              <button
                onClick={onESTracker}
                className={iconBtn}
                title="Análisis Institucional"
                aria-label="Análisis Institucional"
              >
                <BarChart3 size={18}/>
              </button>
            )}

            {userType !== 'trial' && (
              <button
                onClick={onAcademy}
                className={iconBtn}
                title={language === 'es' ? 'Academia de Trading' : 'Trading Academy'}
                aria-label={language === 'es' ? 'Academia de Trading' : 'Trading Academy'}
              >
                <GraduationCap size={18}/>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={onAdmin}
                className={iconBtn}
                title="Panel de Admin"
                aria-label="Panel de Admin"
              >
                <ShieldCheck size={18}/>
              </button>
            )}

            <button
              onClick={onCalendar}
              data-tour="calendar"
              className={iconBtn}
              title="Calendario Económico"
              aria-label="Calendario Económico"
            >
              <Calendar size={18}/>
            </button>

            <button
              onClick={onSettings}
              data-tour="settings"
              className={iconBtn}
              title="Configuración"
              aria-label="Configuración"
            >
              <Settings size={18}/>
            </button>
            
            <div className={`w-px h-5 mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              aria-label="Cerrar Sesión"
              className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'}`}
            >
              <LogOut size={18}/>
            </button>
          </div>
        </div>
      </nav>

      {/* Barra de sesión con reloj e idioma */}
      <SessionBar />

      {/* Sección de bienvenida + Target */}
      <div className={`px-4 sm:px-6 lg:px-8 py-5 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="flex flex-col items-center text-center gap-2 mb-4">
            {config?.fotoPerfil ? (
              <img
                src={config.fotoPerfil}
                alt="Perfil"
                className={`w-12 h-12 rounded-full object-cover border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
              />
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                <User size={20} />
              </div>
            )}
            <div>
              <h2 className={`text-base sm:text-lg font-semibold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {greeting}, {displayName}
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {fraseDelDia}
              </p>
            </div>
          </div>

          {/* Selector de cuenta y Target */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            {/* Selector de cuenta */}
            {(config.cuentasBroker || []).length > 0 && (
              <div className="mb-4">
                <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'es' ? 'Cuenta activa' : 'Active account'}
                </label>
                <select
                  value={selectedAccountId || ''}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {(config.cuentasBroker || []).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.broker} - #{c.numero} ({c.divisa || 'USD'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Target del día */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${pnlHoy >= metaDiaria ? 'bg-green-500/10 text-green-600' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  <Target size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'es' ? 'Target del día' : 'Daily Target'} ({metaDiariaPct}%)
                    </p>
                    {selectedAccount && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {selectedAccount.divisa || 'USD'}
                      </span>
                    )}
                  </div>
                  <p className={`text-lg sm:text-xl font-black ${pnlHoy >= metaDiaria ? 'text-green-500' : isDark ? 'text-white' : 'text-slate-800'}`}>
                    {currencySymbol}{pnlHoy.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className={`text-xs font-normal ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      / {currencySymbol}{metaDiaria.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="w-full sm:flex-1 sm:max-w-[200px]">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {language === 'es' ? 'Progreso' : 'Progress'}
                  </span>
                  <span className={`font-bold tabular-nums ${pnlHoy >= metaDiaria ? 'text-green-500' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {Math.max(0, Math.min(100, progresoMeta)).toFixed(0)}%
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

    </>
  );
}