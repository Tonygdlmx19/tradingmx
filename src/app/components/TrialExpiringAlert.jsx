"use client";
import { useState, useEffect } from 'react';
import { X, Clock, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const PLANS = [
  { id: '1month', name: '1 Mes', price: 10, paypalLink: 'https://www.paypal.com/ncp/payment/X3GWT63PZQ8J6' },
  { id: '3months', name: '3 Meses', price: 20, popular: true, paypalLink: 'https://www.paypal.com/ncp/payment/FGTPJDA5NBTEU' },
  { id: '1year', name: '1 Año', price: 50, paypalLink: 'https://www.paypal.com/ncp/payment/8DV9WS43YAXV8' },
  { id: 'lifetime', name: 'De por vida', price: 100, paypalLink: 'https://www.paypal.com/ncp/payment/Z2NETX47DZ5K4' },
];

export default function TrialExpiringAlert({ trialEnd, userEmail }) {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('3months');
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    if (!trialEnd) return;

    const endDate = trialEnd?.toDate ? trialEnd.toDate() : new Date(trialEnd);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDaysLeft(diffDays);

    // Mostrar si quedan 3 días o menos
    if (diffDays <= 3 && diffDays > 0) {
      // Verificar si ya se cerró hoy
      const dismissedKey = `trial_alert_dismissed_${userEmail}`;
      const dismissedDate = localStorage.getItem(dismissedKey);
      const today = new Date().toDateString();

      if (dismissedDate !== today) {
        setTimeout(() => setIsVisible(true), 1500); // Delay para animación
      }
    }
  }, [trialEnd, userEmail]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Guardar que se cerró hoy
    const dismissedKey = `trial_alert_dismissed_${userEmail}`;
    localStorage.setItem(dismissedKey, new Date().toDateString());
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handlePayPal = () => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (plan) {
      window.open(plan.paypalLink, '_blank');
    }
  };

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan);

  if (!isVisible || daysLeft === null || daysLeft > 3 || daysLeft <= 0) return null;

  return (
    <>
      {/* Banner flotante */}
      <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[420px] z-50 animate-slide-up`}>
        <div className={`relative overflow-hidden rounded-2xl shadow-2xl border ${
          isDark
            ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-orange-500/30'
            : 'bg-gradient-to-r from-white to-orange-50 border-orange-200'
        }`}>
          {/* Barra de progreso animada */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-pulse" />

          {/* Botón cerrar */}
          <button
            onClick={handleDismiss}
            className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
            }`}
          >
            <X size={18} />
          </button>

          <div className="p-4 pr-10">
            <div className="flex items-start gap-3">
              {/* Icono animado */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                daysLeft === 1
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-orange-500'
              }`}>
                <AlertTriangle className="text-white" size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {daysLeft === 1
                    ? '¡Tu prueba expira mañana!'
                    : `Tu prueba expira en ${daysLeft} días`
                  }
                </h3>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  No pierdas tus datos y estadísticas. Adquiere tu licencia ahora.
                </p>

                <button
                  onClick={handleOpenModal}
                  className="mt-3 w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Ver Planes
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de planes */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
              isDark ? 'bg-slate-900' : 'bg-white'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-5 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {daysLeft === 1 ? '¡Último día!' : `${daysLeft} días restantes`}
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Elige tu plan y continúa
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Planes */}
            <div className="p-5 space-y-2">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? isDark
                          ? 'bg-emerald-500/20 border-emerald-500'
                          : 'bg-emerald-50 border-emerald-500'
                        : isDark
                          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500'
                          : isDark ? 'border-slate-500' : 'border-slate-400'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="text-left">
                        <div className={`font-bold text-sm ${
                          isSelected
                            ? isDark ? 'text-white' : 'text-emerald-700'
                            : isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {plan.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {plan.popular && (
                        <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          POPULAR
                        </span>
                      )}
                      <div className={`px-3 py-1.5 rounded-lg font-black text-base ${
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                      }`}>
                        ${plan.price}
                        <span className="text-xs font-medium opacity-70 ml-0.5">USD</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Botón de pago */}
            <div className={`p-5 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={handlePayPal}
                className="w-full py-3 bg-gradient-to-r from-[#FFC439] via-[#FFD700] to-[#FFC439] text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-3"
              >
                <img src="/paypal.png" alt="PayPal" className="h-5" />
                <span>Pagar ${selectedPlanData?.price} USD</span>
                <ArrowRight size={18} />
              </button>

              <p className={`text-center text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Tu acceso se activa en breve después del pago
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
