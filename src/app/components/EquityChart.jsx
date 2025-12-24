"use client";
import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function EquityChart({ data, startBalance }) {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ChartComponents, setChartComponents] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Importar recharts solo en el cliente
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
    });
  }, []);

  // Mensaje cuando no hay datos
  if (!data || data.length <= 1) {
    return (
      <div className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <TrendingUp size={18} className="text-blue-500"/> Curva de Capital
          </h3>
        </div>
        <div className={`h-[200px] sm:h-[280px] flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <p className="text-sm italic">Registra trades para ver la gráfica</p>
        </div>
      </div>
    );
  }

  // Loading mientras carga recharts
  if (!mounted || !ChartComponents) {
    return (
      <div className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <TrendingUp size={18} className="text-blue-500"/> Curva de Capital
          </h3>
        </div>
        <div className={`h-[200px] sm:h-[280px] flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } = ChartComponents;

  return (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <TrendingUp size={18} className="text-blue-500"/> Curva de Capital
        </h3>
      </div>
      
      <div className="h-[200px] sm:h-[280px] lg:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} 
              tickFormatter={(val) => `$${(val/1000).toFixed(1)}k`}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: '12px',
              }} 
              formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Balance']}
            />
            <ReferenceLine 
              y={startBalance} 
              stroke={isDark ? '#64748b' : '#94a3b8'} 
              strokeDasharray="3 3" 
            />
            <Area 
              type="monotone" 
              dataKey="bal" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#equityGradient)" 
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
