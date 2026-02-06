"use client";
import { CheckCircle2, AlertTriangle, XCircle, Trophy, Clock } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useLanguage } from '../LanguageProvider';

export default function ChallengeStatusBanner({ estado, nivelRiesgo, metricas, reglas }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const labels = {
    es: {
      approved: 'CHALLENGE APROBADO',
      approvedSub: 'Felicidades! Has completado el challenge exitosamente',
      failed: 'CHALLENGE FALLIDO',
      failedSub: 'Has violado una de las reglas del challenge',
      dangerZone: 'EN ZONA DE PELIGRO',
      dangerSub: (pct) => `Drawdown al ${pct}% del límite - opera con precaución`,
      caution: 'PRECAUCIÓN',
      cautionSub: (pct) => `Drawdown al ${pct}% del límite`,
      onTrack: 'EN BUEN CAMINO',
      onTrackSub: 'Sigue operando con disciplina',
      ofTarget: 'del objetivo',
      progressTo: 'Progreso hacia',
      daysRemaining: 'días restantes',
      minDays: 'días mínimos',
    },
    en: {
      approved: 'CHALLENGE APPROVED',
      approvedSub: 'Congratulations! You have completed the challenge successfully',
      failed: 'CHALLENGE FAILED',
      failedSub: 'You have violated one of the challenge rules',
      dangerZone: 'DANGER ZONE',
      dangerSub: (pct) => `Drawdown at ${pct}% of limit - trade with caution`,
      caution: 'CAUTION',
      cautionSub: (pct) => `Drawdown at ${pct}% of limit`,
      onTrack: 'ON TRACK',
      onTrackSub: 'Keep trading with discipline',
      ofTarget: 'of target',
      progressTo: 'Progress to',
      daysRemaining: 'days remaining',
      minDays: 'min days',
    },
  };
  const t = labels[language] || labels.es;

  const getStatusConfig = () => {
    if (estado === 'aprobado') {
      return {
        icon: Trophy,
        title: t.approved,
        subtitle: t.approvedSub,
        bgClass: 'bg-green-500/10 border-green-500/30',
        textClass: 'text-green-500',
        iconClass: 'text-green-500',
      };
    }

    if (estado === 'fallido') {
      return {
        icon: XCircle,
        title: t.failed,
        subtitle: t.failedSub,
        bgClass: 'bg-red-500/10 border-red-500/30',
        textClass: 'text-red-500',
        iconClass: 'text-red-500',
      };
    }

    // Estado activo - verificar nivel de riesgo
    if (nivelRiesgo >= 80) {
      return {
        icon: AlertTriangle,
        title: t.dangerZone,
        subtitle: t.dangerSub(nivelRiesgo.toFixed(0)),
        bgClass: 'bg-red-500/10 border-red-500/30',
        textClass: 'text-red-500',
        iconClass: 'text-red-500 animate-pulse',
      };
    }

    if (nivelRiesgo >= 50) {
      return {
        icon: AlertTriangle,
        title: t.caution,
        subtitle: t.cautionSub(nivelRiesgo.toFixed(0)),
        bgClass: 'bg-amber-500/10 border-amber-500/30',
        textClass: 'text-amber-500',
        iconClass: 'text-amber-500',
      };
    }

    return {
      icon: CheckCircle2,
      title: t.onTrack,
      subtitle: t.onTrackSub,
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
              {metricas.progresoTarget.toFixed(1)}% {t.ofTarget}
            </p>
          </div>
        )}
      </div>

      {/* Barra de progreso del objetivo */}
      {estado === 'activo' && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {t.progressTo} {formatMoney(reglas.profitTargetUSD)}
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
            {metricas.diasRestantes} {t.daysRemaining}
          </span>
          {reglas.diasMinimos > 0 && (
            <>
              <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                {metricas.diasOperados}/{reglas.diasMinimos} {t.minDays}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
