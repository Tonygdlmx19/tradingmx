"use client";
import { useState } from 'react';
import { auth, provider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from '../../firebase';
import { signInWithPopup } from "firebase/auth";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

const firebaseErrorsES = {
  'auth/user-not-found': 'No existe una cuenta con ese correo',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-credential': 'Correo o contraseña incorrectos',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
  'auth/invalid-email': 'El correo no es válido',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google. Intenta de nuevo.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana. Permite popups para este sitio.',
};

const firebaseErrorsEN = {
  'auth/user-not-found': 'No account exists with that email',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-credential': 'Incorrect email or password',
  'auth/email-already-in-use': 'An account already exists with that email',
  'auth/weak-password': 'Password must be at least 6 characters',
  'auth/invalid-email': 'Invalid email address',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes.',
  'auth/popup-closed-by-user': 'You closed the Google window. Please try again.',
  'auth/popup-blocked': 'Browser blocked the popup. Please allow popups for this site.',
};

function getErrorMessage(error, language) {
  const errors = language === 'en' ? firebaseErrorsEN : firebaseErrorsES;
  return errors[error.code] || `Error: ${error.message || error.code}`;
}

const labels = {
  es: {
    login: 'Iniciar sesión',
    register: 'Registrarse',
    back: 'Volver',
    recoverPassword: 'Recuperar contraseña',
    recoverPasswordDesc: 'Te enviaremos un correo para restablecer tu contraseña.',
    emailPlaceholder: 'Correo electrónico',
    passwordPlaceholder: 'Contraseña',
    passwordMinChars: 'Contraseña (mín. 6 caracteres)',
    confirmPassword: 'Confirmar contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    createAccount: 'Crear cuenta',
    sendRecoveryEmail: 'Enviar correo de recuperación',
    or: 'o',
    continueWithGoogle: 'Continuar con Google',
    registerNote: 'Al crear tu cuenta, necesitarás activar el acceso con un código de prueba o pago.',
    loginNote: 'Usa el correo con el que pagaste o con el que activaste tu código de prueba.',
    backToHome: '← Volver al inicio',
    creatingAccount: 'Creando cuenta...',
    loggingIn: 'Iniciando sesión...',
    emailSent: 'Correo enviado. Revisa tu bandeja de entrada (y spam).',
    passwordsNoMatch: 'Las contraseñas no coinciden',
    passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
    enterEmail: 'Ingresa tu correo electrónico',
  },
  en: {
    login: 'Log in',
    register: 'Sign up',
    back: 'Back',
    recoverPassword: 'Recover password',
    recoverPasswordDesc: 'We will send you an email to reset your password.',
    emailPlaceholder: 'Email address',
    passwordPlaceholder: 'Password',
    passwordMinChars: 'Password (min. 6 characters)',
    confirmPassword: 'Confirm password',
    forgotPassword: 'Forgot your password?',
    createAccount: 'Create account',
    sendRecoveryEmail: 'Send recovery email',
    or: 'or',
    continueWithGoogle: 'Continue with Google',
    registerNote: 'After creating your account, you will need to activate access with a trial code or payment.',
    loginNote: 'Use the email you paid with or activated your trial code with.',
    backToHome: '← Back to home',
    creatingAccount: 'Creating account...',
    loggingIn: 'Logging in...',
    emailSent: 'Email sent. Check your inbox (and spam folder).',
    passwordsNoMatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    enterEmail: 'Please enter your email address',
  }
};

export default function LoginPage({ onBack }) {
  const { language } = useLanguage();
  const t = labels[language] || labels.es;

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err, language));
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError(t.passwordsNoMatch);
      return;
    }
    if (password.length < 6) {
      setError(t.passwordTooShort);
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err, language));
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError(t.enterEmail);
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (err) {
      setError(getErrorMessage(err, language));
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code !== 'auth/cancelled-popup-request') {
        setError(getErrorMessage(err, language));
      }
      setIsLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setResetSent(false);
  };

  // Loading state
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
          <p className="text-slate-400 text-sm">
            {mode === 'register' ? t.creatingAccount : t.loggingIn}
          </p>
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

        {/* Tabs Login/Registro (no en reset) */}
        {mode !== 'reset' && (
          <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.register}
            </button>
          </div>
        )}

        {/* Reset password header */}
        {mode === 'reset' && (
          <div className="mb-6">
            <button
              onClick={() => switchMode('login')}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3"
            >
              <ArrowLeft size={16} />
              {t.back}
            </button>
            <h2 className="text-lg font-bold text-slate-800">{t.recoverPassword}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {t.recoverPasswordDesc}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg font-bold mb-4">
            {error}
          </div>
        )}

        {/* Reset sent success */}
        {resetSent && (
          <div className="p-3 bg-green-50 text-green-600 text-xs rounded-lg font-bold mb-4">
            {t.emailSent}
          </div>
        )}

        {/* Login form */}
        {mode === 'login' && (
          <form onSubmit={handleEmailLogin} className="space-y-3 mb-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => switchMode('reset')}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              {t.forgotPassword}
            </button>
          </form>
        )}

        {/* Register form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 mb-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t.passwordMinChars}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t.confirmPassword}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              {t.createAccount}
            </button>
          </form>
        )}

        {/* Reset form */}
        {mode === 'reset' && !resetSent && (
          <form onSubmit={handleResetPassword} className="space-y-3 mb-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              {t.sendRecoveryEmail}
            </button>
          </form>
        )}

        {/* Separator + Google button (login/register modes only) */}
        {mode !== 'reset' && (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-xs text-slate-400">{t.or}</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/>
              {t.continueWithGoogle}
            </button>
          </>
        )}

        <p className="mt-6 text-xs text-slate-400">
          {mode === 'register' ? t.registerNote : t.loginNote}
        </p>

        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 text-xs text-slate-400 hover:text-slate-600"
          >
            {t.backToHome}
          </button>
        )}
      </div>
    </div>
  );
}
