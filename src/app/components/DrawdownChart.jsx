"use client";
import { useState, useEffect } from 'react';
import { TrendingDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function DrawdownChart({ data }) {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ChartComponents, setChartComponents] = useState(null);
  const [containerWidth, setContainerWidth] = useState(500);

  useEffect(() => {
    setMounted(true);
    import('recharts').then((mod) => {
      setChartComponents({
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

  // Medir el ancho del contenedor
  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('drawdown-chart-container');
      if (container) {
        setContainerWidth(container.offsetWidth - 32);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [mounted]);

  // Debug
  useEffect(() => {
    console.log('📉 DRAWDOWN DATA:', data);
  }, [data]);

  // Mensaje cuando no hay datos
  if (!data || data.length <= 1) {
    return (
      <div id="drawdown-chart-container" className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <TrendingDown size={18} className="text-red-500"/> Drawdown
          </h3>
        </div>
        <div className={`h-[180px] flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <p className="text-sm italic">Registra trades para ver la gráfica</p>
        </div>
      </div>
    );
  }

  // Loading
  if (!mounted || !ChartComponents) {
    return (
      <div id="drawdown-chart-container" className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <TrendingDown size={18} className="text-red-500"/> Drawdown
          </h3>
        </div>
        <div className={`h-[180px] flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } = ChartComponents;

  // Calcular domain del eje Y
  const ddValues = data.map(d => d.dd).filter(d => typeof d === 'number' && !isNaN(d));
  const minDD = Math.min(...ddValues, 0);
  const padding = Math.abs(minDD) * 0.2 || 2;
  const yDomain = [Math.floor(minDD - padding), 2];

  console.log('📉 Drawdown render - width:', containerWidth, 'domain:', yDomain);

  return (
    <div id="drawdown-chart-container" className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <TrendingDown size={18} className="text-red-500"/> Drawdown
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
          Max: {Math.abs(minDD).toFixed(1)}%
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <AreaChart 
          width={Math.max(containerWidth, 300)} 
          height={180} 
          data={data} 
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="ddGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={isDark ? '#334155' : '#e2e8f0'}
          />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
          />
          <YAxis 
            domain={yDomain}
            tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} 
            tickFormatter={(val) => `${val}%`}
            tickLine={false}
            axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
            width={45}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none',
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '12px',
            }} 
            formatter={(val) => [`${Number(val).toFixed(2)}%`, 'Drawdown']}
          />
          <ReferenceLine 
            y={0} 
            stroke={isDark ? '#64748b' : '#94a3b8'}
            strokeWidth={1}
          />
          <Area 
            type="monotone" 
            dataKey="dd" 
            stroke="#ef4444" 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#ddGradient)"
            dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </div>
    </div>
  );
}