"use client";
import { useState } from 'react';
import { X, Calendar, TrendingUp, TrendingDown, FileText, Camera, Save, Trash2, Image } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function TradeDetailModal({ trade, isOpen, onClose, onUpdate, onDelete }) {
  const { isDark } = useTheme();
  const [notas, setNotas] = useState(trade?.notas || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !trade) return null;

  const isWin = trade.res >= 0;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [y, m, d] = dateStr.split('-');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${parseInt(d)} de ${months[parseInt(m) - 1]}, ${y}`;
  };

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

  const handleSaveNotas = async () => {
    setIsSaving(true);
    await onUpdate(trade.id, { notas });
    setIsSaving(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este trade?')) {
      onDelete(trade.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl w-full max-w-lg shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        {/* Header con resultado */}
        <div className={`p-5 border-b ${
          isWin 
            ? 'bg-gradient-to-r from-green-500/10 to-green-500/5' 
            : 'bg-gradient-to-r from-red-500/10 to-red-500/5'
        } ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {trade.activo}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  trade.dir === 'Long' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {trade.dir}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  {formatDate(trade.fecha)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-black ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                {isWin ? '+' : ''}{trade.res?.toFixed(2)}$
              </p>
              {trade.lotes && (
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {trade.lotes} lote{trade.lotes > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Precios de entrada/salida */}
          {(trade.entrada || trade.salida) && (
            <div className={`grid grid-cols-2 gap-3 p-4 rounded-xl ${
              isDark ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
              <div>
                <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Entrada
                </p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {trade.entrada || '-'}
                </p>
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Salida
                </p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {trade.salida || '-'}
                </p>
              </div>
            </div>
          )}

          {/* Autoevaluación */}
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <p className={`text-[10px] font-bold uppercase mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Autoevaluación
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded flex items-center justify-center ${
                  trade.seguiPlan ? 'bg-green-500' : isDark ? 'bg-slate-600' : 'bg-slate-300'
                }`}>
                  {trade.seguiPlan && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Seguí plan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded flex items-center justify-center ${
                  trade.respetoRiesgo ? 'bg-green-500' : isDark ? 'bg-slate-600' : 'bg-slate-300'
                }`}>
                  {trade.respetoRiesgo && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Respeté riesgo
                </span>
              </div>
            </div>
          </div>

          {/* Estado emocional */}
          <div className={`p-4 rounded-xl flex items-center justify-between ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <div>
              <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Estado Emocional
              </p>
              <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {trade.emo}
              </p>
            </div>
            <span className="text-3xl">{getEmojiForEmotion(trade.emo)}</span>
          </div>

          {/* Imagen del trade */}
          {trade.imagen && (
            <div>
              <p className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Image size={12} /> Captura del Trade
              </p>
              <img 
                src={trade.imagen} 
                alt="Trade screenshot" 
                className="w-full rounded-xl border cursor-pointer hover:opacity-90 transition-opacity"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
                onClick={() => window.open(trade.imagen, '_blank')}
              />
            </div>
          )}

          {/* Notas */}
          <div>
            <p className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <FileText size={12} /> Notas y Comentarios
            </p>
            <textarea 
              placeholder="Agrega tus observaciones sobre este trade..."
              rows={4}
              className={`w-full p-3 border rounded-xl text-sm outline-none focus:border-blue-500 resize-none ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
              value={notas} 
              onChange={e => setNotas(e.target.value)} 
            />
            {notas !== (trade.notas || '') && (
              <button
                onClick={handleSaveNotas}
                disabled={isSaving}
                className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={14} />
                {isSaving ? 'Guardando...' : 'Guardar Notas'}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-between ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            Eliminar
          </button>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
