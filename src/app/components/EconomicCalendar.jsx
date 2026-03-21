"use client";
import { useEffect, useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function EconomicCalendar({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const containerRef = useRef(null);

  const title = language === 'en' ? 'Economic Calendar' : 'Calendario Económico';

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    // Limpiar widget anterior
    container.innerHTML = '';

    // Crear contenedor para el widget
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": isDark ? "dark" : "light",
      "isTransparent": true,
      "width": "100%",
      "height": "100%",
      "locale": language === 'en' ? "en" : "es",
      "importanceFilter": "-1,0,1",
      "countryFilter": "us,eu,de,gb,jp,cn,mx,ca,au,ch,br,nz"
    });

    widgetContainer.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isDark, isOpen, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl shadow-2xl border overflow-hidden transition-colors w-full max-w-5xl ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
        }`}
      >
        {/* Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDark ? 'border-slate-700' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" />
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {title}
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              TradingView
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Widget Container - más grande para mejor experiencia */}
        <div
          ref={containerRef}
          className="h-[70vh] overflow-hidden"
        />
      </div>
    </div>
  );
}