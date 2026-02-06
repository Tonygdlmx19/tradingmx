"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Calendar, FileText, Save, Trash2, Image, PlusCircle, ClipboardCheck, CheckCircle, AlertTriangle, XCircle, Clock, ArrowRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const TEMPORALIDADES = ['1D', '4H', '1H', '30M', '15M', '5M', '1M', 'Ejecución'];

export default function TradeDetailModal({ trade, isOpen, onClose, onUpdate, onDelete }) {
  const { isDark } = useTheme();
  const [notas, setNotas] = useState(trade?.notas || '');
  const [imagenes, setImagenes] = useState(trade?.imagenes || []);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef(null);
  const imageContainerRef = useRef(null);

  // Reset state when trade changes
  useEffect(() => {
    if (trade) {
      setNotas(trade.notas || '');
      // Compatibilidad: convertir imagen antigua (singular) a array
      let imgs = trade.imagenes || [];
      if (imgs.length === 0 && trade.imagen) {
        imgs = [{ data: trade.imagen, temporalidad: '1H' }];
      }
      setImagenes(imgs);
      setHasChanges(false);
    }
  }, [trade]);

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
      'Euforico': '🤑',
      'Frustrado': '😔',
    };
    return emojis[emo] || '😐';
  };

  // Comprimir imagen
  const compressImage = (file, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.onerror = () => reject(new Error('Error cargando imagen'));
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height && width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else if (height > maxWidth) {
              width = (width * maxWidth) / height;
              height = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } catch (err) {
            reject(err);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const agregarImagen = async (file) => {
    if (!file) return;
    if (imagenes.length >= 3) {
      alert('Máximo 3 imágenes por trade');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande (max 5MB)');
      return;
    }
    try {
      const compressed = await compressImage(file);
      setImagenes(prev => [...prev, { data: compressed, temporalidad: '1H' }]);
      setHasChanges(true);
    } catch (error) {
      console.error('Error procesando imagen:', error);
      alert('Error al procesar la imagen');
    }
  };

  const handleTemporalidadChange = (index, temporalidad) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index] = { ...nuevasImagenes[index], temporalidad };
    setImagenes(nuevasImagenes);
    setHasChanges(true);
  };

  const removeImage = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Guardar imagenes y limpiar el campo antiguo 'imagen'
    await onUpdate(trade.id, { notas, imagenes, imagen: null });
    setHasChanges(false);
    setIsSaving(false);
  };

  const handleNotasChange = (value) => {
    setNotas(value);
    if (value !== (trade?.notas || '')) {
      setHasChanges(true);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Estas seguro de eliminar este trade?')) {
      onDelete(trade.id);
      onClose();
    }
  };

  // Zoom handlers
  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    // Double tap to zoom
    if (zoom === 1) {
      setZoom(2);
    } else {
      resetZoom();
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch start
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistance.current = distance;
    } else if (e.touches.length === 1 && zoom > 1) {
      // Pan start
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchDistance.current) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance - lastTouchDistance.current;
      lastTouchDistance.current = distance;

      setZoom(prev => {
        const newZoom = prev + delta * 0.01;
        return Math.max(1, Math.min(4, newZoom));
      });
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      // Pan
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;

      // Limit pan based on zoom level
      const maxPan = (zoom - 1) * 150;
      setPosition({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY))
      });
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
    setIsDragging(false);
    if (zoom <= 1) {
      resetZoom();
    }
  };

  const openImageViewer = (img) => {
    setViewingImage(img);
    resetZoom();
  };

  const closeImageViewer = () => {
    setViewingImage(null);
    resetZoom();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        {/* Header con resultado */}
        <div className={`p-5 border-b relative ${
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
              {/* Fecha y hora */}
              <div className="flex flex-col gap-1 text-sm">
                {/* Swing trade: mostrar fechas de entrada y salida */}
                {trade.fechaEntrada && trade.fechaSalida && trade.fechaEntrada !== trade.fechaSalida ? (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Calendar size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      {formatDate(trade.fechaEntrada)}
                    </span>
                    <ArrowRight size={12} className="text-amber-500" />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      {formatDate(trade.fechaSalida)}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 ml-1">
                      SWING
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      {formatDate(trade.fecha)}
                    </span>
                  </div>
                )}
                {/* Hora del trade */}
                {trade.hora && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      {trade.hora}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right pr-10">
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
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
            }`}
          >
            <X size={18} />
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

          {/* Checklist de Setup */}
          {trade.checklist && trade.checklist.reglas && (
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-[10px] font-bold uppercase flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <ClipboardCheck size={12}/> Checklist de Setup
                </p>
                <span className={`text-sm font-black flex items-center gap-1 ${
                  trade.checklist.porcentaje >= 70 ? 'text-green-500' :
                  trade.checklist.porcentaje >= 50 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {trade.checklist.porcentaje >= 70 ? <CheckCircle size={14}/> :
                   trade.checklist.porcentaje >= 50 ? <AlertTriangle size={14}/> : <XCircle size={14}/>}
                  {trade.checklist.porcentaje}%
                </span>
              </div>
              {/* Barra de progreso */}
              <div className={`w-full h-2 rounded-full mb-3 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>
                <div
                  className={`h-full rounded-full ${
                    trade.checklist.porcentaje >= 70 ? 'bg-green-500' :
                    trade.checklist.porcentaje >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${trade.checklist.porcentaje}%` }}
                />
              </div>
              <div className="space-y-1.5">
                {trade.checklist.reglas.map((regla, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                      regla.cumplida ? 'bg-green-500' : isDark ? 'bg-slate-600' : 'bg-slate-300'
                    }`}>
                      {regla.cumplida && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs ${
                      regla.cumplida
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {regla.nombre}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Imágenes del trade */}
          <div>
            <p className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Image size={12} /> Capturas del Trade (max 3)
            </p>

            {/* Imágenes existentes */}
            {imagenes.length > 0 && (
              <div className="space-y-3 mb-3">
                {imagenes.map((img, index) => (
                  <div key={index} className={`p-2 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                    {/* Imagen grande arriba */}
                    <div
                      className="relative w-full h-32 rounded-lg overflow-hidden border border-blue-500 cursor-pointer hover:opacity-90 mb-2"
                      onClick={() => openImageViewer(img)}
                    >
                      <img src={img.data} alt={`Captura ${index + 1}`} className="w-full h-full object-cover"/>
                    </div>

                    {/* Controles abajo */}
                    <div className="flex items-center gap-2">
                      <select
                        value={img.temporalidad}
                        onChange={(e) => handleTemporalidadChange(index, e.target.value)}
                        className={`flex-1 p-2 border rounded-lg text-sm font-bold outline-none focus:border-blue-500 ${
                          isDark
                            ? 'bg-slate-600 border-slate-500 text-white'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {TEMPORALIDADES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>

                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 flex-shrink-0"
                        title="Eliminar imagen"
                      >
                        <X size={18}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botón agregar imagen */}
            {imagenes.length < 3 && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await agregarImagen(file);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                  id="trade-detail-add-image"
                />
                <label
                  htmlFor="trade-detail-add-image"
                  className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    isDark
                      ? 'border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400'
                      : 'border-slate-300 hover:border-blue-500 text-slate-400 hover:text-blue-500'
                  }`}
                >
                  <PlusCircle size={18}/>
                  <span className="text-sm font-bold">
                    {imagenes.length === 0 ? 'Agregar captura' : 'Agregar otra captura'}
                  </span>
                </label>
              </div>
            )}
          </div>

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
              onChange={e => handleNotasChange(e.target.value)}
            />
          </div>

          {/* Botón guardar cambios */}
          {hasChanges && (
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              <Save size={18} />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          )}
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

      {/* Modal para ver imagen completa con zoom */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/95 flex flex-col z-[60]"
          onClick={closeImageViewer}
        >
          {/* Header con controles */}
          <div className="flex items-center justify-between p-4 bg-black/50">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full">
                {viewingImage.temporalidad}
              </span>
              <span className="text-white/60 text-xs">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                disabled={zoom <= 1}
              >
                <ZoomOut size={20} className={zoom <= 1 ? 'text-white/30' : 'text-white'} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                disabled={zoom >= 4}
              >
                <ZoomIn size={20} className={zoom >= 4 ? 'text-white/30' : 'text-white'} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RotateCcw size={20} className="text-white" />
              </button>
              <button
                onClick={closeImageViewer}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors ml-2"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Imagen con zoom */}
          <div
            ref={imageContainerRef}
            className="flex-1 flex items-center justify-center overflow-hidden touch-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={viewingImage.data}
              alt={`Captura ${viewingImage.temporalidad}`}
              className="max-w-full max-h-full object-contain transition-transform duration-100"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? 'grab' : 'zoom-in'
              }}
              onClick={handleImageClick}
              draggable={false}
            />
          </div>

          {/* Hint */}
          <div className="p-3 text-center bg-black/50">
            <p className="text-white/50 text-xs">
              {zoom === 1 ? 'Toca para hacer zoom · Pellizca para ajustar' : 'Arrastra para mover · Toca para restablecer'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}