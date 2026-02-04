"use client";
import { useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, AlertTriangle, Camera, X } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

const TEMPORALIDADES = ['1D', '4H', '1H', '30M', '15M', '5M', '1M', 'Ejecución'];

// Activos simplificados para el simulador
const ACTIVOS_COMUNES = [
  { symbol: 'EUR/USD', name: 'Euro/Dolar' },
  { symbol: 'GBP/USD', name: 'Libra/Dolar' },
  { symbol: 'USD/JPY', name: 'Dolar/Yen' },
  { symbol: 'XAU/USD', name: 'Oro' },
  { symbol: 'MNQ', name: 'Micro Nasdaq' },
  { symbol: 'MES', name: 'Micro S&P' },
  { symbol: 'NQ', name: 'Nasdaq' },
  { symbol: 'ES', name: 'S&P 500' },
  { symbol: 'BTC/USD', name: 'Bitcoin' },
  { symbol: 'ETH/USD', name: 'Ethereum' },
];

export default function FundingTradeForm({ onAddTrade, reglas, metricas, disabled }) {
  const { isDark } = useTheme();
  const [form, setForm] = useState({
    activo: 'EUR/USD',
    dir: 'Long',
    res: '',
    lotes: '0.01',
  });
  const [isWin, setIsWin] = useState(true);
  const [showWarning, setShowWarning] = useState(null);

  // Estado para imágenes dinámicas (máximo 3)
  const [imagenes, setImagenes] = useState([]);

  // Comprimir imagen con manejo de errores
  const compressImage = (file, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => reject(new Error('Error leyendo archivo'));

      reader.onload = (e) => {
        const img = document.createElement('img');

        img.onerror = () => reject(new Error('Error cargando imagen'));

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });
  };

  const agregarImagen = async (file) => {
    if (!file) {
      console.log('No file provided');
      return;
    }

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
    } catch (error) {
      console.error('Error procesando imagen:', error);
      alert('Error al procesar la imagen. Intenta con otra.');
    }
  };

  const handleTemporalidadChange = (index, temporalidad) => {
    setImagenes(prev => {
      const newImages = [...prev];
      newImages[index] = { ...newImages[index], temporalidad };
      return newImages;
    });
  };

  const removeImage = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.res || disabled) return;

    const resultado = isWin ? Math.abs(parseFloat(form.res)) : -Math.abs(parseFloat(form.res));

    // Verificar si este trade violaría alguna regla
    const hoy = new Date().toISOString().split('T')[0];
    const nuevoBalance = metricas.balanceActual + resultado;
    const nuevoPnlDiario = (metricas.pnlDiario || 0) + resultado;

    // Calcular DD diario potencial
    const ddDiarioPotencial = nuevoPnlDiario < 0
      ? (Math.abs(nuevoPnlDiario) / reglas.capitalInicial) * 100
      : 0;

    // Calcular DD total potencial
    const picoBalance = Math.max(metricas.picoBalance, metricas.balanceActual);
    const ddTotalPotencial = nuevoBalance < picoBalance
      ? ((picoBalance - nuevoBalance) / picoBalance) * 100
      : 0;

    // Verificar violaciones
    if (ddDiarioPotencial >= reglas.maxDrawdownDiario) {
      setShowWarning({
        tipo: 'dd_diario',
        mensaje: `Este trade excederia el DD diario (${ddDiarioPotencial.toFixed(2)}% >= ${reglas.maxDrawdownDiario}%)`,
      });
      return;
    }

    if (ddTotalPotencial >= reglas.maxDrawdownTotal) {
      setShowWarning({
        tipo: 'dd_total',
        mensaje: `Este trade excederia el DD total (${ddTotalPotencial.toFixed(2)}% >= ${reglas.maxDrawdownTotal}%)`,
      });
      return;
    }

    const trade = {
      fecha: hoy,
      activo: form.activo,
      dir: form.dir,
      res: resultado,
      lotes: parseFloat(form.lotes),
      imagenes: imagenes.map(img => ({ data: img.data, temporalidad: img.temporalidad })),
    };

    onAddTrade(trade);

    // Reset form
    setForm({ ...form, res: '' });
    setImagenes([]);
    setShowWarning(null);
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        <PlusCircle size={16} className="text-amber-500"/>
        Registrar Trade
      </h3>

      {/* Warning */}
      {showWarning && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5"/>
          <div>
            <p className="text-red-500 text-sm font-bold">Alerta de Violacion</p>
            <p className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>{showWarning.mensaje}</p>
            <button
              onClick={() => setShowWarning(null)}
              className="text-xs text-red-500 underline mt-1"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Activo */}
          <div>
            <label className={`text-xs font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Activo
            </label>
            <select
              value={form.activo}
              onChange={e => setForm({...form, activo: e.target.value})}
              className={`w-full p-2.5 border rounded-xl font-bold text-sm outline-none focus:border-amber-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {ACTIVOS_COMUNES.map(a => (
                <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
              ))}
            </select>
          </div>

          {/* Lotes */}
          <div>
            <label className={`text-xs font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Lotes
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.lotes}
              onChange={e => setForm({...form, lotes: e.target.value})}
              className={`w-full p-2.5 border rounded-xl font-bold text-sm outline-none focus:border-amber-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            />
          </div>
        </div>

        {/* Direccion */}
        <div>
          <label className={`text-xs font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Direccion
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({...form, dir: 'Long'})}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                form.dir === 'Long'
                  ? 'bg-green-500 text-white shadow-lg'
                  : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <TrendingUp size={16}/> Long
            </button>
            <button
              type="button"
              onClick={() => setForm({...form, dir: 'Short'})}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                form.dir === 'Short'
                  ? 'bg-red-500 text-white shadow-lg'
                  : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <TrendingDown size={16}/> Short
            </button>
          </div>
        </div>

        {/* Resultado */}
        <div>
          <label className={`text-xs font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Resultado (USD)
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsWin(true)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isWin
                  ? 'bg-green-500 text-white shadow-lg'
                  : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}
            >
              WIN
            </button>
            <button
              type="button"
              onClick={() => setIsWin(false)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                !isWin
                  ? 'bg-red-500 text-white shadow-lg'
                  : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}
            >
              LOSS
            </button>
            <div className="relative flex-1">
              <span className={`absolute left-3 top-2.5 font-bold ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                {isWin ? '+$' : '-$'}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.res}
                onChange={e => setForm({...form, res: e.target.value})}
                className={`w-full pl-10 p-2.5 border rounded-xl font-mono font-bold outline-none focus:border-amber-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                } ${isWin ? 'text-green-500' : 'text-red-500'}`}
              />
            </div>
          </div>
        </div>

        {/* Imagenes con temporalidad */}
        <div>
          <label className={`text-xs font-bold uppercase mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Camera size={12} className="inline mr-1"/> Capturas (opcional - max 3)
          </label>

          {/* Imágenes agregadas */}
          {imagenes.length > 0 && (
            <div className="space-y-3 mb-3">
              {imagenes.map((img, index) => (
                <div key={index} className={`p-3 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex gap-3 items-start">
                    {/* Preview de imagen */}
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-amber-500 flex-shrink-0">
                      <img src={img.data} alt={`Captura ${index + 1}`} className="w-full h-full object-cover"/>
                    </div>

                    <div className="flex-1">
                      {/* Selector de temporalidad */}
                      <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Temporalidad
                      </label>
                      <select
                        value={img.temporalidad}
                        onChange={(e) => handleTemporalidadChange(index, e.target.value)}
                        className={`w-full p-2 border rounded-lg text-sm font-bold outline-none focus:border-amber-500 ${
                          isDark
                            ? 'bg-slate-600 border-slate-500 text-white'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {TEMPORALIDADES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 flex-shrink-0"
                      title="Eliminar imagen"
                    >
                      <X size={16}/>
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
                capture="environment"
                onChange={async (e) => {
                  console.log('File input changed:', e.target.files);
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log('Processing file:', file.name, file.type, file.size);
                    await agregarImagen(file);
                  }
                  e.target.value = '';
                }}
                className="hidden"
                id="funding-add-image"
              />
              <label
                htmlFor="funding-add-image"
                className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  isDark
                    ? 'border-slate-600 hover:border-amber-500 text-slate-400 hover:text-amber-400'
                    : 'border-slate-300 hover:border-amber-500 text-slate-400 hover:text-amber-500'
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

        {/* Preview del impacto */}
        {form.res && (
          <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Balance despues: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                {formatMoney(metricas.balanceActual + (isWin ? Math.abs(parseFloat(form.res || 0)) : -Math.abs(parseFloat(form.res || 0))))}
              </span>
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!form.res || disabled}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            form.res && !disabled
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg active:scale-[0.98]'
              : isDark ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <PlusCircle size={18} className="inline mr-2"/>
          Agregar Trade
        </button>
      </form>
    </div>
  );
}
