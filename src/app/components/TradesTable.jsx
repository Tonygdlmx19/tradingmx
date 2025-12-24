"use client";
import { List, Image, FileText, ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function TradesTable({ trades, onTradeClick }) {
  const { isDark } = useTheme();

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
          <List size={18} className={`mr-2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}/> Historial de Trades
        </h3>
        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
          Toca un trade para ver detalles
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[500px]">
          <thead className={`text-[10px] sm:text-xs uppercase font-bold tracking-wider ${
            isDark ? 'text-slate-400 bg-slate-800/50' : 'text-slate-400 bg-slate-50/50'
          }`}>
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4">Fecha</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4">Activo</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">Dir</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Resultado</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">Info</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center"></th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
            {trades.slice().reverse().map((t) => (
              <tr 
                key={t.id} 
                onClick={() => onTradeClick(t)}
                className={`transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                }`}
              >
                <td className={`px-4 sm:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.fecha}
                </td>
                <td className={`px-4 sm:px-6 py-3 sm:py-4 font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                  {t.activo}
                  {t.lotes && (
                    <span className={`ml-1 text-[10px] font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      x{t.lotes}
                    </span>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                  <span className={`px-2 sm:px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    t.dir === 'Long' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {t.dir}
                  </span>
                </td>
                <td className={`px-4 sm:px-6 py-3 sm:py-4 text-right font-black text-sm ${
                  t.res >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {t.res >= 0 ? '+' : ''}{t.res?.toFixed(2)}$
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Emoji de emoción */}
                    <span className="text-base" title={t.emo}>
                      {getEmojiForEmotion(t.emo)}
                    </span>
                    {/* Indicador de imagen */}
                    {t.imagen && (
                      <Image size={14} className="text-blue-400" title="Tiene imagen" />
                    )}
                    {/* Indicador de notas */}
                    {t.notas && (
                      <FileText size={14} className="text-purple-400" title="Tiene notas" />
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
          <p className="italic">No hay trades registrados.</p>
          <p className="text-xs mt-2">Registra tu primer trade usando el formulario.</p>
        </div>
      )}
    </div>
  );
}
