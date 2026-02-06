"use client";
import { Shield, Target, TrendingDown, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useLanguage } from '../LanguageProvider';

export default function FundingRulesCard({ reglas, metricas, empresa }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const labels = {
    es: {
      challengeRules: 'Reglas del Challenge',
      profitTarget: 'Profit Target',
      maxDailyDD: 'Max DD Diario',
      maxTotalDD: 'Max DD Total',
      minDays: 'Días Mínimos',
      timeLimit: 'Tiempo Límite',
      days: 'días',
      initialCapital: 'Capital Inicial',
    },
    en: {
      challengeRules: 'Challenge Rules',
      profitTarget: 'Profit Target',
      maxDailyDD: 'Max Daily DD',
      maxTotalDD: 'Max Total DD',
      minDays: 'Minimum Days',
      timeLimit: 'Time Limit',
      days: 'days',
      initialCapital: 'Initial Capital',
    },
  };
  const t = labels[language] || labels.es;

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const rules = [
    {
      label: t.profitTarget,
      value: `${formatMoney(reglas.profitTargetUSD)} (${reglas.profitTarget}%)`,
      current: metricas.pnlTotal,
      passed: metricas.pnlTotal >= reglas.profitTargetUSD,
      icon: Target,
    },
    {
      label: t.maxDailyDD,
      value: `${formatMoney(reglas.maxDrawdownDiarioUSD)} (${reglas.maxDrawdownDiario}%)`,
      current: metricas.drawdownDiario.usd,
      passed: metricas.drawdownDiario.porcentaje < reglas.maxDrawdownDiario,
      icon: TrendingDown,
      isLimit: true,
    },
    {
      label: t.maxTotalDD,
      value: `${formatMoney(reglas.maxDrawdownTotalUSD)} (${reglas.maxDrawdownTotal}%)`,
      current: metricas.drawdownTotal.usd,
      passed: metricas.drawdownTotal.porcentaje < reglas.maxDrawdownTotal,
      icon: TrendingDown,
      isLimit: true,
    },
    ...(reglas.diasMinimos > 0 ? [{
      label: t.minDays,
      value: `${reglas.diasMinimos} ${t.days}`,
      current: metricas.diasOperados,
      passed: metricas.diasOperados >= reglas.diasMinimos,
      icon: Calendar,
    }] : []),
    ...(reglas.tiempoLimite > 0 ? [{
      label: t.timeLimit,
      value: `${reglas.tiempoLimite} ${t.days}`,
      current: metricas.diasTranscurridos,
      passed: metricas.diasRestantes > 0,
      icon: Clock,
    }] : []),
  ];

  return (
    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Shield size={18} className="text-amber-500"/>
        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {t.challengeRules}
        </h3>
        {empresa && empresa !== 'custom' && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
            {empresa}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-xl ${
                isDark ? 'bg-slate-700/50' : 'bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'}/>
                <div>
                  <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {rule.label}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {rule.value}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {rule.passed ? (
                  <CheckCircle2 size={18} className="text-green-500"/>
                ) : (
                  <XCircle size={18} className={rule.isLimit ? 'text-red-500' : 'text-slate-400'}/>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Capital info */}
      <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex justify-between items-center">
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.initialCapital}</span>
          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
            {formatMoney(reglas.capitalInicial)}
          </span>
        </div>
      </div>
    </div>
  );
}
