"use client";
import { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, ArrowLeft, Settings, Trophy, BarChart3, Calendar, Target, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

const TOUR_STEPS_ES = [
  {
    id: 'welcome',
    target: null,
    title: '¡Bienvenido a Trading Journal PRO!',
    description: 'Te mostraremos las funciones principales para que le saques el máximo provecho a tu journal. ¡Empecemos!',
    icon: Sparkles,
  },
  {
    id: 'settings',
    target: '[data-tour="settings"]',
    title: 'Configuración',
    description: 'Aquí puedes personalizar tu journal: agrega activos, crea tu checklist de setup, define tu capital inicial y tu meta diaria.',
    icon: Settings,
  },
  {
    id: 'funding',
    target: '[data-tour="funding"]',
    title: 'Simulador de Fondeo',
    description: 'Practica con reglas reales de empresas de fondeo como FTMO. Simula tu challenge antes de arriesgar dinero real.',
    icon: Trophy,
  },
  {
    id: 'calendar',
    target: '[data-tour="calendar"]',
    title: 'Calendario Económico',
    description: 'Consulta los eventos económicos importantes del día. Nunca te pierdas un NFP, FOMC o dato de inflación.',
    icon: Calendar,
  },
  {
    id: 'stats',
    target: '[data-tour="stats"]',
    title: 'Estadísticas Principales',
    description: 'Tu balance actual, P&L del periodo, win rate, drawdown máximo y profit factor. Las métricas clave de un vistazo.',
    icon: BarChart3,
  },
  {
    id: 'advanced-stats',
    target: '[data-tour="advanced-stats"]',
    title: 'Métricas Avanzadas',
    description: 'Análisis detallado: mejor/peor trade, promedio de ganancias y pérdidas, racha ganadora y expectativa.',
    icon: BarChart3,
  },
  {
    id: 'charts',
    target: '[data-tour="charts"]',
    title: 'Curva de Capital',
    description: 'Visualiza cómo ha crecido tu cuenta trade por trade. Una curva ascendente indica consistencia en tu operativa.',
    icon: BarChart3,
  },
  {
    id: 'drawdown',
    target: '[data-tour="drawdown"]',
    title: 'Gráfica de Drawdown',
    description: 'Mide cuánto ha caído tu cuenta desde su punto máximo. Un drawdown bajo indica buen control de riesgo. Las empresas de fondeo suelen tener límites de 5-10%.',
    icon: BarChart3,
  },
  {
    id: 'trade-form',
    target: '[data-tour="trade-form"]',
    title: 'Registra tus Trades',
    description: 'Usa este formulario para registrar cada operación con resultado, emoción y notas.',
    icon: Target,
  },
  {
    id: 'complete',
    target: null,
    title: '¡Listo para empezar!',
    description: 'Ya conoces las funciones principales. La consistencia en el registro es clave para mejorar. ¡Éxito en tu trading!',
    icon: CheckCircle,
  }
];

const TOUR_STEPS_EN = [
  {
    id: 'welcome',
    target: null,
    title: 'Welcome to Trading Journal PRO!',
    description: 'We\'ll show you the main features so you can get the most out of your journal. Let\'s get started!',
    icon: Sparkles,
  },
  {
    id: 'settings',
    target: '[data-tour="settings"]',
    title: 'Settings',
    description: 'Here you can customize your journal: add assets, create your setup checklist, set your initial capital and daily goal.',
    icon: Settings,
  },
  {
    id: 'funding',
    target: '[data-tour="funding"]',
    title: 'Funding Simulator',
    description: 'Practice with real rules from prop firms like FTMO. Simulate your challenge before risking real money.',
    icon: Trophy,
  },
  {
    id: 'calendar',
    target: '[data-tour="calendar"]',
    title: 'Economic Calendar',
    description: 'Check important economic events of the day. Never miss an NFP, FOMC or inflation data.',
    icon: Calendar,
  },
  {
    id: 'stats',
    target: '[data-tour="stats"]',
    title: 'Main Statistics',
    description: 'Your current balance, period P&L, win rate, max drawdown and profit factor. Key metrics at a glance.',
    icon: BarChart3,
  },
  {
    id: 'advanced-stats',
    target: '[data-tour="advanced-stats"]',
    title: 'Advanced Metrics',
    description: 'Detailed analysis: best/worst trade, average wins and losses, winning streak and expectancy.',
    icon: BarChart3,
  },
  {
    id: 'charts',
    target: '[data-tour="charts"]',
    title: 'Equity Curve',
    description: 'Visualize how your account has grown trade by trade. An ascending curve indicates consistency in your trading.',
    icon: BarChart3,
  },
  {
    id: 'drawdown',
    target: '[data-tour="drawdown"]',
    title: 'Drawdown Chart',
    description: 'Measures how much your account has dropped from its peak. Low drawdown indicates good risk control. Prop firms usually have 5-10% limits.',
    icon: BarChart3,
  },
  {
    id: 'trade-form',
    target: '[data-tour="trade-form"]',
    title: 'Record your Trades',
    description: 'Use this form to record each trade with result, emotion and notes.',
    icon: Target,
  },
  {
    id: 'complete',
    target: null,
    title: 'Ready to start!',
    description: 'You now know the main features. Consistency in recording is key to improvement. Good luck with your trading!',
    icon: CheckCircle,
  }
];

export default function OnboardingTour({ userEmail, onComplete, forceStart, onForceStartHandled }) {
  const { language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState(null);

  const TOUR_STEPS = language === 'en' ? TOUR_STEPS_EN : TOUR_STEPS_ES;

  const labels = {
    es: {
      step: 'Paso',
      of: 'de',
      skip: 'Omitir',
      next: 'Siguiente',
      finish: 'Finalizar',
    },
    en: {
      step: 'Step',
      of: 'of',
      skip: 'Skip',
      next: 'Next',
      finish: 'Finish',
    },
  };
  const t = labels[language];

  // Verificar si es primera vez
  useEffect(() => {
    if (!userEmail) return;

    const tourKey = `onboarding_completed_${userEmail}`;
    const completed = localStorage.getItem(tourKey);

    if (!completed) {
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

  // Scroll y highlight del elemento actual
  const highlightCurrentStep = useCallback(() => {
    // Limpiar highlight anterior
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight');
    }

    const step = TOUR_STEPS[currentStep];
    if (!step.target) {
      setHighlightedElement(null);
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      // Scroll suave al elemento
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Agregar clase de highlight
      setTimeout(() => {
        element.classList.add('tour-highlight');
        setHighlightedElement(element);
      }, 300);
    }
  }, [currentStep, highlightedElement]);

  useEffect(() => {
    if (isActive) {
      highlightCurrentStep();
    }

    return () => {
      // Limpiar highlight al desmontar
      if (highlightedElement) {
        highlightedElement.classList.remove('tour-highlight');
      }
    };
  }, [isActive, currentStep, highlightCurrentStep]);

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

  const handleComplete = () => {
    // Limpiar highlight
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight');
    }

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
  const isCentered = !step.target;

  return (
    <>
      {/* Overlay semi-transparente solo para pasos centrados */}
      {isCentered && (
        <div
          className="fixed inset-0 bg-black/60 z-[200]"
          onClick={handleComplete}
        />
      )}

      {/* Tooltip fijo en la parte inferior */}
      <div
        className={`fixed z-[201] left-4 right-4 mx-auto max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden ${
          isCentered
            ? 'top-1/2 -translate-y-1/2 animate-fade-in'
            : 'bottom-20 animate-slide-up-simple'
        }`}
        style={{ maxHeight: 'calc(100vh - 160px)' }}
      >
        {/* Header con icono */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">{step.title}</h3>
              <p className="text-blue-100 text-xs">
                {t.step} {currentStep + 1} {t.of} {TOUR_STEPS.length}
              </p>
            </div>
            <button
              onClick={handleComplete}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="px-4 pb-3">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? 'bg-blue-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <button
            onClick={handleComplete}
            className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
          >
            {t.skip}
          </button>

          <div className="flex gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-colors flex items-center gap-1"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-1"
            >
              {isLastStep ? (
                <>
                  <CheckCircle size={16} />
                  {t.finish}
                </>
              ) : (
                <>
                  {t.next}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Estilos globales para el highlight */}
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 100;
          outline: 4px solid #f59e0b !important;
          outline-offset: 4px;
          border-radius: 12px;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.3), 0 0 30px rgba(245, 158, 11, 0.4) !important;
          animation: tour-pulse 1.5s ease-in-out infinite;
        }

        @keyframes tour-pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.3), 0 0 30px rgba(245, 158, 11, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.4), 0 0 50px rgba(245, 158, 11, 0.5);
          }
        }

        @keyframes slide-up-simple {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
        }

        .animate-slide-up-simple {
          animation: slide-up-simple 0.3s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
