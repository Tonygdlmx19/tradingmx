"use client";
import { useState, useRef } from 'react';
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
  VolumeX
} from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

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
      a: "Inmediatamente después del pago recibirás un email con tus credenciales de acceso. Si no lo ves, revisa tu carpeta de spam."
    },
    {
      q: "¿El pago es único o es suscripción?",
      a: "Es un pago único de $19.99 USD. Acceso de por vida, sin mensualidades ni cargos ocultos."
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
    window.open('https://www.paypal.com/ncp/payment/FGTPJDA5NBTEU', '_blank');
  };

  // Componente de botón de compra - Compacto y horizontal
  const BuyButton = ({ size = 'normal', className = '' }) => (
    <div className={`relative group ${className}`}>
      {/* Glow animado exterior */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition-all duration-500" />
      
      <button 
        onClick={handlePayPal}
        className={`
          relative
          bg-gradient-to-r from-[#FFC439] via-[#FFD700] to-[#FFC439]
          text-black font-bold rounded-xl
          transition-all duration-300
          hover:scale-[1.02] active:scale-[0.98]
          overflow-hidden
          border border-yellow-500/50
          shadow-lg shadow-yellow-500/20
          px-5 sm:px-6 py-3 sm:py-3.5
        `}
      >
        {/* Efecto de brillo */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
        
        {/* Contenido del botón - Todo en una línea */}
        <div className="relative flex items-center justify-center gap-3 sm:gap-4">
          {/* Logo PayPal */}
          <img 
            src="/paypal.png" 
            alt="PayPal" 
            className="h-6 sm:h-7 w-auto object-contain"
          />
          
          {/* Separador */}
          <div className="w-px h-6 bg-black/20" />
          
          {/* Texto y precios en línea */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm sm:text-base font-black">Comprar</span>
            <span className="text-black/40 line-through text-xs sm:text-sm">$49.99</span>
            <span className="bg-black text-yellow-400 px-2 py-0.5 rounded-md text-sm sm:text-base font-black">
              $19.99
            </span>
          </div>
          
          {/* Badge de descuento */}
          <div className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
            -60%
          </div>
          
          {/* Flecha */}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );

  // Botón secundario para navbar
  const NavBuyButton = () => (
    <button 
      onClick={handlePayPal}
      className="relative group overflow-hidden bg-gradient-to-r from-[#FFC439] to-[#FFD700] text-black font-bold px-3 sm:px-4 py-2 rounded-lg transition-all shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-105 active:scale-95 flex items-center gap-2 border border-yellow-500/50"
    >
      {/* Brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
      
      <div className="relative flex items-center gap-1.5">
        <img 
          src="/paypal.png" 
          alt="PayPal" 
          className="h-5 w-auto object-contain"
        />
        <span className="font-bold text-sm">Comprar</span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
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
          {/* Logo grande */}
          <div className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
            <img 
              src="/tradingLogo.svg" 
              alt="Trading Journal PRO" 
              className="h-12 sm:h-14 md:h-16 w-auto"
            />
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
              <BuyButton />
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
                {/* ⬇️ REEMPLAZA ESTO CON TU SCREENSHOT: <img src="/interfaz.jpg" alt="Trading Journal PRO" className="w-full" /> */}
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-emerald-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-7 h-7 sm:w-10 sm:h-10 text-emerald-500" />
                    </div>
                    <p className="text-slate-400 font-medium text-xs sm:text-base">Screenshot de tu app aquí</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VIDEO DEMO - CON FIREBASE STORAGE ==================== */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              Mira cómo <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">funciona</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-base">
              En 2 minutos te muestro cómo puede transformar tu operativa
            </p>
          </div>

          <div className="relative rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-slate-800">
            {/* Video Container */}
            <div 
              className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative group cursor-pointer"
              onClick={handlePlayVideo}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                src={VIDEO_URL}
                poster={VIDEO_POSTER}
                muted={isMuted}
                playsInline
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Play/Pause Overlay - Se oculta cuando reproduce */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                <div className="text-center">
                  <div className={`w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all ${isPlaying ? 'scale-90' : ''}`}>
                    {isPlaying ? (
                      <Pause className="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="white" />
                    ) : (
                      <Play className="w-6 h-6 sm:w-10 sm:h-10 text-white ml-1" fill="white" />
                    )}
                  </div>
                  {!isPlaying && (
                    <>
                      <p className="text-white font-bold text-sm sm:text-lg">Ver Demo</p>
                      <p className="text-slate-400 text-xs">2 minutos</p>
                    </>
                  )}
                </div>
              </div>

              {/* Controles de video (visible cuando reproduce) */}
              {isPlaying && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Texto debajo del video */}
          <p className="text-center text-slate-500 text-xs mt-4">
            {isPlaying ? 'Click para pausar' : 'Click para reproducir'} • Sin sonido molesto
          </p>
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

      {/* ==================== PRECIO - MEJORADO ==================== */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              Invierte en tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">éxito</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Menos de lo que pierdes en un mal trade
            </p>
          </div>
          
          <div className="relative">
            {/* Glow animado */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-[1.5rem] sm:rounded-[2rem] blur-xl opacity-30 animate-pulse" />
            
            <div className="relative bg-gradient-to-b from-slate-800/95 to-slate-900/95 border border-emerald-500/30 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 text-center backdrop-blur-sm">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 text-xs font-bold rounded-full mb-4 sm:mb-6 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                ACCESO DE POR VIDA
              </div>
              
              {/* Precio */}
              <div className="mb-4 sm:mb-6">
                <div className="text-slate-500 text-xs line-through mb-1">$49.99 USD</div>
                <span className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">$19.99</span>
                <span className="text-slate-400 ml-1 text-sm">USD</span>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-bold rounded-full">
                  <Zap className="w-3 h-3" />
                  60% DESCUENTO
                </div>
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
              
              {/* Botón */}
              <div className="flex justify-center">
                <BuyButton />
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
            <BuyButton />
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-8 sm:py-10 px-4 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/tradingLogo.svg" 
              alt="Trading Journal PRO" 
              className="h-10 sm:h-12 w-auto"
            />
          </div>
          <p className="text-slate-500 text-xs sm:text-sm text-center">
            © 2025 Trading Journal PRO. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Términos</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacidad</a>
            <a href="mailto:tmsolucionesdigitales@gmail.com" className="hover:text-blue-600 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}