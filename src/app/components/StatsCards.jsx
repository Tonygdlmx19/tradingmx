"use client";
import { Wallet, TrendingUp, Target, AlertTriangle, Crosshair } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function StatsCards({ stats, currencySymbol = '$', selectedAccount }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const labels = {
    es: {
      balance: 'Balance',
      profitFactor: 'Profit Factor',
      winRate: 'Win Rate',
      maxDrawdown: 'Max DD',
      totalPoints: 'Puntos Totales',
      avgPoints: 'Promedio/Trade',
      totalSwap: 'Total Swap',
      trades: 'trades',
    },
    en: {
      balance: 'Balance',
      profitFactor: 'Profit Factor',
      winRate: 'Win Rate',
      maxDrawdown: 'Max DD',
      totalPoints: 'Total Points',
      avgPoints: 'Avg/Trade',
      totalSwap: 'Total Swap',
      trades: 'trades',
    },
  };

  const t = labels[language];

  // Calcular porcentaje de crecimiento
  const growthPct = stats.startBalance > 0
    ? ((stats.balance - stats.startBalance) / stats.startBalance) * 100
    : 0;

  // Iconos monocromos: el color se reserva para los valores con signo.
  const iconStyle = isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600';
  const badgeFor = (pct) => {
    if (pct > 0) return { text: `+${pct.toFixed(1)}%`, color: 'bg-green-500/10 text-green-600' };
    if (pct < 0) return { text: `${pct.toFixed(1)}%`, color: 'bg-red-500/10 text-red-600' };
    return { text: '0.0%', color: isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500' };
  };

  const cards = [
    {
      icon: <Wallet size={18} />,
      label: t.balance,
      value: `${currencySymbol}${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      badge: badgeFor(growthPct)
    },
    {
      icon: <TrendingUp size={18} />,
      label: t.profitFactor,
      value: stats.profitFactor.toFixed(2),
    },
    {
      icon: <Target size={18} />,
      label: t.winRate,
      value: `${stats.winRate.toFixed(0)}%`,
    },
    {
      icon: <AlertTriangle size={18} />,
      label: t.maxDrawdown,
      value: `${stats.maxDD.toFixed(2)}%`,
    },
  ];

  return (
    <div data-tour="stats" className="space-y-3">
      {/* Header con cuenta seleccionada */}
      {selectedAccount && (
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${isDark ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
            {selectedAccount.broker} #{selectedAccount.numero}
          </span>
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {selectedAccount.divisa || 'USD'} - {stats.tradeCount} {t.trades}
          </span>
        </div>
      )}

      {/* Stats principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`p-3 sm:p-4 rounded-xl shadow-sm border transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
            }`}
          >
            <div className="flex justify-between mb-2">
              <div className={`p-2 ${iconStyle} rounded-lg`}>
                {card.icon}
              </div>
              {card.badge && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full h-fit ${card.badge.color}`}>
                  {card.badge.text}
                </span>
              )}
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              {card.label}
            </p>
            <h3 className={`text-lg sm:text-xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Métricas de puntos y swap */}
      {(stats.tradesConPuntos > 0 || stats.totalSwap > 0) && (
        <div className={`p-3 sm:p-4 rounded-xl shadow-sm border transition-colors ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 ${iconStyle} rounded-lg`}>
              <Crosshair size={18} />
            </div>
            <p className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.totalPoints}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className={`text-[10px] font-medium uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Total
              </p>
              <p className={`text-lg font-black ${
                stats.totalPuntos > 0 ? 'text-green-600' : stats.totalPuntos < 0 ? 'text-red-600' : isDark ? 'text-white' : 'text-slate-800'
              }`}>
                {stats.totalPuntos > 0 ? '+' : ''}{stats.totalPuntos.toFixed(1)}
              </p>
              <p className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {stats.tradesConPuntos} {t.trades}
              </p>
            </div>
            <div>
              <p className={`text-[10px] font-medium uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.avgPoints}
              </p>
              <p className={`text-lg font-black ${
                stats.promedioPuntos > 0 ? 'text-green-600' : stats.promedioPuntos < 0 ? 'text-red-600' : isDark ? 'text-white' : 'text-slate-800'
              }`}>
                {stats.promedioPuntos > 0 ? '+' : ''}{stats.promedioPuntos.toFixed(2)}
              </p>
            </div>
            <div>
              <p className={`text-[10px] font-medium uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.totalSwap}
              </p>
              <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                -{currencySymbol}{stats.totalSwap.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
