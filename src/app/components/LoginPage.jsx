"use client";
import { useState } from 'react';
import { auth, provider } from '../../firebase';
import { signInWithPopup } from "firebase/auth";

export default function LoginPage({ onBack }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log('Google login error:', error.code);
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Cerraste la ventana de Google. Intenta de nuevo.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Usuario hizo click múltiples veces, ignorar
      } else if (error.code === 'auth/popup-blocked') {
        setError("El navegador bloqueó la ventana. Permite popups para este sitio.");
      } else {
        setError("Error con Google: " + (error.message || error.code));
      }
      setIsLoading(false);
    }
  };

  // Si está cargando, mostrar loader con velas
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="flex items-end justify-center gap-1 mb-4 h-12">
            <div className="w-2 bg-emerald-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '60%', animationDelay: '0ms'}}></div>
            <div className="w-2 bg-red-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '40%', animationDelay: '100ms'}}></div>
            <div className="w-2 bg-emerald-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '80%', animationDelay: '200ms'}}></div>
            <div className="w-2 bg-red-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '50%', animationDelay: '300ms'}}></div>
            <div className="w-2 bg-emerald-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '70%', animationDelay: '400ms'}}></div>
          </div>
          <p className="text-slate-400 text-sm">Iniciando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm text-center shadow-2xl">
        {/* Logo */}
        <div className="w-[150px] sm:w-[160px] h-[50px] flex items-center justify-center mx-auto mb-4">
          <img src="/tradingLogo.svg" alt="Trading Journal PRO" className="max-w-full max-h-full object-contain" />
        </div>

        <p className="text-slate-500 mb-6 text-sm">
          Inicia sesión con tu cuenta de Google para acceder a tu Trading Journal.
        </p>

        {error && (
          <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg font-bold mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/>
          Continuar con Google
        </button>

        <p className="mt-6 text-xs text-slate-400">
          Usa el mismo correo con el que pagaste en PayPal para activar tu acceso automáticamente.
        </p>

        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 text-xs text-slate-400 hover:text-slate-600"
          >
            ← Volver al inicio
          </button>
        )}
      </div>
    </div>
  );
}
