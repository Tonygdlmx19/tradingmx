"use client";
import { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Target,
  CheckCircle2,
  ArrowRight,
  Calendar,
  PieChart,
  LineChart,
  Clock,
  DollarSign,
  ChevronDown,
  LogIn,
  Play,
  Pause,
  Sparkles,
  Shield,
  Zap,
  X,
  AlertTriangle,
  TrendingDown,
  Brain,
  Repeat,
  HelpCircle,
  BarChart,
  Volume2,
  VolumeX,
  Trophy,
  Star,
  Crown,
  Infinity
} from 'lucide-react';

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

export default function LandingPage({ onLogin }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 0, seconds: 0 });
  const [selectedPlan, setSelectedPlan] = useState('3months');
  const videoRef = useRef(null);

  // Contador de tiempo limitado
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reiniciar el contador cuando llega a 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ⚠️ IMPORTANTE: Reemplaza esta URL con la de tu video en Firebase Storage
  const VIDEO_URL = "https://firebasestorage.googleapis.com/v0/b/TU-PROYECTO.appspot.com/o/public%2Fdemo.mp4?alt=media";
  
  // Opcional: Imagen de preview/poster del video
  const VIDEO_POSTER = "/video-poster.jpg"; // Guarda una imagen en /public/video-poster.jpg

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const features = [
    {
      icon: <LineChart className="w-7 h-7" />,
      title: "Equity Curve",
      description: "Visualiza el crecimiento de tu cuenta en tiempo real",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Métricas Avanzadas",
      description: "Win rate, profit factor, expectativa y más",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Target Diario",
      description: "Establece y trackea tu meta diaria de ganancias",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Calendar className="w-7 h-7" />,
      title: "Calendario Económico",
      description: "Nunca te pierdas un evento importante del mercado",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: <PieChart className="w-7 h-7" />,
      title: "Análisis por Activo",
      description: "Descubre en qué instrumentos eres más rentable",
      gradient: "from-rose-500 to-red-500"
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: "Historial Completo",
      description: "Revisa todos tus trades con filtros avanzados",
      gradient: "from-indigo-500 to-violet-500"
    }
  ];

  const problems = [
    {
      icon: <HelpCircle className="w-5 h-5" />,
      text: "No sabes cuál es tu win rate real",
    },
    {
      icon: <Repeat className="w-5 h-5" />,
      text: "Repites los mismos errores una y otra vez",
    },
    {
      icon: <TrendingDown className="w-5 h-5" />,
      text: "No tienes idea si eres rentable o no",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      text: "Operas por emociones, no por datos",
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      text: "Tu cuenta sube y baja sin control",
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      text: "No sabes en qué activos eres mejor",
    }
  ];

  const benefits = [
    "Identifica patrones en tu operativa",
    "Mejora tu win rate con datos reales",
    "Controla tus emociones con métricas",
    "Deja de repetir los mismos errores",
    "Crece tu cuenta de forma consistente",
    "Toma decisiones basadas en datos"
  ];

  const faqs = [
    {
      q: "¿Cómo recibo acceso después de pagar?",
      a: "Al pagar con PayPal, usa el mismo correo que usarás para iniciar sesión con Google. Tu acceso se activa automáticamente en 1-2 minutos. Solo haz clic en 'Ingresar' y selecciona Google."
    },
    {
      q: "¿Cuáles son los planes disponibles?",
      a: "Tenemos 4 planes: 1 Mes ($10), 3 Meses ($20), 1 Año ($50) y De por vida ($100). Todos incluyen acceso completo a todas las funciones."
    },
    {
      q: "¿Funciona para Forex, Futuros, Crypto?",
      a: "Sí, funciona para cualquier mercado. Puedes registrar trades de Forex, Futuros, Acciones, Crypto, Opciones Binarias y más."
    },
    {
      q: "¿Mis datos están seguros?",
      a: "Absolutamente. Usamos Firebase con encriptación de nivel bancario. Tus datos son privados y solo tú puedes verlos."
    },
    {
      q: "¿Hay garantía de devolución?",
      a: "Sí, tienes 7 días para probar la aplicación. Si no te convence, te devolvemos el 100% de tu dinero sin preguntas."
    },
    {
      q: "¿Puedo usarlo en mi celular?",
      a: "Sí, la aplicación es 100% responsive. Funciona perfecto en computadora, tablet y celular."
    }
  ];

  const handlePayPal = () => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (plan) {
      window.open(plan.paypalLink, '_blank');
    }
  };

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan);

  // Botón con precios para Hero y CTA (Comprar)
  const BuyButtonWithPrice = ({ className = '' }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition-all duration-500" />
      <button
        onClick={() => document.getElementById('planes-section')?.scrollIntoView({ behavior: 'smooth' })}
        className="relative bg-gradient-to-r from-[#FFC439] via-[#FFD700] to-[#FFC439] text-black font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden border border-yellow-500/50 shadow-lg shadow-yellow-500/20 px-4 sm:px-6 py-2.5 sm:py-3"
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
        <div className="relative flex items-center justify-center gap-2 sm:gap-3">
          <img src="/paypal.png" alt="PayPal" className="h-5 sm:h-6 w-auto object-contain" />
          <div className="w-px h-5 bg-black/20" />
          <span className="text-sm sm:text-base font-black">Ver Planes</span>
          <span className="bg-black text-yellow-400 px-1.5 py-0.5 rounded text-xs sm:text-sm font-bold">Desde $10</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );

  // Botón simple para el card de precio
  const BuyButton = ({ className = '' }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition-all duration-500" />
      <button
        onClick={handlePayPal}
        className="relative bg-gradient-to-r from-[#FFC439] via-[#FFD700] to-[#FFC439] text-black font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden border border-yellow-500/50 shadow-lg shadow-yellow-500/20 px-6 sm:px-8 py-2.5 sm:py-3"
      >
        <div className="relative flex items-center justify-center gap-2">
          <img src="/paypal.png" alt="PayPal" className="h-5 sm:h-6 w-auto object-contain" />
          <span className="text-sm sm:text-base font-black">Comprar</span>
        </div>
      </button>
    </div>
  );

  // Botón secundario para navbar
  const NavBuyButton = () => (
    <button
      onClick={() => document.getElementById('planes-section')?.scrollIntoView({ behavior: 'smooth' })}
      className="relative group overflow-hidden bg-gradient-to-r from-[#FFC439] to-[#FFD700] text-black font-bold px-3 sm:px-4 py-2 rounded-lg transition-all shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-105 active:scale-95 flex items-center gap-2 border border-yellow-500/50"
    >
      <div className="relative flex items-center gap-1.5">
        <img
          src="/paypal.png"
          alt="PayPal"
          className="h-5 w-auto object-contain"
        />
        <span className="font-bold text-sm">Planes</span>
      </div>
    </button>
  );

  // Modal de Términos y Condiciones
  const TermsModal = () => (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${showTerms ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setShowTerms(false)}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Términos y Condiciones</h3>
          <button
            onClick={() => setShowTerms(false)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-slate-300 space-y-4">
          <p className="text-slate-400 text-xs">Última actualización: Enero 2025</p>

          <section>
            <h4 className="font-bold text-white mb-2">1. Aceptación de Términos</h4>
            <p>Al acceder y utilizar Trading Journal PRO, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no debes utilizar nuestro servicio.</p>
          </section>

          <section>
            <h4 className="font-bold text-white mb-2">2. Descripción del Servicio</h4>
            <p>Trading Journal PRO es una aplicación web diseñada para ayudar a traders a registrar, analizar y mejorar su operativa mediante el seguimiento de métricas y estadísticas de trading.</p>
          </section>

          <section>
            <h4 className="font-bold text-white mb-2">3. Registro y Cuenta</h4>
            <p>Para acceder al servicio debes crear una cuenta utilizando Google Sign-In. Eres responsable de mantener la confidencialidad de tu cuenta y de todas las actividades que ocurran bajo ella.</p>
          </section>

          <section>
            <h4 className="font-bold text-white mb-2">4. Pagos y Reembolsos</h4>
            <p>El acceso a Trading Journal PRO requiere un pago único. Ofrecemos una garantía de devolución de 7 días desde la fecha de compra. Para solicitar un reembolso, contacta a nuestro soporte.</p>
          </section>

          <section>
            <h4 className="font-bold text-white mb-2">5. Uso Aceptable</h4>
            <p>Te comprometes a utilizar el servicio únicamente para fines legales y de acuerdo con estos términos. No debes intentar acceder a cuentas de otros usuarios ni interferir con el funcionamiento del servicio.</p>
          </section>

          <section>
            <h4 className="font-bold text-white mb-2">6. Privacidad de Datos</h4>
            <p>Tus datos de trading son privados y solo tú puedes acceder a ellos. Utilizamos Firebase con encriptación para proteger tu información. No vendemos ni compartimos tus datos con terceros.</p>
          </section>

          <section>
            <h4 className="font-bold text-white mb-2">7. Limitación de Responsabilidad</h4>
            <p>Trading Journal PRO es una herramienta de registro y análisis. No proporcionamos asesoría financiera ni garantizamos resultados de trading. Las decisiones de inversión son tu responsabilidad exclusiva.</p>
          </section>

          <section>
            <h4 className="font-bold text-white mb-2">8. Modificaciones</h4>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos al publicarse en la aplicación.</p>
          </section>

          <section>
            <h4 className="font-bold text-white mb-2">9. Contacto</h4>
            <p>Para cualquier pregunta sobre estos términos, contáctanos en: <a href="mailto:tmsolucionesdigitales@gmail.com" className="text-emerald-400 hover:underline">tmsolucionesdigitales@gmail.com</a></p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setShowTerms(false)}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Modal de Términos */}
      {showTerms && <TermsModal />}

      {/* Estilos para animaciones */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      
      {/* ==================== NAVBAR ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="w-[150px] sm:w-[160px] h-[50px] flex items-center hover:opacity-80 transition-opacity cursor-pointer">
            <img src="/tradingLogo.svg" alt="Trading Journal PRO" className="max-w-full max-h-full object-contain" />
          </div>
          
          {/* Botones */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={onLogin}
              className="text-slate-600 hover:text-slate-900 font-medium px-3 sm:px-4 py-2 transition-all flex items-center gap-1.5 rounded-xl hover:bg-slate-100 text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Ingresar</span>
            </button>
            <NavBuyButton />
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-20 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="text-emerald-400 text-xs sm:text-sm font-medium">+500 traders ya lo usan</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight px-2">
              Deja de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">perder dinero</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">trackea tus trades</span>
            </h1>
            
            <p className="text-sm sm:text-lg text-slate-400 max-w-xl mx-auto mb-6 sm:mb-8 px-4">
              El 90% de los traders pierden porque operan sin datos. 
              Obtén las métricas que necesitas para ser rentable.
            </p>
            
            <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
              <BuyButtonWithPrice />
              <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Pago único • Garantía 7 días
              </p>
            </div>
          </div>

          {/* App Preview - Aquí puedes poner tu screenshot */}
          <div className="relative px-2">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-b from-emerald-500/20 to-transparent p-0.5 sm:p-1 rounded-2xl">
              <div className="bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-slate-800">
                <img src="/apptj.png" alt="Trading Journal PRO" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROBLEMA - MEJORADO ==================== */}
      <section className="py-12 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-400 text-xs font-medium">El problema</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold">
              ¿Te suena <span className="text-red-400">familiar</span>?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            {problems.map((problem, i) => (
              <div 
                key={i} 
                className="group relative"
              >
                {/* Borde gradiente en hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/50 to-orange-500/50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                
                <div className="relative flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-slate-900/90 border border-red-500/10 group-hover:border-red-500/30 rounded-xl sm:rounded-2xl transition-all duration-300">
                  {/* Icono mejorado */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all">
                    <div className="text-red-400">
                      {problem.icon}
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-xs sm:text-sm font-medium flex-1">{problem.text}</p>
                  
                  {/* X decorativa */}
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 text-red-400/60" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transición visual */}
          <div className="flex justify-center mt-8 sm:mt-12">
            <div className="flex flex-col items-center">
              <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-red-500/50 to-emerald-500/50" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mt-1">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SOLUCIÓN - MEJORADO ==================== */}
      <section className="py-12 sm:py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/5 to-slate-950" />
        
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-8 sm:mb-14">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">La solución</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Trading Journal PRO</span>
            </h2>
            <p className="text-sm sm:text-lg text-slate-400 px-4">
              Todo para analizar tu operativa y ser consistente
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group relative"
              >
                {/* Efecto glow en hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-40 blur-sm transition-opacity duration-300`} />
                
                {/* Card */}
                <div className="relative p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm border border-slate-800 group-hover:border-slate-700 rounded-xl sm:rounded-2xl transition-all duration-300 h-full">
                  {/* Icono colorido */}
                  <div className={`w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 text-white shadow-lg group-hover:scale-110 group-hover:rotate-2 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2 text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                  
                  {/* Decoración sutil */}
                  <div className={`absolute top-3 right-3 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full opacity-5 blur-xl`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SIMULADOR DE FONDEO ==================== */}
      <section className="py-12 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-amber-950/5 to-slate-950" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        <div className="max-w-4xl mx-auto relative">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-[2rem] blur-xl opacity-50" />

            <div className="relative bg-slate-900/90 border border-amber-500/20 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-center">
                {/* Texto */}
                <div>
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400 text-xs font-medium">Nuevo</span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">
                    Simulador de{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">Prueba de Fondeo</span>
                  </h2>

                  <p className="text-slate-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                    Practica con las reglas reales de FTMO, Funded Next, E8 y mas.
                    Registra tus trades y ve si pasarias el challenge <span className="text-amber-400 font-medium">antes de arriesgar tu dinero.</span>
                  </p>

                  <div className="space-y-2">
                    {[
                      "Reglas reales de empresas de fondeo",
                      "Tracking de drawdown diario y total",
                      "Progreso hacia el profit target",
                      "Crea reglas personalizadas"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-300 text-xs sm:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className="relative">
                  <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                    {/* Header simulado */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">FTMO $100,000</p>
                        <p className="text-slate-500 text-xs">Challenge Fase 1</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Profit Target</span>
                        <span className="text-emerald-400 font-bold">72%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/50">
                        <p className="text-slate-500 text-[10px] uppercase">Balance</p>
                        <p className="text-white font-bold text-sm">$107,200</p>
                      </div>
                      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/50">
                        <p className="text-slate-500 text-[10px] uppercase">DD Total</p>
                        <p className="text-emerald-400 font-bold text-sm">1.8%</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                      <p className="text-emerald-400 text-xs font-bold">Challenge en progreso - Dia 12 de 30</p>
                    </div>
                  </div>

                  {/* Glow decorativo */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-500/20 blur-2xl rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BENEFICIOS ==================== */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-8">
                Convierte tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">datos en ganancias</span>
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="space-y-3">
                {[
                  { label: "Win Rate", value: "68%", color: "from-emerald-400 to-teal-400" },
                  { label: "Profit Factor", value: "2.4", color: "from-blue-400 to-cyan-400" },
                  { label: "Mejor Día", value: "+$847", color: "from-purple-400 to-pink-400" },
                  { label: "Crecimiento", value: "+24.5%", color: "from-orange-400 to-amber-400" }
                ].map((stat, i) => (
                  <div 
                    key={i}
                    className="flex justify-between items-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <span className="text-slate-400 text-xs sm:text-sm">{stat.label}</span>
                    <span className={`text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIOS ==================== */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              Lo que dicen nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">traders</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-base">
              Resultados reales de personas como tú
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Testimonio 1 - México */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                  RC
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Roberto Castillo</h4>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <span>🇲🇽</span> Guadalajara, México
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                "Llevaba 2 años operando sin llevar registro. Cuando empecé a usar el journal descubrí que mi win rate real era del 38%, no del 60% que yo creía. <span className="text-emerald-400 font-medium">En 3 meses lo subí a 52%</span> solo siendo consciente de mis errores."
              </p>
              <p className="text-slate-500 text-xs">Opera futuros desde 2021</p>
            </div>

            {/* Testimonio 2 - Argentina */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  MF
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Martín Fernández</h4>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <span>🇦🇷</span> Buenos Aires, Argentina
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                "El calendario económico me salvó varias veces de operar en NFP sin darme cuenta. Pero lo mejor es ver mi curva de equity crecer. <span className="text-emerald-400 font-medium">+18% en mi cuenta en 2 meses.</span>"
              </p>
              <p className="text-slate-500 text-xs">Opera forex desde 2020</p>
            </div>

            {/* Testimonio 3 - Perú */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  CV
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Carolina Vargas</h4>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <span>🇵🇪</span> Lima, Perú
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                "Antes operaba por impulso. Ahora registro cada trade y reviso mis emociones. <span className="text-emerald-400 font-medium">Mi drawdown máximo bajó de 25% a 8%.</span> La calculadora de riesgo es mi herramienta favorita."
              </p>
              <p className="text-slate-500 text-xs">Opera crypto desde 2022</p>
            </div>

            {/* Testimonio 4 - Chile */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                  DS
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Diego Soto</h4>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <span>🇨🇱</span> Santiago, Chile
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                "Simple pero efectivo. No necesitas Excel ni apps complicadas. <span className="text-emerald-400 font-medium">En 1 mes ya tenía claro que los lunes eran mi peor día.</span> Ahora no opero lunes y mi cuenta lo agradece."
              </p>
              <p className="text-slate-500 text-xs">Opera índices desde 2023</p>
            </div>

            {/* Testimonio 5 - México */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                  AG
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Andrea González</h4>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <span>🇲🇽</span> Monterrey, México
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                "Lo uso desde mi celular mientras viajo. Registro el trade, pongo mi emoción y listo. <span className="text-emerald-400 font-medium">Mi profit factor pasó de 0.8 a 1.6.</span> Por fin soy rentable después de 1 año."
              </p>
              <p className="text-slate-500 text-xs">Opera MNQ desde 2023</p>
            </div>

            {/* Testimonio 6 - Colombia */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                  JR
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Juan Rodríguez</h4>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <span>🇨🇴</span> Medellín, Colombia
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                "Probé como 5 journals diferentes. Este es el único que realmente uso porque es rápido. <span className="text-emerald-400 font-medium">Las estadísticas avanzadas valen cada peso.</span> Sé exactamente en qué activos soy mejor."
              </p>
              <p className="text-slate-500 text-xs">Opera forex y futuros desde 2019</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRECIO - CON PLANES ==================== */}
      <section id="planes-section" className="py-12 sm:py-20 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              Invierte en tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">éxito</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Elige el plan que mejor se adapte a ti
            </p>
          </div>

          <div className="relative">
            {/* Glow animado */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-[1.5rem] sm:rounded-[2rem] blur-xl opacity-30 animate-pulse" />

            <div className="relative bg-gradient-to-b from-slate-800/95 to-slate-900/95 border border-emerald-500/30 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 text-center backdrop-blur-sm">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 text-xs font-bold rounded-full mb-4 sm:mb-6 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                ELIGE TU PLAN
              </div>

              {/* Selector de Planes - Cards */}
              <div className="space-y-2 sm:space-y-3 mb-6">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;

                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500'
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {/* Radio button visual */}
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className={`font-bold text-sm sm:text-base ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {plan.name}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
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
                        <div className={`px-3 py-1.5 rounded-lg font-black text-lg ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-200'
                        }`}>
                          ${plan.price}
                          <span className="text-xs font-medium opacity-70 ml-0.5">USD</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Lista */}
              <div className="space-y-2 mb-6 text-left">
                {[
                  "Acceso completo a la app",
                  "Todas las métricas",
                  "Calendario económico",
                  "Updates gratuitos",
                  "Soporte por email",
                  "Garantía de 7 días"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-300 text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Botón de Pago */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition-all duration-500" />
                <button
                  onClick={handlePayPal}
                  className="relative w-full bg-gradient-to-r from-[#FFC439] via-[#FFD700] to-[#FFC439] text-black font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden border border-yellow-500/50 shadow-lg shadow-yellow-500/20 px-6 py-3 sm:py-4"
                >
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                  <div className="relative flex items-center justify-center gap-3">
                    <img src="/paypal.png" alt="PayPal" className="h-5 sm:h-6 w-auto object-contain" />
                    <span className="text-base sm:text-lg font-black">Pagar ${selectedPlanData?.price} USD</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Trust */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 text-slate-500 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Pago seguro
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Garantía 7 días
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-12 sm:py-20 px-4 bg-slate-900/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-bold text-center mb-6 sm:mb-12">
            Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Frecuentes</span>
          </h2>
          
          <div className="space-y-2 sm:space-y-3">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-medium pr-3 text-xs sm:text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-slate-400 text-xs sm:text-sm">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="py-12 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative px-4">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-6">
            ¿Listo para ser <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">rentable</span>?
          </h2>
          <p className="text-sm sm:text-lg text-slate-400 mb-6 sm:mb-8">
            Únete a los traders que ya usan datos para mejorar. Tu futuro yo te lo agradecerá.
          </p>
          <div className="flex justify-center">
            <BuyButtonWithPrice />
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-8 sm:py-10 px-4 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 sm:gap-6">
          <div className="w-[150px] sm:w-[160px] h-[50px] flex items-center justify-center">
            <img src="/tradingLogo.svg" alt="Trading Journal PRO" className="max-w-full max-h-full object-contain" />
          </div>
          <p className="text-slate-500 text-xs sm:text-sm text-center">
            © 2025 Trading Journal PRO. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
            <button onClick={() => setShowTerms(true)} className="hover:text-blue-600 transition-colors">Términos</button>
            <button onClick={() => setShowTerms(true)} className="hover:text-blue-600 transition-colors">Privacidad</button>
            <a href="mailto:tmsolucionesdigitales@gmail.com" className="hover:text-blue-600 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}