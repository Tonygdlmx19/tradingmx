"use client";
import { CheckCircle2, AlertTriangle, XCircle, Trophy, Clock } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export default function ChallengeStatusBanner({ estado, nivelRiesgo, metricas, reglas }) {
  const { isDark } = useTheme();

  const getStatusConfig = () => {
    if (estado === 'aprobado') {
      return {
        icon: Trophy,
        title: 'CHALLENGE APROBADO',
        subtitle: 'Felicidades! Has completado el challenge exitosamente',
        bgClass: 'bg-green-500/10 border-green-500/30',
        textClass: 'text-green-500',
        iconClass: 'text-green-500',
      };
    }

    if (estado === 'fallido') {
      return {
        icon: XCircle,
        title: 'CHALLENGE FALLIDO',
        subtitle: 'Has violado una de las reglas del challenge',
        bgClass: 'bg-red-500/10 border-red-500/30',
        textClass: 'text-red-500',
        iconClass: 'text-red-500',
      };
    }

    // Estado activo - verificar nivel de riesgo
    if (nivelRiesgo >= 80) {
      return {
        icon: AlertTriangle,
        title: 'EN ZONA DE PELIGRO',
        subtitle: `Drawdown al ${nivelRiesgo.toFixed(0)}% del limite - opera con precaucion`,
        bgClass: 'bg-red-500/10 border-red-500/30',
        textClass: 'text-red-500',
        iconClass: 'text-red-500 animate-pulse',
      };
    }

    if (nivelRiesgo >= 50) {
      return {
        icon: AlertTriangle,
        title: 'PRECAUCION',
        subtitle: `Drawdown al ${nivelRiesgo.toFixed(0)}% del limite`,
        bgClass: 'bg-amber-500/10 border-amber-500/30',
        textClass: 'text-amber-500',
        iconClass: 'text-amber-500',
      };
    }

    return {
      icon: CheckCircle2,
      title: 'EN BUEN CAMINO',
      subtitle: 'Sigue operando con disciplina',
      bgClass: 'bg-green-500/10 border-green-500/30',
      textClass: 'text-green-500',
      iconClass: 'text-green-500',
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className={`p-4 rounded-2xl border ${config.bgClass}`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <Icon size={28} className={config.iconClass}/>
        </div>
        <div className="flex-1">
          <h3 className={`font-black text-sm ${config.textClass}`}>
            {config.title}
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {config.subtitle}
          </p>
        </div>

        {/* Stats rapidos */}
        {estado === 'activo' && (
          <div className="text-right">
            <p className={`text-lg font-black ${metricas.pnlTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metricas.pnlTotal >= 0 ? '+' : ''}{formatMoney(metricas.pnlTotal)}
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {metricas.progresoTarget.toFixed(1)}% del objetivo
            </p>
          </div>
        )}
      </div>

      {/* Barra de progreso del objetivo */}
      {estado === 'activo' && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Progreso hacia {formatMoney(reglas.profitTargetUSD)}
            </span>
            <span className={`font-bold ${metricas.progresoTarget >= 100 ? 'text-green-500' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {metricas.progresoTarget.toFixed(1)}%
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                metricas.progresoTarget >= 100 ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, metricas.progresoTarget))}%` }}
            />
          </div>
        </div>
      )}

      {/* Info de dias si aplica */}
      {estado === 'activo' && reglas.tiempoLimite > 0 && metricas.diasRestantes !== null && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <Clock size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'}/>
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            {metricas.diasRestantes} dias restantes
          </span>
          {reglas.diasMinimos > 0 && (
            <>
              <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                {metricas.diasOperados}/{reglas.diasMinimos} dias minimos
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
