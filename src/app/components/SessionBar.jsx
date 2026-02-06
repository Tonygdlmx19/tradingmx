"use client";
import { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

// Trading Sessions in UTC
const SESSIONS = [
  { id: 'sydney', name: { es: 'Sydney', en: 'Sydney' }, startUTC: 21, endUTC: 6, color: 'blue' },
  { id: 'tokyo', name: { es: 'Tokyo', en: 'Tokyo' }, startUTC: 0, endUTC: 9, color: 'pink' },
  { id: 'london', name: { es: 'Londres', en: 'London' }, startUTC: 7, endUTC: 16, color: 'green' },
  { id: 'newyork', name: { es: 'New York', en: 'New York' }, startUTC: 13, endUTC: 22, color: 'orange' },
];

const SESSION_COLORS = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-500', bgLight: 'bg-blue-500/20' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-500', bgLight: 'bg-pink-500/20' },
  green: { bg: 'bg-green-500', text: 'text-green-500', bgLight: 'bg-green-500/20' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500', bgLight: 'bg-orange-500/20' },
};

function isSessionActive(session, utcHour) {
  if (session.startUTC > session.endUTC) {
    // Session crosses midnight (e.g., Sydney 21:00 - 06:00)
    return utcHour >= session.startUTC || utcHour < session.endUTC;
  }
  return utcHour >= session.startUTC && utcHour < session.endUTC;
}

function getActiveSessions(utcHour) {
  return SESSIONS.filter(session => isSessionActive(session, utcHour));
}

export default function SessionBar() {
  const { isDark } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className={`px-4 py-2 border-b ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: '1280px' }}>
          <div className="w-10 h-6 rounded bg-slate-300 animate-pulse" />
          <div className="w-32 h-6 rounded bg-slate-300 animate-pulse" />
        </div>
      </div>
    );
  }

  const utcHour = currentTime.getUTCHours();
  const activeSessions = getActiveSessions(utcHour);

  const timeString = currentTime.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const labels = {
    es: {
      noSession: 'Mercados cerrados',
    },
    en: {
      noSession: 'Markets closed',
    },
  };
  const t = labels[language];

  return (
    <div className={`px-4 py-2 border-b ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
      <div className="mx-auto flex items-center justify-between gap-4" style={{ maxWidth: '1280px' }}>
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className={`ml-2 sm:ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
            isDark
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <Globe size={14} />
          {language === 'es' ? 'ES' : 'EN'}
        </button>

        {/* Clock and Session */}
        <div className="flex items-center gap-4">
          {/* Digital Clock */}
          <div className={`flex items-center gap-2 font-mono text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
            <Clock size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            {timeString}
          </div>

          {/* Session Indicator */}
          <div className="flex items-center gap-2">
            {activeSessions.length === 0 ? (
              <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.noSession}
              </span>
            ) : (
              <div className="flex items-center gap-2">
                {activeSessions.map((session, index) => {
                  const colors = SESSION_COLORS[session.color];
                  return (
                    <div
                      key={session.id}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${colors.bgLight}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${colors.bg} animate-pulse`} />
                      <span className={`text-xs font-bold ${colors.text}`}>
                        {session.name[language]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
