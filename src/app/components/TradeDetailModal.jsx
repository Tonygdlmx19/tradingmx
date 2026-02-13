"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Calendar, FileText, Save, Trash2, Image, PlusCircle, ClipboardCheck, CheckCircle, AlertTriangle, XCircle, Clock, ArrowRight, ZoomIn, ZoomOut, RotateCcw, Briefcase, Edit3, TrendingUp, TrendingDown, Crosshair, DollarSign, BarChart3, Loader2, Bot } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// AI Query limits by plan
const AI_QUERY_LIMITS = {
  trial: 5,
  '1month': 5,
  '3months': 10,
  '1year': 20,
  lifetime: 30,
  paid: 30, // backwards compat - treat as lifetime
};

const TEMPORALIDADES = ['1D', '4H', '1H', '30M', '15M', '5M', '1M', 'Ejecución'];
const EMOCIONES = ['Neutral', 'Calmado', 'Ansioso', 'Venganza', 'Miedo', 'Eufórico', 'Frustrado'];

export default function TradeDetailModal({ trade, isOpen, onClose, onUpdate, onDelete, cuentasBroker = [], userId, userType, userPlan }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  // Estados editables
  const [editData, setEditData] = useState({});
  const [notas, setNotas] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analyzingIndex, setAnalyzingIndex] = useState(null);
  const [aiQueriesUsed, setAiQueriesUsed] = useState(0);
  const [aiQueriesLimit, setAiQueriesLimit] = useState(5);

  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef(null);
  const imageContainerRef = useRef(null);

  const labels = {
    es: {
      editTrade: 'Editar',
      direction: 'Dirección',
      entryDate: 'Fecha Entrada',
      exitDate: 'Fecha Salida',
      tradeTime: 'Hora',
      lots: 'Lotes',
      result: 'Resultado',
      entryPrice: 'Entrada',
      exitPrice: 'Salida',
      emotion: 'Estado Emocional',
      swap: 'Swap/Comisión',
      account: 'Cuenta',
      selectAccount: 'Sin cuenta',
      saveChanges: 'Guardar Cambios',
      saving: 'Guardando...',
      delete: 'Eliminar',
      close: 'Cerrar',
      confirmDelete: '¿Estás seguro de eliminar este trade?',
      points: 'Puntos',
      metrics: 'Métricas',
      prices: 'Precios',
      netResult: 'Neto',
      swing: 'Swing Trade',
      screenshots: 'Captura del Trade',
      addScreenshot: 'Agregar captura',
      addAnotherScreenshot: 'Agregar otra captura',
      notes: 'Notas y Comentarios',
      notesPlaceholder: 'Agrega tus observaciones sobre este trade...',
      analyzeWithAI: 'Analizar con IA',
      analyzing: 'Analizando...',
      aiAnalysis: 'Análisis de IA',
      aiError: 'Error al analizar',
      hideAnalysis: 'Ocultar análisis',
      showAnalysis: 'Ver análisis',
      queriesRemaining: 'consultas restantes hoy',
      queryLimitReached: 'Límite de consultas alcanzado por hoy',
    },
    en: {
      editTrade: 'Edit',
      direction: 'Direction',
      entryDate: 'Entry Date',
      exitDate: 'Exit Date',
      tradeTime: 'Time',
      lots: 'Lots',
      result: 'Result',
      entryPrice: 'Entry',
      exitPrice: 'Exit',
      emotion: 'Emotional State',
      swap: 'Swap/Commission',
      account: 'Account',
      selectAccount: 'No account',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      delete: 'Delete',
      close: 'Close',
      confirmDelete: 'Are you sure you want to delete this trade?',
      points: 'Points',
      metrics: 'Metrics',
      prices: 'Prices',
      netResult: 'Net',
      swing: 'Swing Trade',
      screenshots: 'Trade Screenshot',
      addScreenshot: 'Add screenshot',
      addAnotherScreenshot: 'Add another screenshot',
      notes: 'Notes & Comments',
      notesPlaceholder: 'Add your observations about this trade...',
      analyzeWithAI: 'Analyze with AI',
      analyzing: 'Analyzing...',
      aiAnalysis: 'AI Analysis',
      aiError: 'Analysis error',
      hideAnalysis: 'Hide analysis',
      showAnalysis: 'View analysis',
      queriesRemaining: 'queries remaining today',
      queryLimitReached: 'Daily query limit reached',
    },
  };
  const t = labels[language];

  // Emotion translations
  const emotionLabels = {
    es: {
      'Neutral': 'Neutral',
      'Calmado': 'Calmado',
      'Ansioso': 'Ansioso',
      'Venganza': 'Venganza',
      'Miedo': 'Miedo',
      'Eufórico': 'Eufórico',
      'Frustrado': 'Frustrado',
    },
    en: {
      'Neutral': 'Neutral',
      'Calmado': 'Calm',
      'Ansioso': 'Anxious',
      'Venganza': 'Revenge',
      'Miedo': 'Fear',
      'Eufórico': 'Euphoric',
      'Frustrado': 'Frustrated',
    },
  };
  const getEmotionLabel = (emo) => emotionLabels[language]?.[emo] || emo;

  // Get AI query limit based on user plan
  const getQueryLimit = () => {
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

  // Load AI query count for today
  useEffect(() => {
    const loadQueryCount = async () => {
      if (!userId || !isOpen) return;

      const limit = getQueryLimit();
      setAiQueriesLimit(limit);

      try {
        const todayKey = getTodayKey();
        const queryDocRef = doc(db, 'ai_queries', `${userId}_${todayKey}`);
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
  }, [userId, isOpen, userType, userPlan]);

  // Increment AI query count
  const incrementQueryCount = async () => {
    if (!userId) {
      console.error('Cannot increment query count: userId is missing');
      return false;
    }

    try {
      const todayKey = getTodayKey();
      const queryDocRef = doc(db, 'ai_queries', `${userId}_${todayKey}`);

      // Get current count from Firestore to avoid stale state issues
      const currentDoc = await getDoc(queryDocRef);
      const currentCount = currentDoc.exists() ? (currentDoc.data().count || 0) : 0;
      const newCount = currentCount + 1;

      await setDoc(queryDocRef, {
        userId,
        date: todayKey,
        count: newCount,
        lastQuery: new Date().toISOString(),
      });

      setAiQueriesUsed(newCount);
      return true;
    } catch (error) {
      console.error('Error updating AI query count:', error);
      return false;
    }
  };

  const canMakeQuery = () => aiQueriesUsed < aiQueriesLimit;
  const queriesRemaining = Math.max(0, aiQueriesLimit - aiQueriesUsed);

  // Reset state when trade changes
  useEffect(() => {
    if (trade) {
      setEditData({
        activo: trade.activo || '',
        dir: trade.dir || 'Long',
        fechaEntrada: trade.fechaEntrada || trade.fecha || '',
        fechaSalida: trade.fechaSalida || trade.fecha || '',
        hora: trade.hora || '',
        lotes: trade.lotes || 1,
        res: Math.abs(trade.res || 0),
        esGanancia: (trade.res || 0) >= 0,
        entrada: trade.entrada || '',
        salida: trade.salida || '',
        emo: trade.emo || 'Neutral',
        swap: trade.swap || 0,
        cuentaId: trade.cuentaId || '',
      });
      setNotas(trade.notas || '');
      // Compatibilidad: convertir imagen antigua (singular) a array
      let imgs = trade.imagenes || [];
      if (imgs.length === 0 && trade.imagen) {
        imgs = [{ data: trade.imagen, temporalidad: '1H' }];
      }
      setImagenes(imgs);
      setHasChanges(false);
      setIsEditMode(false);
      setAiAnalysis({});
      setAnalyzingIndex(null);
    }
  }, [trade]);

  if (!isOpen || !trade) return null;

  const currentRes = editData.esGanancia ? Math.abs(editData.res || 0) : -Math.abs(editData.res || 0);
  const isWin = currentRes >= 0;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [y, m, d] = dateStr.split('-');
    const monthsEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months = language === 'en' ? monthsEn : monthsEs;
    // American format: Month Day, Year
    return language === 'en'
      ? `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`
      : `${parseInt(d)} de ${months[parseInt(m) - 1]}, ${y}`;
  };

  const getEmojiForEmotion = (emo) => {
    const emojis = {
      'Neutral': '😐',
      'Calmado': '😌',
      'Ansioso': '😰',
      'Venganza': '😤',
      'Miedo': '😨',
      'Euforico': '🤑',
      'Frustrado': '😔',
    };
    return emojis[emo] || '😐';
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
      alert(language === 'en' ? 'Maximum 1 image per trade' : 'Máximo 1 imagen por trade');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande (max 5MB)');
      return;
    }
    try {
      const compressed = await compressImage(file);
      setImagenes(prev => [...prev, { data: compressed, temporalidad: '1H' }]);
      setHasChanges(true);
    } catch (error) {
      console.error('Error procesando imagen:', error);
      alert('Error al procesar la imagen');
    }
  };

  const handleTemporalidadChange = (index, temporalidad) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index] = { ...nuevasImagenes[index], temporalidad };
    setImagenes(nuevasImagenes);
    setHasChanges(true);
  };

  const removeImage = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    // Calcular resultado del trade (el swap se descuenta del balance, no del trade)
    const resultadoFinal = editData.esGanancia
      ? Math.abs(parseFloat(editData.res) || 0)
      : -Math.abs(parseFloat(editData.res) || 0);

    // Obtener info de cuenta
    const cuentaSeleccionada = editData.cuentaId
      ? cuentasBroker.find(c => c.id === editData.cuentaId)
      : null;

    // Calcular puntos según dirección
    let puntos = null;
    if (editData.entrada && editData.salida) {
      const entrada = parseFloat(editData.entrada);
      const salida = parseFloat(editData.salida);
      puntos = editData.dir === 'Long' ? salida - entrada : entrada - salida;
    }

    // Get the latest AI analysis text if available
    const latestAiAnalysis = Object.values(aiAnalysis).find(a => a?.text)?.text || trade.aiAnalysis || null;

    const updates = {
      activo: editData.activo,
      dir: editData.dir,
      fecha: editData.fechaSalida,
      fechaEntrada: editData.fechaEntrada,
      fechaSalida: editData.fechaSalida,
      hora: editData.hora || null,
      lotes: parseFloat(editData.lotes) || 1,
      res: resultadoFinal,
      entrada: editData.entrada ? parseFloat(editData.entrada) : null,
      salida: editData.salida ? parseFloat(editData.salida) : null,
      puntos: puntos,
      emo: editData.emo,
      swap: parseFloat(editData.swap) || 0,
      cuentaId: editData.cuentaId || null,
      broker: cuentaSeleccionada?.broker || null,
      numeroCuenta: cuentaSeleccionada?.numero || null,
      notas,
      imagenes,
      imagen: null,
      aiAnalysis: latestAiAnalysis,
    };

    await onUpdate(trade.id, updates);
    setHasChanges(false);
    setIsEditMode(false);
    setIsSaving(false);
  };

  const handleFieldChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNotasChange = (value) => {
    setNotas(value);
    setHasChanges(true);
  };

  const handleDelete = () => {
    if (window.confirm(t.confirmDelete)) {
      onDelete(trade.id);
      onClose();
    }
  };

  // AI Analysis handler
  const analyzeWithAI = async (imageIndex) => {
    const img = imagenes[imageIndex];
    if (!img?.data) return;

    // Check query limit
    if (!canMakeQuery()) {
      setAiAnalysis(prev => ({ ...prev, [imageIndex]: { error: t.queryLimitReached, expanded: true } }));
      return;
    }

    setAnalyzingIndex(imageIndex);

    try {
      const response = await fetch('/api/analyze-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: img.data,
          tradeData: {
            activo: editData.activo,
            dir: editData.dir,
            res: editData.esGanancia ? Math.abs(editData.res) : -Math.abs(editData.res),
            entrada: editData.entrada,
            salida: editData.salida,
            puntos: trade.puntos,
          },
          userNotes: notas || '',
          language,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setAiAnalysis(prev => ({ ...prev, [imageIndex]: { error: data.error } }));
      } else {
        // Increment query count on successful analysis
        const incremented = await incrementQueryCount();
        if (!incremented) {
          console.warn('Failed to increment query count, but analysis was successful');
        }
        setAiAnalysis(prev => ({ ...prev, [imageIndex]: { text: data.analysis, expanded: true } }));
        // Mark as having changes so user can save the analysis
        setHasChanges(true);
      }
    } catch (error) {
      setAiAnalysis(prev => ({ ...prev, [imageIndex]: { error: error.message } }));
    } finally {
      setAnalyzingIndex(null);
    }
  };

  const toggleAnalysisExpanded = (index) => {
    setAiAnalysis(prev => ({
      ...prev,
      [index]: { ...prev[index], expanded: !prev[index]?.expanded }
    }));
  };

  // Zoom handlers
  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    // Double tap to zoom
    if (zoom === 1) {
      setZoom(2);
    } else {
      resetZoom();
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch start
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistance.current = distance;
    } else if (e.touches.length === 1 && zoom > 1) {
      // Pan start
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchDistance.current) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance - lastTouchDistance.current;
      lastTouchDistance.current = distance;

      setZoom(prev => {
        const newZoom = prev + delta * 0.01;
        return Math.max(1, Math.min(4, newZoom));
      });
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      // Pan
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;

      // Limit pan based on zoom level
      const maxPan = (zoom - 1) * 150;
      setPosition({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY))
      });
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
    setIsDragging(false);
    if (zoom <= 1) {
      resetZoom();
    }
  };

  const openImageViewer = (img) => {
    setViewingImage(img);
    resetZoom();
  };

  const closeImageViewer = () => {
    setViewingImage(null);
    resetZoom();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        {/* Header con botones */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {editData.activo}
            </span>
            <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1 ${
              editData.dir === 'Long'
                ? 'bg-green-500/20 text-green-500'
                : 'bg-red-500/20 text-red-500'
            }`}>
              {editData.dir === 'Long' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
              {editData.dir}
            </span>
            {editData.fechaEntrada !== editData.fechaSalida && (
              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-500">
                SWING
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                isEditMode
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <Edit3 size={14} />
              {t.editTrade}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Resultado principal con lotes */}
        <div className={`px-4 py-4 border-b ${
          isWin
            ? 'bg-gradient-to-r from-green-500/10 to-green-500/5'
            : 'bg-gradient-to-r from-red-500/10 to-red-500/5'
        } ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-center gap-3">
            <p className={`text-4xl font-black ${isWin ? 'text-green-500' : 'text-red-500'}`}>
              {isWin ? '+' : '-'}${Math.abs(currentRes).toFixed(2)}
            </p>
            <div className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-slate-700/80' : 'bg-white/80'}`}>
              <p className={`text-[9px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.lots}
              </p>
              <p className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {editData.lotes}
              </p>
            </div>
          </div>
          {editData.swap > 0 && (
            <p className={`text-sm mt-2 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.netResult}: <span className={isWin ? 'text-green-500' : 'text-red-500'}>
                {isWin ? '+' : '-'}${(Math.abs(currentRes) - editData.swap).toFixed(2)}
              </span>
              <span className="text-amber-500 ml-2">(Swap: -${parseFloat(editData.swap).toFixed(2)})</span>
            </p>
          )}
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Modo edición: campos editables */}
          {isEditMode ? (
            <>
              {/* Dirección */}
              <div>
                <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.direction}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('dir', 'Long')}
                    className={`p-2 rounded-xl font-bold text-sm transition-all ${
                      editData.dir === 'Long'
                        ? 'bg-green-500 text-white'
                        : isDark ? 'bg-slate-700 border border-slate-600 text-slate-400' : 'bg-slate-50 border border-slate-200 text-slate-500'
                    }`}
                  >
                    ↑ LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('dir', 'Short')}
                    className={`p-2 rounded-xl font-bold text-sm transition-all ${
                      editData.dir === 'Short'
                        ? 'bg-red-500 text-white'
                        : isDark ? 'bg-slate-700 border border-slate-600 text-slate-400' : 'bg-slate-50 border border-slate-200 text-slate-500'
                    }`}
                  >
                    ↓ SHORT
                  </button>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.entryDate}
                  </label>
                  <input
                    type="date"
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    value={editData.fechaEntrada}
                    onChange={e => handleFieldChange('fechaEntrada', e.target.value)}
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.exitDate}
                  </label>
                  <input
                    type="date"
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    value={editData.fechaSalida}
                    onChange={e => handleFieldChange('fechaSalida', e.target.value)}
                  />
                </div>
              </div>

              {/* Hora */}
              <div>
                <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.tradeTime}
                </label>
                <input
                  type="time"
                  className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                  value={editData.hora || ''}
                  onChange={e => handleFieldChange('hora', e.target.value)}
                />
              </div>

              {/* Lotes y Resultado */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.lots}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    value={editData.lotes}
                    onChange={e => handleFieldChange('lotes', e.target.value)}
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.result} ($)
                  </label>
                  <div className={`flex rounded-lg p-0.5 mb-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('esGanancia', true)}
                      className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                        editData.esGanancia ? 'bg-green-500 text-white' : isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      + WIN
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('esGanancia', false)}
                      className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                        !editData.esGanancia ? 'bg-red-500 text-white' : isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      − LOSS
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none ${
                      editData.esGanancia
                        ? isDark ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-green-50 border-green-200 text-green-600'
                        : isDark ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
                    }`}
                    value={editData.res}
                    onChange={e => handleFieldChange('res', e.target.value)}
                  />
                </div>
              </div>

              {/* Precios entrada/salida */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.entryPrice}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="-"
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                    }`}
                    value={editData.entrada || ''}
                    onChange={e => handleFieldChange('entrada', e.target.value)}
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.exitPrice}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="-"
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                    }`}
                    value={editData.salida || ''}
                    onChange={e => handleFieldChange('salida', e.target.value)}
                  />
                </div>
              </div>

              {/* Estado emocional */}
              <div>
                <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.emotion}
                </label>
                <select
                  className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                  value={editData.emo}
                  onChange={e => handleFieldChange('emo', e.target.value)}
                >
                  {EMOCIONES.map(e => (
                    <option key={e} value={e}>{getEmojiForEmotion(e)} {e}</option>
                  ))}
                </select>
              </div>

              {/* Swap */}
              <div>
                <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.swap}
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-amber-500 ${
                    isDark ? 'bg-slate-700 border-slate-600 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'
                  }`}
                  value={editData.swap || ''}
                  onChange={e => handleFieldChange('swap', e.target.value)}
                />
              </div>

              {/* Cuenta de broker */}
              {cuentasBroker.length > 0 && (
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.account}
                  </label>
                  <select
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-purple-500 ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-purple-50 border-purple-200 text-slate-700'
                    }`}
                    value={editData.cuentaId || ''}
                    onChange={e => handleFieldChange('cuentaId', e.target.value)}
                  >
                    <option value="">{t.selectAccount}</option>
                    {cuentasBroker.map(c => (
                      <option key={c.id} value={c.id}>{c.broker} - #{c.numero}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Modo vista: Info compacta */}

              {/* Fecha y hora */}
              <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <div>
                      {editData.fechaEntrada !== editData.fechaSalida ? (
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                          {formatDate(editData.fechaEntrada)} → {formatDate(editData.fechaSalida)}
                        </p>
                      ) : (
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                          {formatDate(editData.fechaSalida || editData.fechaEntrada)}
                        </p>
                      )}
                    </div>
                  </div>
                  {editData.hora && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{editData.hora}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Precios de entrada/salida con puntos */}
              {(editData.entrada || editData.salida) && (
                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t.prices}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className={`text-[9px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.entryPrice}</p>
                      <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {editData.entrada || '-'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-[9px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.exitPrice}</p>
                      <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {editData.salida || '-'}
                      </p>
                    </div>
                    {trade.puntos !== null && trade.puntos !== undefined && (
                      <div className={`p-2 -m-2 rounded-lg ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                        <p className={`text-[9px] uppercase ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{t.points}</p>
                        <p className={`text-base font-black ${trade.puntos >= 0 ? 'text-cyan-500' : 'text-red-500'}`}>
                          {trade.puntos >= 0 ? '+' : ''}{trade.puntos.toFixed(1)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Swap (si existe) */}
              {editData.swap > 0 && (
                <div className={`p-3 rounded-xl flex items-center justify-between ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                  <div>
                    <p className={`text-[9px] font-bold uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      Swap/Comisión
                    </p>
                    <p className="text-lg font-black text-amber-500">
                      -${parseFloat(editData.swap).toFixed(2)}
                    </p>
                  </div>
                  <DollarSign size={20} className="text-amber-500" />
                </div>
              )}

              {/* Cuenta de broker */}
              {trade.broker && (
                <div className={`p-3 rounded-xl flex items-center gap-3 ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                  <Briefcase size={16} className="text-purple-500" />
                  <div>
                    <p className={`text-[9px] font-bold uppercase ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                      {t.account}
                    </p>
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                      {trade.broker} <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>#{trade.numeroCuenta}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Estado emocional */}
              <div className={`p-3 rounded-xl flex items-center justify-between ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <div>
                  <p className={`text-[9px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.emotion}
                  </p>
                  <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {getEmotionLabel(editData.emo)}
                  </p>
                </div>
                <span className="text-3xl">{getEmojiForEmotion(editData.emo)}</span>
              </div>
            </>
          )}

          {/* Checklist de Setup */}
          {trade.checklist && trade.checklist.reglas && (
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-[10px] font-bold uppercase flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <ClipboardCheck size={12}/> Checklist de Setup
                </p>
                <span className={`text-sm font-black flex items-center gap-1 ${
                  trade.checklist.porcentaje >= 70 ? 'text-green-500' :
                  trade.checklist.porcentaje >= 50 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {trade.checklist.porcentaje >= 70 ? <CheckCircle size={14}/> :
                   trade.checklist.porcentaje >= 50 ? <AlertTriangle size={14}/> : <XCircle size={14}/>}
                  {trade.checklist.porcentaje}%
                </span>
              </div>
              {/* Barra de progreso */}
              <div className={`w-full h-2 rounded-full mb-3 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>
                <div
                  className={`h-full rounded-full ${
                    trade.checklist.porcentaje >= 70 ? 'bg-green-500' :
                    trade.checklist.porcentaje >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${trade.checklist.porcentaje}%` }}
                />
              </div>
              <div className="space-y-1.5">
                {trade.checklist.reglas.map((regla, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                      regla.cumplida ? 'bg-green-500' : isDark ? 'bg-slate-600' : 'bg-slate-300'
                    }`}>
                      {regla.cumplida && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs ${
                      regla.cumplida
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {regla.nombre}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Imágenes del trade */}
          <div>
            <p className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Image size={12} /> {t.screenshots}
            </p>

            {/* Imágenes existentes */}
            {imagenes.length > 0 && (
              <div className="space-y-3 mb-3">
                {imagenes.map((img, index) => (
                  <div key={index} className={`p-2 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                    {/* Imagen grande arriba */}
                    <div
                      className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-blue-500 cursor-pointer hover:opacity-90 mb-2"
                      onClick={() => openImageViewer(img)}
                    >
                      <img src={img.data} alt={`Captura ${index + 1}`} className="w-full h-full object-cover"/>
                    </div>

                    {/* Controles abajo */}
                    <div className="flex items-center gap-2">
                      <select
                        value={img.temporalidad}
                        onChange={(e) => handleTemporalidadChange(index, e.target.value)}
                        className={`flex-1 p-2 border rounded-lg text-sm font-bold outline-none focus:border-blue-500 ${
                          isDark
                            ? 'bg-slate-600 border-slate-500 text-white'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {TEMPORALIDADES.map(temp => (
                          <option key={temp} value={temp}>{temp}</option>
                        ))}
                      </select>

                      {/* Botón analizar con IA */}
                      <button
                        type="button"
                        onClick={() => analyzeWithAI(index)}
                        disabled={analyzingIndex === index || !canMakeQuery()}
                        className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                          !canMakeQuery()
                            ? 'bg-slate-500/20 text-slate-400 cursor-not-allowed'
                            : analyzingIndex === index
                              ? 'bg-purple-500/20 text-purple-400 cursor-wait'
                              : aiAnalysis[index]?.text
                                ? 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30'
                                : isDark
                                  ? 'hover:bg-purple-500/20 text-purple-400'
                                  : 'hover:bg-purple-100 text-purple-500'
                        }`}
                        title={canMakeQuery() ? `${t.analyzeWithAI} (${queriesRemaining} ${t.queriesRemaining})` : t.queryLimitReached}
                      >
                        {analyzingIndex === index ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Bot size={24} />
                        )}
                      </button>

                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 flex-shrink-0"
                        title="Eliminar imagen"
                      >
                        <X size={18}/>
                      </button>
                    </div>

                    {/* Contador de consultas IA */}
                    <div className={`flex items-center justify-between mt-2 px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span className="text-[10px] flex items-center gap-1">
                        <Bot size={16} />
                        {queriesRemaining}/{aiQueriesLimit} {t.queriesRemaining}
                      </span>
                      {!canMakeQuery() && (
                        <span className="text-[10px] text-amber-500 font-medium">
                          {t.queryLimitReached}
                        </span>
                      )}
                    </div>

                    {/* Resultado del análisis de IA */}
                    {aiAnalysis[index] && (
                      <div className={`mt-2 rounded-lg overflow-hidden ${
                        isDark ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
                      }`}>
                        <button
                          type="button"
                          onClick={() => toggleAnalysisExpanded(index)}
                          className={`w-full px-3 py-2 flex items-center justify-between ${
                            isDark ? 'hover:bg-purple-500/20' : 'hover:bg-purple-100'
                          }`}
                        >
                          <span className={`text-xs font-bold flex items-center gap-2 ${
                            isDark ? 'text-purple-400' : 'text-purple-600'
                          }`}>
                            <Bot size={18} />
                            {t.aiAnalysis}
                          </span>
                          <span className={`text-[10px] ${isDark ? 'text-purple-400' : 'text-purple-500'}`}>
                            {aiAnalysis[index]?.expanded ? t.hideAnalysis : t.showAnalysis}
                          </span>
                        </button>

                        {aiAnalysis[index]?.expanded && (
                          <div className={`px-3 pb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {aiAnalysis[index]?.error ? (
                              <p className="text-red-500 text-sm">{t.aiError}: {aiAnalysis[index].error}</p>
                            ) : (
                              <div className="text-xs leading-relaxed whitespace-pre-wrap">
                                {aiAnalysis[index]?.text}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
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
                  id="trade-detail-add-image"
                />
                <label
                  htmlFor="trade-detail-add-image"
                  className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    isDark
                      ? 'border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400'
                      : 'border-slate-300 hover:border-blue-500 text-slate-400 hover:text-blue-500'
                  }`}
                >
                  <PlusCircle size={18}/>
                  <span className="text-sm font-bold">
                    {imagenes.length === 0 ? t.addScreenshot : t.addAnotherScreenshot}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Notas */}
          <div>
            <p className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <FileText size={12} /> {t.notes}
            </p>
            <textarea
              placeholder={t.notesPlaceholder}
              rows={4}
              className={`w-full p-3 border rounded-xl text-sm outline-none focus:border-blue-500 resize-none ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
              value={notas}
              onChange={e => handleNotasChange(e.target.value)}
            />
          </div>

          {/* Botón guardar cambios */}
          {hasChanges && (
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              <Save size={18} />
              {isSaving ? t.saving : t.saveChanges}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-between ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            {t.delete}
          </button>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {t.close}
          </button>
        </div>
      </div>

      {/* Modal para ver imagen completa con zoom */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/95 flex flex-col z-[60]"
          onClick={closeImageViewer}
        >
          {/* Header con controles */}
          <div className="flex items-center justify-between p-4 bg-black/50">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full">
                {viewingImage.temporalidad}
              </span>
              <span className="text-white/60 text-xs">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                disabled={zoom <= 1}
              >
                <ZoomOut size={20} className={zoom <= 1 ? 'text-white/30' : 'text-white'} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                disabled={zoom >= 4}
              >
                <ZoomIn size={20} className={zoom >= 4 ? 'text-white/30' : 'text-white'} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RotateCcw size={20} className="text-white" />
              </button>
              <button
                onClick={closeImageViewer}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors ml-2"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Imagen con zoom */}
          <div
            ref={imageContainerRef}
            className="flex-1 flex items-center justify-center overflow-hidden touch-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={viewingImage.data}
              alt={`Captura ${viewingImage.temporalidad}`}
              className="max-w-full max-h-full object-contain transition-transform duration-100"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? 'grab' : 'zoom-in'
              }}
              onClick={handleImageClick}
              draggable={false}
            />
          </div>

          {/* Hint */}
          <div className="p-3 text-center bg-black/50">
            <p className="text-white/50 text-xs">
              {zoom === 1 ? 'Toca para hacer zoom · Pellizca para ajustar' : 'Arrastra para mover · Toca para restablecer'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}