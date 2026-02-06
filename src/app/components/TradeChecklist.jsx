"use client";
import { useState } from 'react';
import { ClipboardCheck, X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function TradeChecklist({ reglas, isOpen, onClose, onConfirm }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [marcadas, setMarcadas] = useState(reglas.map(() => false));

  const labels = {
    es: {
      title: 'Checklist de Setup',
      validSetup: 'Setup valido',
      caution: 'Precaucion',
      doNotTrade: 'No operar',
      criteriaOf: 'de',
      criteriaMet: 'criterios cumplidos',
      confirmSetup: 'Confirmar Setup',
      cancel: 'Cancelar',
    },
    en: {
      title: 'Setup Checklist',
      validSetup: 'Valid setup',
      caution: 'Caution',
      doNotTrade: 'Do not trade',
      criteriaOf: 'of',
      criteriaMet: 'criteria met',
      confirmSetup: 'Confirm Setup',
      cancel: 'Cancel',
    },
  };
  const t = labels[language];

  if (!isOpen || !reglas || reglas.length === 0) return null;

  const totalMarcadas = marcadas.filter(Boolean).length;
  const porcentaje = Math.round((totalMarcadas / reglas.length) * 100);

  const toggleRegla = (index) => {
    setMarcadas(prev => {
      const nuevas = [...prev];
      nuevas[index] = !nuevas[index];
      return nuevas;
    });
  };

  // Semáforo
  const getSemaforo = () => {
    if (porcentaje >= 65) return { color: 'green', label: t.validSetup, icon: CheckCircle };
    if (porcentaje >= 50) return { color: 'amber', label: t.caution, icon: AlertTriangle };
    return { color: 'red', label: t.doNotTrade, icon: XCircle };
  };

  const semaforo = getSemaforo();
  const SemaforoIcon = semaforo.icon;

  const colorMap = {
    green: {
      bg: 'bg-green-500',
      bgLight: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-500',
      bar: 'bg-green-500',
    },
    amber: {
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-500',
      bar: 'bg-amber-500',
    },
    red: {
      bg: 'bg-red-500',
      bgLight: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-500',
      bar: 'bg-red-500',
    },
  };

  const colors = colorMap[semaforo.color];

  const handleConfirm = () => {
    const resultado = {
      reglas: reglas.map((nombre, i) => ({ nombre, cumplida: marcadas[i] })),
      porcentaje,
    };
    onConfirm(resultado);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        {/* Header */}
        <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex justify-between items-center">
            <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <ClipboardCheck size={20} className="text-amber-500"/>
              {t.title}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <X size={20}/>
            </button>
          </div>
        </div>

        {/* Semáforo */}
        <div className={`mx-4 mt-4 p-4 rounded-xl border ${colors.bgLight} ${colors.border}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <SemaforoIcon size={24} className={colors.text}/>
              <span className={`font-bold text-lg ${colors.text}`}>
                {semaforo.label}
              </span>
            </div>
            <span className={`text-2xl font-black ${colors.text}`}>
              {porcentaje}%
            </span>
          </div>
          {/* Barra de progreso */}
          <div className={`w-full h-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {totalMarcadas} {t.criteriaOf} {reglas.length} {t.criteriaMet}
          </p>
        </div>

        {/* Lista de reglas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {reglas.map((regla, index) => (
            <button
              key={index}
              type="button"
              onClick={() => toggleRegla(index)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                marcadas[index]
                  ? isDark
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-green-50 border-green-200'
                  : isDark
                    ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Checkbox */}
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                marcadas[index]
                  ? 'bg-green-500 border-green-500'
                  : isDark ? 'border-slate-500' : 'border-slate-300'
              }`}>
                {marcadas[index] && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <span className={`text-sm font-medium ${
                marcadas[index]
                  ? 'text-green-500'
                  : isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {regla}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={handleConfirm}
            className={`w-full py-3 rounded-xl font-bold transition-all active:scale-[0.98] ${colors.bg} text-white shadow-lg`}
          >
            {t.confirmSetup} ({porcentaje}%)
          </button>
          <button
            onClick={onClose}
            className={`w-full py-2 rounded-xl font-bold text-sm transition-colors ${
              isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
