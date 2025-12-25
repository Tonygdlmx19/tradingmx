"use client";
import { LogOut, ShieldX, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';

export default function UnauthorizedScreen({ user, onLogout }) {
  const handlePayPal = () => {
    window.open('https://www.paypal.com/ncp/payment/FGTPJDA5NBTEU', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card principal */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          {/* Icono */}
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldX size={40} className="text-amber-600" />
          </div>
          
          {/* Título */}
          <h1 className="text-2xl font-black text-slate-800 mb-2">
            Cuenta No Activada
          </h1>
          
          <p className="text-slate-500 mb-6">
            Hola <span className="font-semibold text-slate-700">{user?.email}</span>, 
            tu cuenta aún no tiene acceso a Trading Journal PRO.
          </p>
          
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
          
          {/* Precio */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-slate-400 line-through text-lg">$49.99</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -60%
              </span>
            </div>
            <div className="text-4xl font-black text-slate-800">
              $19.99 <span className="text-base font-normal text-slate-500">USD</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Pago único • Acceso de por vida</p>
          </div>
          
          {/* Botón de compra */}
          <button
            onClick={handlePayPal}
            className="w-full bg-gradient-to-r from-[#FFC439] via-[#FFD700] to-[#FFC439] text-black font-bold py-4 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-3 mb-4"
          >
            <img src="/paypal.png" alt="PayPal" className="h-6" />
            <span className="text-lg font-black">Activar Ahora</span>
            <ArrowRight size={20} />
          </button>
          
          {/* Nota */}
          <p className="text-xs text-slate-400 mb-6">
            💡 Usa el mismo correo de Google al pagar para activación automática
          </p>
          
          {/* Separador */}
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
          ¿Ya pagaste? El acceso se activa automáticamente en unos minutos.
          <br />
          Si tienes problemas, contacta: <span className="text-blue-400">soporte@tudominio.com</span>
        </p>
      </div>
    </div>
  );
}
