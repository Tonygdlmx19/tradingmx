"use client";
import { useState, useMemo } from 'react';
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
  'Weltrade - PainX': [
    { symbol: 'PainX400', name: 'Pain X 400', spread: 10 },
    { symbol: 'PainX600', name: 'Pain X 600', spread: 15 },
    { symbol: 'PainX800', name: 'Pain X 800', spread: 20 },
    { symbol: 'PainX999', name: 'Pain X 999', spread: 15 },
    { symbol: 'PainX1200', name: 'Pain X 1200', spread: 25 },
  ],
  'Weltrade - GainX': [
    { symbol: 'GainX400', name: 'Gain X 400', spread: 10 },
    { symbol: 'GainX600', name: 'Gain X 600', spread: 15 },
    { symbol: 'GainX800', name: 'Gain X 800', spread: 20 },
    { symbol: 'GainX999', name: 'Gain X 999', spread: 15 },
    { symbol: 'GainX1200', name: 'Gain X 1200', spread: 25 },
  ],
  'Weltrade - FlipX': [
    { symbol: 'FlipX1', name: 'Flip X 1 (step 1)', spread: 20 },
    { symbol: 'FlipX2', name: 'Flip X 2 (step 1-2)', spread: 15 },
    { symbol: 'FlipX3', name: 'Flip X 3 (step 1-3)', spread: 10 },
    { symbol: 'FlipX4', name: 'Flip X 4 (step 1-4)', spread: 7 },
    { symbol: 'FlipX5', name: 'Flip X 5 (step 1-5)', spread: 6 },
  ],
  'Weltrade - SwitchX': [
    { symbol: 'SwitchX600', name: 'Switch X 600', spread: 15 },
    { symbol: 'SwitchX1200', name: 'Switch X 1200', spread: 25 },
    { symbol: 'SwitchX1800', name: 'Switch X 1800', spread: 40 },
  ],
  'Weltrade - BreakX': [
    { symbol: 'BreakX600', name: 'Break X 600', spread: 15 },
    { symbol: 'BreakX1200', name: 'Break X 1200', spread: 25 },
    { symbol: 'BreakX1800', name: 'Break X 1800', spread: 40 },
  ],
  'Weltrade - TrendX': [
    { symbol: 'TrendX600', name: 'Trend X 600', spread: 15 },
    { symbol: 'TrendX1200', name: 'Trend X 1200', spread: 25 },
    { symbol: 'TrendX1800', name: 'Trend X 1800', spread: 40 },
  ],
  'Weltrade - FX Vol': [
    { symbol: 'FXVol20', name: 'FX Vol 20', spread: 2 },
    { symbol: 'FXVol40', name: 'FX Vol 40', spread: 4 },
    { symbol: 'FXVol60', name: 'FX Vol 60', spread: 6 },
    { symbol: 'FXVol80', name: 'FX Vol 80', spread: 8 },
    { symbol: 'FXVol99', name: 'FX Vol 99', spread: 10 },
  ],
  'Weltrade - SFX Vol': [
    { symbol: 'SFXVol20', name: 'SFX Vol 20 (spikes)', spread: 3 },
    { symbol: 'SFXVol40', name: 'SFX Vol 40 (spikes)', spread: 5 },
    { symbol: 'SFXVol60', name: 'SFX Vol 60 (spikes)', spread: 7 },
    { symbol: 'SFXVol80', name: 'SFX Vol 80 (spikes)', spread: 9 },
    { symbol: 'SFXVol99', name: 'SFX Vol 99 (spikes)', spread: 11 },
  ],
};

// Detectar si es Forex para mostrar spread
const isForex = (symbol) => {
  return symbol.includes('/') && !symbol.includes('BTC') && !symbol.includes('ETH') && !symbol.includes('XRP') && !symbol.includes('SOL') && !symbol.includes('XAU') && !symbol.includes('XAG');
};

// Categorías de Weltrade
const WELTRADE_CATEGORIES = [
  'Weltrade - PainX',
  'Weltrade - GainX',
  'Weltrade - FlipX',
  'Weltrade - SwitchX',
  'Weltrade - BreakX',
  'Weltrade - TrendX',
  'Weltrade - FX Vol',
  'Weltrade - SFX Vol',
];

// Detectar si es Sintético Weltrade
const isSyntheticWeltrade = (symbol) => {
  return WELTRADE_CATEGORIES.some(cat =>
    ACTIVOS_TRADING[cat]?.some(a => a.symbol === symbol)
  );
};

// Obtener spread predefinido del sintético
const getSyntheticSpread = (symbol) => {
  for (const cat of WELTRADE_CATEGORIES) {
    const synthetic = ACTIVOS_TRADING[cat]?.find(a => a.symbol === symbol);
    if (synthetic) return synthetic.spread;
  }
  return 10;
};

export default function RiskCalculator({ balance }) {
  const { isDark } = useTheme();
  const [activo, setActivo] = useState('MNQ');
  const [tipoUnidad, setTipoUnidad] = useState('contratos'); // contratos o lotes
  const [mode, setMode] = useState('ticks'); // ticks o points
  const [stopValue, setStopValue] = useState('');
  const [spread, setSpread] = useState('');
  const [valorPorPunto, setValorPorPunto] = useState('');
  const [riesgoPorcentaje, setRiesgoPorcentaje] = useState('');
  const [riesgoUSD, setRiesgoUSD] = useState('');

  // Calcular posición
  const resultado = useMemo(() => {
    const vpp = parseFloat(valorPorPunto) || 0;
    const stop = parseFloat(stopValue) || 0;
    const riesgo = parseFloat(riesgoUSD) || 0;
    const spreadNum = parseFloat(spread) || 0;

    if (vpp <= 0 || stop <= 0 || riesgo <= 0) return { cantidad: 0, stopIdeal: 0, esTick: mode === 'ticks' };

    // Convertir stop a puntos si está en ticks
    let stopEnPuntos = mode === 'ticks' ? stop / 4 : stop;
    if (stopEnPuntos <= 0) stopEnPuntos = 0.25;

    // Agregar spread si es Forex o Sintético Weltrade
    let spreadPuntos = 0;
    if (isForex(activo)) {
      spreadPuntos = spreadNum / 10; // pips a puntos
    } else if (isSyntheticWeltrade(activo)) {
      spreadPuntos = spreadNum; // ya está en puntos
    }
    const stopTotal = stopEnPuntos + spreadPuntos;

    // Cálculo
    const costoPorUnidad = stopTotal * vpp;
    if (costoPorUnidad <= 0) return { cantidad: 0, stopIdeal: 0, esTick: mode === 'ticks' };

    const cantidadReal = Math.floor(riesgo / costoPorUnidad);
    const stopIdealPuntos = riesgo / ((cantidadReal + 1) * vpp);
    const stopIdealDisplay = mode === 'ticks'
      ? Math.floor(stopIdealPuntos * 4)
      : stopIdealPuntos.toFixed(2);

    return {
      cantidad: Math.max(0, cantidadReal),
      stopIdeal: stopIdealDisplay,
      esTick: mode === 'ticks',
    };
  }, [riesgoUSD, stopValue, activo, mode, valorPorPunto, spread]);

  const handleRiesgoPctChange = (value) => {
    setRiesgoPorcentaje(value);
    const pct = parseFloat(value) || 0;
    if (pct > 0 && balance > 0) {
      setRiesgoUSD((balance * (pct / 100)).toFixed(2));
    } else {
      setRiesgoUSD('');
    }
  };

  const handleRiesgoUSDChange = (value) => {
    setRiesgoUSD(value);
    const usd = parseFloat(value) || 0;
    if (usd > 0 && balance > 0) {
      setRiesgoPorcentaje(((usd / balance) * 100).toFixed(2));
    } else {
      setRiesgoPorcentaje('');
    }
  };

  const toggleMode = (newMode) => {
    const currentStop = parseFloat(stopValue) || 0;
    if (currentStop > 0) {
      if (newMode === 'points' && mode === 'ticks') {
        setStopValue((currentStop / 4).toString());
      } else if (newMode === 'ticks' && mode === 'points') {
        setStopValue((currentStop * 4).toString());
      }
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
            onChange={e => {
              const newActivo = e.target.value;
              setActivo(newActivo);
              if (isSyntheticWeltrade(newActivo)) {
                setSpread(getSyntheticSpread(newActivo).toString());
              } else {
                setSpread('');
              }
            }}
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
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
            }`}
            value={valorPorPunto}
            onChange={e => setValorPorPunto(e.target.value)}
            placeholder="Ej: 2"
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
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
            }`}
            value={stopValue}
            onChange={e => setStopValue(e.target.value)}
            placeholder={mode === 'ticks' ? 'Ej: 20' : 'Ej: 5'}
          />
        </div>

        {/* Spread (Forex y Sintéticos Weltrade) */}
        {(isForex(activo) || isSyntheticWeltrade(activo)) && (
          <div className="space-y-1">
            <label className={`text-[10px] uppercase font-bold pl-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              Spread {isSyntheticWeltrade(activo) ? '(puntos)' : '(pips)'}
            </label>
            <input
              type="number"
              step="0.1"
              className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-amber-500 ${
                isDark ? 'bg-slate-800 border-amber-700/50 text-amber-400 placeholder:text-amber-700/50' : 'bg-amber-50 border-amber-200 text-amber-700 placeholder:text-amber-400'
              }`}
              value={spread}
              onChange={e => setSpread(e.target.value)}
              placeholder={isSyntheticWeltrade(activo) ? 'Ej: 15' : 'Ej: 1.5'}
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
                isDark ? 'bg-slate-800 border-slate-700 text-emerald-400 placeholder:text-emerald-800' : 'bg-slate-50 border-slate-200 text-emerald-600 placeholder:text-emerald-300'
              }`}
              value={riesgoPorcentaje}
              onChange={e => handleRiesgoPctChange(e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="space-y-1">
            <label className={`text-[10px] uppercase font-bold pl-1 flex items-center ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <DollarSign size={10} className="mr-1"/> Riesgo USD
            </label>
            <input
              type="number"
              className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-emerald-500 ${
                isDark ? 'bg-slate-800 border-slate-700 text-emerald-400 placeholder:text-emerald-800' : 'bg-slate-50 border-slate-200 text-emerald-600 placeholder:text-emerald-300'
              }`}
              value={riesgoUSD}
              onChange={e => handleRiesgoUSDChange(e.target.value)}
              placeholder="20"
            />
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