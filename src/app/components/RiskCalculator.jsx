"use client";
import { useState, useEffect } from 'react';
import { Activity, Percent, DollarSign } from 'lucide-react';

// 📊 ACTIVOS CON VALOR POR PUNTO/TICK
// Puedes agregar más activos aquí
const ACTIVOS_TRADING = {
  'Índices US': [
    { symbol: 'MNQ', name: 'Micro Nasdaq', tickValue: 0.50, pointValue: 2 },
    { symbol: 'MES', name: 'Micro S&P 500', tickValue: 1.25, pointValue: 5 },
    { symbol: 'NQ', name: 'Nasdaq 100', tickValue: 5, pointValue: 20 },
    { symbol: 'ES', name: 'S&P 500', tickValue: 12.50, pointValue: 50 },
    { symbol: 'YM', name: 'Dow Jones', tickValue: 5, pointValue: 5 },
    { symbol: 'MYM', name: 'Micro Dow', tickValue: 0.50, pointValue: 0.50 },
    { symbol: 'RTY', name: 'Russell 2000', tickValue: 5, pointValue: 50 },
    { symbol: 'M2K', name: 'Micro Russell', tickValue: 0.50, pointValue: 5 },
  ],
  'Commodities': [
    { symbol: 'GC', name: 'Oro', tickValue: 10, pointValue: 100 },
    { symbol: 'MGC', name: 'Micro Oro', tickValue: 1, pointValue: 10 },
    { symbol: 'SI', name: 'Plata', tickValue: 25, pointValue: 5000 },
    { symbol: 'CL', name: 'Crudo WTI', tickValue: 10, pointValue: 1000 },
    { symbol: 'MCL', name: 'Micro Crudo', tickValue: 1, pointValue: 100 },
  ],
  'Forex (por lote)': [
    { symbol: 'EUR/USD', name: 'Euro/Dólar', tickValue: 1, pointValue: 10 },
    { symbol: 'GBP/USD', name: 'Libra/Dólar', tickValue: 1, pointValue: 10 },
    { symbol: 'USD/JPY', name: 'Dólar/Yen', tickValue: 1, pointValue: 10 },
    { symbol: 'AUD/USD', name: 'Aussie/Dólar', tickValue: 1, pointValue: 10 },
    { symbol: 'GBP/JPY', name: 'Libra/Yen', tickValue: 1, pointValue: 10 },
  ],
  'Crypto CME': [
    { symbol: 'BTC', name: 'Bitcoin', tickValue: 25, pointValue: 5 },
    { symbol: 'MBT', name: 'Micro Bitcoin', tickValue: 0.50, pointValue: 0.10 },
    { symbol: 'ETH', name: 'Ethereum', tickValue: 5, pointValue: 50 },
  ],
};

// Crear mapa plano para búsqueda rápida
const ACTIVOS_MAP = {};
Object.values(ACTIVOS_TRADING).flat().forEach(a => {
  ACTIVOS_MAP[a.symbol] = a;
});

export default function RiskCalculator({ balance }) {
  const [activo, setActivo] = useState('MNQ'); 
  const [mode, setMode] = useState('ticks'); 
  const [inputValue, setInputValue] = useState(20); 
  const [riesgoPorcentaje, setRiesgoPorcentaje] = useState(1.0); 
  const [riesgoUSD, setRiesgoUSD] = useState(0); 
  const [resultado, setResultado] = useState({ contratos: 0, stopIdeal: 0 });
  
  // Obtener datos del activo seleccionado
  const activoData = ACTIVOS_MAP[activo] || { tickValue: 0.50, pointValue: 2 };
  
  useEffect(() => { 
    if (balance > 0 && riesgoUSD === 0) {
      setRiesgoUSD((balance * 0.01).toFixed(2)); 
    }
  }, [balance]);
  
  useEffect(() => {
    const valorPorTick = activoData.tickValue;
    const valorPorPunto = activoData.pointValue;
    
    // Convertir input a puntos
    let stopEnPuntos = mode === 'ticks' ? inputValue / 4 : inputValue;
    if (stopEnPuntos <= 0) stopEnPuntos = 0.25;
    
    // Costo por contrato = stop en puntos * valor por punto
    const costoPorContrato = stopEnPuntos * valorPorPunto; 
    if (costoPorContrato <= 0) return;
    
    const contratosReales = Math.floor(riesgoUSD / costoPorContrato);
    const stopIdealPuntos = riesgoUSD / ((contratosReales + 1) * valorPorPunto);
    const stopIdealDisplay = mode === 'ticks' 
      ? Math.floor(stopIdealPuntos * 4) 
      : stopIdealPuntos.toFixed(2);
    
    setResultado({ 
      contratos: Math.max(0, contratosReales), 
      stopIdeal: stopIdealDisplay, 
      esTick: mode === 'ticks',
      valorTick: valorPorTick,
      valorPunto: valorPorPunto,
    });
  }, [riesgoUSD, inputValue, activo, mode, activoData]);
  
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
      setInputValue(inputValue / 4);
    } else if (newMode === 'ticks' && mode === 'points') {
      setInputValue(inputValue * 4);
    }
    setMode(newMode);
  };
  
  return (
    <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-800">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-bold text-white flex items-center uppercase tracking-widest">
          <Activity size={16} className="mr-2 text-blue-500"/> Risk Master
        </h3>
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          <button 
            onClick={() => toggleMode('points')} 
            className={`text-[10px] px-2 sm:px-3 py-1 rounded-md font-bold transition-all ${
              mode === 'points' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            PTS
          </button>
          <button 
            onClick={() => toggleMode('ticks')} 
            className={`text-[10px] px-2 sm:px-3 py-1 rounded-md font-bold transition-all ${
              mode === 'ticks' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            TICKS
          </button>
        </div>
      </div>
      
      <div className="space-y-4 sm:space-y-5">
        {/* Activo con categorías */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold pl-1">Activo</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 sm:p-2.5 text-sm font-medium outline-none text-white" 
            value={activo} 
            onChange={e => setActivo(e.target.value)}
          >
            {Object.entries(ACTIVOS_TRADING).map(([categoria, activos]) => (
              <optgroup key={categoria} label={`── ${categoria} ──`}>
                {activos.map(a => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} (${a.pointValue}/pt)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Stop */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold pl-1">
            Stop ({mode === 'ticks' ? 'ticks' : 'puntos'})
          </label>
          <input 
            type="number" 
            step={mode === 'ticks' ? 1 : 0.25} 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 sm:p-2.5 text-sm font-bold outline-none text-white" 
            value={inputValue} 
            onChange={e => setInputValue(Number(e.target.value))} 
          />
        </div>
        
        {/* Riesgo % y USD */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-emerald-400 uppercase font-bold pl-1 flex items-center">
              <Percent size={10} className="mr-1"/> Riesgo %
            </label>
            <input 
              type="number" 
              step="0.1" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 sm:p-2.5 text-sm font-bold text-emerald-400 outline-none" 
              value={riesgoPorcentaje} 
              onChange={e => handleRiesgoPctChange(e.target.value)} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-emerald-400 uppercase font-bold pl-1 flex items-center">
              <DollarSign size={10} className="mr-1"/> Riesgo USD
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 sm:top-2.5 text-slate-500 text-xs">$</span>
              <input 
                type="number" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 sm:p-2.5 pl-6 text-sm font-bold text-emerald-400 outline-none" 
                value={riesgoUSD} 
                onChange={e => handleRiesgoUSDChange(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Info del activo */}
        <div className="flex justify-between text-[10px] text-slate-500 px-1">
          <span>Tick: ${activoData.tickValue}</span>
          <span>Punto: ${activoData.pointValue}</span>
        </div>
        
        {/* Resultado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-3 sm:p-4 flex justify-between items-center shadow-lg">
          <div>
            <p className="text-[10px] text-blue-100 uppercase font-bold mb-1">Posición Sugerida</p>
            <p className="text-2xl sm:text-3xl font-black text-white leading-none">
              {resultado.contratos} <span className="text-sm font-medium opacity-70">Lotes</span>
            </p>
          </div>
          {resultado.contratos > 0 && (
            <div className="text-right">
              <p className="text-[9px] text-blue-100 opacity-80 mb-0.5">Optimizar (+1 lote):</p>
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
