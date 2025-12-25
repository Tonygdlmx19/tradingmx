"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ChevronUp,
  LogIn,
  Play,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';

// Animaciones reutilizables
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function LandingPage({ onLogin }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Equity Curve",
      description: "Visualiza el crecimiento de tu cuenta en tiempo real"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Métricas Avanzadas",
      description: "Win rate, profit factor, expectativa y más"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Target Diario",
      description: "Establece y trackea tu meta diaria de ganancias"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendario Económico",
      description: "Nunca te pierdas un evento importante del mercado"
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Análisis por Activo",
      description: "Descubre en qué instrumentos eres más rentable"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Historial Completo",
      description: "Revisa todos tus trades con filtros avanzados"
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
    window.open('https://www.paypal.com/paypalme/TUUSUARIO/19.99', '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      
      {/* ==================== NAVBAR ==================== */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-950/95 backdrop-blur-lg border-b border-slate-800 py-3' 
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">Trading Journal PRO</span>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button 
              onClick={onLogin}
              className="text-slate-400 hover:text-white font-medium px-4 py-2 transition-colors flex items-center gap-2 rounded-full hover:bg-slate-800/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Ya tengo cuenta</span>
            </motion.button>
            <motion.button 
              onClick={handlePayPal}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-emerald-500/25"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Comprar Ahora
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ==================== HERO ==================== */}
      <section className="pt-32 pb-20 px-4 relative">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
              variants={fadeInUp}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">+500 traders ya lo usan</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
              variants={fadeInUp}
            >
              Deja de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">perder dinero</span> por no
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">trackear tus trades</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
              variants={fadeInUp}
            >
              El 90% de los traders pierden porque operan sin datos. 
              Trading Journal PRO te da las métricas que necesitas para ser rentable.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.button 
                onClick={handlePayPal}
                className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-full transition-all flex items-center gap-3 shadow-xl shadow-emerald-500/25"
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-5 h-5" />
                Obtener Acceso - $19.99 USD
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <p className="text-slate-500 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Pago único • Acceso de por vida
              </p>
            </motion.div>
          </motion.div>

          {/* App Preview */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-b from-emerald-500/20 to-transparent p-1 rounded-3xl">
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-slate-800">
                {/* Placeholder para screenshot de tu app */}
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <p className="text-slate-400 font-medium">Screenshot de tu app aquí</p>
                    <p className="text-slate-500 text-sm">Reemplaza con imagen real</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== VIDEO DEMO ==================== */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mira cómo <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">funciona</span>
            </h2>
            <p className="text-slate-400">
              Te muestro en 2 minutos cómo Trading Journal PRO puede transformar tu operativa
            </p>
          </motion.div>

          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-slate-800"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
          >
            {/* Video Container - Reemplaza el src con tu video de YouTube */}
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative group cursor-pointer">
              {/* Thumbnail/Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div 
                    className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </motion.div>
                  <p className="text-white font-bold text-lg">Ver Demo</p>
                  <p className="text-slate-400 text-sm">2 minutos</p>
                </div>
              </div>
              
              {/* Cuando tengas el video, descomenta esto y reemplaza VIDEO_ID */}
              {/* 
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/VIDEO_ID?rel=0" 
                title="Trading Journal PRO Demo"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
              */}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ==================== PROBLEMA ==================== */}
      <section className="py-20 px-4 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            ¿Te suena <span className="text-red-400">familiar</span>?
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              "No sabes cuál es tu win rate real",
              "Repites los mismos errores una y otra vez",
              "No tienes idea si eres rentable o no",
              "Operas por emociones, no por datos",
              "Tu cuenta sube y baja sin control",
              "No sabes en qué activos eres mejor"
            ].map((problem, i) => (
              <motion.div 
                key={i} 
                className="flex items-start gap-3 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-left hover:bg-red-500/10 transition-colors"
                variants={fadeInUp}
              >
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm">✕</span>
                </div>
                <p className="text-slate-300">{problem}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== SOLUCIÓN ==================== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              La solución: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Trading Journal PRO</span>
            </h2>
            <p className="text-xl text-slate-400">
              Todo lo que necesitas para analizar tu operativa y ser consistente
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature, i) => (
              <motion.div 
                key={i} 
                className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-3xl hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all group"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mb-5 text-emerald-400 group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== BENEFICIOS ==================== */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInLeft}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Convierte tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">datos en ganancias</span>
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-slate-300">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
            >
              <div className="space-y-4">
                {[
                  { label: "Win Rate", value: "68%", color: "emerald" },
                  { label: "Profit Factor", value: "2.4", color: "emerald" },
                  { label: "Mejor Día", value: "+$847", color: "emerald" },
                  { label: "Crecimiento", value: "+24.5%", color: "emerald" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-slate-400">{stat.label}</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== PRECIO ==================== */}
      <section className="py-20 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Invierte en tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">éxito</span>
            </h2>
            <p className="text-slate-400">
              Menos de lo que pierdes en un mal trade
            </p>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-[2rem] blur-xl opacity-20" />
            
            <div className="relative bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-emerald-500/20 rounded-[2rem] p-8 text-center backdrop-blur-sm">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="w-4 h-4" />
                ACCESO DE POR VIDA
              </motion.div>
              
              <div className="mb-6">
                <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">$19.99</span>
                <span className="text-slate-400 ml-2">USD</span>
              </div>
              
              <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                {[
                  "Acceso completo a la aplicación",
                  "Todas las métricas y estadísticas",
                  "Calendario económico integrado",
                  "Actualizaciones gratuitas",
                  "Soporte por email",
                  "Garantía de 7 días"
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.button 
                onClick={handlePayPal}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-lg py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <DollarSign className="w-5 h-5" />
                Comprar con PayPal
              </motion.button>
              
              <p className="text-slate-500 text-sm mt-4 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Pago seguro con PayPal • Garantía de 7 días
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-2xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Frecuentes</span>
          </motion.h2>
          
          <motion.div 
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {faqs.map((faq, i) => (
              <motion.div 
                key={i} 
                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden"
                variants={fadeInUp}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-700/20 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <p className="text-slate-400">{faq.a}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div 
          className="max-w-4xl mx-auto text-center relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6"
            variants={fadeInUp}
          >
            ¿Listo para ser <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">rentable</span>?
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Únete a los traders que ya están usando datos para mejorar su operativa. 
            Tu futuro yo te lo agradecerá.
          </motion.p>
          <motion.button 
            onClick={handlePayPal}
            className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg px-10 py-5 rounded-full transition-all flex items-center gap-3 mx-auto shadow-xl shadow-emerald-500/25"
            variants={fadeInUp}
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-5 h-5" />
            Obtener Trading Journal PRO - $19.99
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-10 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">Trading Journal PRO</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2025 Trading Journal PRO. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacidad</a>
            <a href="mailto:tu@email.com" className="hover:text-emerald-400 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}