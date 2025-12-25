"use client";
import { useState } from 'react';
import { auth, provider } from '../../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { Lock, Mail, ArrowLeft } from 'lucide-react';

export default function LoginPage({ onBack }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
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
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError("Error con Google: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative">
      {/* Botón volver */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>
      )}
      
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl">
        <div className="h-12 sm:h-14 mx-auto mb-4">
          <img src="/tradingLogo.svg" alt="Trading Journal PRO" className="h-full w-auto mx-auto object-contain" />
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
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
          >
            {isRegistering ? 'Registrarse Gratis' : 'Entrar'}
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
          className="w-full py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/> 
          Google
        </button>
        
        <p className="mt-6 text-xs text-slate-400">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'} 
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="text-blue-600 font-bold ml-1 hover:underline"
          >
            {isRegistering ? 'Inicia Sesión' : 'Regístrate aquí'}
          </button>
        </p>
      </div>
    </div>
  );
}