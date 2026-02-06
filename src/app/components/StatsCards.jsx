"use client";
import { Wallet, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function StatsCards({ stats }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const labels = {
    es: {
      balance: 'Balance Final',
      profitFactor: 'Profit Factor',
      winRate: 'Win Rate',
      maxDrawdown: 'Max Drawdown',
    },
    en: {
      balance: 'Final Balance',
      profitFactor: 'Profit Factor',
      winRate: 'Win Rate',
      maxDrawdown: 'Max Drawdown',
    },
  };

  const t = labels[language];

  const cards = [
    {
      icon: <Wallet size={18} />,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
      label: t.balance,
      value: `$${stats.balance.toFixed(0)}`,
      badge: stats.totalPnl >= 0
        ? { text: `+${stats.totalPnl.toFixed(0)}$`, color: 'bg-green-500/20 text-green-500' }
        : { text: `${stats.totalPnl.toFixed(0)}$`, color: 'bg-red-500/20 text-red-500' }
    },
    {
      icon: <TrendingUp size={18} />,
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-500',
      label: t.profitFactor,
      value: stats.profitFactor.toFixed(2),
    },
    {
      icon: <Target size={18} />,
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-500',
      label: t.winRate,
      value: `${stats.winRate.toFixed(0)}%`,
    },
    {
      icon: <AlertTriangle size={18} />,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-500',
      label: t.maxDrawdown,
      value: `${stats.maxDD.toFixed(2)}%`,
    },
  ];

  return (
    <div data-tour="stats" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-3 sm:p-4 rounded-xl shadow-sm border transition-colors ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex justify-between mb-2">
            <div className={`p-2 ${card.bgColor} ${card.textColor} rounded-lg`}>
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
  );
}
