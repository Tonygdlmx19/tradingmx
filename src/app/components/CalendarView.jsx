"use client";
import { useState, useMemo } from 'react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { Calendar, ChevronRight, ChevronLeft, Image, FileText, Ban, XCircle } from 'lucide-react';

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

export default function CalendarView({
  trades,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onTradeClick,
  tradeCount,
  diasNoOperativos = [],
  onToggleDiaNoOperativo
}) {
  const { isDark } = useTheme();
  const { language, t: translations } = useLanguage();
  const [selectedDay, setSelectedDay] = useState(null);

  const labels = {
    es: {
      selectDay: 'Toca un día',
      tradesOf: 'Trades del',
      of: 'de',
      noTradesThisDay: 'No hay trades este día',
      noTradesThisMonth: 'No hay trades en este mes.',
      recordFirst: 'Registra tu primer trade usando el formulario.',
      lots: 'lotes',
      swingTrade: 'Swing',
      operations: 'operaciones',
      operation: 'operación',
      noTrading: 'No operé',
      markNoTrading: 'Marcar como no operativo',
      unmarkNoTrading: 'Quitar marca',
      dayOff: 'Día sin operar',
    },
    en: {
      selectDay: 'Tap a day',
      tradesOf: 'Trades on',
      of: '',
      noTradesThisDay: 'No trades this day',
      noTradesThisMonth: 'No trades this month.',
      recordFirst: 'Record your first trade using the form.',
      lots: 'lots',
      swingTrade: 'Swing',
      operations: 'trades',
      operation: 'trade',
      noTrading: 'No trading',
      markNoTrading: 'Mark as no trading day',
      unmarkNoTrading: 'Remove mark',
      dayOff: 'Day off',
    },
  };
  const t = labels[language];

  const monthsFull = translations.monthsFull;
  const daysOfWeek = translations.daysShort;

  // Navegación de meses
  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setSelectedDay(null);
  };

  // Agrupar trades por día (usando fechaSalida como fecha principal, o fecha para trades antiguos)
  const tradesByDay = useMemo(() => {
    const grouped = {};
    trades.forEach(trade => {
      // Usar fechaSalida si existe, sino usar fecha
      const exitDate = trade.fechaSalida || trade.fecha;
      if (!exitDate) return;
      const [, , d] = exitDate.split('-').map(Number);
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(trade);
    });
    return grouped;
  }, [trades]);

  // Detectar días que son parte de un swing trade (rango)
  const swingRanges = useMemo(() => {
    const ranges = {};
    trades.forEach(trade => {
      const entryDate = trade.fechaEntrada;
      const exitDate = trade.fechaSalida || trade.fecha;

      if (!entryDate || !exitDate || entryDate === exitDate) return;

      const entry = new Date(entryDate);
      const exit = new Date(exitDate);

      // Solo procesar si el rango cruza el mes seleccionado
      const monthStart = new Date(selectedYear, selectedMonth, 1);
      const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);

      if (exit < monthStart || entry > monthEnd) return;

      // Marcar cada día del rango que está en este mes
      let current = new Date(Math.max(entry.getTime(), monthStart.getTime()));
      const rangeEnd = new Date(Math.min(exit.getTime(), monthEnd.getTime()));

      while (current <= rangeEnd) {
        if (current.getMonth() === selectedMonth && current.getFullYear() === selectedYear) {
          const day = current.getDate();
          if (!ranges[day]) ranges[day] = [];
          ranges[day].push({
            trade,
            isStart: current.getTime() === entry.getTime(),
            isEnd: current.getTime() === exit.getTime(),
            isMiddle: current.getTime() !== entry.getTime() && current.getTime() !== exit.getTime(),
            color: trade.res >= 0 ? 'green' : 'red',
          });
        }
        current.setDate(current.getDate() + 1);
      }
    });
    return ranges;
  }, [trades, selectedMonth, selectedYear]);

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

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [selectedMonth, selectedYear]);

  // Color de fondo para un día
  const getDayBgColor = (day) => {
    if (!day) return '';

    // Si hay trades que cierran este día
    if (tradesByDay[day]) {
      const pnl = pnlByDay[day];
      if (pnl > 0) {
        return isDark ? 'bg-green-500/30 hover:bg-green-500/40' : 'bg-green-100 hover:bg-green-200';
      } else if (pnl < 0) {
        return isDark ? 'bg-red-500/30 hover:bg-red-500/40' : 'bg-red-100 hover:bg-red-200';
      }
      return isDark ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-200 hover:bg-slate-300';
    }

    return '';
  };

  // Trades del día seleccionado
  const selectedDayTrades = useMemo(() => {
    if (!selectedDay) return [];

    // Incluir trades que cierran este día
    const closingTrades = tradesByDay[selectedDay] || [];

    // Incluir trades swing que están en curso este día
    const swingTrades = swingRanges[selectedDay]?.map(r => r.trade) || [];

    // Combinar y eliminar duplicados
    const allTrades = [...closingTrades];
    swingTrades.forEach(st => {
      if (!allTrades.find(t => t.id === st.id)) {
        allTrades.push(st);
      }
    });

    return allTrades;
  }, [selectedDay, tradesByDay, swingRanges]);

  // Es hoy?
  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() &&
           selectedMonth === today.getMonth() &&
           selectedYear === today.getFullYear();
  };

  // Verificar si un día tiene swing range
  const hasSwingRange = (day) => swingRanges[day] && swingRanges[day].length > 0;

  // Verificar si un día está marcado como no operativo
  const isDiaNoOperativo = (day) => {
    if (!day) return false;
    const fecha = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return diasNoOperativos.includes(fecha);
  };

  // Obtener fecha formateada para el día seleccionado
  const getSelectedDateString = () => {
    if (!selectedDay) return '';
    return `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  };

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* Header con navegación */}
      <div className={`p-4 border-b ${
        isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="flex items-center justify-between">
          {/* Navegación izquierda */}
          <button
            onClick={goToPrevMonth}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Mes y año */}
          <div className="flex items-center gap-2">
            <Calendar size={18} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {monthsFull[selectedMonth]} {selectedYear}
            </h3>
          </div>

          {/* Navegación derecha */}
          <button
            onClick={goToNextMonth}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Contador de operaciones */}
        <div className="flex justify-center mt-2">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
          }`}>
            {tradeCount} {tradeCount === 1 ? t.operation : t.operations}
          </span>
        </div>
      </div>

      {/* Calendario */}
      <div className="p-4">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(dia => (
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
          {calendarDays.map((day, idx) => {
            const swingInfo = day ? swingRanges[day] : null;
            const hasSwing = swingInfo && swingInfo.length > 0;
            const isNoOp = isDiaNoOperativo(day);

            return (
              <button
                key={idx}
                disabled={!day}
                onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                className={`
                  aspect-square rounded-xl text-sm font-bold transition-all relative
                  flex flex-col items-center justify-center
                  ${!day ? 'invisible' : ''}
                  ${day ? 'cursor-pointer' : 'cursor-default'}
                  ${day === selectedDay
                    ? 'ring-2 ring-blue-500 ring-offset-2 ' + (isDark ? 'ring-offset-slate-800' : 'ring-offset-white')
                    : ''
                  }
                  ${isNoOp
                    ? (isDark ? 'bg-slate-700/50 text-slate-500' : 'bg-slate-100 text-slate-400')
                    : getDayBgColor(day) || (isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50')
                  }
                  ${isToday(day) ? 'ring-1 ring-blue-400' : ''}
                  ${!isNoOp && (isDark ? 'text-white' : 'text-slate-700')}
                `}
              >
                {/* Indicador de día no operativo */}
                {isNoOp && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-full h-[2px] rotate-45 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
                  </div>
                )}

                {/* Indicador de swing trade (barra superior) */}
                {hasSwing && !isNoOp && (
                  <div className="absolute top-0.5 left-0.5 right-0.5 flex gap-0.5">
                    {swingInfo.slice(0, 3).map((swing, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          swing.color === 'green'
                            ? 'bg-amber-500'
                            : 'bg-amber-500'
                        } ${swing.isStart ? 'rounded-l-full ml-1' : ''} ${swing.isEnd ? 'rounded-r-full mr-1' : ''}`}
                      />
                    ))}
                  </div>
                )}

                <span className={`${hasSwing && !isNoOp ? 'mt-1' : ''} ${isNoOp ? 'opacity-50' : ''}`}>{day}</span>

                {day && tradesByDay[day] && !isNoOp && (
                  <div className="flex flex-col items-center">
                    <span className={`text-[9px] font-normal ${
                      pnlByDay[day] >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pnlByDay[day] >= 0 ? '+' : ''}{pnlByDay[day]?.toFixed(0)}$
                    </span>
                    <span className={`text-[8px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {tradesByDay[day].length}T
                    </span>
                  </div>
                )}

                {isNoOp && !tradesByDay[day] && (
                  <Ban size={10} className={`${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                )}

                {/* Indicador swing sin cierre */}
                {hasSwing && !tradesByDay[day] && (
                  <span className={`text-[8px] font-bold text-amber-500`}>
                    {t.swingTrade}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de trades del día seleccionado */}
      {selectedDay && (
        <div className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className={`px-4 py-3 flex items-center justify-between ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
              {isDiaNoOperativo(selectedDay) ? (
                <span className="flex items-center gap-2">
                  <Ban size={14} className="text-slate-500" />
                  {t.dayOff}
                </span>
              ) : (
                <>{t.tradesOf} {selectedDay} {t.of} {monthsFull[selectedMonth]}</>
              )}
            </h4>
            {/* Botón para marcar/desmarcar día no operativo */}
            {onToggleDiaNoOperativo && (
              <button
                onClick={() => onToggleDiaNoOperativo(getSelectedDateString())}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isDiaNoOperativo(selectedDay)
                    ? isDark
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                    : isDark
                      ? 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {isDiaNoOperativo(selectedDay) ? (
                  <>
                    <XCircle size={12} />
                    {t.unmarkNoTrading}
                  </>
                ) : (
                  <>
                    <Ban size={12} />
                    {t.markNoTrading}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Mensaje si el día está marcado como no operativo */}
          {isDiaNoOperativo(selectedDay) && (
            <div className={`px-4 py-4 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Ban size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t.noTrading}</p>
            </div>
          )}

          {!isDiaNoOperativo(selectedDay) && selectedDayTrades.length > 0 ? (
            <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
              {selectedDayTrades.map(trade => {
                const isSwing = trade.fechaEntrada && trade.fechaSalida && trade.fechaEntrada !== trade.fechaSalida;
                return (
                  <div
                    key={trade.id}
                    onClick={() => onTradeClick(trade)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Mostrar puntos del trade si existen, sino mostrar icono */}
                      {trade.puntos !== null && trade.puntos !== undefined ? (
                        <div className={`w-12 h-8 flex items-center justify-center rounded-lg text-xs font-black ${
                          trade.puntos >= 0
                            ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
                            : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                        }`}>
                          {trade.puntos >= 0 ? '+' : ''}{trade.puntos.toFixed(1)}
                        </div>
                      ) : (
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                          trade.res >= 0
                            ? isDark ? 'bg-green-500/20' : 'bg-green-100'
                            : isDark ? 'bg-red-500/20' : 'bg-red-100'
                        }`}>
                          <span className={`text-xs font-bold ${trade.res >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trade.res >= 0 ? '↑' : '↓'}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {trade.activo}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            trade.dir === 'Long' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                          }`}>
                            {trade.dir}
                          </span>
                          {isSwing && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                            }`}>
                              SWING
                            </span>
                          )}
                          {trade.imagenes?.length > 0 && <Image size={12} className="text-blue-400" />}
                          {trade.notas && <FileText size={12} className="text-purple-400" />}
                        </div>
                        <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {isSwing ? (
                            <span>{trade.fechaEntrada} → {trade.fechaSalida}</span>
                          ) : (
                            trade.lotes && <span>{trade.lotes} {t.lots}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-sm ${trade.res >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.res >= 0 ? '+' : ''}{trade.res?.toFixed(2)}$
                      </span>
                      <ChevronRight size={16} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isDiaNoOperativo(selectedDay) && (
            <div className={`p-6 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <p className="text-sm italic">{t.noTradesThisDay}</p>
            </div>
          )}
        </div>
      )}

      {/* Mensaje cuando no hay trades en el mes */}
      {trades.length === 0 && (
        <div className={`p-8 sm:p-12 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <p className="italic">{t.noTradesThisMonth}</p>
          <p className="text-xs mt-2">{t.recordFirst}</p>
        </div>
      )}
    </div>
  );
}
