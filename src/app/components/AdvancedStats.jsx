"use client";
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function AdvancedStats({ trades, capitalInicial, balance }) {
  const { isDark } = useTheme();
  
  // Calcular métricas
  const calculateMetrics = () => {
    if (trades.length === 0) {
      return {
        avgWin: 0,
        avgLoss: 0,
        bestDay: { date: '-', amount: 0 },
        worstDay: { date: '-', amount: 0 },
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

    // Agrupar por día
    const byDay = {};
    trades.forEach(t => {
      if (!byDay[t.fecha]) byDay[t.fecha] = 0;
      byDay[t.fecha] += t.res;
    });
    
    const days = Object.entries(byDay).map(([date, amount]) => ({ date, amount }));
    
    // Mejor día = mayor ganancia (más positivo)
    // Peor día = mayor pérdida (más negativo)
    let bestDay = { date: '-', amount: 0 };
    let worstDay = { date: '-', amount: 0 };
    
    if (days.length > 0) {
      bestDay = days.reduce((best, day) => day.amount > best.amount ? day : best, days[0]);
      worstDay = days.reduce((worst, day) => day.amount < worst.amount ? day : worst, days[0]);
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
    if (dateStr === '-') return '-';
    const [y, mo, d] = dateStr.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${parseInt(d)} ${months[parseInt(mo) - 1]}`;
  };

  const winPct = m.totalTrades > 0 ? (m.winningTrades / m.totalTrades) * 100 : 0;

  return (
    <div className={`p-4 sm:p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 size={18} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
        <h3 className={`font-bold text-sm uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Métricas Avanzadas
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
                Crecimiento de Cuenta
              </p>
              <p className={`text-xl font-black ${growthPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {growthPct >= 0 ? '+' : ''}{growthPct.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Capital: ${capitalInicial?.toLocaleString() || 0}
            </p>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de métricas - Diseño limpio tipo tabla */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-200 dark:bg-slate-600 rounded-xl overflow-hidden">
        {/* Promedio Ganancia */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Prom. Ganancia
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
            Prom. Pérdida
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
            Mejor Racha
          </p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {m.maxWinStreak} wins
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {m.currentStreak > 0 ? `Actual: ${m.currentStreak}` : m.currentStreak < 0 ? `Perdiendo: ${Math.abs(m.currentStreak)}` : '-'}
          </p>
        </div>

        {/* Expectativa */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Expectativa
          </p>
          <p className={`text-lg font-bold ${m.expectancy >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${m.expectancy.toFixed(2)}
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            por operación
          </p>
        </div>

        {/* Mejor Día */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Mejor Día
          </p>
          <p className={`text-lg font-bold ${m.bestDay.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {m.bestDay.amount >= 0 ? '+' : ''}${m.bestDay.amount.toFixed(0)}
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {formatDate(m.bestDay.date)}
          </p>
        </div>

        {/* Peor Día */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Peor Día
          </p>
          <p className={`text-lg font-bold ${m.worstDay.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {m.worstDay.amount >= 0 ? '+' : ''}${m.worstDay.amount.toFixed(0)}
          </p>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {formatDate(m.worstDay.date)}
          </p>
        </div>
      </div>

      {/* Barra de distribución */}
      {m.totalTrades > 0 && (
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Distribución
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