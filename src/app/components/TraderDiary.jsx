'use client';
import { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { X, BookOpen, Loader2, Heart, Brain, TrendingUp, MessageCircle, Sparkles, Calendar, ChevronLeft, ChevronRight, PenLine, History } from 'lucide-react';

// Emails con consultas ilimitadas
const UNLIMITED_AI_EMAILS = ['tonytrader19@gmail.com'];

// Frases motivacionales para mostrar mientras carga
const MOTIVATIONAL_PHRASES = {
  es: [
    "Analizando tus patrones de trading...",
    "El autoconocimiento es la clave del éxito...",
    "Cada error es una lección disfrazada...",
    "Tu mentor está preparando tu retroalimentación...",
    "La disciplina supera al talento...",
    "Reflexionar es el primer paso para mejorar...",
    "Tu diario es tu mejor herramienta de crecimiento...",
    "Los mejores traders son los más honestos consigo mismos...",
    "Procesando tu historial de trades...",
    "Preparando consejos personalizados para ti..."
  ],
  en: [
    "Analyzing your trading patterns...",
    "Self-awareness is the key to success...",
    "Every mistake is a lesson in disguise...",
    "Your mentor is preparing feedback...",
    "Discipline beats talent...",
    "Reflection is the first step to improvement...",
    "Your diary is your best growth tool...",
    "The best traders are the most honest with themselves...",
    "Processing your trade history...",
    "Preparing personalized advice for you..."
  ]
};

export default function TraderDiary({
  isOpen,
  onClose,
  trades = [],
  userId,
  userEmail,
  userType,
  userPlan
}) {
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [queryCount, setQueryCount] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'history'
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [savingEntry, setSavingEntry] = useState(false);
  const textareaRef = useRef(null);
  const phraseIntervalRef = useRef(null);

  const lang = typeof navigator !== 'undefined' && navigator.language?.startsWith('es') ? 'es' : 'en';
  const phrases = MOTIVATIONAL_PHRASES[lang] || MOTIVATIONAL_PHRASES.es;

  const t = {
    es: {
      title: 'Diario del Trader',
      subtitle: 'Un espacio seguro para reflexionar sobre tu trading',
      placeholder: 'Escribe lo que sientes, lo que te preocupa, tus errores, tus victorias... Este es tu espacio seguro. La IA te escuchará y te dará retroalimentación honesta y constructiva.',
      analyze: 'Obtener Retroalimentación',
      analyzing: 'Analizando...',
      recentTrades: 'Tus últimos trades',
      noTrades: 'Aún no tienes trades registrados',
      win: 'Ganado',
      loss: 'Pérdida',
      prompts: [
        '¿Qué emociones sentiste hoy operando?',
        '¿Seguiste tu plan de trading?',
        '¿Qué harías diferente?',
        '¿Qué aprendiste hoy?'
      ],
      tips: [
        'Sé honesto contigo mismo',
        'No hay respuestas incorrectas',
        'El ego es el enemigo del progreso',
        'Aceptar errores es el primer paso'
      ],
      limitReached: 'Has alcanzado el límite de consultas de IA para hoy',
      queriesRemaining: 'consultas restantes hoy',
      unlimited: 'Consultas ilimitadas',
      newEntry: 'Nueva entrada',
      errorGeneric: 'Error al obtener retroalimentación. Intenta de nuevo.',
      writeTab: 'Escribir',
      historyTab: 'Historial',
      noEntries: 'No hay entradas este mes',
      entrySaved: '¡Entrada guardada!',
      viewEntry: 'Ver entrada',
      yourThoughts: 'Tus pensamientos',
      mentorResponse: 'Respuesta del mentor',
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      back: 'Volver'
    },
    en: {
      title: 'Trader Diary',
      subtitle: 'A safe space to reflect on your trading',
      placeholder: 'Write what you feel, what worries you, your mistakes, your victories... This is your safe space. The AI will listen and give you honest, constructive feedback.',
      analyze: 'Get Feedback',
      analyzing: 'Analyzing...',
      recentTrades: 'Your recent trades',
      noTrades: 'No trades registered yet',
      win: 'Won',
      loss: 'Loss',
      prompts: [
        'What emotions did you feel trading today?',
        'Did you follow your trading plan?',
        'What would you do differently?',
        'What did you learn today?'
      ],
      tips: [
        'Be honest with yourself',
        'There are no wrong answers',
        'Ego is the enemy of progress',
        'Accepting mistakes is the first step'
      ],
      limitReached: 'You have reached the AI query limit for today',
      queriesRemaining: 'queries remaining today',
      unlimited: 'Unlimited queries',
      newEntry: 'New entry',
      errorGeneric: 'Error getting feedback. Please try again.',
      writeTab: 'Write',
      historyTab: 'History',
      noEntries: 'No entries this month',
      entrySaved: 'Entry saved!',
      viewEntry: 'View entry',
      yourThoughts: 'Your thoughts',
      mentorResponse: 'Mentor response',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      back: 'Back'
    }
  }[lang];

  // Rotate motivational phrases during loading
  useEffect(() => {
    if (isAnalyzing) {
      setCurrentPhrase(0);
      phraseIntervalRef.current = setInterval(() => {
        setCurrentPhrase(prev => (prev + 1) % phrases.length);
      }, 2500);
    } else {
      if (phraseIntervalRef.current) {
        clearInterval(phraseIntervalRef.current);
      }
    }
    return () => {
      if (phraseIntervalRef.current) {
        clearInterval(phraseIntervalRef.current);
      }
    };
  }, [isAnalyzing, phrases.length]);

  // Load diary entries from Firestore
  useEffect(() => {
    if (!userId || !isOpen) return;

    const q = query(
      collection(db, 'diary_entries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setDiaryEntries(entries);
    }, (err) => {
      console.error('Error loading diary entries:', err);
    });

    return () => unsubscribe();
  }, [userId, isOpen]);

  // Check if user has unlimited queries
  const hasUnlimitedQueries = () => {
    if (!userEmail) return false;
    return UNLIMITED_AI_EMAILS.includes(userEmail.toLowerCase());
  };

  // Get daily query limit based on plan
  const getDailyLimit = () => {
    if (hasUnlimitedQueries()) return Infinity;
    if (userType === 'paid' || userType === 'lifetime') {
      if (userPlan === 'lifetime') return 20;
      if (userPlan === 'yearly') return 15;
      if (userPlan === 'monthly') return 10;
      return 10;
    }
    if (userType === 'trial') return 3;
    return 3;
  };

  // Get remaining queries
  const getRemainingQueries = () => {
    const limit = getDailyLimit();
    if (limit === Infinity) return Infinity;
    return Math.max(0, limit - queryCount);
  };

  // Load query count from localStorage
  useEffect(() => {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`diary_queries_${userId}_${today}`);
    if (stored) {
      setQueryCount(parseInt(stored, 10));
    }
  }, [userId]);

  // Get recent trades with notes for context
  const getRecentTradesContext = () => {
    if (!trades || trades.length === 0) return [];
    return trades
      .slice(0, 30)
      .map(t => ({
        fecha: t.fecha,
        activo: t.activo,
        direccion: t.dir,
        resultado: t.resultado,
        monto: t.monto,
        emocion: t.emo,
        notas: t.notas,
        analisis: t.analisis
      }));
  };

  // Save entry to Firestore
  const saveEntryToFirestore = async (entryText, feedbackText) => {
    if (!userId) return;
    setSavingEntry(true);
    try {
      await addDoc(collection(db, 'diary_entries'), {
        userId,
        entry: entryText,
        feedback: feedbackText,
        createdAt: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error saving diary entry:', err);
    } finally {
      setSavingEntry(false);
    }
  };

  const handleAnalyze = async () => {
    if (!entry.trim() || isAnalyzing) return;

    const remaining = getRemainingQueries();
    if (remaining <= 0 && !hasUnlimitedQueries()) {
      setError(t.limitReached);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setFeedback(null);

    try {
      const recentTrades = getRecentTradesContext();

      const response = await fetch('/api/diary-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry,
          recentTrades,
          lang
        })
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      setFeedback(data.feedback);

      // Save to Firestore
      await saveEntryToFirestore(entry, data.feedback);

      // Update query count
      if (!hasUnlimitedQueries()) {
        const today = new Date().toISOString().split('T')[0];
        const newCount = queryCount + 1;
        setQueryCount(newCount);
        localStorage.setItem(`diary_queries_${userId}_${today}`, newCount.toString());
      }

    } catch (err) {
      console.error('Diary feedback error:', err);
      setError(t.errorGeneric);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewEntry = () => {
    setEntry('');
    setFeedback(null);
    setError(null);
    setSelectedEntry(null);
    textareaRef.current?.focus();
  };

  const handlePromptClick = (prompt) => {
    setEntry(prev => prev ? `${prev}\n\n${prompt}` : prompt);
    textareaRef.current?.focus();
  };

  // Get entries for selected month
  const getEntriesForMonth = () => {
    return diaryEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
    });
  };

  // Get days with entries for calendar
  const getDaysWithEntries = () => {
    const days = new Set();
    diaryEntries.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      if (entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear) {
        days.add(entryDate.getDate());
      }
    });
    return days;
  };

  // Navigate months
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysWithEntries = getDaysWithEntries();

    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEntry = daysWithEntries.has(day);
      const isToday = day === new Date().getDate() &&
                      selectedMonth === new Date().getMonth() &&
                      selectedYear === new Date().getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => {
            if (hasEntry) {
              const entryForDay = diaryEntries.find(e => {
                const d = new Date(e.createdAt);
                return d.getDate() === day && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
              });
              if (entryForDay) setSelectedEntry(entryForDay);
            }
          }}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
            ${hasEntry
              ? 'bg-purple-500 text-white hover:bg-purple-600 cursor-pointer'
              : 'text-slate-400 hover:bg-slate-700/50'}
            ${isToday && !hasEntry ? 'ring-2 ring-purple-500/50' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  if (!isOpen) return null;

  const recentTrades = trades.slice(0, 5);
  const remaining = getRemainingQueries();
  const monthEntries = getEntriesForMonth();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t.title}</h2>
                <p className="text-purple-200 text-sm">{t.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => { setActiveTab('write'); setSelectedEntry(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'write'
                  ? 'bg-white/20 text-white'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              <PenLine size={16} />
              {t.writeTab}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-white/20 text-white'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              <History size={16} />
              {t.historyTab}
              {diaryEntries.length > 0 && (
                <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">
                  {diaryEntries.length}
                </span>
              )}
            </button>
          </div>

          {/* Query counter (only show in write tab) */}
          {activeTab === 'write' && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Sparkles size={14} className="text-yellow-300" />
              {hasUnlimitedQueries() ? (
                <span className="text-purple-200">{t.unlimited}</span>
              ) : (
                <span className="text-purple-200">
                  {remaining} {t.queriesRemaining}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {/* WRITE TAB */}
          {activeTab === 'write' && !feedback && !isAnalyzing && (
            <>
              {/* Writing prompts */}
              <div className="mb-4 flex flex-wrap gap-2">
                {t.prompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder={t.placeholder}
                className="w-full h-48 bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />

              {/* Tips */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {t.tips.map((tip, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <Heart size={12} className="text-pink-400" />
                    {tip}
                  </div>
                ))}
              </div>

              {/* Recent trades context */}
              {recentTrades.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <TrendingUp size={14} />
                    {t.recentTrades}
                  </h3>
                  <div className="space-y-1">
                    {recentTrades.map((trade, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs bg-slate-700/30 rounded-lg px-3 py-2"
                      >
                        <span className="text-slate-300">
                          {trade.fecha} - {trade.activo || 'N/A'}
                        </span>
                        <div className="flex items-center gap-2">
                          {trade.emo && <span>{trade.emo}</span>}
                          <span className={trade.resultado === 'ganado' ? 'text-green-400' : 'text-red-400'}>
                            {trade.resultado === 'ganado' ? t.win : t.loss}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleAnalyze}
                disabled={!entry.trim() || isAnalyzing || (remaining <= 0 && !hasUnlimitedQueries())}
                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Brain size={18} />
                {t.analyze}
              </button>
            </>
          )}

          {/* LOADING STATE */}
          {activeTab === 'write' && isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-16">
              {/* Animated brain icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-full">
                  <Brain size={40} className="text-white animate-pulse" />
                </div>
              </div>

              {/* Rotating motivational phrase */}
              <div className="mt-8 text-center">
                <p
                  key={currentPhrase}
                  className="text-lg text-purple-300 font-medium animate-fade-in"
                >
                  {phrases[currentPhrase]}
                </p>
                <div className="mt-4 flex justify-center gap-1">
                  {phrases.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentPhrase ? 'bg-purple-500 scale-125' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Loading bar */}
              <div className="mt-8 w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-loading-bar"></div>
              </div>
            </div>
          )}

          {/* FEEDBACK DISPLAY */}
          {activeTab === 'write' && feedback && !isAnalyzing && (
            <>
              {/* Saved indicator */}
              {savingEntry ? (
                <div className="mb-4 flex items-center gap-2 text-sm text-purple-300">
                  <Loader2 size={14} className="animate-spin" />
                  Guardando...
                </div>
              ) : (
                <div className="mb-4 flex items-center gap-2 text-sm text-green-400">
                  <Sparkles size={14} />
                  {t.entrySaved}
                </div>
              )}

              {/* Feedback display */}
              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={18} className="text-purple-400" />
                  <span className="text-purple-300 font-medium">{t.mentorResponse}:</span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <div
                    className="text-slate-200 whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: feedback
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300">$1</strong>')
                        .replace(/## (.*?)(\n|$)/g, '<h3 class="text-lg font-semibold text-purple-300 mt-4 mb-2">$1</h3>')
                        .replace(/### (.*?)(\n|$)/g, '<h4 class="text-base font-medium text-indigo-300 mt-3 mb-1">$1</h4>')
                    }}
                  />
                </div>
              </div>

              {/* What you wrote */}
              <div className="mt-4 bg-slate-700/30 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-2">{t.yourThoughts}:</p>
                <p className="text-sm text-slate-300 italic">"{entry}"</p>
              </div>

              {/* New entry button */}
              <button
                onClick={handleNewEntry}
                className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen size={18} />
                {t.newEntry}
              </button>
            </>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && !selectedEntry && (
            <>
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} className="text-slate-400" />
                </button>
                <h3 className="text-lg font-semibold text-white">
                  {t.months[selectedMonth]} {selectedYear}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Calendar grid */}
              <div className="mb-6">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                    <div key={i} className="h-8 flex items-center justify-center text-xs text-slate-500 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays()}
                </div>
              </div>

              {/* Entries list */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Calendar size={14} />
                  {t.months[selectedMonth]} - {monthEntries.length} {monthEntries.length === 1 ? 'entrada' : 'entradas'}
                </h4>

                {monthEntries.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                    <p>{t.noEntries}</p>
                  </div>
                ) : (
                  monthEntries.map((entryItem) => (
                    <button
                      key={entryItem.id}
                      onClick={() => setSelectedEntry(entryItem)}
                      className="w-full text-left bg-slate-700/30 hover:bg-slate-700/50 rounded-xl p-4 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-purple-400">
                          {new Date(entryItem.createdAt).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(entryItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {entryItem.entry}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </>
          )}

          {/* SELECTED ENTRY VIEW */}
          {activeTab === 'history' && selectedEntry && (
            <>
              <button
                onClick={() => setSelectedEntry(null)}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors"
              >
                <ChevronLeft size={18} />
                {t.back}
              </button>

              <div className="text-xs text-slate-500 mb-4">
                {new Date(selectedEntry.createdAt).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              {/* Entry content */}
              <div className="bg-slate-700/30 rounded-xl p-4 mb-4">
                <p className="text-xs text-slate-400 mb-2">{t.yourThoughts}:</p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{selectedEntry.entry}</p>
              </div>

              {/* Feedback */}
              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={18} className="text-purple-400" />
                  <span className="text-purple-300 font-medium">{t.mentorResponse}:</span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <div
                    className="text-slate-200 whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: selectedEntry.feedback
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300">$1</strong>')
                        .replace(/## (.*?)(\n|$)/g, '<h3 class="text-lg font-semibold text-purple-300 mt-4 mb-2">$1</h3>')
                        .replace(/### (.*?)(\n|$)/g, '<h4 class="text-base font-medium text-indigo-300 mt-3 mb-1">$1</h4>')
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
