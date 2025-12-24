"use client";
import { useState, useEffect } from 'react';
import { Activity, Percent, DollarSign, RefreshCw } from 'lucide-react';
import { useTheme } from './ThemeProvider';

// 📊 ACTIVOS DE TRADING - Organizados por categoría
const ACTIVOS_TRADING = {
  'Índices US': [
    { symbol: 'MNQ', name: 'Micro Nasdaq' },
    { symbol: 'MES', name: 'Micro S&P 500' },
    { symbol: 'NQ', name: 'Nasdaq 100' },
    { symbol: 'ES', name: 'S&P 500' },
    { symbol: 'YM', name: 'Dow Jones' },
    { symbol: 'MYM', name: 'Micro Dow' },
    { symbol: 'RTY', name: 'Russell 2000' },
    { symbol: 'M2K', name: 'Micro Russell' },
  ],
  'Índices Globales': [
    { symbol: 'DAX', name: 'DAX 40 (Alemania)' },
    { symbol: 'FTSE', name: 'FTSE 100 (UK)' },
    { symbol: 'CAC', name: 'CAC 40 (Francia)' },
    { symbol: 'NIKKEI', name: 'Nikkei 225 (Japón)' },
    { symbol: 'HSI', name: 'Hang Seng (HK)' },
  ],
  'Metales': [
    { symbol: 'XAU/USD', name: 'Oro' },
    { symbol: 'XAG/USD', name: 'Plata' },
    { symbol: 'GC', name: 'Oro Futuros' },
    { symbol: 'MGC', name: 'Micro Oro' },
    { symbol: 'SI', name: 'Plata Futuros' },
    { symbol: 'HG', name: 'Cobre' },
    { symbol: 'PL', name: 'Platino' },
  ],
  'Energía': [
    { symbol: 'WTI', name: 'Petróleo WTI' },
    { symbol: 'BRENT', name: 'Petróleo Brent' },
    { symbol: 'CL', name: 'Crudo Futuros' },
    { symbol: 'MCL', name: 'Micro Crudo' },
    { symbol: 'NG', name: 'Gas Natural' },
  ],
  'Forex Mayores': [
    { symbol: 'EUR/USD', name: 'Euro/Dólar' },
    { symbol: 'GBP/USD', name: 'Libra/Dólar' },
    { symbol: 'USD/JPY', name: 'Dólar/Yen' },
    { symbol: 'USD/CHF', name: 'Dólar/Franco' },
    { symbol: 'AUD/USD', name: 'Aussie/Dólar' },
    { symbol: 'USD/CAD', name: 'Dólar/CAD' },
    { symbol: 'NZD/USD', name: 'NZD/Dólar' },
  ],
  'Forex Cruces': [
    { symbol: 'EUR/GBP', name: 'Euro/Libra' },
    { symbol: 'EUR/JPY', name: 'Euro/Yen' },
    { symbol: 'GBP/JPY', name: 'Libra/Yen' },
    { symbol: 'AUD/JPY', name: 'Aussie/Yen' },
    { symbol: 'EUR/AUD', name: 'Euro/Aussie' },
    { symbol: 'GBP/AUD', name: 'Libra/Aussie' },
  ],
  'Forex Exóticos': [
    { symbol: 'USD/MXN', name: 'Dólar/Peso MX' },
    { symbol: 'EUR/MXN', name: 'Euro/Peso MX' },
    { symbol: 'USD/ZAR', name: 'Dólar/Rand' },
    { symbol: 'USD/TRY', name: 'Dólar/Lira' },
    { symbol: 'USD/BRL', name: 'Dólar/Real' },
  ],
  'Crypto': [
    { symbol: 'BTC/USD', name: 'Bitcoin' },
    { symbol: 'ETH/USD', name: 'Ethereum' },
    { symbol: 'BTC', name: 'Bitcoin CME' },
    { symbol: 'MBT', name: 'Micro Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum CME' },
    { symbol: 'XRP/USD', name: 'Ripple' },
    { symbol: 'SOL/USD', name: 'Solana' },
  ],
};

// Detectar si es Forex para mostrar spread
const isForex = (symbol) => {
  return symbol.includes('/') && !symbol.includes('BTC') && !symbol.includes('ETH') && !symbol.includes('XRP') && !symbol.includes('SOL') && !symbol.includes('XAU') && !symbol.includes('XAG');
};

export default function RiskCalculator({ balance }) {
  const { isDark } = useTheme();
  const [activo, setActivo] = useState('MNQ');
  const [tipoUnidad, setTipoUnidad] = useState('contratos'); // contratos o lotes
  const [mode, setMode] = useState('ticks'); // ticks o points
  const [stopValue, setStopValue] = useState(20);
  const [spread, setSpread] = useState(1); // Solo para Forex
  const [valorPorPunto, setValorPorPunto] = useState(2); // Editable por usuario
  const [riesgoPorcentaje, setRiesgoPorcentaje] = useState(1.0);
  const [riesgoUSD, setRiesgoUSD] = useState(0);
  const [resultado, setResultado] = useState({ cantidad: 0, stopIdeal: 0 });
  
  // Inicializar riesgo USD
  useEffect(() => {
    if (balance > 0 && riesgoUSD === 0) {
      setRiesgoUSD((balance * 0.01).toFixed(2));
    }
  }, [balance]);

  // Calcular posición
  useEffect(() => {
    if (valorPorPunto <= 0 || stopValue <= 0) return;
    
    // Convertir stop a puntos si está en ticks
    let stopEnPuntos = mode === 'ticks' ? stopValue / 4 : stopValue;
    if (stopEnPuntos <= 0) stopEnPuntos = 0.25;
    
    // Agregar spread si es Forex
    const spreadPuntos = isForex(activo) ? (spread / 10) : 0; // pips a puntos
    const stopTotal = stopEnPuntos + spreadPuntos;
    
    // Cálculo
    const costoPorUnidad = stopTotal * valorPorPunto;
    if (costoPorUnidad <= 0) return;
    
    const cantidadReal = Math.floor(riesgoUSD / costoPorUnidad);
    const stopIdealPuntos = riesgoUSD / ((cantidadReal + 1) * valorPorPunto);
    const stopIdealDisplay = mode === 'ticks'
      ? Math.floor(stopIdealPuntos * 4)
      : stopIdealPuntos.toFixed(2);
    
    setResultado({
      cantidad: Math.max(0, cantidadReal),
      stopIdeal: stopIdealDisplay,
      esTick: mode === 'ticks',
    });
  }, [riesgoUSD, stopValue, activo, mode, valorPorPunto, spread]);

  const handleRiesgoPctChange = (value) => {
    setRiesgoPorcentaje(value);
    setRiesgoUSD((balance * (value / 100)).toFixed(2));
  };

  const handleRiesgoUSDChange = (value) => {
    setRiesgoUSD(value);
    setRiesgoPorcentaje(((value / balance) * 100).toFixed(2));
  };

  const toggleMode = (newMode) => {
    if (newMode === 'points' && mode === 'ticks') {
      setStopValue(stopValue / 4);
    } else if (newMode === 'ticks' && mode === 'points') {
      setStopValue(stopValue * 4);
    }
    setMode(newMode);
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-5">
        <h3 className={`text-xs sm:text-sm font-bold flex items-center uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <Activity size={16} className="mr-2 text-blue-500"/> Risk Master
        </h3>
        <div className={`flex rounded-lg p-1 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => toggleMode('points')}
            className={`text-[10px] px-2 sm:px-3 py-1 rounded-md font-bold transition-all ${
              mode === 'points' ? 'bg-blue-600 text-white' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            PTS
          </button>
          <button
            onClick={() => toggleMode('ticks')}
            className={`text-[10px] px-2 sm:px-3 py-1 rounded-md font-bold transition-all ${
              mode === 'ticks' ? 'bg-blue-600 text-white' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            TICKS
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Activo */}
        <div className="space-y-1">
          <label className={`text-[10px] uppercase font-bold pl-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Activo
          </label>
          <select
            className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none focus:border-blue-500 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
            value={activo}
            onChange={e => setActivo(e.target.value)}
          >
            {Object.entries(ACTIVOS_TRADING).map(([categoria, activos]) => (
              <optgroup key={categoria} label={`── ${categoria} ──`}>
                {activos.map(a => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} - {a.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Tipo de unidad: Contratos vs Lotes */}
        <div className="space-y-1">
          <label className={`text-[10px] uppercase font-bold pl-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Tipo de posición
          </label>
          <div className={`flex rounded-xl p-1 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setTipoUnidad('contratos')}
              className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${
                tipoUnidad === 'contratos' 
                  ? 'bg-blue-600 text-white' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Contratos
            </button>
            <button
              onClick={() => setTipoUnidad('lotes')}
              className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${
                tipoUnidad === 'lotes' 
                  ? 'bg-blue-600 text-white' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lotes
            </button>
          </div>
        </div>

        {/* Valor por punto (editable) */}
        <div className="space-y-1">
          <label className={`text-[10px] uppercase font-bold pl-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Valor por punto ($)
          </label>
          <input
            type="number"
            step="0.01"
            className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-blue-500 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
            value={valorPorPunto}
            onChange={e => setValorPorPunto(Number(e.target.value))}
            placeholder="Ej: 2 para MNQ"
          />
        </div>

        {/* Stop */}
        <div className="space-y-1">
          <label className={`text-[10px] uppercase font-bold pl-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Stop ({mode === 'ticks' ? 'ticks' : 'puntos'})
          </label>
          <input
            type="number"
            step={mode === 'ticks' ? 1 : 0.25}
            className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-blue-500 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
            value={stopValue}
            onChange={e => setStopValue(Number(e.target.value))}
          />
        </div>

        {/* Spread (solo Forex) */}
        {isForex(activo) && (
          <div className="space-y-1">
            <label className={`text-[10px] uppercase font-bold pl-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              Spread (pips)
            </label>
            <input
              type="number"
              step="0.1"
              className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-amber-500 ${
                isDark ? 'bg-slate-800 border-amber-700/50 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
              value={spread}
              onChange={e => setSpread(Number(e.target.value))}
              placeholder="Spread de tu broker"
            />
          </div>
        )}

        {/* Riesgo % y USD */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={`text-[10px] uppercase font-bold pl-1 flex items-center ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <Percent size={10} className="mr-1"/> Riesgo %
            </label>
            <input
              type="number"
              step="0.1"
              className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-emerald-500 ${
                isDark ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'
              }`}
              value={riesgoPorcentaje}
              onChange={e => handleRiesgoPctChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className={`text-[10px] uppercase font-bold pl-1 flex items-center ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <DollarSign size={10} className="mr-1"/> Riesgo USD
            </label>
            <div className="relative">
              <span className={`absolute left-2.5 top-2.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>$</span>
              <input
                type="number"
                className={`w-full border rounded-xl p-2.5 pl-6 text-sm font-bold outline-none focus:border-emerald-500 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'
                }`}
                value={riesgoUSD}
                onChange={e => handleRiesgoUSDChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 flex justify-between items-center shadow-lg">
          <div>
            <p className="text-[10px] text-blue-100 uppercase font-bold mb-1">Posición Sugerida</p>
            <p className="text-2xl sm:text-3xl font-black text-white leading-none">
              {resultado.cantidad} <span className="text-sm font-medium opacity-70">{tipoUnidad === 'contratos' ? 'Contratos' : 'Lotes'}</span>
            </p>
          </div>
          {resultado.cantidad > 0 && (
            <div className="text-right">
              <p className="text-[9px] text-blue-100 opacity-80 mb-0.5">Optimizar (+1):</p>
              <p className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded text-white">
                Stop {resultado.stopIdeal} {resultado.esTick ? 't' : 'pts'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}