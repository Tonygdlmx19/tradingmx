"use client";
import { useState } from 'react';
import { Trophy, X, Building2, DollarSign, Target, Clock, TrendingDown, Calendar, Settings2, Loader2 } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { FUNDING_PRESETS, getEmpresas, presetToReglas, crearReglasPersonalizadas } from '../../constants/fundingPresets';

export default function FundingSetupModal({ isOpen, onClose, onCreateChallenge }) {
  const { isDark } = useTheme();
  const [modo, setModo] = useState('preset'); // 'preset' o 'custom'
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Estado para configuración personalizada
  const [customConfig, setCustomConfig] = useState({
    capital: 10000,
    profitTarget: 10,
    maxDDDiario: 5,
    maxDDTotal: 10,
    diasMin: 4,
    tiempoLimite: 30,
  });

  if (!isOpen) return null;

  const empresas = getEmpresas();
  const cuentasEmpresa = empresaSeleccionada ? FUNDING_PRESETS[empresaSeleccionada]?.cuentas || [] : [];

  // Obtener reglas actuales según el modo
  const getReglas = () => {
    if (modo === 'preset' && empresaSeleccionada && cuentaSeleccionada !== '') {
      return presetToReglas(empresaSeleccionada, parseInt(cuentaSeleccionada));
    } else if (modo === 'custom') {
      return crearReglasPersonalizadas(customConfig);
    }
    return null;
  };

  const reglas = getReglas();

  const canCreate = modo === 'preset'
    ? (empresaSeleccionada && cuentaSeleccionada !== '')
    : (customConfig.capital > 0 && customConfig.profitTarget > 0);

  const handleCreate = async () => {
    if (!canCreate || !reglas || creating) return;

    const challengeData = {
      empresa: modo === 'preset' ? empresaSeleccionada : 'custom',
      nombreChallenge: modo === 'preset'
        ? `${FUNDING_PRESETS[empresaSeleccionada].nombre} $${reglas.capitalInicial.toLocaleString()}`
        : `Challenge Personalizado $${reglas.capitalInicial.toLocaleString()}`,
      reglas,
    };

    setCreating(true);
    setError('');
    try {
      await onCreateChallenge(challengeData);
    } catch (err) {
      console.error('Error creating challenge:', err);
      setError(err.message || 'Error desconocido al crear el challenge');
      setCreating(false);
    }
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Trophy size={20} className="text-amber-500"/> Nuevo Challenge de Fondeo
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            <X size={20}/>
          </button>
        </div>

        <div className="space-y-5">
          {/* Toggle Preset/Custom */}
          <div className="flex gap-2">
            <button
              onClick={() => setModo('preset')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                modo === 'preset'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Building2 size={16} className="inline mr-2"/>
              Empresa
            </button>
            <button
              onClick={() => setModo('custom')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                modo === 'custom'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Settings2 size={16} className="inline mr-2"/>
              Personalizado
            </button>
          </div>

          {/* Modo Preset */}
          {modo === 'preset' && (
            <>
              {/* Selector de Empresa */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Building2 size={14}/> Empresa de Fondeo
                </label>
                <select
                  value={empresaSeleccionada}
                  onChange={e => {
                    setEmpresaSeleccionada(e.target.value);
                    setCuentaSeleccionada('');
                  }}
                  className={`w-full p-3 border rounded-xl font-bold outline-none focus:border-amber-500 transition-colors ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="">Selecciona una empresa...</option>
                  {empresas.map(emp => (
                    <option key={emp.key} value={emp.key}>{emp.nombre}</option>
                  ))}
                </select>
                {empresaSeleccionada && FUNDING_PRESETS[empresaSeleccionada] && (
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {FUNDING_PRESETS[empresaSeleccionada].descripcion}
                  </p>
                )}
              </div>

              {/* Selector de Cuenta */}
              {empresaSeleccionada && (
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <DollarSign size={14}/> Tamano de Cuenta
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {cuentasEmpresa.map((cuenta, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCuentaSeleccionada(idx.toString())}
                        className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
                          cuentaSeleccionada === idx.toString()
                            ? 'bg-amber-500 text-white shadow-lg'
                            : isDark
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                      >
                        ${cuenta.capital.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modo Custom */}
          {modo === 'custom' && (
            <div className="space-y-4">
              {/* Capital */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <DollarSign size={14}/> Capital Inicial
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-3 font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
                  <input
                    type="number"
                    value={customConfig.capital}
                    onChange={e => setCustomConfig({...customConfig, capital: Number(e.target.value)})}
                    className={`w-full pl-8 p-2.5 border rounded-xl font-mono font-bold outline-none focus:border-amber-500 transition-colors ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              {/* Grid de configuraciones */}
              <div className="grid grid-cols-2 gap-3">
                {/* Profit Target */}
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Target size={12}/> Profit Target
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customConfig.profitTarget}
                      onChange={e => setCustomConfig({...customConfig, profitTarget: Number(e.target.value)})}
                      className={`w-full pr-8 p-2.5 border rounded-xl font-bold outline-none focus:border-amber-500 transition-colors ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    />
                    <span className={`absolute right-3 top-3 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>%</span>
                  </div>
                </div>

                {/* Max DD Diario */}
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <TrendingDown size={12}/> DD Diario Max
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customConfig.maxDDDiario}
                      onChange={e => setCustomConfig({...customConfig, maxDDDiario: Number(e.target.value)})}
                      className={`w-full pr-8 p-2.5 border rounded-xl font-bold outline-none focus:border-amber-500 transition-colors ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    />
                    <span className={`absolute right-3 top-3 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>%</span>
                  </div>
                </div>

                {/* Max DD Total */}
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <TrendingDown size={12}/> DD Total Max
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customConfig.maxDDTotal}
                      onChange={e => setCustomConfig({...customConfig, maxDDTotal: Number(e.target.value)})}
                      className={`w-full pr-8 p-2.5 border rounded-xl font-bold outline-none focus:border-amber-500 transition-colors ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    />
                    <span className={`absolute right-3 top-3 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>%</span>
                  </div>
                </div>

                {/* Dias Minimos */}
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Calendar size={12}/> Dias Minimos
                  </label>
                  <input
                    type="number"
                    value={customConfig.diasMin}
                    onChange={e => setCustomConfig({...customConfig, diasMin: Number(e.target.value)})}
                    className={`w-full p-2.5 border rounded-xl font-bold outline-none focus:border-amber-500 transition-colors ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>

                {/* Tiempo Limite */}
                <div className="col-span-2">
                  <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Clock size={12}/> Tiempo Limite (0 = sin limite)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customConfig.tiempoLimite}
                      onChange={e => setCustomConfig({...customConfig, tiempoLimite: Number(e.target.value)})}
                      className={`w-full pr-14 p-2.5 border rounded-xl font-bold outline-none focus:border-amber-500 transition-colors ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    />
                    <span className={`absolute right-3 top-3 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>dias</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vista previa de reglas */}
          {reglas && (
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-amber-50 border-amber-100'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                <Target size={14}/> Resumen del Challenge
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Capital:</span>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{formatMoney(reglas.capitalInicial)}</p>
                </div>
                <div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Objetivo:</span>
                  <p className="font-bold text-green-500">{formatMoney(reglas.profitTargetUSD)} ({reglas.profitTarget}%)</p>
                </div>
                <div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>DD Diario Max:</span>
                  <p className="font-bold text-red-500">{formatMoney(reglas.maxDrawdownDiarioUSD)} ({reglas.maxDrawdownDiario}%)</p>
                </div>
                <div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>DD Total Max:</span>
                  <p className="font-bold text-red-500">{formatMoney(reglas.maxDrawdownTotalUSD)} ({reglas.maxDrawdownTotal}%)</p>
                </div>
                <div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dias Minimos:</span>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    {reglas.diasMinimos > 0 ? `${reglas.diasMinimos} dias` : 'Sin minimo'}
                  </p>
                </div>
                <div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tiempo Limite:</span>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    {reglas.tiempoLimite > 0 ? `${reglas.tiempoLimite} dias` : 'Sin limite'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Boton crear */}
          <button
            onClick={handleCreate}
            disabled={!canCreate || creating}
            className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg ${
              canCreate && !creating
                ? 'bg-amber-500 hover:bg-amber-600 text-white active:scale-[0.98]'
                : isDark ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {creating ? (
              <>
                <Loader2 size={18} className="inline mr-2 animate-spin"/>
                Creando...
              </>
            ) : (
              <>
                <Trophy size={18} className="inline mr-2"/>
                Iniciar Challenge
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
