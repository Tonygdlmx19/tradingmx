"use client";
import { useState } from 'react';
import { auth, provider } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { Lock, Mail } from 'lucide-react';

export default function LoginPage({ onBack }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const errorMessages = {
        'auth/email-already-in-use': 'Este correo ya está registrado.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/user-not-found': 'Usuario no encontrado.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-credential': 'Credenciales inválidas.',
      };
      setError(errorMessages[err.code] || 'Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Usar siempre popup (funciona mejor en iOS Safari que redirect)
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

  // Si está cargando (procesando login), mostrar loader con velas
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          {/* Velas japonesas animadas */}
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl">
        {/* Logo */}
        <div className="w-[150px] sm:w-[160px] h-[50px] flex items-center justify-center mx-auto mb-4">
          <img src="/tradingLogo.svg" alt="Trading Journal PRO" className="max-w-full max-h-full object-contain" />
        </div>
        
        <p className="text-slate-500 mb-6 text-sm">
          {isRegistering ? 'Crea una cuenta para guardar tus trades.' : 'Inicia sesión para ver tu progreso.'}
        </p>
        
        <form onSubmit={handleEmailAuth} className="space-y-3 mb-6 text-left">
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg font-bold">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-400"/>
              <input 
                type="email" 
                required 
                className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-800" 
                placeholder="ejemplo@correo.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-slate-400"/>
              <input 
                type="password" 
                required 
                className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-800" 
                placeholder="••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : (isRegistering ? 'Registrarse Gratis' : 'Entrar')}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-slate-400">O continúa con</span>
          </div>
        </div>
        
        <button 
          onClick={handleGoogleLogin} 
          type="button"
          disabled={isLoading}
          className="w-full py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
          ) : (
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/>
          )}
          Google
        </button>
        
        <p className="mt-6 text-xs text-slate-400">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'} 
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="text-blue-600 font-bold ml-1 hover:underline"
            disabled={isLoading}
          >
            {isRegistering ? 'Inicia Sesión' : 'Regístrate aquí'}
          </button>
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