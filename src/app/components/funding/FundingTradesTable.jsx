"use client";
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export default function FundingTradesTable({ trades, onDeleteTrade }) {
  const { isDark } = useTheme();

  if (!trades || trades.length === 0) {
    return (
      <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          No hay trades registrados aun
        </p>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Registra tu primer trade para comenzar el seguimiento
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
          Historial de Trades ({trades.length})
        </h3>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full">
          <thead className={`sticky top-0 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <tr className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Activo</th>
              <th className="text-center p-3">Dir</th>
              <th className="text-right p-3">P&L</th>
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
                  {onDeleteTrade && (
                    <button
                      onClick={() => onDeleteTrade(trade.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                      title="Eliminar trade"
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
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Total P&L:</span>
          <span className={`font-bold ${trades.reduce((sum, t) => sum + t.res, 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatMoney(trades.reduce((sum, t) => sum + t.res, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
