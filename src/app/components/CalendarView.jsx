"use client";
import { useState, useMemo } from 'react';
import { useTheme } from './ThemeProvider';
import { Calendar, ChevronRight, Image, FileText } from 'lucide-react';

const mesesFull = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const getEmojiForEmotion = (emo) => {
  const emojis = {
    'Neutral': '😐',
    'Calmado': '😌',
    'Ansioso': '😰',
    'Venganza': '😤',
    'Miedo': '😨',
    'Eufórico': '🤑',
    'Frustrado': '😔',
  };
  return emojis[emo] || '😐';
};

export default function CalendarView({ trades, selectedMonth, selectedYear, onTradeClick }) {
  const { isDark } = useTheme();
  const [selectedDay, setSelectedDay] = useState(null);

  // Agrupar trades por día
  const tradesByDay = useMemo(() => {
    const grouped = {};
    trades.forEach(t => {
      const [, , d] = t.fecha.split('-').map(Number);
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(t);
    });
    return grouped;
  }, [trades]);

  // Calcular P&L por día para colores
  const pnlByDay = useMemo(() => {
    const pnl = {};
    Object.keys(tradesByDay).forEach(day => {
      pnl[day] = tradesByDay[day].reduce((sum, t) => sum + t.res, 0);
    });
    return pnl;
  }, [tradesByDay]);

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Día de la semana del primer día (0 = Domingo, convertir a Lunes = 0)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days = [];

    // Días vacíos antes del primer día
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Días del mes
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    return days;
  }, [selectedMonth, selectedYear]);

  // Color de fondo para un día
  const getDayBgColor = (day) => {
    if (!day || !tradesByDay[day]) return '';

    const pnl = pnlByDay[day];
    if (pnl > 0) {
      return isDark ? 'bg-green-500/30 hover:bg-green-500/40' : 'bg-green-100 hover:bg-green-200';
    } else if (pnl < 0) {
      return isDark ? 'bg-red-500/30 hover:bg-red-500/40' : 'bg-red-100 hover:bg-red-200';
    }
    return isDark ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-200 hover:bg-slate-300';
  };

  // Trades del día seleccionado
  const selectedDayTrades = selectedDay ? tradesByDay[selectedDay] || [] : [];

  // Es hoy?
  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() &&
           selectedMonth === today.getMonth() &&
           selectedYear === today.getFullYear();
  };

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className={`p-4 sm:p-6 border-b flex justify-between items-center ${
        isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <h3 className={`font-bold flex items-center text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <Calendar size={18} className={`mr-2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}/>
          {mesesFull[selectedMonth]} {selectedYear}
        </h3>
        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
          Selecciona un día
        </span>
      </div>

      {/* Calendario */}
      <div className="p-4">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {diasSemana.map(dia => (
            <div
              key={dia}
              className={`text-center text-[10px] font-bold uppercase py-2 ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => (
            <button
              key={idx}
              disabled={!day}
              onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
              className={`
                aspect-square rounded-xl text-sm font-bold transition-all
                flex flex-col items-center justify-center relative
                ${!day ? 'invisible' : ''}
                ${day && tradesByDay[day] ? 'cursor-pointer' : 'cursor-default'}
                ${day === selectedDay
                  ? 'ring-2 ring-blue-500 ring-offset-2 ' + (isDark ? 'ring-offset-slate-800' : 'ring-offset-white')
                  : ''
                }
                ${getDayBgColor(day) || (isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50')}
                ${isToday(day) ? 'ring-1 ring-blue-400' : ''}
                ${isDark ? 'text-white' : 'text-slate-700'}
              `}
            >
              <span>{day}</span>
              {day && tradesByDay[day] && (
                <span className={`text-[9px] font-normal ${
                  pnlByDay[day] >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {pnlByDay[day] >= 0 ? '+' : ''}{pnlByDay[day]?.toFixed(0)}$
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de trades del día seleccionado */}
      {selectedDay && (
        <div className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className={`px-4 py-3 ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
              Trades del {selectedDay} de {mesesFull[selectedMonth]}
            </h4>
          </div>

          {selectedDayTrades.length > 0 ? (
            <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
              {selectedDayTrades.map(t => (
                <div
                  key={t.id}
                  onClick={() => onTradeClick(t)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getEmojiForEmotion(t.emo)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                          {t.activo}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.dir === 'Long' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {t.dir}
                        </span>
                        {t.imagen && <Image size={12} className="text-blue-400" />}
                        {t.notas && <FileText size={12} className="text-purple-400" />}
                      </div>
                      {t.lotes && (
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {t.lotes} lotes
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm ${t.res >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {t.res >= 0 ? '+' : ''}{t.res?.toFixed(2)}$
                    </span>
                    <ChevronRight size={16} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-6 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <p className="text-sm italic">No hay trades este día</p>
            </div>
          )}
        </div>
      )}

      {/* Mensaje cuando no hay trades en el mes */}
      {trades.length === 0 && (
        <div className={`p-8 sm:p-12 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <p className="italic">No hay trades en este mes.</p>
          <p className="text-xs mt-2">Registra tu primer trade usando el formulario.</p>
        </div>
      )}
    </div>
  );
}
