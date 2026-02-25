"use client";
import { useState, useEffect } from 'react';
import { PlusCircle, Save, Camera, X, ToggleLeft, ToggleRight, Percent, ClipboardCheck, CheckCircle, AlertTriangle, XCircle, Bot, Loader2, Eye, Trash2, Globe, Search, TrendingUp, TrendingDown, History, ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import TradeChecklist from './TradeChecklist';
import PreTradeResultModal from './PreTradeResultModal';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, collection, addDoc, query, where, orderBy, limit, getDocs, deleteDoc } from 'firebase/firestore';

// AI Query limits by plan
const AI_QUERY_LIMITS = {
  trial: 5,
  '1month': 5,
  '3months': 10,
  '1year': 20,
  lifetime: 30,
  paid: 30,
};

const TEMPORALIDADES = ['1D', '4H', '1H', '30M', '15M', '5M', '1M', 'Ejecución'];

// 📊 ACTIVOS ORGANIZADOS POR CATEGORÍA
const ACTIVOS_POR_CATEGORIA = {
  'Índices US': [
    { symbol: 'MNQ', name: 'Micro Nasdaq' },
    { symbol: 'MES', name: 'Micro S&P 500' },
    { symbol: 'NQ', name: 'Nasdaq 100' },
    { symbol: 'ES', name: 'S&P 500' },
    { symbol: 'YM', name: 'Dow Jones' },
    { symbol: 'MYM', name: 'Micro Dow' },
    { symbol: 'RTY', name: 'Russell 2000' },
    { symbol: 'M2K', name: 'Micro Russell' },
  ],
  'Índices Globales': [
    { symbol: 'DAX', name: 'DAX 40 (Alemania)' },
    { symbol: 'FTSE', name: 'FTSE 100 (UK)' },
    { symbol: 'CAC', name: 'CAC 40 (Francia)' },
    { symbol: 'NIKKEI', name: 'Nikkei 225' },
    { symbol: 'HSI', name: 'Hang Seng' },
  ],
  'Forex Majors': [
    { symbol: 'EUR/USD', name: 'Euro/Dólar' },
    { symbol: 'GBP/USD', name: 'Libra/Dólar' },
    { symbol: 'USD/JPY', name: 'Dólar/Yen' },
    { symbol: 'USD/CHF', name: 'Dólar/Franco' },
    { symbol: 'AUD/USD', name: 'Aussie/Dólar' },
    { symbol: 'USD/CAD', name: 'Dólar/Canadá' },
    { symbol: 'NZD/USD', name: 'Kiwi/Dólar' },
  ],
  'Forex Crosses': [
    { symbol: 'EUR/GBP', name: 'Euro/Libra' },
    { symbol: 'EUR/JPY', name: 'Euro/Yen' },
    { symbol: 'GBP/JPY', name: 'Libra/Yen' },
    { symbol: 'AUD/JPY', name: 'Aussie/Yen' },
    { symbol: 'EUR/AUD', name: 'Euro/Aussie' },
    { symbol: 'GBP/AUD', name: 'Libra/Aussie' },
  ],
  'Forex Exóticos': [
    { symbol: 'USD/MXN', name: 'Dólar/Peso MX' },
    { symbol: 'EUR/MXN', name: 'Euro/Peso MX' },
    { symbol: 'USD/BRL', name: 'Dólar/Real' },
    { symbol: 'USD/ZAR', name: 'Dólar/Rand' },
    { symbol: 'USD/TRY', name: 'Dólar/Lira' },
  ],
  'Metales': [
    { symbol: 'XAU/USD', name: 'Oro' },
    { symbol: 'XAG/USD', name: 'Plata' },
    { symbol: 'GC', name: 'Oro Futuros' },
    { symbol: 'MGC', name: 'Micro Oro' },
    { symbol: 'SI', name: 'Plata Futuros' },
  ],
  'Energía': [
    { symbol: 'WTI', name: 'Petróleo WTI' },
    { symbol: 'BRENT', name: 'Petróleo Brent' },
    { symbol: 'CL', name: 'Crudo Futuros' },
    { symbol: 'MCL', name: 'Micro Crudo' },
    { symbol: 'NG', name: 'Gas Natural' },
  ],
  'Crypto': [
    { symbol: 'BTC/USD', name: 'Bitcoin' },
    { symbol: 'ETH/USD', name: 'Ethereum' },
    { symbol: 'MBT', name: 'Micro Bitcoin CME' },
    { symbol: 'SOL/USD', name: 'Solana' },
    { symbol: 'XRP/USD', name: 'Ripple' },
    { symbol: 'BNB/USD', name: 'Binance Coin' },
    { symbol: 'ADA/USD', name: 'Cardano' },
  ],
  'Weltrade - PainX': [
    { symbol: 'PainX400', name: 'Pain X 400' },
    { symbol: 'PainX600', name: 'Pain X 600' },
    { symbol: 'PainX800', name: 'Pain X 800' },
    { symbol: 'PainX999', name: 'Pain X 999' },
    { symbol: 'PainX1200', name: 'Pain X 1200' },
  ],
  'Weltrade - GainX': [
    { symbol: 'GainX400', name: 'Gain X 400' },
    { symbol: 'GainX600', name: 'Gain X 600' },
    { symbol: 'GainX800', name: 'Gain X 800' },
    { symbol: 'GainX999', name: 'Gain X 999' },
    { symbol: 'GainX1200', name: 'Gain X 1200' },
  ],
  'Weltrade - FlipX': [
    { symbol: 'FlipX1', name: 'Flip X 1 (step 1)' },
    { symbol: 'FlipX2', name: 'Flip X 2 (step 1-2)' },
    { symbol: 'FlipX3', name: 'Flip X 3 (step 1-3)' },
    { symbol: 'FlipX4', name: 'Flip X 4 (step 1-4)' },
    { symbol: 'FlipX5', name: 'Flip X 5 (step 1-5)' },
  ],
  'Weltrade - SwitchX': [
    { symbol: 'SwitchX600', name: 'Switch X 600' },
    { symbol: 'SwitchX1200', name: 'Switch X 1200' },
    { symbol: 'SwitchX1800', name: 'Switch X 1800' },
  ],
  'Weltrade - BreakX': [
    { symbol: 'BreakX600', name: 'Break X 600' },
    { symbol: 'BreakX1200', name: 'Break X 1200' },
    { symbol: 'BreakX1800', name: 'Break X 1800' },
  ],
  'Weltrade - TrendX': [
    { symbol: 'TrendX600', name: 'Trend X 600' },
    { symbol: 'TrendX1200', name: 'Trend X 1200' },
    { symbol: 'TrendX1800', name: 'Trend X 1800' },
  ],
  'Weltrade - FX Vol': [
    { symbol: 'FXVol20', name: 'FX Vol 20' },
    { symbol: 'FXVol40', name: 'FX Vol 40' },
    { symbol: 'FXVol60', name: 'FX Vol 60' },
    { symbol: 'FXVol80', name: 'FX Vol 80' },
    { symbol: 'FXVol99', name: 'FX Vol 99' },
  ],
  'Weltrade - SFX Vol': [
    { symbol: 'SFXVol20', name: 'SFX Vol 20 (spikes)' },
    { symbol: 'SFXVol40', name: 'SFX Vol 40 (spikes)' },
    { symbol: 'SFXVol60', name: 'SFX Vol 60 (spikes)' },
    { symbol: 'SFXVol80', name: 'SFX Vol 80 (spikes)' },
    { symbol: 'SFXVol99', name: 'SFX Vol 99 (spikes)' },
  ],
};

// Admin emails with unlimited AI queries
const UNLIMITED_AI_EMAILS = [
  'tonytrader19@gmail.com',
];

export default function TradeForm({
  onSubmit,
  form,
  setForm,
  activosFavoritos = [],
  reglasSetup = [],
  cuentasBroker = [],
  userId,
  userEmail,
  userType,
  userPlan,
  trades = [],
}) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [imagenes, setImagenes] = useState([]);
  const [isBinaryOptions, setIsBinaryOptions] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  // Pre-trade AI analysis state (up to 3 images for different timeframes)
  const [preTradeImages, setPreTradeImages] = useState([]);
  const [preTradeDescription, setPreTradeDescription] = useState('');
  const [preTradeAnalysis, setPreTradeAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreTradeSection, setShowPreTradeSection] = useState(false);

  // Pre-trade enhanced inputs
  const [preTradeAsset, setPreTradeAsset] = useState('');
  const [preTradeTimeframe, setPreTradeTimeframe] = useState('15M');
  const [preTradeSession, setPreTradeSession] = useState('auto');
  const [preTradeDirection, setPreTradeDirection] = useState('Long');
  const [showPreTradeModal, setShowPreTradeModal] = useState(false);

  // Pre-trade history
  const [preTradeHistory, setPreTradeHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // AI query tracking
  const [aiQueriesUsed, setAiQueriesUsed] = useState(0);
  const [aiQueriesLimit, setAiQueriesLimit] = useState(5);

  // Check if user has unlimited AI queries
  const hasUnlimitedQueries = () => {
    if (!userEmail) return false;
    return UNLIMITED_AI_EMAILS.includes(userEmail.toLowerCase());
  };

  // Get AI query limit based on user plan
  const getQueryLimit = () => {
    // Unlimited for admin emails
    if (hasUnlimitedQueries()) return 999999;
    if (userType === 'lifetime' || userType === 'paid') return AI_QUERY_LIMITS.lifetime;
    if (userType === 'trial') return AI_QUERY_LIMITS.trial;
    if (userType === 'subscription' && userPlan) {
      return AI_QUERY_LIMITS[userPlan] || AI_QUERY_LIMITS.trial;
    }
    return AI_QUERY_LIMITS.trial;
  };

  // Get today's date string for tracking
  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Load AI query count (pre-trade uses separate counter)
  useEffect(() => {
    const loadQueryCount = async () => {
      if (!userId) return;

      const limit = getQueryLimit();
      setAiQueriesLimit(limit);

      try {
        const todayKey = getTodayKey();
        const queryDocRef = doc(db, 'ai_queries_pretrade', `${userId}_${todayKey}`);
        const queryDoc = await getDoc(queryDocRef);

        if (queryDoc.exists()) {
          setAiQueriesUsed(queryDoc.data().count || 0);
        } else {
          setAiQueriesUsed(0);
        }
      } catch (error) {
        console.error('Error loading AI query count:', error);
        setAiQueriesUsed(0);
      }
    };

    loadQueryCount();
  }, [userId, userType, userPlan]);

  // Reset pre-trade states when form is reset (after saving a trade)
  useEffect(() => {
    if (form.preTradeAnalysis === null && form.preTradeImages === null) {
      setPreTradeImages([]);
      setPreTradeDescription('');
      setPreTradeAnalysis(null);
      setShowPreTradeSection(false);
      setPreTradeAsset('');
      setPreTradeTimeframe('15M');
      setPreTradeSession('auto');
      setPreTradeDirection('Long');
    }
  }, [form.preTradeAnalysis, form.preTradeImages]);

  // Sync preTradeAsset with form.activo when it changes (if preTradeAsset is empty)
  useEffect(() => {
    if (!preTradeAsset && form.activo) {
      setPreTradeAsset(form.activo);
    }
  }, [form.activo]);

  // Load pre-trade history
  useEffect(() => {
    const loadPreTradeHistory = async () => {
      if (!userId) return;
      try {
        const q = query(
          collection(db, 'pretrade_analyses'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPreTradeHistory(history);
      } catch (error) {
        console.error('Error loading pre-trade history:', error);
      }
    };
    loadPreTradeHistory();
  }, [userId]);

  // Save pre-trade analysis to history
  const savePreTradeToHistory = async (analysisData) => {
    if (!userId) return;
    try {
      const docRef = await addDoc(collection(db, 'pretrade_analyses'), {
        userId,
        asset: analysisData.asset,
        direction: analysisData.direction,
        timeframe: analysisData.timeframe,
        session: analysisData.session,
        analysis: analysisData.analysis,
        imagePreview: analysisData.imagePreview, // First image as thumbnail
        createdAt: new Date().toISOString(),
      });
      // Refresh history
      setPreTradeHistory(prev => [{
        id: docRef.id,
        userId,
        asset: analysisData.asset,
        direction: analysisData.direction,
        timeframe: analysisData.timeframe,
        session: analysisData.session,
        analysis: analysisData.analysis,
        imagePreview: analysisData.imagePreview,
        createdAt: new Date().toISOString(),
      }, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error saving pre-trade analysis:', error);
    }
  };

  // Delete pre-trade analysis from history
  const deletePreTradeFromHistory = async (analysisId) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'pretrade_analyses', analysisId));
      setPreTradeHistory(prev => prev.filter(item => item.id !== analysisId));
    } catch (error) {
      console.error('Error deleting pre-trade analysis:', error);
    }
  };

  // Load a previous analysis
  const loadPreTradeFromHistory = (analysis) => {
    setPreTradeAsset(analysis.asset);
    setPreTradeDirection(analysis.direction);
    setPreTradeTimeframe(analysis.timeframe);
    setPreTradeAnalysis({ text: analysis.analysis });
    setShowHistory(false);
    setShowPreTradeModal(true);
  };

  // Reset local imagenes state when form.imagenes is cleared (after saving a trade)
  useEffect(() => {
    if (form.imagenes && form.imagenes.length === 0 && imagenes.length > 0) {
      setImagenes([]);
    }
  }, [form.imagenes]);

  // Increment AI query count (pre-trade uses separate counter)
  const incrementQueryCount = async () => {
    if (!userId) {
      console.warn('incrementQueryCount: No userId available');
      return;
    }

    // Immediately update local state for instant UI feedback
    setAiQueriesUsed(prev => prev + 1);

    try {
      const todayKey = getTodayKey();
      const queryDocRef = doc(db, 'ai_queries_pretrade', `${userId}_${todayKey}`);

      const currentDoc = await getDoc(queryDocRef);
      const currentCount = currentDoc.exists() ? (currentDoc.data().count || 0) : 0;
      const newCount = currentCount + 1;

      await setDoc(queryDocRef, {
        userId,
        date: todayKey,
        count: newCount,
        lastQuery: new Date().toISOString(),
      });

      // Sync with actual Firestore count (in case of discrepancy)
      setAiQueriesUsed(newCount);
      console.log(`AI Pre-Trade query count updated: ${newCount}/${aiQueriesLimit}`);
    } catch (error) {
      console.error('Error updating AI query count:', error);
      // Revert local state on error using functional update
      setAiQueriesUsed(prev => Math.max(0, prev - 1));
    }
  };

  // Traducciones
  const labels = {
    es: {
      title: 'Registrar Trade',
      checklist: 'Checklist de Setup',
      validSetup: 'Setup válido',
      caution: 'Precaución',
      dontTrade: 'No operar',
      rules: 'reglas',
      binaryOptions: 'Opciones Binarias',
      asset: 'Activo',
      myAssets: '★ Mis Activos ★',
      direction: 'Dirección',
      prediction: 'Predicción',
      amountInvested: 'Monto Invertido ($)',
      payoutPercent: 'Porcentaje de Pago',
      result: 'Resultado',
      calculatedPL: 'P&L Calculado',
      lotsContracts: 'Lotes/Contratos',
      entry: 'Entrada',
      exit: 'Salida',
      price: 'Precio',
      points: 'Puntos',
      emotionalState: 'Estado Emocional',
      emotions: {
        neutral: '😐 Neutral',
        calm: '😌 Calmado',
        anxious: '😰 Ansioso',
        revenge: '😤 Venganza',
        fear: '😨 Miedo',
        euphoric: '🤑 Eufórico',
        frustrated: '😔 Frustrado',
      },
      notes: 'Notas (opcional)',
      notesPlaceholder: 'Observaciones del trade...',
      screenshots: 'Captura (opcional)',
      timeframe: 'Temporalidad',
      addScreenshot: 'Agregar captura',
      addAnother: 'Agregar otra captura',
      saveTrade: 'Guardar Trade',
      maxImages: 'Máximo 1 imagen por trade',
      imageTooLarge: 'La imagen es muy grande (max 5MB)',
      imageError: 'Error al procesar la imagen',
      tradeTime: 'Hora del Trade',
      entryDate: 'Fecha de Entrada',
      exitDate: 'Fecha de Cierre',
      swingTrade: 'Swing Trade (multi-día)',
      swapCommission: 'Swap/Comisión',
      swapHint: 'Cargo por mantener posición overnight',
      brokerAccount: 'Cuenta',
      selectAccount: 'Selecciona una cuenta',
      noAccounts: 'Sin cuenta asignada',
      preTradeAnalysis: 'Análisis Pre-Trade',
      preTradeDesc: 'Sube hasta 3 capturas (diferentes temporalidades) para un análisis más completo',
      analyzeBeforeTrading: 'IA Pre Trade',
      analyzing: 'Analizando...',
      aiMentor: 'Mentor IA',
      queriesRemaining: 'consultas restantes',
      basedOnHistory: 'Basado en tu historial',
      noQueriesLeft: 'Sin consultas disponibles hoy',
      uploadPreTrade: 'Agregar imagen',
      addMoreImages: 'Agregar otra temporalidad',
      hidePreTrade: 'Ocultar análisis pre-trade',
      showPreTrade: 'IA Pre Trade',
      preTradeDescLabel: '¿Qué ves en el gráfico?',
      preTradeDescPlaceholder: 'Describe lo que ves: estructura, patrones, zonas de interés, tu emoción actual, por qué quieres entrar...',
      preTradeDescHint: 'Cuanto más detallado, mejor retroalimentación recibirás',
      imagesCount: 'imágenes',
      selectTimeframe: 'Temporalidad',
      preTradeAsset: 'Activo a analizar',
      preTradeTimeframe: 'Temporalidad principal',
      marketSession: 'Sesión de mercado',
      sentimentSearch: 'Buscando sentimiento de mercado...',
      analysisType: 'Tipo de análisis',
      technicalOnly: 'Solo técnico',
      withSentiment: 'Con sentimiento de mercado',
      marketOpen: 'Mercado activo',
      marketClosed: 'Mercado cerrado',
      sessionInfo: 'La sesión afecta la volatilidad y liquidez del activo',
    },
    en: {
      title: 'Record Trade',
      checklist: 'Setup Checklist',
      validSetup: 'Valid setup',
      caution: 'Caution',
      dontTrade: 'Don\'t trade',
      rules: 'rules',
      binaryOptions: 'Binary Options',
      asset: 'Asset',
      myAssets: '★ My Assets ★',
      direction: 'Direction',
      prediction: 'Prediction',
      amountInvested: 'Amount Invested ($)',
      payoutPercent: 'Payout Percentage',
      result: 'Result',
      calculatedPL: 'Calculated P&L',
      lotsContracts: 'Lots/Contracts',
      entry: 'Entry',
      exit: 'Exit',
      price: 'Price',
      points: 'Points',
      emotionalState: 'Emotional State',
      emotions: {
        neutral: '😐 Neutral',
        calm: '😌 Calm',
        anxious: '😰 Anxious',
        revenge: '😤 Revenge',
        fear: '😨 Fear',
        euphoric: '🤑 Euphoric',
        frustrated: '😔 Frustrated',
      },
      notes: 'Notes (optional)',
      notesPlaceholder: 'Trade observations...',
      screenshots: 'Screenshot (optional)',
      timeframe: 'Timeframe',
      addScreenshot: 'Add screenshot',
      addAnother: 'Add another screenshot',
      saveTrade: 'Save Trade',
      maxImages: 'Maximum 1 image per trade',
      imageTooLarge: 'Image is too large (max 5MB)',
      imageError: 'Error processing image',
      tradeTime: 'Trade Time',
      entryDate: 'Entry Date',
      exitDate: 'Exit Date',
      swingTrade: 'Swing Trade (multi-day)',
      swapCommission: 'Swap/Commission',
      swapHint: 'Overnight position charge',
      brokerAccount: 'Account',
      selectAccount: 'Select an account',
      noAccounts: 'No account assigned',
      preTradeAnalysis: 'Pre-Trade Analysis',
      preTradeDesc: 'Upload up to 3 screenshots (different timeframes) for a more complete analysis',
      analyzeBeforeTrading: 'AI Pre Trade',
      analyzing: 'Analyzing...',
      aiMentor: 'AI Mentor',
      queriesRemaining: 'queries remaining',
      basedOnHistory: 'Based on your history',
      noQueriesLeft: 'No queries available today',
      uploadPreTrade: 'Add image',
      addMoreImages: 'Add another timeframe',
      hidePreTrade: 'Hide pre-trade analysis',
      showPreTrade: 'AI Pre Trade',
      preTradeDescLabel: 'What do you see in the chart?',
      preTradeDescPlaceholder: 'Describe what you see: structure, patterns, zones of interest, your current emotion, why you want to enter...',
      preTradeDescHint: 'The more detailed, the better feedback you\'ll receive',
      imagesCount: 'images',
      selectTimeframe: 'Timeframe',
      preTradeAsset: 'Asset to analyze',
      preTradeTimeframe: 'Primary timeframe',
      marketSession: 'Market session',
      sentimentSearch: 'Searching market sentiment...',
      analysisType: 'Analysis type',
      technicalOnly: 'Technical only',
      withSentiment: 'With market sentiment',
      marketOpen: 'Market active',
      marketClosed: 'Market closed',
      sessionInfo: 'The session affects asset volatility and liquidity',
    },
  };
  const t = labels[language];

  // Get current time as default
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Detect current market session based on UTC time
  const detectMarketSession = () => {
    const now = new Date();
    const utcHour = now.getUTCHours();

    // Market sessions in UTC:
    // Asian (Tokyo): 00:00 - 09:00 UTC
    // European (London): 07:00 - 16:00 UTC
    // American (NY): 13:00 - 22:00 UTC

    // Overlaps:
    // Asian-European: 07:00 - 09:00 UTC
    // European-American: 13:00 - 16:00 UTC

    if (utcHour >= 0 && utcHour < 7) return 'asian';
    if (utcHour >= 7 && utcHour < 9) return 'asian-european';
    if (utcHour >= 9 && utcHour < 13) return 'european';
    if (utcHour >= 13 && utcHour < 16) return 'european-american';
    if (utcHour >= 16 && utcHour < 22) return 'american';
    return 'asian'; // 22:00-00:00 early Asian
  };

  // Get current session for display
  const getCurrentSession = () => {
    if (preTradeSession === 'auto') {
      return detectMarketSession();
    }
    return preTradeSession;
  };

  // Session labels
  const getSessionLabel = (session) => {
    const sessionLabels = {
      es: {
        'asian': 'Asiática (Tokyo)',
        'european': 'Europea (Londres)',
        'american': 'Americana (NY)',
        'asian-european': 'Asia-Europa (Overlap)',
        'european-american': 'Europa-América (Overlap)',
        'auto': 'Auto-detectar'
      },
      en: {
        'asian': 'Asian (Tokyo)',
        'european': 'European (London)',
        'american': 'American (NY)',
        'asian-european': 'Asia-Europe (Overlap)',
        'european-american': 'Europe-America (Overlap)',
        'auto': 'Auto-detect'
      }
    };
    return sessionLabels[language][session] || session;
  };

  // Usar activos favoritos si existen, sino mostrar lista por defecto
  const tieneActivosFavoritos = activosFavoritos && activosFavoritos.length > 0;
  
  // Validar que haya un resultado
  const canSubmit = isBinaryOptions 
    ? form.montoInvertido !== '' && form.montoInvertido > 0
    : form.res !== '' && form.res !== null && form.res !== undefined;

  // Toggle opciones binarias
  const handleBinaryToggle = () => {
    setIsBinaryOptions(!isBinaryOptions);
    // Resetear campos específicos
    setForm(prev => ({
      ...prev,
      res: '',
      montoInvertido: '',
      porcentajePago: 80,
      resultadoBinario: 'win'
    }));
  };

  // Calcular P&L para opciones binarias
  const calcularPLBinario = () => {
    const monto = parseFloat(form.montoInvertido) || 0;
    const pago = parseFloat(form.porcentajePago) || 80;
    
    if (form.resultadoBinario === 'win') {
      return (monto * (pago / 100)).toFixed(2);
    } else {
      return (-monto).toFixed(2);
    }
  };

  // Comprimir imagen
  const compressImage = (file, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.onerror = () => reject(new Error('Error cargando imagen'));
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height && width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else if (height > maxWidth) {
              width = (width * maxWidth) / height;
              height = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } catch (err) {
            reject(err);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const agregarImagen = async (file) => {
    if (!file) return;
    if (imagenes.length >= 1) {
      alert(t.maxImages);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t.imageTooLarge);
      return;
    }
    try {
      const compressed = await compressImage(file);
      const nuevasImagenes = [...imagenes, { data: compressed, temporalidad: '1H' }];
      setImagenes(nuevasImagenes);
      setForm(prev => ({ ...prev, imagenes: nuevasImagenes }));
    } catch (error) {
      console.error('Error procesando imagen:', error);
      alert(t.imageError);
    }
  };

  const handleTemporalidadChange = (index, temporalidad) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index] = { ...nuevasImagenes[index], temporalidad };
    setImagenes(nuevasImagenes);
    setForm(prev => ({ ...prev, imagenes: nuevasImagenes }));
  };

  const removeImage = (index) => {
    const nuevasImagenes = imagenes.filter((_, i) => i !== index);
    setImagenes(nuevasImagenes);
    setForm(prev => ({ ...prev, imagenes: nuevasImagenes }));
  };

  const handleChecklistConfirm = (resultado) => {
    setForm(prev => ({ ...prev, checklist: resultado }));
  };

  // Pre-trade image handling (up to 3 images)
  const handlePreTradeImage = async (file, timeframe = '15M') => {
    if (!file) return;
    if (preTradeImages.length >= 3) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(t.imageTooLarge);
      return;
    }
    try {
      const compressed = await compressImage(file);
      setPreTradeImages(prev => [...prev, { base64: compressed, timeframe }]);
      setPreTradeAnalysis(null);
    } catch (error) {
      console.error('Error processing pre-trade image:', error);
      alert(t.imageError);
    }
  };

  const updatePreTradeImageTimeframe = (index, timeframe) => {
    setPreTradeImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], timeframe };
      return updated;
    });
  };

  const removePreTradeImage = (index) => {
    setPreTradeImages(prev => prev.filter((_, i) => i !== index));
    if (preTradeImages.length === 1) {
      setPreTradeDescription('');
      setPreTradeAnalysis(null);
    }
  };

  const clearAllPreTradeImages = () => {
    setPreTradeImages([]);
    setPreTradeDescription('');
    setPreTradeAnalysis(null);
  };

  // Get trade history for this asset
  const getAssetHistory = () => {
    if (!trades || trades.length === 0) return [];
    return trades
      .filter(t => t.activo === form.activo)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 10)
      .map(t => ({
        fecha: t.fecha,
        dir: t.dir,
        res: t.res,
        puntos: t.puntos,
        emo: t.emo,
        notas: t.notas,
        aiAnalysis: t.aiAnalysis || t.postTradeAnalysis,
      }));
  };

  // Analyze pre-trade with AI (supports multiple images)
  const analyzePreTrade = async () => {
    if (preTradeImages.length === 0 || (!hasUnlimitedQueries() && aiQueriesUsed >= aiQueriesLimit)) return;

    // Require asset selection for sentiment analysis
    const assetForAnalysis = preTradeAsset || form.activo;
    if (!assetForAnalysis) {
      alert(language === 'es' ? 'Selecciona un activo para analizar' : 'Select an asset to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const assetHistory = getAssetHistory();

      // Prepare images with their timeframes
      const imagesWithTimeframes = preTradeImages.map(img => ({
        base64: img.base64,
        timeframe: img.timeframe
      }));

      // Get current session info
      const currentSession = getCurrentSession();
      const sessionLabel = getSessionLabel(currentSession);

      // Get current time info for market context
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

      const response = await fetch('/api/analyze-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Send first image for backward compatibility
          imageBase64: preTradeImages[0].base64,
          // Send all images with timeframes
          multipleImages: imagesWithTimeframes,
          tradeData: {
            activo: assetForAnalysis,
            dir: preTradeDirection,
          },
          isPreTrade: true,
          assetHistory,
          language,
          userPreTradeNotes: preTradeDescription,
          // New enhanced pre-trade data
          preTradeEnhanced: {
            asset: assetForAnalysis,
            primaryTimeframe: preTradeTimeframe,
            marketSession: currentSession,
            sessionLabel: sessionLabel,
            includeSentiment: true, // Always include sentiment
            currentTime: currentTime,
            currentDay: currentDay,
            userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        setPreTradeAnalysis({ error: data.error });
      } else {
        setPreTradeAnalysis({ text: data.analysis });
        // Save to form so it gets stored with the trade
        setForm(prev => ({
          ...prev,
          preTradeAnalysis: data.analysis,
          preTradeImages: preTradeImages.map(img => img.base64),
          preTradeDescription,
        }));
        // Increment query count
        await incrementQueryCount();
        // Save to history
        await savePreTradeToHistory({
          asset: assetForAnalysis,
          direction: preTradeDirection,
          timeframe: preTradeTimeframe,
          session: getCurrentSession(),
          analysis: data.analysis,
          imagePreview: preTradeImages[0]?.base64 || null,
        });
        // Open the modal to show results
        setShowPreTradeModal(true);
      }
    } catch (error) {
      setPreTradeAnalysis({ error: error.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = preTradeImages.length > 0 && (hasUnlimitedQueries() || aiQueriesUsed < aiQueriesLimit) && !isAnalyzing && (preTradeAsset || form.activo);

  const getChecklistSemaforo = () => {
    if (!form.checklist) return null;
    const pct = form.checklist.porcentaje;
    if (pct >= 70) return { color: 'green', label: t.validSetup, icon: CheckCircle };
    if (pct >= 50) return { color: 'amber', label: t.caution, icon: AlertTriangle };
    return { color: 'red', label: t.dontTrade, icon: XCircle };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Si es opciones binarias, calcular el resultado y pasarlo directamente
    if (isBinaryOptions) {
      const plCalculado = calcularPLBinario();
      onSubmit(e, { resCalculado: plCalculado });
    } else {
      onSubmit(e);
    }
  };
  
  return (
    <div data-tour="trade-form" className={`p-4 sm:p-6 rounded-2xl shadow-xl border transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      <h3 className={`font-bold mb-4 sm:mb-5 flex items-center text-sm uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>
        <PlusCircle size={18} className="mr-2 text-blue-500"/> {t.title}
      </h3>

      {/* Botón Checklist de Setup */}
      {reglasSetup.length > 0 && (() => {
        const semaforo = getChecklistSemaforo();
        return (
          <button
            type="button"
            onClick={() => setShowChecklist(true)}
            className={`w-full mb-4 p-3 rounded-xl border font-bold text-sm flex items-center justify-between transition-all ${
              form.checklist
                ? semaforo?.color === 'green'
                  ? 'bg-green-500/10 border-green-500/30 text-green-500'
                  : semaforo?.color === 'amber'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    : 'bg-red-500/10 border-red-500/30 text-red-500'
                : isDark
                  ? 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-amber-500 hover:text-amber-400'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-amber-500 hover:text-amber-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18}/>
              {form.checklist ? semaforo?.label : t.checklist}
            </div>
            {form.checklist ? (
              <span className="text-lg font-black">{form.checklist.porcentaje}%</span>
            ) : (
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {reglasSetup.length} {t.rules}
              </span>
            )}
          </button>
        );
      })()}

      {/* Toggle Opciones Binarias */}
      <div 
        onClick={handleBinaryToggle}
        className={`mb-4 p-3 rounded-xl border cursor-pointer transition-all ${
          isBinaryOptions 
            ? 'bg-purple-500/10 border-purple-500/50' 
            : isDark ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isBinaryOptions ? (
              <ToggleRight size={24} className="text-purple-500" />
            ) : (
              <ToggleLeft size={24} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            )}
            <span className={`text-sm font-bold ${isBinaryOptions ? 'text-purple-500' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.binaryOptions}
            </span>
          </div>
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
            isBinaryOptions 
              ? 'bg-purple-500 text-white' 
              : isDark ? 'bg-slate-600 text-slate-400' : 'bg-slate-200 text-slate-500'
          }`}>
            {isBinaryOptions ? 'ON' : 'OFF'}
          </span>
        </div>
        <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          IQ Option, Olymp Trade, Quotex, etc.
        </p>
      </div>

      {/* Pre-Trade AI Analysis Section */}
      <div className={`mb-4 rounded-xl border overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
      }`}>
        <div
          className={`w-full p-3 flex items-center justify-between transition-colors ${
            isDark ? 'hover:bg-white/5' : 'hover:bg-white/50'
          }`}
        >
          <div
            className="flex items-center gap-2 flex-1 cursor-pointer"
            onClick={() => setShowPreTradeSection(!showPreTradeSection)}
          >
            <Bot size={24} className="text-purple-500" />
            <span className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              {t.showPreTrade}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {preTradeHistory.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showPreTradeSection) setShowPreTradeSection(true);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  showHistory
                    ? 'bg-purple-500 text-white'
                    : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title={language === 'es' ? 'Historial' : 'History'}
              >
                <History size={14} />
              </button>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
            }`}>
              {hasUnlimitedQueries()
                ? (language === 'es' ? '∞ Ilimitado' : '∞ Unlimited')
                : `${aiQueriesLimit - aiQueriesUsed} ${t.queriesRemaining}`
              }
            </span>
            <span
              className={`text-xs cursor-pointer ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
              onClick={() => setShowPreTradeSection(!showPreTradeSection)}
            >
              {showPreTradeSection ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {showPreTradeSection && (
          <div className={`p-4 border-t ${isDark ? 'border-purple-500/20' : 'border-purple-200'}`}>

            {/* History list */}
            {showHistory && preTradeHistory.length > 0 && (
              <div className={`mb-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`px-3 py-2 border-b flex items-center justify-between ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <History size={12} className="inline mr-1" />
                    {language === 'es' ? 'Análisis recientes' : 'Recent analyses'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHistory(false)}
                    className={`text-xs ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {preTradeHistory.map((item) => (
                    <div
                      key={item.id}
                      className={`px-3 py-2 flex items-center gap-3 border-b last:border-0 cursor-pointer transition-colors ${
                        isDark ? 'border-slate-600 hover:bg-slate-600/50' : 'border-slate-200 hover:bg-slate-100'
                      }`}
                      onClick={() => loadPreTradeFromHistory(item)}
                    >
                      {item.imagePreview && (
                        <img
                          src={item.imagePreview}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {item.asset}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            item.direction === 'Long'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {item.direction === 'Long' ? '↑' : '↓'} {item.direction}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.timeframe} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePreTradeFromHistory(item.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-red-500/20 text-slate-500 hover:text-red-400' : 'hover:bg-red-100 text-slate-400 hover:text-red-500'
                        }`}
                      >
                        <Trash2 size={12} />
                      </button>
                      <ChevronRight size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!showHistory && (
              <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.preTradeDesc}
              </p>
            )}

            {/* Asset selector for pre-trade */}
            <div className="mb-3">
              <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                {t.preTradeAsset}
              </label>
              <select
                className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-purple-500 ${
                  isDark
                    ? 'bg-slate-700 border-purple-500/30 text-white'
                    : 'bg-white border-purple-200 text-slate-600'
                }`}
                value={preTradeAsset}
                onChange={e => setPreTradeAsset(e.target.value)}
              >
                <option value="">{language === 'es' ? 'Selecciona un activo' : 'Select an asset'}</option>
                {/* Favoritos primero */}
                {tieneActivosFavoritos && (
                  <optgroup label={t.myAssets}>
                    {activosFavoritos.map(symbol => (
                      <option key={`fav-pre-${symbol}`} value={symbol}>
                        {symbol}
                      </option>
                    ))}
                  </optgroup>
                )}
                {/* Lista completa */}
                {Object.entries(ACTIVOS_POR_CATEGORIA).map(([categoria, activos]) => (
                  <optgroup key={`pre-${categoria}`} label={`── ${categoria} ──`}>
                    {activos.map(activo => (
                      <option key={`pre-${activo.symbol}`} value={activo.symbol}>
                        {activo.symbol} - {activo.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Direction selector */}
            <div className="mb-3">
              <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                {language === 'es' ? '¿Qué dirección tienes en mente?' : 'What direction do you have in mind?'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreTradeDirection('Long')}
                  className={`p-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    preTradeDirection === 'Long'
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : isDark
                        ? 'bg-slate-700 border border-slate-600 text-slate-400 hover:border-green-500'
                        : 'bg-white border border-slate-200 text-slate-500 hover:border-green-500'
                  }`}
                >
                  <TrendingUp size={16} />
                  LONG
                </button>
                <button
                  type="button"
                  onClick={() => setPreTradeDirection('Short')}
                  className={`p-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    preTradeDirection === 'Short'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : isDark
                        ? 'bg-slate-700 border border-slate-600 text-slate-400 hover:border-red-500'
                        : 'bg-white border border-slate-200 text-slate-500 hover:border-red-500'
                  }`}
                >
                  <TrendingDown size={16} />
                  SHORT
                </button>
              </div>
            </div>

            {/* Timeframe and Session in grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Primary timeframe */}
              <div>
                <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {t.preTradeTimeframe}
                </label>
                <select
                  className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-purple-500 ${
                    isDark
                      ? 'bg-slate-700 border-purple-500/30 text-white'
                      : 'bg-white border-purple-200 text-slate-600'
                  }`}
                  value={preTradeTimeframe}
                  onChange={e => setPreTradeTimeframe(e.target.value)}
                >
                  {TEMPORALIDADES.filter(tf => tf !== 'Ejecución').map(tf => (
                    <option key={`pre-tf-${tf}`} value={tf}>{tf}</option>
                  ))}
                </select>
              </div>

              {/* Market session */}
              <div>
                <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {t.marketSession}
                </label>
                <select
                  className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-purple-500 ${
                    isDark
                      ? 'bg-slate-700 border-purple-500/30 text-white'
                      : 'bg-white border-purple-200 text-slate-600'
                  }`}
                  value={preTradeSession}
                  onChange={e => setPreTradeSession(e.target.value)}
                >
                  <option value="auto">{getSessionLabel('auto')}</option>
                  <option value="asian">{getSessionLabel('asian')}</option>
                  <option value="european">{getSessionLabel('european')}</option>
                  <option value="american">{getSessionLabel('american')}</option>
                  <option value="asian-european">{getSessionLabel('asian-european')}</option>
                  <option value="european-american">{getSessionLabel('european-american')}</option>
                </select>
              </div>
            </div>

            {/* Current session indicator */}
            <div className={`mb-3 p-2 rounded-lg flex items-center justify-between ${
              isDark ? 'bg-slate-700/50' : 'bg-purple-50'
            }`}>
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.sessionInfo}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                getCurrentSession().includes('american')
                  ? 'bg-blue-500/20 text-blue-400'
                  : getCurrentSession().includes('european')
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-purple-500/20 text-purple-400'
              }`}>
                {getSessionLabel(getCurrentSession())}
              </span>
            </div>

            {/* Pre-trade images upload (up to 3) */}
            <div className="space-y-3">
              {/* Display existing images */}
              {preTradeImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {preTradeImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.base64}
                        alt={`Pre-trade ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => removePreTradeImage(index)}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                      {/* Timeframe selector */}
                      <select
                        value={img.timeframe}
                        onChange={(e) => updatePreTradeImageTimeframe(index, e.target.value)}
                        className={`absolute bottom-1 left-1 right-1 text-[10px] font-bold rounded px-1 py-0.5 ${
                          isDark ? 'bg-slate-800/90 text-purple-400' : 'bg-white/90 text-purple-600'
                        }`}
                      >
                        {TEMPORALIDADES.map(tf => (
                          <option key={tf} value={tf}>{tf}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Add image button */}
              {preTradeImages.length < 3 && !preTradeAnalysis && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await handlePreTradeImage(file, '15M');
                      e.target.value = '';
                    }}
                    className="hidden"
                    id="pre-trade-image"
                  />
                  <label
                    htmlFor="pre-trade-image"
                    className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      isDark
                        ? 'border-purple-500/30 hover:border-purple-500 text-purple-400'
                        : 'border-purple-300 hover:border-purple-500 text-purple-500'
                    }`}
                  >
                    <Camera size={18} />
                    <span className="text-sm font-bold">
                      {preTradeImages.length === 0 ? t.uploadPreTrade : t.addMoreImages}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      ({preTradeImages.length}/3)
                    </span>
                  </label>
                </div>
              )}
            </div>

            {preTradeImages.length > 0 && (
              <div className="space-y-3">

                {/* User description textarea */}
                {!preTradeAnalysis && (
                  <div>
                    <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                      {t.preTradeDescLabel}
                    </label>
                    <textarea
                      placeholder={t.preTradeDescPlaceholder}
                      rows={3}
                      className={`w-full p-2.5 border rounded-xl text-sm outline-none focus:border-purple-500 resize-none ${
                        isDark
                          ? 'bg-slate-700 border-purple-500/30 text-white placeholder-slate-500'
                          : 'bg-white border-purple-200 text-slate-800 placeholder-slate-400'
                      }`}
                      value={preTradeDescription}
                      onChange={e => setPreTradeDescription(e.target.value)}
                    />
                    <p className={`text-[9px] mt-1 ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.preTradeDescHint}
                    </p>
                  </div>
                )}

                {/* Analyze button */}
                {!preTradeAnalysis && (
                  <button
                    type="button"
                    onClick={analyzePreTrade}
                    disabled={!canAnalyze}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      canAnalyze
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg'
                        : 'bg-slate-500/20 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {t.sentimentSearch}
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        {t.analyzeBeforeTrading}
                      </>
                    )}
                  </button>
                )}

                {/* Analysis result - Show button to open modal */}
                {preTradeAnalysis && (
                  <div className={`p-4 rounded-xl ${
                    preTradeAnalysis.error
                      ? isDark ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'
                      : isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'
                  }`}>
                    {preTradeAnalysis.error ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Bot size={18} className="text-red-500" />
                          <span className="text-xs font-bold text-red-500">
                            {t.aiMentor}
                          </span>
                        </div>
                        <p className="text-red-500 text-sm">{preTradeAnalysis.error}</p>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                            <CheckCircle size={18} className="text-green-500" />
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                              {language === 'es' ? 'Análisis completado' : 'Analysis complete'}
                            </p>
                            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {language === 'es' ? 'Incluye idea de trade con niveles' : 'Includes trade idea with levels'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPreTradeModal(true)}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-600 text-white transition-colors flex items-center gap-1.5"
                        >
                          <Eye size={14} />
                          {language === 'es' ? 'Ver análisis' : 'View analysis'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!hasUnlimitedQueries() && aiQueriesUsed >= aiQueriesLimit && (
              <p className="text-amber-500 text-xs text-center mt-2 font-medium">
                {t.noQueriesLeft}
              </p>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cuenta de Broker */}
        {cuentasBroker.length > 0 && (
          <div>
            <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              {t.brokerAccount}
            </label>
            <select
              className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-purple-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-purple-50 border-purple-200 text-slate-600'
              }`}
              value={form.cuentaId || ''}
              onChange={e => setForm({...form, cuentaId: e.target.value})}
            >
              <option value="">{t.selectAccount}</option>
              {cuentasBroker.map(cuenta => (
                <option key={cuenta.id} value={cuenta.id}>
                  {cuenta.broker} - #{cuenta.numero}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Activo */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            {t.asset}
          </label>
          <select
            className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-blue-500 ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            value={form.activo}
            onChange={e => setForm({...form, activo: e.target.value})}
          >
            {/* Mostrar favoritos primero si existen */}
            {tieneActivosFavoritos && (
              <optgroup label={t.myAssets}>
                {activosFavoritos.map(symbol => (
                  <option key={`fav-${symbol}`} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </optgroup>
            )}
            {/* Siempre mostrar lista completa */}
            {Object.entries(ACTIVOS_POR_CATEGORIA).map(([categoria, activos]) => (
              <optgroup key={categoria} label={`── ${categoria} ──`}>
                {activos.map(activo => (
                  <option key={activo.symbol} value={activo.symbol}>
                    {activo.symbol} - {activo.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Dirección */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            {isBinaryOptions ? t.prediction : t.direction}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm({...form, dir: 'Long'})}
              className={`p-2.5 rounded-xl font-bold text-sm transition-all ${
                form.dir === 'Long'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : isDark 
                    ? 'bg-slate-700 border border-slate-600 text-slate-400 hover:border-green-500' 
                    : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-green-500'
              }`}
            >
              {isBinaryOptions ? '↑ CALL' : '↑ LONG'}
            </button>
            <button
              type="button"
              onClick={() => setForm({...form, dir: 'Short'})}
              className={`p-2.5 rounded-xl font-bold text-sm transition-all ${
                form.dir === 'Short'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : isDark 
                    ? 'bg-slate-700 border border-slate-600 text-slate-400 hover:border-red-500' 
                    : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-red-500'
              }`}
            >
              {isBinaryOptions ? '↓ PUT' : '↓ SHORT'}
            </button>
          </div>
        </div>

        {/* Fechas de entrada y salida */}
        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              {t.entryDate}
            </label>
            <input
              type="date"
              className={`w-full max-w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-blue-500 appearance-none ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
              value={form.fechaEntrada || new Date().toISOString().split('T')[0]}
              onChange={e => setForm({...form, fechaEntrada: e.target.value})}
            />
          </div>
          <div className="min-w-0">
            <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              {t.exitDate}
            </label>
            <input
              type="date"
              className={`w-full max-w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-blue-500 appearance-none ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
              value={form.fechaSalida || new Date().toISOString().split('T')[0]}
              onChange={e => setForm({...form, fechaSalida: e.target.value})}
            />
          </div>
        </div>

        {/* Hora del trade */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            {t.tradeTime}
          </label>
          <input
            type="time"
            className={`w-full max-w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-blue-500 appearance-none ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            value={form.hora || getCurrentTime()}
            onChange={e => setForm({...form, hora: e.target.value})}
          />
        </div>

        {/* Indicador de swing trade */}
        {form.fechaEntrada && form.fechaSalida && form.fechaEntrada !== form.fechaSalida && (
          <div className={`p-2 rounded-xl text-center text-xs font-bold ${
            isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
          }`}>
            {t.swingTrade} ({Math.ceil((new Date(form.fechaSalida) - new Date(form.fechaEntrada)) / (1000 * 60 * 60 * 24))} días)
          </div>
        )}

        {/* --- MODO OPCIONES BINARIAS --- */}
        {isBinaryOptions ? (
          <>
            {/* Monto invertido */}
            <div>
              <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                {t.amountInvested}
              </label>
              <input 
                type="number" 
                step="0.01"
                placeholder="100.00" 
                className={`w-full p-2.5 border rounded-xl text-sm font-bold outline-none focus:border-purple-500 ${
                  isDark 
                    ? 'bg-slate-700 border-purple-500/30 text-white placeholder-slate-500' 
                    : 'bg-purple-50 border-purple-200 text-slate-800 placeholder-slate-400'
                }`}
                value={form.montoInvertido || ''} 
                onChange={e => setForm({...form, montoInvertido: e.target.value})} 
                required
              />
            </div>

            {/* Porcentaje de pago */}
            <div>
              <label className={`text-[10px] font-bold uppercase ml-1 mb-1 flex items-center gap-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                <Percent size={10} /> {t.payoutPercent}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="1"
                  min="1"
                  max="100"
                  placeholder="80" 
                  className={`w-full p-2.5 pr-8 border rounded-xl text-sm font-bold outline-none focus:border-purple-500 ${
                    isDark 
                      ? 'bg-slate-700 border-purple-500/30 text-white placeholder-slate-500' 
                      : 'bg-purple-50 border-purple-200 text-slate-800 placeholder-slate-400'
                  }`}
                  value={form.porcentajePago || 80} 
                  onChange={e => setForm({...form, porcentajePago: e.target.value})} 
                />
                <span className={`absolute right-3 top-2.5 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>%</span>
              </div>
            </div>

            {/* Resultado binario */}
            <div>
              <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                {t.result}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({...form, resultadoBinario: 'win'})}
                  className={`p-2.5 rounded-xl font-bold text-sm transition-all ${
                    form.resultadoBinario === 'win'
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : isDark 
                        ? 'bg-slate-700 border border-slate-600 text-slate-400 hover:border-green-500' 
                        : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-green-500'
                  }`}
                >
                  ✓ WIN
                </button>
                <button
                  type="button"
                  onClick={() => setForm({...form, resultadoBinario: 'loss'})}
                  className={`p-2.5 rounded-xl font-bold text-sm transition-all ${
                    form.resultadoBinario === 'loss'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : isDark 
                        ? 'bg-slate-700 border border-slate-600 text-slate-400 hover:border-red-500' 
                        : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-red-500'
                  }`}
                >
                  ✗ LOSS
                </button>
              </div>
            </div>

            {/* Preview del P&L calculado */}
            {form.montoInvertido && (
              <div className={`p-3 rounded-xl text-center ${
                form.resultadoBinario === 'win' 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <p className={`text-xs uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.calculatedPL}
                </p>
                <p className={`text-2xl font-black ${
                  form.resultadoBinario === 'win' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {form.resultadoBinario === 'win' ? '+' : ''}${calcularPLBinario()}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* --- MODO NORMAL --- */}
            {/* Lotes y P&L en grid */}
            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  {t.lotsContracts}
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.01"
                  className={`w-full p-2.5 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                  value={form.lotes}
                  onChange={e => setForm({...form, lotes: e.target.value})}
                />
              </div>
              <div>
                <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  P&L ($)
                </label>
                {/* Toggle WIN/LOSS encima del input */}
                <div className={`flex rounded-lg p-0.5 mb-1.5 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <button
                    type="button"
                    onClick={() => setForm({...form, esGanancia: true})}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                      form.esGanancia !== false
                        ? 'bg-green-500 text-white shadow-sm'
                        : isDark
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    + WIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({...form, esGanancia: false})}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                      form.esGanancia === false
                        ? 'bg-red-500 text-white shadow-sm'
                        : isDark
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    − LOSS
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full p-2.5 border rounded-xl text-sm font-bold outline-none transition-colors ${
                    form.esGanancia !== false
                      ? isDark
                        ? 'bg-green-500/10 border-green-500/50 text-green-400 focus:border-green-500'
                        : 'bg-green-50 border-green-200 text-green-600 focus:border-green-500'
                      : isDark
                        ? 'bg-red-500/10 border-red-500/50 text-red-400 focus:border-red-500'
                        : 'bg-red-50 border-red-200 text-red-600 focus:border-red-500'
                  }`}
                  value={form.res}
                  onChange={e => setForm({...form, res: e.target.value.replace('-', '')})}
                  required
                />
              </div>
            </div>

            {/* Entrada y Salida (opcional) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  {t.entry}
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder={t.price} 
                  className={`w-full p-2.5 border rounded-xl text-sm font-medium outline-none focus:border-blue-500 ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                  value={form.entrada || ''} 
                  onChange={e => setForm({...form, entrada: e.target.value})} 
                />
              </div>
              <div>
                <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  {t.exit}
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder={t.price} 
                  className={`w-full p-2.5 border rounded-xl text-sm font-medium outline-none focus:border-blue-500 ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                  value={form.salida || ''} 
                  onChange={e => setForm({...form, salida: e.target.value})} 
                />
              </div>
            </div>

            {/* Diferencia de puntos - considera la dirección */}
            {form.entrada && form.salida && (() => {
              const entrada = parseFloat(form.entrada);
              const salida = parseFloat(form.salida);
              // Long: gana si salida > entrada | Short: gana si entrada > salida
              const puntos = form.dir === 'Long' ? salida - entrada : entrada - salida;
              const esPositivo = puntos >= 0;
              return (
                <div className={`p-2.5 rounded-xl text-center ${
                  esPositivo
                    ? isDark ? 'bg-green-500/10' : 'bg-green-50'
                    : isDark ? 'bg-red-500/10' : 'bg-red-50'
                }`}>
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.points}: </span>
                  <span className={`text-sm font-black ${esPositivo ? 'text-green-500' : 'text-red-500'}`}>
                    {esPositivo ? '+' : ''}{puntos.toFixed(2)}
                  </span>
                </div>
              );
            })()}

            {/* Swap/Comisión */}
            <div>
              <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                {t.swapCommission}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className={`w-full p-2.5 border rounded-xl text-sm font-bold outline-none focus:border-amber-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-amber-400 placeholder-slate-500'
                    : 'bg-amber-50 border-amber-200 text-amber-600 placeholder-slate-400'
                }`}
                value={form.swap || ''}
                onChange={e => setForm({...form, swap: e.target.value})}
              />
              <p className={`text-[9px] mt-1 ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.swapHint}
              </p>
            </div>
          </>
        )}

        {/* Estado emocional */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            {t.emotionalState}
          </label>
          <select
            className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none focus:border-blue-500 ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            value={form.emo}
            onChange={e => setForm({...form, emo: e.target.value})}
          >
            <option value="Neutral">{t.emotions.neutral}</option>
            <option value="Calmado">{t.emotions.calm}</option>
            <option value="Ansioso">{t.emotions.anxious}</option>
            <option value="Venganza">{t.emotions.revenge}</option>
            <option value="Miedo">{t.emotions.fear}</option>
            <option value="Eufórico">{t.emotions.euphoric}</option>
            <option value="Frustrado">{t.emotions.frustrated}</option>
          </select>
        </div>

        {/* Notas rápidas */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            {t.notes}
          </label>
          <textarea
            placeholder={t.notesPlaceholder}
            rows={2}
            className={`w-full p-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 resize-none ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
            value={form.notas || ''} 
            onChange={e => setForm({...form, notas: e.target.value})} 
          />
        </div>

        {/* Capturas con temporalidad */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            <Camera size={12} className="inline mr-1"/> {t.screenshots}
          </label>

          {/* Imágenes agregadas */}
          {imagenes.length > 0 && (
            <div className="space-y-3 mb-3">
              {imagenes.map((img, index) => (
                <div key={index} className={`p-3 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex gap-3 items-start">
                    {/* Preview de imagen */}
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-blue-500 flex-shrink-0">
                      <img src={img.data} alt={`Captura ${index + 1}`} className="w-full h-full object-cover"/>
                    </div>

                    <div className="flex-1">
                      {/* Selector de temporalidad */}
                      <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t.timeframe}
                      </label>
                      <select
                        value={img.temporalidad}
                        onChange={(e) => handleTemporalidadChange(index, e.target.value)}
                        className={`w-full p-2 border rounded-lg text-sm font-bold outline-none focus:border-blue-500 ${
                          isDark
                            ? 'bg-slate-600 border-slate-500 text-white'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {TEMPORALIDADES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 flex-shrink-0"
                    >
                      <X size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botón agregar imagen */}
          {imagenes.length < 1 && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await agregarImagen(file);
                  }
                  e.target.value = '';
                }}
                className="hidden"
                id="trade-add-image"
              />
              <label
                htmlFor="trade-add-image"
                className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  isDark
                    ? 'border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400'
                    : 'border-slate-300 hover:border-blue-500 text-slate-400 hover:text-blue-500'
                }`}
              >
                <PlusCircle size={18}/>
                <span className="text-sm font-bold">
                  {imagenes.length === 0 ? t.addScreenshot : t.addAnother}
                </span>
              </label>
            </div>
          )}
        </div>
        
        {/* Botón guardar */}
        <button 
          type="submit" 
          disabled={!canSubmit}
          className={`w-full py-3 text-white rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed ${
            isBinaryOptions 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Save size={18} className="mr-2"/> {t.saveTrade}
        </button>
      </form>

      {/* Modal Checklist */}
      <TradeChecklist
        reglas={reglasSetup}
        isOpen={showChecklist}
        onClose={() => setShowChecklist(false)}
        onConfirm={handleChecklistConfirm}
      />

      {/* Modal Pre-Trade Result */}
      <PreTradeResultModal
        isOpen={showPreTradeModal}
        onClose={() => setShowPreTradeModal(false)}
        analysis={preTradeAnalysis?.text}
        asset={preTradeAsset || form.activo}
        direction={preTradeDirection}
        session={getSessionLabel(getCurrentSession())}
        timeframe={preTradeTimeframe}
        preTradeImages={preTradeImages}
      />
    </div>
  );
}