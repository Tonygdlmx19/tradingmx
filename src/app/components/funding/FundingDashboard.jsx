"use client";
import { Trophy, RotateCcw, X, Trash2 } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useLanguage } from '../LanguageProvider';
import ChallengeStatusBanner from './ChallengeStatusBanner';
import FundingStatsCards from './FundingStatsCards';
import FundingRulesCard from './FundingRulesCard';
import FundingTradeForm from './FundingTradeForm';
import FundingTradesTable from './FundingTradesTable';

export default function FundingDashboard({
  challenge,
  trades,
  estadoChallenge,
  onAddTrade,
  onDeleteTrade,
  onResetChallenge,
  onAbandonChallenge,
  onClose,
}) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const labels = {
    es: {
      fundingSimulator: 'Simulador de Fondeo',
      resetTitle: 'Reiniciar challenge (mismas reglas)',
      abandonTitle: 'Abandonar y elegir otro challenge',
      backToJournal: 'Volver al journal',
      challengeCompleted: 'Challenge Completado!',
      challengeFailed: 'Challenge Fallido',
      congratulations: 'Felicidades! Has demostrado que puedes pasar el challenge.',
      dontGiveUp: 'No te desanimes, puedes volver a intentarlo.',
      newChallenge: 'Nuevo Challenge',
    },
    en: {
      fundingSimulator: 'Funding Simulator',
      resetTitle: 'Reset challenge (same rules)',
      abandonTitle: 'Abandon and choose another challenge',
      backToJournal: 'Back to journal',
      challengeCompleted: 'Challenge Completed!',
      challengeFailed: 'Challenge Failed',
      congratulations: 'Congratulations! You have proven you can pass the challenge.',
      dontGiveUp: 'Don\'t give up, you can try again.',
      newChallenge: 'New Challenge',
    },
  };
  const t = labels[language] || labels.es;

  const { estado, metricas, nivelRiesgo } = estadoChallenge;
  const { reglas, empresa, nombreChallenge } = challenge;

  // Calcular PnL del dia actual para el form
  const hoy = new Date().toISOString().split('T')[0];
  const pnlDiario = trades
    .filter(t => t.fecha === hoy)
    .reduce((sum, t) => sum + t.res, 0);

  const metricasConPnlDiario = {
    ...metricas,
    pnlDiario,
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 px-4 py-3 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy size={24} className="text-amber-500"/>
            <div>
              <h1 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {nombreChallenge}
              </h1>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.fundingSimulator}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset button */}
            <button
              onClick={onResetChallenge}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
              title={t.resetTitle}
            >
              <RotateCcw size={18}/>
            </button>
            {/* Abandon button */}
            <button
              onClick={onAbandonChallenge}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
              }`}
              title={t.abandonTitle}
            >
              <Trash2 size={18}/>
            </button>
            {/* Close button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
              title={t.backToJournal}
            >
              <X size={18}/>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Status Banner */}
        <ChallengeStatusBanner
          estado={estado}
          nivelRiesgo={nivelRiesgo}
          metricas={metricas}
          reglas={reglas}
        />

        {/* Stats Cards */}
        <FundingStatsCards
          metricas={metricas}
          reglas={reglas}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Form & Rules */}
          <div className="lg:col-span-4 space-y-4">
            {/* Trade Form - solo si el challenge está activo */}
            {estado === 'activo' && (
              <FundingTradeForm
                onAddTrade={onAddTrade}
                reglas={reglas}
                metricas={metricasConPnlDiario}
                disabled={estado !== 'activo'}
              />
            )}

            {/* Challenge terminado */}
            {estado !== 'activo' && (
              <div className={`p-6 rounded-2xl border text-center ${
                estado === 'aprobado'
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <Trophy size={48} className={`mx-auto mb-3 ${estado === 'aprobado' ? 'text-green-500' : 'text-red-500'}`}/>
                <h3 className={`font-bold text-lg ${estado === 'aprobado' ? 'text-green-500' : 'text-red-500'}`}>
                  {estado === 'aprobado' ? t.challengeCompleted : t.challengeFailed}
                </h3>
                <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {estado === 'aprobado' ? t.congratulations : t.dontGiveUp}
                </p>
                <button
                  onClick={onResetChallenge}
                  className={`mt-4 px-4 py-2 rounded-xl font-bold text-sm ${
                    isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <RotateCcw size={14} className="inline mr-2"/>
                  {t.newChallenge}
                </button>
              </div>
            )}

            {/* Rules Card */}
            <FundingRulesCard
              reglas={reglas}
              metricas={metricas}
              empresa={empresa}
            />
          </div>

          {/* Right Column - Trades Table */}
          <div className="lg:col-span-8">
            <FundingTradesTable
              trades={trades}
              onDeleteTrade={estado === 'activo' ? onDeleteTrade : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
