"use client";
import { LayoutGrid, Calendar, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const mesesFull = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function ViewSelector({ 
  viewMode, 
  setViewMode, 
  selectedMonth, 
  setSelectedMonth,
  selectedYear,
  tradeCount 
}) {
  const { isDark } = useTheme();

  return (
    <div className={`p-4 rounded-2xl border mb-4 ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Toggle Global/Mensual */}
        <div className={`flex p-1 rounded-xl border ${
          isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'
        }`}>
          <button 
            onClick={() => setViewMode('global')} 
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              viewMode === 'global' 
                ? `${isDark ? 'bg-slate-800' : 'bg-white'} shadow text-blue-500` 
                : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`
            }`}
          >
            <LayoutGrid size={16}/> 
            Global {selectedYear}
          </button>
          <button 
            onClick={() => setViewMode('mensual')} 
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              viewMode === 'mensual' 
                ? `${isDark ? 'bg-slate-800' : 'bg-white'} shadow text-blue-500` 
                : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`
            }`}
          >
            <Calendar size={16}/> 
            Mensual
          </button>
        </div>

        {/* Selector de mes (solo visible en modo mensual) */}
        <div className="flex items-center gap-3">
          {viewMode === 'mensual' && (
            <div className="relative">
              <select 
                className={`appearance-none border px-4 py-2.5 pr-10 rounded-xl text-sm font-bold outline-none focus:border-blue-500 cursor-pointer transition-colors ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {mesesFull.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <ChevronDown size={16} className={`absolute right-3 top-3 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`}/>
            </div>
          )}
          
          {/* Contador de operaciones */}
          <div className={`px-4 py-2.5 rounded-xl border text-sm font-bold ${
            isDark 
              ? 'bg-slate-700 border-slate-600 text-slate-300' 
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            {tradeCount} operaciones
          </div>
        </div>
      </div>
    </div>
  );
}
