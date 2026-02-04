"use client";
import { DollarSign, TrendingDown, Target, Calendar, AlertTriangle } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { getColorRiesgo } from '../../utils/fundingCalculations';

export default function FundingStatsCards({ metricas, reglas }) {
  const { isDark } = useTheme();

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const cards = [
    {
      label: 'Balance Actual',
      value: formatMoney(metricas.balanceActual),
      subvalue: `${metricas.pnlPorcentaje >= 0 ? '+' : ''}${metricas.pnlPorcentaje.toFixed(2)}%`,
      icon: DollarSign,
      color: metricas.pnlTotal >= 0 ? 'green' : 'red',
    },
    {
      label: 'DD Diario',
      value: `${metricas.drawdownDiario.porcentaje.toFixed(2)}%`,
      subvalue: `Max: ${reglas.maxDrawdownDiario}%`,
      icon: TrendingDown,
      color: getColorRiesgo(metricas.drawdownDiario.porcentaje, reglas.maxDrawdownDiario),
      progress: (metricas.drawdownDiario.porcentaje / reglas.maxDrawdownDiario) * 100,
    },
    {
      label: 'DD Total',
      value: `${metricas.drawdownTotal.porcentaje.toFixed(2)}%`,
      subvalue: `Max: ${reglas.maxDrawdownTotal}%`,
      icon: TrendingDown,
      color: getColorRiesgo(metricas.drawdownTotal.porcentaje, reglas.maxDrawdownTotal),
      progress: (metricas.drawdownTotal.porcentaje / reglas.maxDrawdownTotal) * 100,
    },
    {
      label: 'Dias Operados',
      value: metricas.diasOperados,
      subvalue: reglas.diasMinimos > 0 ? `Min: ${reglas.diasMinimos}` : 'Sin minimo',
      icon: Calendar,
      color: reglas.diasMinimos > 0 && metricas.diasOperados >= reglas.diasMinimos ? 'green' : 'slate',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: {
        text: 'text-green-500',
        bg: isDark ? 'bg-green-500/10' : 'bg-green-50',
        progress: 'bg-green-500',
      },
      red: {
        text: 'text-red-500',
        bg: isDark ? 'bg-red-500/10' : 'bg-red-50',
        progress: 'bg-red-500',
      },
      amber: {
        text: 'text-amber-500',
        bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
        progress: 'bg-amber-500',
      },
      slate: {
        text: isDark ? 'text-slate-300' : 'text-slate-600',
        bg: isDark ? 'bg-slate-700/50' : 'bg-slate-50',
        progress: 'bg-slate-400',
      },
    };
    return colors[color] || colors.slate;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, idx) => {
        const colorClasses = getColorClasses(card.color);
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                <Icon size={16} className={colorClasses.text}/>
              </div>
              <span className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {card.label}
              </span>
            </div>

            <p className={`text-xl font-black ${colorClasses.text}`}>
              {card.value}
            </p>

            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {card.subvalue}
            </p>

            {/* Barra de progreso para DD */}
            {card.progress !== undefined && (
              <div className="mt-2">
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${colorClasses.progress}`}
                    style={{ width: `${Math.min(100, Math.max(0, card.progress))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
