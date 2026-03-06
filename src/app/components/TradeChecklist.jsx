"use client";
import { useState } from 'react';
import { ClipboardCheck, X, CheckCircle, AlertTriangle, XCircle, Image, Maximize2, AlertCircle, Info } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function TradeChecklist({ reglas, isOpen, onClose, onConfirm, strategyName }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [marcadas, setMarcadas] = useState(reglas.map(() => false));
  const [viewingImage, setViewingImage] = useState(null);

  // Normalize rules to handle both string and object formats
  const normalizeRule = (rule) => {
    if (typeof rule === 'string') {
      return { texto: rule, imagen: null, importancia: 'media' };
    }
    return { ...rule, importancia: rule.importancia || 'media' };
  };

  // Helper to get importance styling
  const getImportanceStyle = (importancia) => {
    switch (importancia) {
      case 'alta':
        return { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-l-red-500', icon: AlertTriangle, label: language === 'es' ? 'Alta' : 'High' };
      case 'baja':
        return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-l-slate-400', icon: Info, label: language === 'es' ? 'Baja' : 'Low' };
      default: // media
        return { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-l-amber-500', icon: AlertCircle, label: language === 'es' ? 'Media' : 'Medium' };
    }
  };

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
      viewImage: 'Ver referencia',
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
      viewImage: 'View reference',
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
      reglas: reglas.map((regla, i) => {
        const normalized = normalizeRule(regla);
        return { nombre: normalized.texto, cumplida: marcadas[i] };
      }),
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
            <div>
              <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <ClipboardCheck size={20} className="text-amber-500"/>
                {t.title}
              </h3>
              {strategyName && (
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {strategyName}
                </span>
              )}
            </div>
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
          {reglas.map((regla, index) => {
            const normalizedRule = normalizeRule(regla);
            const impStyle = getImportanceStyle(normalizedRule.importancia);
            const ImpIcon = impStyle.icon;
            return (
              <div
                key={index}
                className={`rounded-xl border overflow-hidden transition-all border-l-4 ${impStyle.border} ${
                  marcadas[index]
                    ? isDark
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-green-50 border-green-200'
                    : isDark
                      ? 'bg-slate-700/50 border-slate-600'
                      : 'bg-slate-50 border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleRegla(index)}
                  className="w-full p-3 text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border-2 transition-colors mt-0.5 ${
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

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header row: Number + Importance + Image icon */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${impStyle.bg} ${impStyle.text}`}>
                          <ImpIcon size={10}/>
                          {impStyle.label}
                        </div>
                        {normalizedRule.imagen && (
                          <span className={`${isDark ? 'text-amber-400' : 'text-amber-500'}`}>
                            <Image size={14}/>
                          </span>
                        )}
                      </div>
                      {/* Rule text */}
                      <p className={`text-sm font-medium leading-snug ${
                        marcadas[index]
                          ? 'text-green-500'
                          : isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        {normalizedRule.texto}
                      </p>
                      {/* Rule description */}
                      {normalizedRule.descripcion && (
                        <p className={`text-xs mt-1.5 leading-relaxed ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {normalizedRule.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Image preview */}
                {normalizedRule.imagen && (
                  <div
                    className={`px-3 pb-3 ${isDark ? 'bg-slate-800/50' : 'bg-white/50'}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative group cursor-pointer" onClick={() => setViewingImage(normalizedRule.imagen)}>
                      <img
                        src={normalizedRule.imagen}
                        alt={`Referencia: ${normalizedRule.texto}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <div className="flex items-center gap-2 text-white text-xs">
                          <Maximize2 size={14}/>
                          {t.viewImage}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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

      {/* Modal for viewing rule image fullscreen */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 text-white"
          >
            <X size={24}/>
          </button>
          <img
            src={viewingImage}
            alt="Rule reference"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
