"use client";
import { LayoutGrid, Calendar, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function ViewSelector({
  viewMode,
  setViewMode,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  tradeCount,
}) {
  const { isDark } = useTheme();
  const { language, t } = useLanguage();

  const monthsFull = t.monthsFull;

  // Generar lista de años (desde 2020 hasta el año actual)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 2020; y--) {
    years.push(y);
  }

  const labels = {
    global: 'Global',
    monthly: language === 'es' ? 'Mensual' : 'Monthly',
    operations: tradeCount === 1
      ? (language === 'es' ? 'operación' : 'trade')
      : (language === 'es' ? 'operaciones' : 'trades'),
  };

  return (
    <div data-tour="view-selector" className={`p-4 rounded-2xl border mb-4 ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* Toggle Global/Mensual */}
      <div className={`flex p-1 rounded-xl border ${
        isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setViewMode('global')}
          className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            viewMode === 'global'
              ? `${isDark ? 'bg-slate-800' : 'bg-white'} shadow text-blue-500`
              : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`
          }`}
        >
          <LayoutGrid size={16}/>
          {labels.global} {selectedYear}
        </button>
        <button
          onClick={() => setViewMode('mensual')}
          className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            viewMode === 'mensual'
              ? `${isDark ? 'bg-slate-800' : 'bg-white'} shadow text-blue-500`
              : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`
          }`}
        >
          <Calendar size={16}/>
          {labels.monthly}
        </button>
      </div>

      {/* Segunda fila: Selectores + Contador */}
      <div className="flex items-center justify-between mt-4 gap-2">
        {/* Selectores de año y mes */}
        <div className="flex items-center gap-2">
          {/* Selector de año (siempre visible) */}
          <div className="relative">
            <select
              className={`appearance-none border px-3 py-2.5 pr-8 rounded-xl text-sm font-bold outline-none focus:border-blue-500 cursor-pointer transition-colors ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown size={16} className={`absolute right-2 top-3 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`}/>
          </div>

          {/* Selector de mes (solo en modo mensual) */}
          {viewMode === 'mensual' && (
            <div className="relative">
              <select
                className={`appearance-none border px-3 py-2.5 pr-8 rounded-xl text-sm font-bold outline-none focus:border-blue-500 cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {monthsFull.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <ChevronDown size={16} className={`absolute right-2 top-3 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`}/>
            </div>
          )}
        </div>

        {/* Contador de operaciones - Siempre a la derecha */}
        <div className={`px-4 py-2.5 rounded-xl border text-sm font-bold ${
          isDark
            ? 'bg-slate-700 border-slate-600 text-slate-300'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          {tradeCount} {labels.operations}
        </div>
      </div>
    </div>
  );
}
