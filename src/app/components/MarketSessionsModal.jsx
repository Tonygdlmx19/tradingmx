"use client";
import { useState, useEffect } from 'react';
import { X, Clock, MapPin } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

// Trading Sessions in UTC with city info
const SESSIONS = [
  {
    id: 'sydney',
    name: { es: 'Sydney', en: 'Sydney' },
    startUTC: 21,
    endUTC: 6,
    color: 'blue',
    flag: '🇦🇺',
    timezone: 'Australia/Sydney',
    pairs: ['AUD/USD', 'NZD/USD', 'AUD/JPY']
  },
  {
    id: 'tokyo',
    name: { es: 'Tokyo', en: 'Tokyo' },
    startUTC: 0,
    endUTC: 9,
    color: 'pink',
    flag: '🇯🇵',
    timezone: 'Asia/Tokyo',
    pairs: ['USD/JPY', 'EUR/JPY', 'GBP/JPY']
  },
  {
    id: 'london',
    name: { es: 'Londres', en: 'London' },
    startUTC: 7,
    endUTC: 16,
    color: 'green',
    flag: '🇬🇧',
    timezone: 'Europe/London',
    pairs: ['GBP/USD', 'EUR/USD', 'EUR/GBP']
  },
  {
    id: 'newyork',
    name: { es: 'New York', en: 'New York' },
    startUTC: 13,
    endUTC: 22,
    color: 'orange',
    flag: '🇺🇸',
    timezone: 'America/New_York',
    pairs: ['EUR/USD', 'USD/CAD', 'US100', 'US30']
  },
];

const SESSION_COLORS = {
  blue: { bg: 'bg-blue-500', bgLight: 'bg-blue-500/30', border: 'border-blue-500', text: 'text-blue-500' },
  pink: { bg: 'bg-pink-500', bgLight: 'bg-pink-500/30', border: 'border-pink-500', text: 'text-pink-500' },
  green: { bg: 'bg-green-500', bgLight: 'bg-green-500/30', border: 'border-green-500', text: 'text-green-500' },
  orange: { bg: 'bg-orange-500', bgLight: 'bg-orange-500/30', border: 'border-orange-500', text: 'text-orange-500' },
};

function isSessionActive(session, utcHour) {
  if (session.startUTC > session.endUTC) {
    return utcHour >= session.startUTC || utcHour < session.endUTC;
  }
  return utcHour >= session.startUTC && utcHour < session.endUTC;
}

export default function MarketSessionsModal({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const utcHour = currentTime.getUTCHours();
  const localHour = currentTime.getHours();
  const localMinutes = currentTime.getMinutes();
  const currentPosition = ((localHour * 60 + localMinutes) / (24 * 60)) * 100;

  // Calculate UTC offset in hours
  const utcOffset = -currentTime.getTimezoneOffset() / 60;

  const labels = {
    es: {
      title: 'Sesiones de Mercado',
      subtitle: 'Horarios de trading mundial (24h)',
      localTime: 'Hora local',
      utcTime: 'Hora UTC',
      active: 'Activo',
      closed: 'Cerrado',
      pairs: 'Pares populares',
      overlap: 'Solapamiento',
      highVolatility: 'Alta volatilidad',
    },
    en: {
      title: 'Market Sessions',
      subtitle: 'Global trading hours (24h)',
      localTime: 'Local time',
      utcTime: 'UTC time',
      active: 'Active',
      closed: 'Closed',
      pairs: 'Popular pairs',
      overlap: 'Overlap',
      highVolatility: 'High volatility',
    },
  };
  const t = labels[language];

  // Convert UTC hour to local hour
  const utcToLocal = (utcHourVal) => {
    let local = utcHourVal + utcOffset;
    if (local < 0) local += 24;
    if (local >= 24) local -= 24;
    return local;
  };

  // Get session bar position and width (in local time)
  const getSessionBar = (session) => {
    let start = utcToLocal(session.startUTC);
    let end = utcToLocal(session.endUTC);

    if (start > end) {
      // Session crosses midnight - we'll render two bars
      return [
        { left: (start / 24) * 100, width: ((24 - start) / 24) * 100 },
        { left: 0, width: (end / 24) * 100 }
      ];
    }
    return [{ left: (start / 24) * 100, width: ((end - start) / 24) * 100 }];
  };

  // Get local session hours for display
  const getLocalSessionHours = (session) => {
    const startLocal = utcToLocal(session.startUTC);
    const endLocal = utcToLocal(session.endUTC);
    return {
      start: String(Math.floor(startLocal)).padStart(2, '0') + ':00',
      end: String(Math.floor(endLocal)).padStart(2, '0') + ':00'
    };
  };

  // Get local time for a timezone
  const getLocalTime = (timezone) => {
    try {
      return currentTime.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
        style={{ width: '100%', maxWidth: '600px' }}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t.title}
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Current Time Display */}
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Clock size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.localTime}
                  </p>
                  <p className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {currentTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.utcTime}
                </p>
                <p className={`text-lg font-bold font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {currentTime.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false })} UTC
                </p>
              </div>
            </div>
          </div>

          {/* 24h Timeline */}
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            {/* Hour markers */}
            <div className="relative mb-2">
              <div className="flex justify-between text-[9px] font-mono">
                {[0, 3, 6, 9, 12, 15, 18, 21].map(hour => (
                  <span key={hour} className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                    {String(hour).padStart(2, '0')}
                  </span>
                ))}
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>24</span>
              </div>
            </div>

            {/* Session Bars */}
            <div className="space-y-2">
              {SESSIONS.map(session => {
                const colors = SESSION_COLORS[session.color];
                const bars = getSessionBar(session);
                const isActive = isSessionActive(session, utcHour);

                return (
                  <div key={session.id} className="relative">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{session.flag}</span>
                      <span className={`text-xs font-bold ${colors.text}`}>
                        {session.name[language]}
                      </span>
                      {isActive && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${colors.bgLight} ${colors.text}`}>
                          {t.active}
                        </span>
                      )}
                    </div>

                    {/* Bar container */}
                    <div className={`relative h-6 rounded-lg overflow-hidden ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>
                      {bars.map((bar, idx) => (
                        <div
                          key={idx}
                          className={`absolute top-0 h-full rounded-lg transition-all ${
                            isActive ? colors.bg : colors.bgLight
                          }`}
                          style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
                        />
                      ))}

                      {/* Current time line */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-red-500 z-10"
                        style={{ left: `${currentPosition}%` }}
                      >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-dashed" style={{ borderColor: isDark ? '#475569' : '#cbd5e1' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.localTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-3 rounded ${isDark ? 'bg-slate-500' : 'bg-slate-300'}`} />
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.closed}
                </span>
              </div>
            </div>
          </div>

          {/* Session Cards */}
          <div className="grid grid-cols-2 gap-3">
            {SESSIONS.map(session => {
              const colors = SESSION_COLORS[session.color];
              const isActive = isSessionActive(session, utcHour);
              const localTime = getLocalTime(session.timezone);

              return (
                <div
                  key={session.id}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? `${colors.border} ${colors.bgLight}`
                      : isDark ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{session.flag}</span>
                    <div>
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {session.name[language]}
                      </p>
                      <p className={`text-lg font-black font-mono ${colors.text}`}>
                        {localTime}
                      </p>
                    </div>
                    {isActive && (
                      <div className={`ml-auto w-3 h-3 rounded-full ${colors.bg} animate-pulse`} />
                    )}
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <p className="font-medium mb-1">{t.pairs}:</p>
                    <p className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {session.pairs.join(', ')}
                    </p>
                  </div>
                  <div className={`mt-2 text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {getLocalSessionHours(session).start} - {getLocalSessionHours(session).end} ({language === 'es' ? 'hora local' : 'local time'})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overlap Info */}
          <div className={`p-3 rounded-xl border ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
            <p className={`text-xs font-bold mb-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              💡 {t.overlap} = {t.highVolatility}
            </p>
            <p className={`text-[11px] ${isDark ? 'text-amber-300/80' : 'text-amber-700'}`}>
              {language === 'es'
                ? 'Londres + New York (13:00-16:00 UTC) es el período de mayor volumen y volatilidad.'
                : 'London + New York (13:00-16:00 UTC) is the highest volume and volatility period.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
