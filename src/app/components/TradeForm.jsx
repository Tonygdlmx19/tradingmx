"use client";
import { useState, useRef } from 'react';
import { PlusCircle, Save, Camera, X, Image } from 'lucide-react';
import { useTheme } from './ThemeProvider';

// 📊 ACTIVOS ORGANIZADOS POR CATEGORÍA
const ACTIVOS_POR_CATEGORIA = {
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
  'Forex Majors': [
    { symbol: 'EUR/USD', name: 'Euro/Dólar' },
    { symbol: 'GBP/USD', name: 'Libra/Dólar' },
    { symbol: 'USD/JPY', name: 'Dólar/Yen' },
    { symbol: 'USD/CHF', name: 'Dólar/Franco' },
    { symbol: 'AUD/USD', name: 'Aussie/Dólar' },
    { symbol: 'USD/CAD', name: 'Dólar/Canadá' },
    { symbol: 'NZD/USD', name: 'Kiwi/Dólar' },
  ],
  'Forex Crosses': [
    { symbol: 'EUR/GBP', name: 'Euro/Libra' },
    { symbol: 'EUR/JPY', name: 'Euro/Yen' },
    { symbol: 'GBP/JPY', name: 'Libra/Yen' },
    { symbol: 'AUD/JPY', name: 'Aussie/Yen' },
    { symbol: 'EUR/AUD', name: 'Euro/Aussie' },
    { symbol: 'GBP/AUD', name: 'Libra/Aussie' },
  ],
  'Commodities': [
    { symbol: 'GC', name: 'Oro (Gold)' },
    { symbol: 'MGC', name: 'Micro Oro' },
    { symbol: 'SI', name: 'Plata (Silver)' },
    { symbol: 'CL', name: 'Crudo WTI' },
    { symbol: 'MCL', name: 'Micro Crudo' },
    { symbol: 'NG', name: 'Gas Natural' },
  ],
  'Crypto': [
    { symbol: 'BTC/USD', name: 'Bitcoin' },
    { symbol: 'ETH/USD', name: 'Ethereum' },
    { symbol: 'MBT', name: 'Micro Bitcoin CME' },
    { symbol: 'SOL/USD', name: 'Solana' },
    { symbol: 'XRP/USD', name: 'Ripple' },
  ],
};

export default function TradeForm({ onSubmit, form, setForm }) {
  const { isDark } = useTheme();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Validar que haya un resultado
  const canSubmit = form.res !== '' && form.res !== null && form.res !== undefined;

  // Manejar checkbox de plan
  const handlePlanChange = (checked) => {
    setForm(prev => ({
      ...prev,
      seguiPlan: checked
    }));
  };

  // Manejar checkbox de gestión
  const handleGestionChange = (checked) => {
    setForm(prev => ({
      ...prev,
      respetoRiesgo: checked
    }));
  };

  // Comprimir y convertir imagen a base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Comprimir imagen
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setImagePreview(compressedBase64);
        setForm(prev => ({ ...prev, imagen: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setForm(prev => ({ ...prev, imagen: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
    // Limpiar imagen después de guardar
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-xl border transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      <h3 className={`font-bold mb-4 sm:mb-6 flex items-center text-sm uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>
        <PlusCircle size={18} className="mr-2 text-blue-500"/> Registrar Trade
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activo */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            Activo
          </label>
          <select 
            className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none focus:border-blue-500 ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            value={form.activo} 
            onChange={e => setForm({...form, activo: e.target.value})}
          >
            {Object.entries(ACTIVOS_POR_CATEGORIA).map(([categoria, activos]) => (
              <optgroup key={categoria} label={`── ${categoria} ──`}>
                {activos.map(activo => (
                  <option key={activo.symbol} value={activo.symbol}>
                    {activo.symbol} - {activo.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Dirección */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            Dirección
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm({...form, dir: 'Long'})}
              className={`p-2.5 rounded-xl font-bold text-sm transition-all ${
                form.dir === 'Long'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : isDark 
                    ? 'bg-slate-700 border border-slate-600 text-slate-400 hover:border-green-500' 
                    : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-green-500'
              }`}
            >
              ↑ LONG
            </button>
            <button
              type="button"
              onClick={() => setForm({...form, dir: 'Short'})}
              className={`p-2.5 rounded-xl font-bold text-sm transition-all ${
                form.dir === 'Short'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : isDark 
                    ? 'bg-slate-700 border border-slate-600 text-slate-400 hover:border-red-500' 
                    : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-red-500'
              }`}
            >
              ↓ SHORT
            </button>
          </div>
        </div>

        {/* Lotes y P&L en grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Lotes
            </label>
            <input 
              type="number" 
              step="1"
              min="1"
              placeholder="1" 
              className={`w-full p-2.5 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
              value={form.lotes || ''} 
              onChange={e => setForm({...form, lotes: e.target.value})} 
            />
          </div>
          <div>
            <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              P&L ($)
            </label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              className={`w-full p-2.5 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
              value={form.res} 
              onChange={e => setForm({...form, res: e.target.value})} 
              required
            />
          </div>
        </div>

        {/* Entrada y Salida (opcional) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Entrada
            </label>
            <input 
              type="number" 
              step="0.01"
              placeholder="Precio" 
              className={`w-full p-2.5 border rounded-xl text-sm font-medium outline-none focus:border-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
              value={form.entrada || ''} 
              onChange={e => setForm({...form, entrada: e.target.value})} 
            />
          </div>
          <div>
            <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Salida
            </label>
            <input 
              type="number" 
              step="0.01"
              placeholder="Precio" 
              className={`w-full p-2.5 border rounded-xl text-sm font-medium outline-none focus:border-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
              value={form.salida || ''} 
              onChange={e => setForm({...form, salida: e.target.value})} 
            />
          </div>
        </div>
        
        {/* Checkboxes de autoevaluación */}
        <div className={`p-3 rounded-xl border space-y-2 ${
          isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-100'
        }`}>
          <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            Autoevaluación
          </p>
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handlePlanChange(!form.seguiPlan)}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
              form.seguiPlan 
                ? 'bg-blue-500 border-blue-500' 
                : isDark ? 'border-slate-500' : 'border-slate-300'
            }`}>
              {form.seguiPlan && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Seguí mi plan
            </span>
          </div>
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleGestionChange(!form.respetoRiesgo)}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
              form.respetoRiesgo 
                ? 'bg-blue-500 border-blue-500' 
                : isDark ? 'border-slate-500' : 'border-slate-300'
            }`}>
              {form.respetoRiesgo && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Respeté el riesgo
            </span>
          </div>
        </div>
        
        {/* Estado emocional */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            Estado Emocional
          </label>
          <select 
            className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none focus:border-blue-500 ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            value={form.emo} 
            onChange={e => setForm({...form, emo: e.target.value})}
          >
            <option value="Neutral">😐 Neutral</option>
            <option value="Calmado">😌 Calmado</option>
            <option value="Ansioso">😰 Ansioso</option>
            <option value="Venganza">😤 Venganza</option>
            <option value="Miedo">😨 Miedo</option>
            <option value="Eufórico">🤑 Eufórico</option>
            <option value="Frustrado">😔 Frustrado</option>
          </select>
        </div>

        {/* Notas rápidas */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            Notas (opcional)
          </label>
          <textarea 
            placeholder="Observaciones del trade..."
            rows={2}
            className={`w-full p-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 resize-none ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
            value={form.notas || ''} 
            onChange={e => setForm({...form, notas: e.target.value})} 
          />
        </div>

        {/* Subir imagen */}
        <div>
          <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            Captura del Trade (opcional)
          </label>
          
          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                isDark 
                  ? 'border-slate-600 hover:border-slate-500 bg-slate-700/30' 
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <Camera size={24} className={`mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Toca para agregar imagen
              </p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        
        {/* Botón guardar */}
        <button 
          type="submit" 
          disabled={!canSubmit}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} className="mr-2"/> Guardar Trade
        </button>
      </form>
    </div>
  );
}
