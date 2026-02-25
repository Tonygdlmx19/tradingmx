"use client";
import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function EquityChart({ data, startBalance, currencySymbol = '$' }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const labels = {
    es: {
      title: 'Curva de Capital',
      noData: 'Registra trades para ver la gráfica',
      balance: 'Balance',
      pnl: 'P&L',
      date: 'Fecha',
      time: 'Hora',
      deposit: 'Deposito',
      withdrawal: 'Retiro',
      transferIn: 'Transferencia entrada',
      transferOut: 'Transferencia salida',
      profit: 'Ganancia',
      loss: 'Pérdida',
    },
    en: {
      title: 'Equity Curve',
      noData: 'Record trades to see the chart',
      balance: 'Balance',
      pnl: 'P&L',
      date: 'Date',
      time: 'Time',
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      transferIn: 'Transfer in',
      transferOut: 'Transfer out',
      profit: 'Profit',
      loss: 'Loss',
    },
  };
  const t = labels[language];

  const [mounted, setMounted] = useState(false);
  const [ChartComponents, setChartComponents] = useState(null);
  const [viewMode, setViewMode] = useState('balance'); // 'balance' o 'pnl'

  useEffect(() => {
    setMounted(true);
    import('recharts').then((mod) => {
      setChartComponents({
        ResponsiveContainer: mod.ResponsiveContainer,
        AreaChart: mod.AreaChart,
        Area: mod.Area,
        XAxis: mod.XAxis,
        YAxis: mod.YAxis,
        CartesianGrid: mod.CartesianGrid,
        Tooltip: mod.Tooltip,
        ReferenceLine: mod.ReferenceLine,
      });
    }).catch(err => console.error('Error cargando recharts:', err));
  }, []);

  // Mensaje cuando no hay datos
  if (!data || data.length <= 1) {
    return (
      <div className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <TrendingUp size={18} className="text-blue-500"/> {t.title}
          </h3>
        </div>
        <div className={`h-[250px] flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <p className="text-sm italic">{t.noData}</p>
        </div>
      </div>
    );
  }

  // Loading
  if (!mounted || !ChartComponents) {
    return (
      <div className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <TrendingUp size={18} className="text-blue-500"/> {t.title}
          </h3>
        </div>
        <div className={`h-[250px] flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } = ChartComponents;

  // Transformar datos para vista P&L (solo ganancias/pérdidas de trading)
  const pnlData = data.reduce((acc, point, index) => {
    if (index === 0) {
      // Punto inicial siempre en 0 para P&L
      acc.push({ ...point, pnl: 0, bal: point.bal });
      return acc;
    }

    const prevPoint = acc[acc.length - 1];

    if (point.isMovement) {
      // Los movimientos no cambian el P&L, mantener el mismo valor
      acc.push({ ...point, pnl: prevPoint.pnl, bal: point.bal });
    } else {
      // Es un trade: calcular el cambio en balance (excluyendo el movimiento anterior si lo hubo)
      const balanceChange = point.bal - data[index - 1].bal;
      acc.push({ ...point, pnl: prevPoint.pnl + balanceChange, bal: point.bal });
    }

    return acc;
  }, []);

  // Seleccionar datos según el modo de vista
  const chartData = viewMode === 'pnl' ? pnlData : data;
  const dataKey = viewMode === 'pnl' ? 'pnl' : 'bal';

  // Determinar si el P&L final es positivo o negativo
  const finalPnl = pnlData.length > 0 ? pnlData[pnlData.length - 1].pnl : 0;
  const isPnlPositive = finalPnl >= 0;

  // Calcular domain del eje Y según el modo
  const values = chartData.map(d => viewMode === 'pnl' ? d.pnl : d.bal).filter(b => typeof b === 'number' && !isNaN(b));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal;
  const padding = range > 0 ? range * 0.15 : Math.abs(minVal) * 0.1 || 500;
  const yDomain = [Math.floor(minVal - padding), Math.ceil(maxVal + padding)];

  // Calcular posición del 0 en el gradiente (para P&L)
  // El gradiente va de arriba (0%) a abajo (100%)
  // Necesitamos saber dónde está el 0 en ese rango
  const yMin = yDomain[0];
  const yMax = yDomain[1];
  const zeroPosition = yMax <= 0 ? 0 : yMin >= 0 ? 100 : ((yMax - 0) / (yMax - yMin)) * 100;

  // Formatear valores según la magnitud
  const formatYAxis = (val) => {
    if (Math.abs(val) >= 1000000) return `${currencySymbol}${(val/1000000).toFixed(1)}M`;
    if (Math.abs(val) >= 1000) return `${currencySymbol}${(val/1000).toFixed(1)}k`;
    return `${currencySymbol}${val.toFixed(0)}`;
  };

  const getMovementLabel = (type) => {
    if (type === 'deposit') return t.deposit;
    if (type === 'withdrawal') return t.withdrawal;
    if (type === 'transfer_in') return t.transferIn;
    if (type === 'transfer_out') return t.transferOut;
    return type;
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <TrendingUp size={18} className="text-blue-500"/> {t.title}
        </h3>
        <div className="flex items-center gap-2">
          {/* Toggle Balance / P&L */}
          <div className={`flex rounded-lg overflow-hidden border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
            <button
              onClick={() => setViewMode('balance')}
              className={`px-2 py-1 text-[10px] font-bold transition-colors ${
                viewMode === 'balance'
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {t.balance}
            </button>
            <button
              onClick={() => setViewMode('pnl')}
              className={`px-2 py-1 text-[10px] font-bold transition-colors ${
                viewMode === 'pnl'
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {t.pnl}
            </button>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            {data.filter(d => !d.isMovement && d.name !== 'Inicio').length} trades
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 280, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
              {/* Gradiente que cambia de verde a rojo en la línea 0 */}
              <linearGradient id="pnlSplitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset={`${zeroPosition}%`} stopColor="#22c55e" stopOpacity={0.1}/>
                <stop offset={`${zeroPosition}%`} stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#334155' : '#e2e8f0'}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
              tickFormatter={formatYAxis}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: '12px',
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  const isPositiveMovement = d.movementType === 'deposit' || d.movementType === 'transfer_in';
                  const displayValue = viewMode === 'pnl' ? d.pnl : d.bal;
                  const isPnlPositive = viewMode === 'pnl' && d.pnl >= 0;
                  const isPnlNegative = viewMode === 'pnl' && d.pnl < 0;
                  return (
                    <div style={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      fontSize: '12px',
                    }}>
                      <p style={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: '4px', fontWeight: 600 }}>
                        {viewMode === 'pnl' ? t.pnl : t.balance}: <span style={{
                          color: viewMode === 'pnl'
                            ? (isPnlPositive ? '#22c55e' : '#ef4444')
                            : (isDark ? '#fff' : '#1e293b')
                        }}>
                          {viewMode === 'pnl' && displayValue >= 0 ? '+' : ''}{currencySymbol}{Number(displayValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </p>
                      {viewMode === 'balance' && d.isMovement && (
                        <p style={{
                          color: isPositiveMovement ? '#22c55e' : '#ef4444',
                          fontWeight: 600,
                          marginBottom: '4px'
                        }}>
                          {getMovementLabel(d.movementType)}: {isPositiveMovement ? '+' : '-'}{currencySymbol}{d.amount?.toFixed(2)}
                        </p>
                      )}
                      {d.fecha && (
                        <p style={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '11px' }}>
                          {t.date}: {d.fecha} {d.hora && `• ${t.time}: ${d.hora}`}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={viewMode === 'pnl' ? 0 : startBalance}
              stroke={isDark ? '#64748b' : '#94a3b8'}
              strokeDasharray="5 5"
              strokeWidth={1}
            />
            {/* Marcadores de depósitos y transferencias entrantes */}
            {data.filter(d => d.isMovement && (d.movementType === 'deposit' || d.movementType === 'transfer_in')).map((d, i) => (
              <ReferenceLine
                key={`dep-${i}`}
                x={d.name}
                stroke="#22c55e"
                strokeDasharray="4 4"
                strokeWidth={2}
              />
            ))}
            {/* Marcadores de retiros y transferencias salientes */}
            {data.filter(d => d.isMovement && (d.movementType === 'withdrawal' || d.movementType === 'transfer_out')).map((d, i) => (
              <ReferenceLine
                key={`wit-${i}`}
                x={d.name}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={2}
              />
            ))}
            {viewMode === 'pnl' ? (
              <Area
                type="monotone"
                dataKey="pnl"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#pnlSplitGradient)"
                dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ) : (
              <Area
                type="monotone"
                dataKey="bal"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#equityGradient)"
                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
