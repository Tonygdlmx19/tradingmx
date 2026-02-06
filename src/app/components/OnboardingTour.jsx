"use client";
import { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, ArrowLeft, Settings, Trophy, BarChart3, Calculator, Calendar, Target, CheckCircle, Sparkles } from 'lucide-react';

const TOUR_STEPS = [
  {
    id: 'welcome',
    target: null,
    title: '¡Bienvenido a Trading Journal PRO!',
    description: 'Te mostraremos las funciones principales para que le saques el máximo provecho a tu journal. ¡Empecemos!',
    icon: Sparkles,
    position: 'center'
  },
  {
    id: 'settings',
    target: '[data-tour="settings"]',
    title: 'Configuración',
    description: 'Aquí puedes personalizar tu journal: agrega activos que no estén en la lista, crea tu checklist de setup, define tu capital inicial y tu meta diaria.',
    icon: Settings,
    position: 'bottom-left'
  },
  {
    id: 'funding',
    target: '[data-tour="funding"]',
    title: 'Simulador de Fondeo',
    description: 'Practica con reglas reales de empresas de fondeo como FTMO. Simula tu challenge antes de arriesgar dinero real.',
    icon: Trophy,
    position: 'bottom-left'
  },
  {
    id: 'calendar',
    target: '[data-tour="calendar"]',
    title: 'Calendario Económico',
    description: 'Consulta los eventos económicos importantes del día. Nunca te pierdas un NFP, FOMC o dato de inflación.',
    icon: Calendar,
    position: 'bottom-left'
  },
  {
    id: 'stats',
    target: '[data-tour="stats"]',
    title: 'Estadísticas Principales',
    description: 'Tu balance actual, P&L del periodo, win rate, drawdown máximo y profit factor. Las métricas clave de un vistazo.',
    icon: BarChart3,
    position: 'bottom'
  },
  {
    id: 'advanced-stats',
    target: '[data-tour="advanced-stats"]',
    title: 'Métricas Avanzadas',
    description: 'Análisis detallado: mejor/peor trade, promedio de ganancias y pérdidas, racha ganadora, rendimiento por activo y más.',
    icon: BarChart3,
    position: 'top'
  },
  {
    id: 'charts',
    target: '[data-tour="charts"]',
    title: 'Gráficas de Rendimiento',
    description: 'Visualiza tu curva de equity y drawdown. Identifica patrones en tu operativa y cómo evoluciona tu cuenta.',
    icon: BarChart3,
    position: 'top'
  },
  {
    id: 'view-selector',
    target: '[data-tour="view-selector"]',
    title: 'Vista del Historial',
    description: 'Cambia entre vista de tabla o calendario. Filtra por mes o año para analizar periodos específicos.',
    icon: Calendar,
    position: 'top'
  },
  {
    id: 'trade-form',
    target: '[data-tour="trade-form"]',
    title: 'Registra tus Trades',
    description: 'Usa este formulario para registrar cada operación. Incluye el resultado, emoción, si seguiste tu plan y notas importantes.',
    icon: Target,
    position: 'left'
  },
  {
    id: 'complete',
    target: null,
    title: '¡Listo para empezar!',
    description: 'Ya conoces las funciones principales. Recuerda: la consistencia en el registro es clave para mejorar. ¡Éxito en tu trading!',
    icon: CheckCircle,
    position: 'center'
  }
];

export default function OnboardingTour({ userEmail, onComplete, forceStart, onForceStartHandled }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  // Verificar si es primera vez
  useEffect(() => {
    if (!userEmail) return;

    const tourKey = `onboarding_completed_${userEmail}`;
    const completed = localStorage.getItem(tourKey);

    if (!completed) {
      // Delay para que la UI se renderice
      setTimeout(() => setIsActive(true), 1000);
    }
  }, [userEmail]);

  // Manejar inicio forzado desde fuera
  useEffect(() => {
    if (forceStart) {
      setCurrentStep(0);
      setIsActive(true);
      if (onForceStartHandled) onForceStartHandled();
    }
  }, [forceStart, onForceStartHandled]);

  // Actualizar posición del elemento target
  const updateTargetPosition = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    if (!step.target) {
      setTargetRect(null);
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16,
      });

      // Scroll suave al elemento si no está visible
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      updateTargetPosition();
      window.addEventListener('resize', updateTargetPosition);
      return () => window.removeEventListener('resize', updateTargetPosition);
    }
  }, [isActive, currentStep, updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsActive(false);
    if (userEmail) {
      const tourKey = `onboarding_completed_${userEmail}`;
      localStorage.setItem(tourKey, 'true');
    }
    if (onComplete) onComplete();
  };

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isCentered = step.position === 'center';

  // Calcular posición del tooltip
  const getTooltipStyle = () => {
    if (isCentered || !targetRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 16;
    const tooltipWidth = 340;
    const tooltipHeight = 200;

    let top, left;

    switch (step.position) {
      case 'bottom':
        top = targetRect.top + targetRect.height + padding;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom-left':
        top = targetRect.top + targetRect.height + padding;
        left = targetRect.left;
        break;
      case 'bottom-right':
        top = targetRect.top + targetRect.height + padding;
        left = targetRect.left + targetRect.width - tooltipWidth;
        break;
      case 'top':
        top = targetRect.top - tooltipHeight - padding;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = targetRect.top;
        left = targetRect.left - tooltipWidth - padding;
        break;
      case 'right':
        top = targetRect.top;
        left = targetRect.left + targetRect.width + padding;
        break;
      default:
        top = targetRect.top + targetRect.height + padding;
        left = targetRect.left;
    }

    // Ajustar si se sale de la pantalla
    if (left < padding) left = padding;
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }
    if (top + tooltipHeight > window.innerHeight - padding) {
      top = targetRect.top - tooltipHeight - padding;
    }
    if (top < padding) top = padding;

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Overlay oscuro con hueco para el elemento destacado */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Borde brillante alrededor del elemento */}
      {targetRect && (
        <div
          className="absolute rounded-xl border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] pointer-events-none animate-pulse"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
        />
      )}

      {/* Tooltip / Card */}
      <div
        className="w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        style={getTooltipStyle()}
      >
        {/* Header con icono */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{step.title}</h3>
              <p className="text-blue-100 text-xs">
                Paso {currentStep + 1} de {TOUR_STEPS.length}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="px-4 pb-2">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? 'bg-blue-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="p-4 pt-2 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
          >
            Omitir tour
          </button>

          <div className="flex gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-colors flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Atrás
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-1"
            >
              {isLastStep ? (
                <>
                  <CheckCircle size={16} />
                  ¡Empezar!
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Botón X para cerrar */}
      <button
        onClick={handleSkip}
        className="fixed top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X size={24} />
      </button>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
