"use client";
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function AdvancedStats({ trades, capitalInicial, balance }) {
  const { isDark } = useTheme();
  const { language, t: translations } = useLanguage();

  const labels = {
    es: {
      title: 'Métricas Avanzadas',
      accountGrowth: 'Crecimiento de Cuenta',
      capital: 'Capital',
      avgWin: 'Prom. Ganancia',
      avgLoss: 'Prom. Pérdida',
      bestStreak: 'Mejor Racha',
      expectancy: 'Expectativa',
      bestTrade: 'Mejor Trade',
      worstTrade: 'Peor Trade',
      perTrade: 'por operación',
      wins: 'wins',
      current: 'Actual',
      losing: 'Perdiendo',
      distribution: 'Distribución',
    },
    en: {
      title: 'Advanced Metrics',
      accountGrowth: 'Account Growth',
      capital: 'Capital',
      avgWin: 'Avg. Win',
      avgLoss: 'Avg. Loss',
      bestStreak: 'Best Streak',
      expectancy: 'Expectancy',
      bestTrade: 'Best Trade',
      worstTrade: 'Worst Trade',
      perTrade: 'per trade',
      wins: 'wins',
      current: 'Current',
      losing: 'Losing',
      distribution: 'Distribution',
    },
  };
  const t = labels[language];
  
  // Calcular métricas
  const calculateMetrics = () => {
    if (trades.length === 0) {
      return {
        avgWin: 0,
        avgLoss: 0,
        bestDay: { date: '-', amount: 0 },
        worstDay: { date: '-', amount: 0 },
        bestTrade: { date: '-', amount: 0 },
        worstTrade: { date: '-', amount: 0 },
        maxWinStreak: 0,
        maxLossStreak: 0,
        currentStreak: 0,
        expectancy: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
      };
    }

    const wins = trades.filter(t => t.res > 0);
    const losses = trades.filter(t => t.res < 0);
    
    const avgWin = wins.length > 0 
      ? wins.reduce((sum, t) => sum + t.res, 0) / wins.length 
      : 0;
    const avgLoss = losses.length > 0 
      ? losses.reduce((sum, t) => sum + t.res, 0) / losses.length 
      : 0;

    // Agrupar por día para estadísticas por día
    const byDay = {};
    trades.forEach(t => {
      const fecha = t.fecha;
      if (!fecha) return;
      if (!byDay[fecha]) byDay[fecha] = 0;
      byDay[fecha] += Number(t.res) || 0;
    });
    
    const days = Object.entries(byDay).map(([date, amount]) => ({ date, amount }));
    
    // Mejor y peor día (solo si hay más de 1 día)
    let bestDay = { date: '-', amount: 0 };
    let worstDay = { date: '-', amount: 0 };
    
    if (days.length > 1) {
      const sortedByAmount = [...days].sort((a, b) => b.amount - a.amount);
      bestDay = sortedByAmount[0];
      worstDay = sortedByAmount[sortedByAmount.length - 1];
    } else if (days.length === 1) {
      // Si solo hay un día, mostrar ese día como referencia
      bestDay = days[0];
      worstDay = { date: '-', amount: 0 };
    }

    // Mejor y peor TRADE individual
    let bestTrade = { amount: 0, date: '-' };
    let worstTrade = { amount: 0, date: '-' };
    
    if (trades.length > 0) {
      const sortedByRes = [...trades].sort((a, b) => b.res - a.res);
      const best = sortedByRes[0];
      const worst = sortedByRes[sortedByRes.length - 1];
      
      bestTrade = { amount: best.res, date: best.fecha };
      worstTrade = { amount: worst.res, date: worst.fecha };
    }

    // Rachas
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let tempWinStreak = 0;
    let tempLossStreak = 0;

    const sortedTrades = [...trades].sort((a, b) => {
      const dateCompare = new Date(a.fecha) - new Date(b.fecha);
      if (dateCompare !== 0) return dateCompare;
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return aTime - bTime;
    });
    
    sortedTrades.forEach((t, i) => {
      if (t.res > 0) {
        tempWinStreak++;
        tempLossStreak = 0;
        if (tempWinStreak > maxWinStreak) maxWinStreak = tempWinStreak;
      } else if (t.res < 0) {
        tempLossStreak++;
        tempWinStreak = 0;
        if (tempLossStreak > maxLossStreak) maxLossStreak = tempLossStreak;
      }
      if (i === sortedTrades.length - 1) {
        currentStreak = t.res > 0 ? tempWinStreak : -tempLossStreak;
      }
    });

    const winRate = trades.length > 0 ? wins.length / trades.length : 0;
    const lossRate = trades.length > 0 ? losses.length / trades.length : 0;
    const expectancy = (winRate * avgWin) + (lossRate * avgLoss);

    return {
      avgWin,
      avgLoss,
      bestDay,
      worstDay,
      bestTrade,
      worstTrade,
      maxWinStreak,
      maxLossStreak,
      currentStreak,
      expectancy,
      totalTrades: trades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
    };
  };

  const m = calculateMetrics();

  // Calcular crecimiento de cuenta
  const totalPnl = balance - capitalInicial;
  const growthPct = capitalInicial > 0 ? ((balance - capitalInicial) / capitalInicial) * 100 : 0;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '-') return '-';
    try {
      const [y, mo, d] = dateStr.split('-');
      const months = translations.monthsShort;
      return `${parseInt(d)} ${months[parseInt(mo) - 1]}`;
    } catch {
      return dateStr;
    }
  };

  const winPct = m.totalTrades > 0 ? (m.winningTrades / m.totalTrades) * 100 : 0;

  return (
    <div data-tour="advanced-stats" className={`p-4 sm:p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 size={18} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
        <h3 className={`font-bold text-sm uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {t.title}
        </h3>
      </div>

      {/* Crecimiento de cuenta - Destacado */}
      <div className={`mb-4 p-4 rounded-xl border ${
        growthPct >= 0 
          ? isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
          : isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${growthPct >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {growthPct >= 0 ? <TrendingUp size={20} className="text-green-500" /> : <TrendingDown size={20} className="text-red-500" />}
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.accountGrowth}
              </p>
              <p className={`text-xl font-black ${growthPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {growthPct >= 0 ? '+' : ''}{growthPct.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.capital}: ${capitalInicial?.toLocaleString() || 0}
            </p>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de métricas - Diseño limpio tipo tabla */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px rounded-xl overflow-hidden ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>
        {/* Promedio Ganancia */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.avgWin}
          </p>
          <p className="text-lg font-bold text-green-500">
            +${m.avgWin.toFixed(0)}
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {m.winningTrades} trades
          </p>
        </div>

        {/* Promedio Pérdida */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.avgLoss}
          </p>
          <p className="text-lg font-bold text-red-500">
            -${Math.abs(m.avgLoss).toFixed(0)}
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {m.losingTrades} trades
          </p>
        </div>

        {/* Mejor Racha */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.bestStreak}
          </p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {m.maxWinStreak} {t.wins}
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {m.currentStreak > 0 ? `${t.current}: ${m.currentStreak}` : m.currentStreak < 0 ? `${t.losing}: ${Math.abs(m.currentStreak)}` : '-'}
          </p>
        </div>

        {/* Expectativa */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.expectancy}
          </p>
          <p className={`text-lg font-bold ${m.expectancy >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${m.expectancy.toFixed(2)}
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.perTrade}
          </p>
        </div>

        {/* Mejor Trade */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.bestTrade}
          </p>
          <p className={`text-lg font-bold ${m.bestTrade.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {m.bestTrade.amount >= 0 ? '+' : ''}${m.bestTrade.amount.toFixed(0)}
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {formatDate(m.bestTrade.date)}
          </p>
        </div>

        {/* Peor Trade */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.worstTrade}
          </p>
          <p className={`text-lg font-bold ${m.worstTrade.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {m.worstTrade.amount >= 0 ? '+' : ''}${m.worstTrade.amount.toFixed(0)}
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {formatDate(m.worstTrade.date)}
          </p>
        </div>
      </div>

      {/* Barra de distribución */}
      {m.totalTrades > 0 && (
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.distribution}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {m.winningTrades}W ({winPct.toFixed(0)}%) / {m.losingTrades}L
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden flex ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div 
              className="bg-green-500 transition-all duration-500"
              style={{ width: `${winPct}%` }}
            />
            <div 
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${100 - winPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}