'use client';
import { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Send, Loader2, Heart, Brain, TrendingUp, MessageCircle, Sparkles } from 'lucide-react';

// Emails con consultas ilimitadas
const UNLIMITED_AI_EMAILS = ['tonytrader19@gmail.com'];

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
  const textareaRef = useRef(null);

  const lang = typeof navigator !== 'undefined' && navigator.language?.startsWith('es') ? 'es' : 'en';

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
      errorGeneric: 'Error al obtener retroalimentación. Intenta de nuevo.'
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
      errorGeneric: 'Error getting feedback. Please try again.'
    }
  }[lang];

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

    // Get last 30 trades with relevant info
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
    textareaRef.current?.focus();
  };

  const handlePromptClick = (prompt) => {
    setEntry(prev => prev ? `${prev}\n\n${prompt}` : prompt);
    textareaRef.current?.focus();
  };

  if (!isOpen) return null;

  const recentTrades = trades.slice(0, 5);
  const remaining = getRemainingQueries();

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

          {/* Query counter */}
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
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!feedback ? (
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
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <Brain size={18} />
                    {t.analyze}
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Feedback display */}
              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={18} className="text-purple-400" />
                  <span className="text-purple-300 font-medium">Tu mentor dice:</span>
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
                <p className="text-xs text-slate-400 mb-2">Lo que escribiste:</p>
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
        </div>
      </div>
    </div>
  );
}
