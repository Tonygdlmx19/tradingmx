"use client";
import { List, Image, FileText, ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function TradesTable({ trades, onTradeClick }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const labels = {
    es: {
      title: 'Historial de Trades',
      tapForDetails: 'Toca un trade para ver detalles',
      date: 'Fecha',
      asset: 'Activo',
      dir: 'Dir',
      result: 'Resultado',
      info: 'Info',
      noTrades: 'No hay trades registrados.',
      recordFirst: 'Registra tu primer trade usando el formulario.',
      hasImage: 'Tiene imagen',
      hasNotes: 'Tiene notas',
    },
    en: {
      title: 'Trade History',
      tapForDetails: 'Tap a trade to see details',
      date: 'Date',
      asset: 'Asset',
      dir: 'Dir',
      result: 'Result',
      info: 'Info',
      noTrades: 'No trades recorded.',
      recordFirst: 'Record your first trade using the form.',
      hasImage: 'Has image',
      hasNotes: 'Has notes',
    },
  };
  const t = labels[language];

  const getEmojiForEmotion = (emo) => {
    const emojis = {
      'Neutral': '😐',
      'Calmado': '😌',
      'Ansioso': '😰',
      'Venganza': '😤',
      'Miedo': '😨',
      'Eufórico': '🤑',
      'Frustrado': '😔',
    };
    return emojis[emo] || '😐';
  };

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className={`p-4 sm:p-6 border-b flex justify-between items-center ${
        isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <h3 className={`font-bold flex items-center text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <List size={18} className={`mr-2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}/> {t.title}
        </h3>
        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
          {t.tapForDetails}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[500px]">
          <thead className={`text-[10px] sm:text-xs uppercase font-bold tracking-wider ${
            isDark ? 'text-slate-400 bg-slate-800/50' : 'text-slate-400 bg-slate-50/50'
          }`}>
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4">{t.date}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4">{t.asset}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">{t.dir}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">{t.result}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">{t.info}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center"></th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
            {trades.slice().reverse().map((trade) => (
              <tr
                key={trade.id}
                onClick={() => onTradeClick(trade)}
                className={`transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                }`}
              >
                <td className={`px-4 sm:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {trade.fecha}
                </td>
                <td className={`px-4 sm:px-6 py-3 sm:py-4 font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                  {trade.activo}
                  {trade.lotes && (
                    <span className={`ml-1 text-[10px] font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      x{trade.lotes}
                    </span>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                  <span className={`px-2 sm:px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    trade.dir === 'Long' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {trade.dir}
                  </span>
                </td>
                <td className={`px-4 sm:px-6 py-3 sm:py-4 text-right font-black text-sm ${
                  trade.res >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trade.res >= 0 ? '+' : ''}{trade.res?.toFixed(2)}$
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-base" title={trade.emo}>
                      {getEmojiForEmotion(trade.emo)}
                    </span>
                    {trade.imagen && (
                      <Image size={14} className="text-blue-400" title={t.hasImage} />
                    )}
                    {trade.notas && (
                      <FileText size={14} className="text-purple-400" title={t.hasNotes} />
                    )}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                  <ChevronRight size={16} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {trades.length === 0 && (
        <div className={`p-8 sm:p-12 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <p className="italic">{t.noTrades}</p>
          <p className="text-xs mt-2">{t.recordFirst}</p>
        </div>
      )}
    </div>
  );
}
