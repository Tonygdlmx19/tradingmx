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
  Infinity,
  GraduationCap,
  Globe,
  Bot
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';

const PLANS = {
  es: [
    { id: '1month', name: '1 Mes', price: 10, duration: '1 mes', icon: Zap, color: 'blue', aiQueries: 5, paypalLink: 'https://www.paypal.com/ncp/payment/X3GWT63PZQ8J6' },
    { id: '3months', name: '3 Meses', price: 20, duration: '3 meses', icon: Star, color: 'purple', popular: true, aiQueries: 10, paypalLink: 'https://www.paypal.com/ncp/payment/FGTPJDA5NBTEU' },
    { id: '1year', name: '1 Año', price: 50, duration: '12 meses', icon: Crown, color: 'amber', aiQueries: 20, paypalLink: 'https://www.paypal.com/ncp/payment/8DV9WS43YAXV8' },
    { id: 'lifetime', name: 'De por vida', price: 100, duration: 'Para siempre', icon: Infinity, color: 'green', aiQueries: 30, paypalLink: 'https://www.paypal.com/ncp/payment/Z2NETX47DZ5K4' },
  ],
  en: [
    { id: '1month', name: '1 Month', price: 10, duration: '1 month', icon: Zap, color: 'blue', aiQueries: 5, paypalLink: 'https://www.paypal.com/ncp/payment/X3GWT63PZQ8J6' },
    { id: '3months', name: '3 Months', price: 20, duration: '3 months', icon: Star, color: 'purple', popular: true, aiQueries: 10, paypalLink: 'https://www.paypal.com/ncp/payment/FGTPJDA5NBTEU' },
    { id: '1year', name: '1 Year', price: 50, duration: '12 months', icon: Crown, color: 'amber', aiQueries: 20, paypalLink: 'https://www.paypal.com/ncp/payment/8DV9WS43YAXV8' },
    { id: 'lifetime', name: 'Lifetime', price: 100, duration: 'Forever', icon: Infinity, color: 'green', aiQueries: 30, paypalLink: 'https://www.paypal.com/ncp/payment/Z2NETX47DZ5K4' },
  ]
};

export default function LandingPage({ onLogin }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 0, seconds: 0 });
  const [selectedPlan, setSelectedPlan] = useState('3months');
  const { language, toggleLanguage } = useLanguage();
  const videoRef = useRef(null);

  const plans = PLANS[language];

  // Translations
  const labels = {
    es: {
      // Navbar
      login: 'Ingresar',
      // Hero
      tradersUsing: '+500 traders ya lo usan',
      heroTitle1: 'Deja de',
      heroTitle2: 'perder dinero',
      heroTitle3: 'trackea tus trades',
      heroSubtitle: 'El 90% de los traders pierden porque operan sin datos. Obtén las métricas que necesitas para ser rentable.',
      trialButton: 'Prueba Gratis 15 Días',
      noCreditCard: 'Sin tarjeta de crédito • Cancela cuando quieras',
      // Problems
      theProblem: 'El problema',
      soundsFamiliar: '¿Te suena familiar?',
      problems: [
        "No sabes cuál es tu win rate real",
        "Repites los mismos errores una y otra vez",
        "No tienes idea si eres rentable o no",
        "Operas por emociones, no por datos",
        "Tu cuenta sube y baja sin control",
        "No sabes en qué activos eres mejor"
      ],
      // Solution
      theSolution: 'La solución',
      solutionSubtitle: 'Todo para analizar tu operativa y ser consistente',
      features: [
        { title: "Equity Curve", description: "Visualiza el crecimiento de tu cuenta en tiempo real" },
        { title: "Métricas Avanzadas", description: "Win rate, profit factor, expectativa y más" },
        { title: "Target Diario", description: "Establece y trackea tu meta diaria de ganancias" },
        { title: "Calendario Económico", description: "Nunca te pierdas un evento importante del mercado" },
        { title: "Análisis por Activo", description: "Descubre en qué instrumentos eres más rentable" },
        { title: "Historial Completo", description: "Revisa todos tus trades con filtros avanzados" },
        { title: "Asistente IA", description: "Mentor virtual que analiza tus gráficos y te da retroalimentación personalizada" },
        { title: "Academia de Trading", description: "Aprende análisis técnico desde cero con lecciones interactivas" },
        { title: "Plan de Trading", description: "Crea tu checklist de reglas y evalúa cada trade" }
      ],
      // Funding simulator
      newFeature: 'Nuevo',
      fundingSimulator: 'Simulador de',
      fundingTest: 'Prueba de Fondeo',
      fundingDesc: 'Practica con las reglas reales de FTMO, Funded Next, E8 y mas. Registra tus trades y ve si pasarias el challenge',
      beforeRiskingMoney: 'antes de arriesgar tu dinero.',
      fundingFeatures: [
        "Reglas reales de empresas de fondeo",
        "Tracking de drawdown diario y total",
        "Progreso hacia el profit target",
        "Crea reglas personalizadas"
      ],
      profitTarget: 'Profit Target',
      balance: 'Balance',
      ddTotal: 'DD Total',
      challengeInProgress: 'Challenge en progreso - Dia 12 de 30',
      // Benefits
      convertData: 'Convierte tus',
      dataToProfit: 'datos en ganancias',
      benefits: [
        "Identifica patrones en tu operativa",
        "Mejora tu win rate con datos reales",
        "Trackea tus puntos/pips ganados",
        "Controla tus emociones con métricas",
        "Deja de repetir los mismos errores",
        "Crece tu cuenta de forma consistente"
      ],
      winRate: 'Win Rate',
      profitFactor: 'Profit Factor',
      totalPoints: 'Puntos Totales',
      bestDay: 'Mejor Día',
      growth: 'Crecimiento',
      // Testimonials
      whatTradersSay: 'Lo que dicen nuestros',
      traders: 'traders',
      realResults: 'Resultados reales de personas como tú',
      testimonials: [
        { initials: 'RC', name: 'Roberto Castillo', location: 'Guadalajara, México', flag: '🇲🇽', quote: 'Llevaba 2 años operando sin llevar registro. Cuando empecé a usar el journal descubrí que mi win rate real era del 38%, no del 60% que yo creía.', highlight: 'En 3 meses lo subí a 52%', suffix: 'solo siendo consciente de mis errores.', footer: 'Opera futuros desde 2021', color: 'from-emerald-500 to-teal-500' },
        { initials: 'MF', name: 'Martín Fernández', location: 'Buenos Aires, Argentina', flag: '🇦🇷', quote: 'El calendario económico me salvó varias veces de operar en NFP sin darme cuenta. Pero lo mejor es ver mi curva de equity crecer.', highlight: '+18% en mi cuenta en 2 meses.', suffix: '', footer: 'Opera forex desde 2020', color: 'from-blue-500 to-cyan-500' },
        { initials: 'CV', name: 'Carolina Vargas', location: 'Lima, Perú', flag: '🇵🇪', quote: 'Antes operaba por impulso. Ahora registro cada trade y reviso mis emociones.', highlight: 'Mi drawdown máximo bajó de 25% a 8%.', suffix: 'La calculadora de riesgo es mi herramienta favorita.', footer: 'Opera crypto desde 2022', color: 'from-purple-500 to-pink-500' },
        { initials: 'DS', name: 'Diego Soto', location: 'Santiago, Chile', flag: '🇨🇱', quote: 'Simple pero efectivo. No necesitas Excel ni apps complicadas.', highlight: 'En 1 mes ya tenía claro que los lunes eran mi peor día.', suffix: 'Ahora no opero lunes y mi cuenta lo agradece.', footer: 'Opera índices desde 2023', color: 'from-orange-500 to-amber-500' },
        { initials: 'AG', name: 'Andrea González', location: 'Monterrey, México', flag: '🇲🇽', quote: 'Lo uso desde mi celular mientras viajo. Registro el trade, pongo mi emoción y listo.', highlight: 'Mi profit factor pasó de 0.8 a 1.6.', suffix: 'Por fin soy rentable después de 1 año.', footer: 'Opera MNQ desde 2023', color: 'from-rose-500 to-red-500' },
        { initials: 'JR', name: 'Juan Rodríguez', location: 'Medellín, Colombia', flag: '🇨🇴', quote: 'Probé como 5 journals diferentes. Este es el único que realmente uso porque es rápido.', highlight: 'Las estadísticas avanzadas valen cada peso.', suffix: 'Sé exactamente en qué activos soy mejor.', footer: 'Opera forex y futuros desde 2019', color: 'from-indigo-500 to-violet-500' }
      ],
      // Pricing
      investInYour: 'Invierte en tu',
      success: 'éxito',
      choosePlan: 'Elige el plan que mejor se adapte a ti',
      choosePlanBadge: 'ELIGE TU PLAN',
      popular: 'POPULAR',
      aiAnalysisDay: 'análisis IA/día',
      pricingFeatures: [
        "Acceso completo a la app",
        "Todas las métricas y estadísticas",
        "Academia de Trading incluida",
        "Checklist de tu plan de trading",
        "Asistente IA",
        "Calendario económico y sesiones",
        "Updates gratuitos",
        "Garantía de 7 días"
      ],
      pay: 'Pagar',
      securePayment: 'Pago seguro',
      guarantee7Days: 'Garantía 7 días',
      // FAQ
      faq: 'Preguntas',
      frequent: 'Frecuentes',
      faqs: [
        { q: "¿Cómo recibo acceso después de pagar?", a: "Al pagar con PayPal, usa el mismo correo que usarás para iniciar sesión con Google. Tu acceso se activa automáticamente en 1-2 minutos. Solo haz clic en 'Ingresar' y selecciona Google." },
        { q: "¿Cuáles son los planes disponibles?", a: "Tenemos 4 planes: 1 Mes ($10), 3 Meses ($20), 1 Año ($50) y De por vida ($100). Todos incluyen acceso completo a todas las funciones." },
        { q: "¿Funciona para Forex, Futuros, Crypto?", a: "Sí, funciona para cualquier mercado. Puedes registrar trades de Forex, Futuros, Acciones, Crypto, Opciones Binarias y más." },
        { q: "¿Mis datos están seguros?", a: "Absolutamente. Usamos Firebase con encriptación de nivel bancario. Tus datos son privados y solo tú puedes verlos." },
        { q: "¿Hay garantía de devolución?", a: "Sí, tienes 7 días para probar la aplicación. Si no te convence, te devolvemos el 100% de tu dinero sin preguntas." },
        { q: "¿Puedo usarlo en mi celular?", a: "Sí, la aplicación es 100% responsive. Funciona perfecto en computadora, tablet y celular." }
      ],
      // CTA
      readyToBe: '¿Listo para ser',
      profitable: 'rentable',
      joinTraders: 'Únete a los traders que ya usan datos para mejorar. Tu futuro yo te lo agradecerá.',
      // Footer
      allRightsReserved: 'Todos los derechos reservados.',
      terms: 'Términos',
      privacy: 'Privacidad',
      contact: 'Contacto',
      // Terms modal
      termsAndConditions: 'Términos y Condiciones',
      understood: 'Entendido',
      lastUpdated: 'Última actualización: Enero 2025',
      termsContent: [
        { title: '1. Aceptación de Términos', text: 'Al acceder y utilizar Trading Journal PRO, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no debes utilizar nuestro servicio.' },
        { title: '2. Descripción del Servicio', text: 'Trading Journal PRO es una aplicación web diseñada para ayudar a traders a registrar, analizar y mejorar su operativa mediante el seguimiento de métricas y estadísticas de trading.' },
        { title: '3. Registro y Cuenta', text: 'Para acceder al servicio debes crear una cuenta utilizando Google Sign-In. Eres responsable de mantener la confidencialidad de tu cuenta y de todas las actividades que ocurran bajo ella.' },
        { title: '4. Pagos y Reembolsos', text: 'El acceso a Trading Journal PRO requiere un pago único. Ofrecemos una garantía de devolución de 7 días desde la fecha de compra. Para solicitar un reembolso, contacta a nuestro soporte.' },
        { title: '5. Uso Aceptable', text: 'Te comprometes a utilizar el servicio únicamente para fines legales y de acuerdo con estos términos. No debes intentar acceder a cuentas de otros usuarios ni interferir con el funcionamiento del servicio.' },
        { title: '6. Privacidad de Datos', text: 'Tus datos de trading son privados y solo tú puedes acceder a ellos. Utilizamos Firebase con encriptación para proteger tu información. No vendemos ni compartimos tus datos con terceros.' },
        { title: '7. Limitación de Responsabilidad', text: 'Trading Journal PRO es una herramienta de registro y análisis. No proporcionamos asesoría financiera ni garantizamos resultados de trading. Las decisiones de inversión son tu responsabilidad exclusiva.' },
        { title: '8. Modificaciones', text: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos al publicarse en la aplicación.' },
        { title: '9. Contacto', text: 'Para cualquier pregunta sobre estos términos, contáctanos en:' }
      ],
    },
    en: {
      // Navbar
      login: 'Login',
      // Hero
      tradersUsing: '+500 traders already use it',
      heroTitle1: 'Stop',
      heroTitle2: 'losing money',
      heroTitle3: 'track your trades',
      heroSubtitle: '90% of traders lose because they trade without data. Get the metrics you need to be profitable.',
      trialButton: 'Free Trial 15 Days',
      noCreditCard: 'No credit card • Cancel anytime',
      // Problems
      theProblem: 'The problem',
      soundsFamiliar: 'Sound familiar?',
      problems: [
        "You don't know your real win rate",
        "You repeat the same mistakes over and over",
        "You have no idea if you're profitable",
        "You trade by emotions, not data",
        "Your account goes up and down without control",
        "You don't know which assets you're best at"
      ],
      // Solution
      theSolution: 'The solution',
      solutionSubtitle: 'Everything to analyze your trading and be consistent',
      features: [
        { title: "Equity Curve", description: "Visualize your account growth in real time" },
        { title: "Advanced Metrics", description: "Win rate, profit factor, expectancy and more" },
        { title: "Daily Target", description: "Set and track your daily profit goal" },
        { title: "Economic Calendar", description: "Never miss an important market event" },
        { title: "Asset Analysis", description: "Discover which instruments you're most profitable in" },
        { title: "Complete History", description: "Review all your trades with advanced filters" },
        { title: "AI Assistant", description: "Virtual mentor that analyzes your charts and gives personalized feedback" },
        { title: "Trading Academy", description: "Learn technical analysis from scratch with interactive lessons" },
        { title: "Trading Plan", description: "Create your rules checklist and evaluate each trade" }
      ],
      // Funding simulator
      newFeature: 'New',
      fundingSimulator: 'Funding',
      fundingTest: 'Challenge Simulator',
      fundingDesc: 'Practice with real rules from FTMO, Funded Next, E8 and more. Log your trades and see if you would pass the challenge',
      beforeRiskingMoney: 'before risking your money.',
      fundingFeatures: [
        "Real prop firm rules",
        "Daily and total drawdown tracking",
        "Progress towards profit target",
        "Create custom rules"
      ],
      profitTarget: 'Profit Target',
      balance: 'Balance',
      ddTotal: 'DD Total',
      challengeInProgress: 'Challenge in progress - Day 12 of 30',
      // Benefits
      convertData: 'Convert your',
      dataToProfit: 'data into profits',
      benefits: [
        "Identify patterns in your trading",
        "Improve your win rate with real data",
        "Track your points/pips earned",
        "Control your emotions with metrics",
        "Stop repeating the same mistakes",
        "Grow your account consistently"
      ],
      winRate: 'Win Rate',
      profitFactor: 'Profit Factor',
      totalPoints: 'Total Points',
      bestDay: 'Best Day',
      growth: 'Growth',
      // Testimonials
      whatTradersSay: 'What our',
      traders: 'traders say',
      realResults: 'Real results from people like you',
      testimonials: [
        { initials: 'RC', name: 'Roberto Castillo', location: 'Guadalajara, Mexico', flag: '🇲🇽', quote: 'I had been trading for 2 years without keeping records. When I started using the journal I discovered my real win rate was 38%, not the 60% I thought.', highlight: 'In 3 months I raised it to 52%', suffix: 'just by being aware of my mistakes.', footer: 'Trades futures since 2021', color: 'from-emerald-500 to-teal-500' },
        { initials: 'MF', name: 'Martín Fernández', location: 'Buenos Aires, Argentina', flag: '🇦🇷', quote: 'The economic calendar saved me several times from trading during NFP without realizing it. But the best part is watching my equity curve grow.', highlight: '+18% in my account in 2 months.', suffix: '', footer: 'Trades forex since 2020', color: 'from-blue-500 to-cyan-500' },
        { initials: 'CV', name: 'Carolina Vargas', location: 'Lima, Peru', flag: '🇵🇪', quote: 'Before I traded on impulse. Now I log every trade and review my emotions.', highlight: 'My max drawdown dropped from 25% to 8%.', suffix: 'The risk calculator is my favorite tool.', footer: 'Trades crypto since 2022', color: 'from-purple-500 to-pink-500' },
        { initials: 'DS', name: 'Diego Soto', location: 'Santiago, Chile', flag: '🇨🇱', quote: 'Simple but effective. You don\'t need Excel or complicated apps.', highlight: 'In 1 month I clearly knew Mondays were my worst day.', suffix: 'Now I don\'t trade Mondays and my account thanks me.', footer: 'Trades indices since 2023', color: 'from-orange-500 to-amber-500' },
        { initials: 'AG', name: 'Andrea González', location: 'Monterrey, Mexico', flag: '🇲🇽', quote: 'I use it from my phone while traveling. Log the trade, add my emotion and done.', highlight: 'My profit factor went from 0.8 to 1.6.', suffix: 'Finally profitable after 1 year.', footer: 'Trades MNQ since 2023', color: 'from-rose-500 to-red-500' },
        { initials: 'JR', name: 'Juan Rodríguez', location: 'Medellín, Colombia', flag: '🇨🇴', quote: 'I tried like 5 different journals. This is the only one I actually use because it\'s fast.', highlight: 'The advanced statistics are worth every penny.', suffix: 'I know exactly which assets I\'m best at.', footer: 'Trades forex and futures since 2019', color: 'from-indigo-500 to-violet-500' }
      ],
      // Pricing
      investInYour: 'Invest in your',
      success: 'success',
      choosePlan: 'Choose the plan that best suits you',
      choosePlanBadge: 'CHOOSE YOUR PLAN',
      popular: 'POPULAR',
      aiAnalysisDay: 'AI analysis/day',
      pricingFeatures: [
        "Full app access",
        "All metrics and statistics",
        "Trading Academy included",
        "Trading plan checklist",
        "AI Assistant",
        "Economic calendar and sessions",
        "Free updates",
        "7-day guarantee"
      ],
      pay: 'Pay',
      securePayment: 'Secure payment',
      guarantee7Days: '7-day guarantee',
      // FAQ
      faq: 'Frequently',
      frequent: 'Asked Questions',
      faqs: [
        { q: "How do I get access after paying?", a: "When paying with PayPal, use the same email you'll use to sign in with Google. Your access is automatically activated in 1-2 minutes. Just click 'Login' and select Google." },
        { q: "What plans are available?", a: "We have 4 plans: 1 Month ($10), 3 Months ($20), 1 Year ($50) and Lifetime ($100). All include full access to all features." },
        { q: "Does it work for Forex, Futures, Crypto?", a: "Yes, it works for any market. You can log trades from Forex, Futures, Stocks, Crypto, Binary Options and more." },
        { q: "Is my data secure?", a: "Absolutely. We use Firebase with bank-level encryption. Your data is private and only you can see it." },
        { q: "Is there a refund guarantee?", a: "Yes, you have 7 days to try the app. If you're not convinced, we'll refund 100% of your money, no questions asked." },
        { q: "Can I use it on my phone?", a: "Yes, the app is 100% responsive. It works perfectly on computer, tablet and phone." }
      ],
      // CTA
      readyToBe: 'Ready to be',
      profitable: 'profitable',
      joinTraders: 'Join the traders who already use data to improve. Your future self will thank you.',
      // Footer
      allRightsReserved: 'All rights reserved.',
      terms: 'Terms',
      privacy: 'Privacy',
      contact: 'Contact',
      // Terms modal
      termsAndConditions: 'Terms and Conditions',
      understood: 'Understood',
      lastUpdated: 'Last updated: January 2025',
      termsContent: [
        { title: '1. Acceptance of Terms', text: 'By accessing and using Trading Journal PRO, you accept these terms and conditions in full. If you disagree with any part, you must not use our service.' },
        { title: '2. Service Description', text: 'Trading Journal PRO is a web application designed to help traders log, analyze, and improve their trading through tracking metrics and statistics.' },
        { title: '3. Registration and Account', text: 'To access the service you must create an account using Google Sign-In. You are responsible for maintaining the confidentiality of your account and all activities that occur under it.' },
        { title: '4. Payments and Refunds', text: 'Access to Trading Journal PRO requires a one-time payment. We offer a 7-day money-back guarantee from the date of purchase. To request a refund, contact our support.' },
        { title: '5. Acceptable Use', text: 'You agree to use the service only for lawful purposes and in accordance with these terms. You must not attempt to access other users\' accounts or interfere with the operation of the service.' },
        { title: '6. Data Privacy', text: 'Your trading data is private and only you can access it. We use Firebase with encryption to protect your information. We do not sell or share your data with third parties.' },
        { title: '7. Limitation of Liability', text: 'Trading Journal PRO is a logging and analysis tool. We do not provide financial advice nor guarantee trading results. Investment decisions are your sole responsibility.' },
        { title: '8. Modifications', text: 'We reserve the right to modify these terms at any time. Changes will be effective upon publication in the application.' },
        { title: '9. Contact', text: 'For any questions about these terms, contact us at:' }
      ],
    }
  };
  const t = labels[language];

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

  const featureIcons = [
    { icon: <LineChart className="w-7 h-7" />, gradient: "from-blue-500 to-cyan-500" },
    { icon: <BarChart3 className="w-7 h-7" />, gradient: "from-purple-500 to-pink-500" },
    { icon: <Target className="w-7 h-7" />, gradient: "from-emerald-500 to-teal-500" },
    { icon: <Calendar className="w-7 h-7" />, gradient: "from-orange-500 to-amber-500" },
    { icon: <PieChart className="w-7 h-7" />, gradient: "from-rose-500 to-red-500" },
    { icon: <Clock className="w-7 h-7" />, gradient: "from-indigo-500 to-violet-500" },
    { icon: <Bot className="w-7 h-7" />, gradient: "from-purple-500 to-fuchsia-500" },
    { icon: <GraduationCap className="w-7 h-7" />, gradient: "from-amber-500 to-orange-500" },
    { icon: <CheckCircle2 className="w-7 h-7" />, gradient: "from-green-500 to-emerald-500" }
  ];

  const problemIcons = [
    <HelpCircle className="w-5 h-5" />,
    <Repeat className="w-5 h-5" />,
    <TrendingDown className="w-5 h-5" />,
    <Brain className="w-5 h-5" />,
    <AlertTriangle className="w-5 h-5" />,
    <BarChart className="w-5 h-5" />
  ];

  const handlePayPal = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      window.open(plan.paypalLink, '_blank');
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  // Botón para Hero - Prueba gratis
  const TrialButton = ({ className = '' }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition-all duration-500" />
      <button
        onClick={onLogin}
        className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden border border-blue-400/50 shadow-lg shadow-blue-500/20 px-5 sm:px-8 py-3 sm:py-4"
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
        <div className="relative flex items-center justify-center gap-2 sm:gap-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-base sm:text-lg font-black">{t.trialButton}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
          <span className="text-sm sm:text-base font-black">{language === 'es' ? 'Comprar' : 'Buy'}</span>
        </div>
      </button>
    </div>
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
          <h3 className="text-lg font-bold text-white">{t.termsAndConditions}</h3>
          <button
            onClick={() => setShowTerms(false)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-slate-300 space-y-4">
          <p className="text-slate-400 text-xs">{t.lastUpdated}</p>

          {t.termsContent.map((section, i) => (
            <section key={i}>
              <h4 className="font-bold text-white mb-2">{section.title}</h4>
              <p>
                {section.text}
                {i === t.termsContent.length - 1 && (
                  <> <a href="mailto:tmsolucionesdigitales@gmail.com" className="text-emerald-400 hover:underline">tmsolucionesdigitales@gmail.com</a></>
                )}
              </p>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setShowTerms(false)}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            {t.understood}
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

          {/* Language + Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition-colors"
            >
              <Globe size={14} />
              {language === 'es' ? 'ES' : 'EN'}
            </button>
            <button
              onClick={onLogin}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.login}</span>
            </button>
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
              <span className="text-emerald-400 text-xs sm:text-sm font-medium">{t.tradersUsing}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight px-2">
              {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">{t.heroTitle2}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{t.heroTitle3}</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-400 max-w-xl mx-auto mb-6 sm:mb-8 px-4">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
              <TrialButton />
              <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                {t.noCreditCard}
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
              <span className="text-red-400 text-xs font-medium">{t.theProblem}</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold">
              {t.soundsFamiliar.split(' ')[0]} <span className="text-red-400">{t.soundsFamiliar.split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            {t.problems.map((problemText, i) => (
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
                      {problemIcons[i]}
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm font-medium flex-1">{problemText}</p>

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
              <span className="text-emerald-400 text-xs font-medium">{t.theSolution}</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Trading Journal PRO</span>
            </h2>
            <p className="text-sm sm:text-lg text-slate-400 px-4">
              {t.solutionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {t.features.map((feature, i) => (
              <div
                key={i}
                className="group relative"
              >
                {/* Efecto glow en hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${featureIcons[i].gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-40 blur-sm transition-opacity duration-300`} />

                {/* Card */}
                <div className="relative p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm border border-slate-800 group-hover:border-slate-700 rounded-xl sm:rounded-2xl transition-all duration-300 h-full">
                  {/* Icono colorido */}
                  <div className={`w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br ${featureIcons[i].gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 text-white shadow-lg group-hover:scale-110 group-hover:rotate-2 transition-all duration-300`}>
                    {featureIcons[i].icon}
                  </div>

                  <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2 text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>

                  {/* Decoración sutil */}
                  <div className={`absolute top-3 right-3 w-16 h-16 bg-gradient-to-br ${featureIcons[i].gradient} rounded-full opacity-5 blur-xl`} />
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
                    <span className="text-amber-400 text-xs font-medium">{t.newFeature}</span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">
                    {t.fundingSimulator}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">{t.fundingTest}</span>
                  </h2>

                  <p className="text-slate-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                    {t.fundingDesc} <span className="text-amber-400 font-medium">{t.beforeRiskingMoney}</span>
                  </p>

                  <div className="space-y-2">
                    {t.fundingFeatures.map((item, i) => (
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
                        <span className="text-slate-400">{t.profitTarget}</span>
                        <span className="text-emerald-400 font-bold">72%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/50">
                        <p className="text-slate-500 text-[10px] uppercase">{t.balance}</p>
                        <p className="text-white font-bold text-sm">$107,200</p>
                      </div>
                      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/50">
                        <p className="text-slate-500 text-[10px] uppercase">{t.ddTotal}</p>
                        <p className="text-emerald-400 font-bold text-sm">1.8%</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                      <p className="text-emerald-400 text-xs font-bold">{t.challengeInProgress}</p>
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
                {t.convertData} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{t.dataToProfit}</span>
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {t.benefits.map((benefit, i) => (
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
                  { label: t.winRate, value: "68%", color: "from-emerald-400 to-teal-400" },
                  { label: t.profitFactor, value: "2.4", color: "from-blue-400 to-cyan-400" },
                  { label: t.totalPoints, value: "+1,250", color: "from-cyan-400 to-blue-400" },
                  { label: t.bestDay, value: "+$847", color: "from-purple-400 to-pink-400" },
                  { label: t.growth, value: "+24.5%", color: "from-orange-400 to-amber-400" }
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
              {t.whatTradersSay} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{t.traders}</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-base">
              {t.realResults}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {t.testimonials.map((testimonial, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <span>{testimonial.flag}</span> {testimonial.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  "{testimonial.quote} <span className="text-emerald-400 font-medium">{testimonial.highlight}</span>{testimonial.suffix ? ` ${testimonial.suffix}` : ''}"
                </p>
                <p className="text-slate-500 text-xs">{testimonial.footer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PRECIO - CON PLANES ==================== */}
      <section id="planes-section" className="py-12 sm:py-20 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              {t.investInYour} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{t.success}</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              {t.choosePlan}
            </p>
          </div>

          <div className="relative">
            {/* Glow animado */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-[1.5rem] sm:rounded-[2rem] blur-xl opacity-30 animate-pulse" />

            <div className="relative bg-gradient-to-b from-slate-800/95 to-slate-900/95 border border-emerald-500/30 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 text-center backdrop-blur-sm">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 text-xs font-bold rounded-full mb-4 sm:mb-6 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                {t.choosePlanBadge}
              </div>

              {/* Selector de Planes - Cards */}
              <div className="space-y-2 sm:space-y-3 mb-6">
                {plans.map((plan) => {
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
                          <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${isSelected ? 'text-purple-300' : 'text-purple-400'}`}>
                            <GraduationCap size={10} />
                            <span>{plan.aiQueries} {t.aiAnalysisDay}</span>
                          </div>
                        </div>
                      </div>

                      {/* Precio y badge */}
                      <div className="flex items-center gap-2">
                        {plan.popular && (
                          <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            {t.popular}
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
                {t.pricingFeatures.map((item, i) => (
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
                    <span className="text-base sm:text-lg font-black">{t.pay} ${selectedPlanData?.price} USD</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Trust */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 text-slate-500 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {t.securePayment}
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t.guarantee7Days}
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
            {t.faq} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{t.frequent}</span>
          </h2>

          <div className="space-y-2 sm:space-y-3">
            {t.faqs.map((faq, i) => (
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
            {t.readyToBe} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{t.profitable}</span>?
          </h2>
          <p className="text-sm sm:text-lg text-slate-400 mb-6 sm:mb-8">
            {t.joinTraders}
          </p>
          <div className="flex justify-center">
            <TrialButton />
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
            © 2025 Trading Journal PRO. {t.allRightsReserved}
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
            <button onClick={() => setShowTerms(true)} className="hover:text-blue-600 transition-colors">{t.terms}</button>
            <button onClick={() => setShowTerms(true)} className="hover:text-blue-600 transition-colors">{t.privacy}</button>
            <a href="mailto:tmsolucionesdigitales@gmail.com" className="hover:text-blue-600 transition-colors">{t.contact}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}