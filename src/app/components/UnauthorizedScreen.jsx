"use client";
import { useState } from 'react';
import { LogOut, ShieldX, CheckCircle, ArrowRight, Mail, MessageCircle, HelpCircle, Clock, Ticket, Loader2, Crown, Zap, Star, Infinity } from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const PLANS = [
  {
    id: '1month',
    name: '1 Mes',
    price: 10,
    duration: '1 mes',
    icon: Zap,
    color: 'blue',
    paypalLink: 'https://www.paypal.com/ncp/payment/1MONTH_LINK'
  },
  {
    id: '3months',
    name: '3 Meses',
    price: 20,
    duration: '3 meses',
    icon: Star,
    color: 'purple',
    popular: true,
    paypalLink: 'https://www.paypal.com/ncp/payment/3MONTHS_LINK'
  },
  {
    id: '1year',
    name: '1 Año',
    price: 50,
    duration: '12 meses',
    icon: Crown,
    color: 'amber',
    paypalLink: 'https://www.paypal.com/ncp/payment/1YEAR_LINK'
  },
  {
    id: 'lifetime',
    name: 'De por vida',
    price: 100,
    duration: 'Para siempre',
    icon: Infinity,
    color: 'green',
    paypalLink: 'https://www.paypal.com/ncp/payment/FGTPJDA5NBTEU'
  },
];

export default function UnauthorizedScreen({ user, onLogout, authStatus }) {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('3months');

  const isExpired = authStatus === 'expired';

  const handleRedeemCode = async () => {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode || trimmedCode.length < 4) {
      setCodeError('Ingresa un código válido');
      return;
    }

    setCodeError('');
    setCodeLoading(true);

    try {
      const codeRef = doc(db, 'trial_codes', trimmedCode);
      const codeDoc = await getDoc(codeRef);

      if (!codeDoc.exists()) {
        setCodeError('Código no válido');
        setCodeLoading(false);
        return;
      }

      const codeData = codeDoc.data();
      if (codeData.used) {
        setCodeError('Este código ya fue utilizado');
        setCodeLoading(false);
        return;
      }

      // Activate trial: 15 days
      const email = user.email.toLowerCase();
      const now = new Date();
      const trialEnd = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

      await setDoc(doc(db, 'authorized_users', email), {
        email,
        status: 'active',
        type: 'trial',
        trialStart: serverTimestamp(),
        trialEnd: trialEnd,
        codeUsed: trimmedCode,
        authorizedAt: serverTimestamp(),
      }, { merge: true });

      // Mark code as used
      await updateDoc(codeRef, {
        used: true,
        usedBy: email,
        usedAt: serverTimestamp(),
      });

      // Reload to re-trigger auth check
      window.location.reload();
    } catch (err) {
      console.error('Error redeeming code:', err);
      setCodeError('Error al canjear el código. Intenta de nuevo.');
      setCodeLoading(false);
    }
  };

  const handlePayPal = () => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (plan) {
      window.open(plan.paypalLink, '_blank');
    }
  };

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan);

  const contactEmail = "tmsolucionesdigitales@gmail.com";
  const whatsappNumber = "523316145522";
  const whatsappMessage = encodeURIComponent(`Hola, ya realicé mi pago de Trading Journal PRO pero no tengo acceso. Mi correo de registro es: ${user?.email}`);

  const handleEmailContact = () => {
    const subject = encodeURIComponent("Problema de acceso - Trading Journal PRO");
    const body = encodeURIComponent(`Hola,\n\nYa realicé mi pago pero no tengo acceso a la aplicación.\n\nMi correo de registro es: ${user?.email}\n\nGracias.`);
    window.open(`mailto:${contactEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card principal */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          {/* Icono */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isExpired ? 'bg-red-100' : 'bg-amber-100'
          }`}>
            {isExpired
              ? <Clock size={40} className="text-red-500" />
              : <ShieldX size={40} className="text-amber-600" />
            }
          </div>

          {/* Título */}
          <h1 className="text-2xl font-black text-slate-800 mb-2">
            {isExpired ? 'Tu Prueba ha Expirado' : 'Cuenta No Activada'}
          </h1>

          <p className="text-slate-500 mb-6">
            Hola <span className="font-semibold text-slate-700">{user?.email}</span>,
            {isExpired
              ? ' tu periodo de prueba de 15 días ha terminado.'
              : ' tu cuenta aún no tiene acceso a Trading Journal PRO.'
            }
          </p>

          {/* Sección de código de prueba */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Ticket size={18} className="text-blue-500" />
              <span className="text-sm font-bold text-blue-700">
                {isExpired ? '¿Tienes otro código?' : '¿Tienes un código de prueba?'}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="CÓDIGO"
                maxLength={8}
                className="flex-1 px-3 py-2.5 bg-white border border-blue-200 rounded-xl text-center font-mono font-bold text-sm text-slate-700 uppercase tracking-widest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleRedeemCode}
                disabled={codeLoading || !code.trim()}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98]"
              >
                {codeLoading ? <Loader2 size={16} className="animate-spin" /> : 'Canjear'}
              </button>
            </div>
            {codeError && (
              <p className="text-xs text-red-500 font-bold mt-2">{codeError}</p>
            )}
          </div>

          {/* Beneficios */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-bold text-slate-500 uppercase mb-3">
              Con tu licencia obtienes:
            </p>
            <div className="space-y-2">
              {[
                "Acceso de por vida",
                "Todas las métricas y estadísticas",
                "Curva de capital y drawdown",
                "Calculadora de riesgo",
                "Actualizaciones gratuitas"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selector de planes - Cards */}
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase mb-3">
              Selecciona tu plan:
            </p>
            <div className="space-y-2">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {/* Radio button visual */}
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-400'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className={`font-bold text-sm ${isSelected ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {plan.name}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {plan.duration}
                        </div>
                      </div>
                    </div>

                    {/* Precio y badge */}
                    <div className="flex items-center gap-2">
                      {plan.popular && (
                        <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          POPULAR
                        </span>
                      )}
                      <div className={`px-3 py-1.5 rounded-lg font-black text-base ${
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        ${plan.price}
                        <span className="text-xs font-medium opacity-70 ml-0.5">USD</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón de compra */}
          <button
            onClick={handlePayPal}
            className="w-full bg-gradient-to-r from-[#FFC439] via-[#FFD700] to-[#FFC439] text-black font-bold py-4 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-3 mb-4"
          >
            <img src="/paypal.png" alt="PayPal" className="h-6" />
            <span className="text-lg font-black">Pagar ${selectedPlanData?.price} USD</span>
            <ArrowRight size={20} />
          </button>

          {/* Nota animada */}
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/60 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
            <div className="relative flex items-center gap-2">
              <span className="flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <p className="text-xs text-amber-700 font-semibold">
                {isExpired
                  ? `Paga con ${user?.email} y tu acceso se activa automáticamente.`
                  : 'Tu cuenta será activada en breve después del pago.'
                }
              </p>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-slate-200 pt-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <HelpCircle size={16} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-600">¿Ya pagaste y no tienes acceso?</span>
            </div>

            {/* Botones de contacto */}
            <div className="flex gap-3">
              <button
                onClick={handleEmailContact}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Mail size={18} />
                Email
              </button>

              <button
                onClick={handleWhatsAppContact}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium"
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>
            </div>
          </div>

          {/* Cerrar sesión */}
          <div className="border-t border-slate-200 pt-4">
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mx-auto text-sm"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Mensaje inferior */}
        <p className="text-center text-slate-500 text-xs mt-6">
          El acceso se activa automáticamente en 1-2 minutos después del pago.
        </p>
      </div>
    </div>
  );
}
