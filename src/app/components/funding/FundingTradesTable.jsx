"use client";
import { useState } from 'react';
import { TrendingUp, TrendingDown, Trash2, Image, X } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useLanguage } from '../LanguageProvider';

export default function FundingTradesTable({ trades, onDeleteTrade }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);

  const labels = {
    es: {
      noTrades: 'No hay trades registrados aun',
      registerFirst: 'Registra tu primer trade para comenzar el seguimiento',
      tradeHistory: 'Historial de Trades',
      date: 'Fecha',
      asset: 'Activo',
      dir: 'Dir',
      pnl: 'P&L',
      img: 'Img',
      viewImages: (n) => `Ver ${n} imagen(es)`,
      deleteTrade: 'Eliminar trade',
      totalPnl: 'Total P&L:',
      screenshot: 'Captura',
    },
    en: {
      noTrades: 'No trades registered yet',
      registerFirst: 'Register your first trade to start tracking',
      tradeHistory: 'Trade History',
      date: 'Date',
      asset: 'Asset',
      dir: 'Dir',
      pnl: 'P&L',
      img: 'Img',
      viewImages: (n) => `View ${n} image(s)`,
      deleteTrade: 'Delete trade',
      totalPnl: 'Total P&L:',
      screenshot: 'Screenshot',
    },
  };
  const t = labels[language] || labels.es;

  if (!trades || trades.length === 0) {
    return (
      <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.noTrades}
        </p>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {t.registerFirst}
        </p>
      </div>
    );
  }

  const formatMoney = (value) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(value));
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  // Ordenar por fecha desc
  const sortedTrades = [...trades].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || a.fecha);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || b.fecha);
    return dateB - dateA;
  });

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {t.tradeHistory} ({trades.length})
        </h3>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full">
          <thead className={`sticky top-0 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <tr className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <th className="text-left p-3">{t.date}</th>
              <th className="text-left p-3">{t.asset}</th>
              <th className="text-center p-3">{t.dir}</th>
              <th className="text-right p-3">{t.pnl}</th>
              <th className="text-center p-3">{t.img}</th>
              <th className="text-center p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sortedTrades.map((trade, idx) => (
              <tr
                key={trade.id || idx}
                className={`border-t ${isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'}`}
              >
                <td className={`p-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {trade.fecha}
                </td>
                <td className={`p-3 text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {trade.activo}
                </td>
                <td className="p-3 text-center">
                  {trade.dir === 'Long' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-500">
                      <TrendingUp size={12}/> L
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500">
                      <TrendingDown size={12}/> S
                    </span>
                  )}
                </td>
                <td className={`p-3 text-right font-mono font-bold ${trade.res >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatMoney(trade.res)}
                </td>
                <td className="p-3 text-center">
                  {trade.imagenes && trade.imagenes.length > 0 ? (
                    <button
                      onClick={() => setSelectedTrade(trade)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-amber-500/20 text-amber-400' : 'hover:bg-amber-50 text-amber-500'
                      }`}
                      title={t.viewImages(trade.imagenes.length)}
                    >
                      <Image size={14}/>
                    </button>
                  ) : (
                    <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>-</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {onDeleteTrade && (
                    <button
                      onClick={() => onDeleteTrade(trade.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                      title={t.deleteTrade}
                    >
                      <Trash2 size={14}/>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
        <div className="flex justify-between items-center text-sm">
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t.totalPnl}</span>
          <span className={`font-bold ${trades.reduce((sum, t) => sum + t.res, 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatMoney(trades.reduce((sum, t) => sum + t.res, 0))}
          </span>
        </div>
      </div>

      {/* Modal de imágenes */}
      {selectedTrade && selectedTrade.imagenes && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-4 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {selectedTrade.activo} - {selectedTrade.dir}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedTrade.fecha} | {formatMoney(selectedTrade.res)}
                </p>
              </div>
              <button
                onClick={() => setSelectedTrade(null)}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'}/>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedTrade.imagenes.map((img, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold ${
                    isDark ? 'bg-slate-900/80 text-amber-400' : 'bg-white/90 text-amber-600'
                  }`}>
                    {img.temporalidad}
                  </span>
                  <img
                    src={img.data}
                    alt={`${img.temporalidad}`}
                    className="w-full rounded-xl border border-slate-700 cursor-pointer hover:opacity-90"
                    onClick={() => setViewingImage(img)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver imagen completa */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300"
            >
              <X size={28} />
            </button>
            <div className="bg-black/50 text-white text-center py-2 rounded-t-xl">
              <span className="font-bold">{viewingImage.temporalidad}</span>
            </div>
            <img
              src={viewingImage.data}
              alt={`${t.screenshot} ${viewingImage.temporalidad}`}
              className="w-full max-h-[80vh] object-contain rounded-b-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
