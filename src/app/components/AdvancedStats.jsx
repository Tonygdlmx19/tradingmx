"use client";
import { BarChart3 } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function AdvancedStats({ trades }) {
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
    const bestDay = days.reduce((best, day) => day.amount > best.amount ? day : best, { date: '-', amount: -Infinity });
    const worstDay = days.reduce((worst, day) => day.amount < worst.amount ? day : worst, { date: '-', amount: Infinity });

    // Rachas
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let tempWinStreak = 0;
    let tempLossStreak = 0;

    const sortedTrades = [...trades].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
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
      bestDay: bestDay.amount === -Infinity ? { date: '-', amount: 0 } : bestDay,
      worstDay: worstDay.amount === Infinity ? { date: '-', amount: 0 } : worstDay,
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

      {/* Grid de métricas - Diseño limpio tipo tabla */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-200 dark:bg-slate-600 rounded-xl overflow-hidden">
        {/* Promedio Ganancia */}
        <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Prom. Ganancia
          </p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            ${m.avgWin.toFixed(0)}
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
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            ${Math.abs(m.avgLoss).toFixed(0)}
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
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            ${m.bestDay.amount.toFixed(0)}
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
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            ${m.worstDay.amount.toFixed(0)}
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
              className="bg-slate-600 dark:bg-slate-400 transition-all duration-500"
              style={{ width: `${winPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
