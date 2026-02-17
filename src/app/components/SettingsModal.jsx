"use client";
import { useState } from 'react';
import { Settings, X, Target, User, TrendingUp, Plus, Trash2, ClipboardCheck, HelpCircle, Briefcase, Eye, EyeOff, Server, ChevronUp, ChevronDown, Camera, ArrowLeftRight, Edit3 } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

// Lista completa de activos disponibles para sugerir
const ACTIVOS_DISPONIBLES = [
  // Índices US
  { symbol: 'MNQ', name: 'Micro Nasdaq' },
  { symbol: 'MES', name: 'Micro S&P 500' },
  { symbol: 'NQ', name: 'Nasdaq 100' },
  { symbol: 'ES', name: 'S&P 500' },
  { symbol: 'YM', name: 'Dow Jones' },
  { symbol: 'MYM', name: 'Micro Dow' },
  { symbol: 'RTY', name: 'Russell 2000' },
  { symbol: 'M2K', name: 'Micro Russell' },
  // Índices Globales
  { symbol: 'DAX', name: 'DAX 40' },
  { symbol: 'FTSE', name: 'FTSE 100' },
  { symbol: 'CAC', name: 'CAC 40' },
  { symbol: 'NIKKEI', name: 'Nikkei 225' },
  { symbol: 'HSI', name: 'Hang Seng' },
  // Forex Majors
  { symbol: 'EUR/USD', name: 'Euro/Dólar' },
  { symbol: 'GBP/USD', name: 'Libra/Dólar' },
  { symbol: 'USD/JPY', name: 'Dólar/Yen' },
  { symbol: 'USD/CHF', name: 'Dólar/Franco' },
  { symbol: 'AUD/USD', name: 'Aussie/Dólar' },
  { symbol: 'USD/CAD', name: 'Dólar/Canadá' },
  { symbol: 'NZD/USD', name: 'Kiwi/Dólar' },
  // Forex Crosses
  { symbol: 'EUR/GBP', name: 'Euro/Libra' },
  { symbol: 'EUR/JPY', name: 'Euro/Yen' },
  { symbol: 'GBP/JPY', name: 'Libra/Yen' },
  { symbol: 'AUD/JPY', name: 'Aussie/Yen' },
  // Forex Exóticos
  { symbol: 'USD/MXN', name: 'Dólar/Peso MX' },
  { symbol: 'EUR/MXN', name: 'Euro/Peso MX' },
  { symbol: 'USD/BRL', name: 'Dólar/Real' },
  // Metales
  { symbol: 'XAU/USD', name: 'Oro' },
  { symbol: 'XAG/USD', name: 'Plata' },
  { symbol: 'GC', name: 'Oro Futuros' },
  { symbol: 'MGC', name: 'Micro Oro' },
  // Energía
  { symbol: 'WTI', name: 'Petróleo WTI' },
  { symbol: 'BRENT', name: 'Petróleo Brent' },
  { symbol: 'CL', name: 'Crudo Futuros' },
  { symbol: 'NG', name: 'Gas Natural' },
  // Crypto
  { symbol: 'BTC/USD', name: 'Bitcoin' },
  { symbol: 'ETH/USD', name: 'Ethereum' },
  { symbol: 'SOL/USD', name: 'Solana' },
  { symbol: 'XRP/USD', name: 'Ripple' },
];

export default function SettingsModal({ isOpen, onClose, config, setConfig, onSaveToCloud, onRestartTour, trades = [], movements = [], onMovements }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [nuevoActivo, setNuevoActivo] = useState('');
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [nuevaRegla, setNuevaRegla] = useState('');
  const [nuevaCuenta, setNuevaCuenta] = useState({ broker: '', numero: '', servidor: '', password: '', divisa: 'USD', saldoInicial: '' });
  const [showPassword, setShowPassword] = useState({});
  const [editingSaldo, setEditingSaldo] = useState({});

  const labels = {
    es: {
      title: 'Ajustes',
      personalization: 'Personalizacion',
      traderName: 'Tu nombre de trader',
      traderNamePlaceholder: 'Ej: Carlos, El Trader, etc.',
      initialCapital: 'Capital Inicial',
      dailyGoal: 'Meta Diaria',
      myAssets: 'Mis Activos',
      assetsDescription: 'Agrega los pares o activos que operas frecuentemente',
      searchAsset: 'Escribe o busca un activo...',
      noAssetsYet: 'No has agregado activos aun',
      setupRules: 'Reglas de Setup',
      rulesDescription: 'Define tus criterios para tomar un trade. Se usaran como checklist antes de operar.',
      rulePlaceholder: 'Ej: Confluencia de soportes...',
      noRulesYet: 'No has agregado reglas de setup aun',
      moveUp: 'Mover arriba',
      moveDown: 'Mover abajo',
      profilePhoto: 'Foto de perfil',
      changePhoto: 'Cambiar foto',
      removePhoto: 'Quitar foto',
      viewTour: 'Ver tour de la app',
      saveConfig: 'Guardar Configuracion',
      brokerAccounts: 'Cuentas de Broker',
      brokerAccountsDesc: 'Guarda la informacion de tus cuentas de trading',
      brokerName: 'Broker',
      brokerPlaceholder: 'Ej: WelTrade, XM, Exness...',
      accountNumber: 'Numero de cuenta',
      serverName: 'Servidor (opcional)',
      serverPlaceholder: 'Ej: WelTrade-Live',
      investorPassword: 'Contrasena de inversor',
      investorPasswordHint: 'Solo lectura, no permite operar',
      addAccount: 'Agregar cuenta',
      noAccountsYet: 'No has agregado cuentas aun',
      accountAdded: 'Cuenta agregada',
      currency: 'Divisa',
      capitalMovements: 'Movimientos de Capital',
      initialBalance: 'Saldo Inicial',
      balance: 'Saldo',
      dailyGoalMode: 'Tipo de meta',
      percentageMode: 'Porcentaje',
      amountMode: 'Monto fijo',
      percentageDesc: 'Se calcula sobre el saldo de la cuenta activa',
    },
    en: {
      title: 'Settings',
      personalization: 'Personalization',
      traderName: 'Your trader name',
      traderNamePlaceholder: 'Ex: Carlos, The Trader, etc.',
      initialCapital: 'Initial Capital',
      dailyGoal: 'Daily Goal',
      myAssets: 'My Assets',
      assetsDescription: 'Add the pairs or assets you trade frequently',
      searchAsset: 'Type or search for an asset...',
      noAssetsYet: 'You haven\'t added any assets yet',
      setupRules: 'Setup Rules',
      rulesDescription: 'Define your criteria to take a trade. They will be used as a checklist before trading.',
      rulePlaceholder: 'Ex: Support confluence...',
      noRulesYet: 'You haven\'t added any setup rules yet',
      moveUp: 'Move up',
      moveDown: 'Move down',
      profilePhoto: 'Profile photo',
      changePhoto: 'Change photo',
      removePhoto: 'Remove photo',
      viewTour: 'View app tour',
      saveConfig: 'Save Settings',
      brokerAccounts: 'Broker Accounts',
      brokerAccountsDesc: 'Save your trading accounts information',
      brokerName: 'Broker',
      brokerPlaceholder: 'Ex: WelTrade, XM, Exness...',
      accountNumber: 'Account number',
      serverName: 'Server (optional)',
      serverPlaceholder: 'Ex: WelTrade-Live',
      investorPassword: 'Investor password',
      investorPasswordHint: 'Read-only, cannot trade',
      addAccount: 'Add account',
      noAccountsYet: 'You haven\'t added any accounts yet',
      accountAdded: 'Account added',
      currency: 'Currency',
      capitalMovements: 'Capital Movements',
      initialBalance: 'Initial Balance',
      balance: 'Balance',
      dailyGoalMode: 'Goal type',
      percentageMode: 'Percentage',
      amountMode: 'Fixed amount',
      percentageDesc: 'Calculated on active account balance',
    },
  };
  const t = labels[language];

  if (!isOpen) return null;

  // Filtrar sugerencias basadas en el input
  const sugerenciasFiltradas = nuevoActivo.length > 0
    ? ACTIVOS_DISPONIBLES.filter(a =>
        (a.symbol.toLowerCase().includes(nuevoActivo.toLowerCase()) ||
        a.name.toLowerCase().includes(nuevoActivo.toLowerCase())) &&
        !(config.activosFavoritos || []).includes(a.symbol)
      ).slice(0, 6)
    : [];

  const agregarActivo = (symbol) => {
    const actuales = config.activosFavoritos || [];
    if (!actuales.includes(symbol)) {
      setConfig({ ...config, activosFavoritos: [...actuales, symbol] });
    }
    setNuevoActivo('');
    setShowSugerencias(false);
  };

  const agregarActivoManual = () => {
    const symbol = nuevoActivo.trim().toUpperCase();
    if (symbol && !(config.activosFavoritos || []).includes(symbol)) {
      setConfig({ ...config, activosFavoritos: [...(config.activosFavoritos || []), symbol] });
    }
    setNuevoActivo('');
    setShowSugerencias(false);
  };

  const eliminarActivo = (symbol) => {
    const actuales = config.activosFavoritos || [];
    setConfig({ ...config, activosFavoritos: actuales.filter(a => a !== symbol) });
  };

  const agregarRegla = () => {
    const regla = nuevaRegla.trim();
    if (!regla) return;
    const actuales = config.reglasSetup || [];
    if (actuales.includes(regla)) return;
    setConfig({ ...config, reglasSetup: [...actuales, regla] });
    setNuevaRegla('');
  };

  const eliminarRegla = (index) => {
    const actuales = config.reglasSetup || [];
    setConfig({ ...config, reglasSetup: actuales.filter((_, i) => i !== index) });
  };

  const moverRegla = (index, direccion) => {
    const actuales = [...(config.reglasSetup || [])];
    const nuevoIndex = index + direccion;
    if (nuevoIndex < 0 || nuevoIndex >= actuales.length) return;
    // Intercambiar posiciones
    [actuales[index], actuales[nuevoIndex]] = [actuales[nuevoIndex], actuales[index]];
    setConfig({ ...config, reglasSetup: actuales });
  };

  const moverCuenta = (index, direccion) => {
    const actuales = [...(config.cuentasBroker || [])];
    const nuevoIndex = index + direccion;
    if (nuevoIndex < 0 || nuevoIndex >= actuales.length) return;
    // Intercambiar posiciones
    [actuales[index], actuales[nuevoIndex]] = [actuales[nuevoIndex], actuales[index]];
    setConfig({ ...config, cuentasBroker: actuales });
  };

  // Comprimir imagen de perfil
  const compressProfileImage = (file, maxWidth = 200) => {
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
            // Hacer cuadrada (crop al centro)
            const size = Math.min(width, height);
            const offsetX = (width - size) / 2;
            const offsetY = (height - size) / 2;
            canvas.width = maxWidth;
            canvas.height = maxWidth;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, maxWidth, maxWidth);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } catch (err) {
            reject(err);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProfilePhoto = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande (max 5MB)');
      return;
    }
    try {
      const compressed = await compressProfileImage(file);
      setConfig({ ...config, fotoPerfil: compressed });
    } catch (error) {
      console.error('Error procesando imagen:', error);
    }
  };

  const removeProfilePhoto = () => {
    setConfig({ ...config, fotoPerfil: null });
  };

  const agregarCuenta = () => {
    if (!nuevaCuenta.broker.trim() || !nuevaCuenta.numero.trim()) return;
    const actuales = config.cuentasBroker || [];
    const cuenta = {
      id: Date.now().toString(),
      broker: nuevaCuenta.broker.trim(),
      numero: nuevaCuenta.numero.trim(),
      servidor: nuevaCuenta.servidor.trim() || null,
      password: nuevaCuenta.password.trim() || null,
      divisa: nuevaCuenta.divisa || 'USD',
      saldoInicial: parseFloat(nuevaCuenta.saldoInicial) || 0,
    };
    setConfig({ ...config, cuentasBroker: [...actuales, cuenta] });
    setNuevaCuenta({ broker: '', numero: '', servidor: '', password: '', divisa: 'USD', saldoInicial: '' });
  };

  const eliminarCuenta = (id) => {
    const actuales = config.cuentasBroker || [];
    setConfig({ ...config, cuentasBroker: actuales.filter(c => c.id !== id) });
  };

  const toggleShowPassword = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateSaldoInicial = (id, nuevoSaldo) => {
    const actuales = config.cuentasBroker || [];
    const actualizadas = actuales.map(c =>
      c.id === id ? { ...c, saldoInicial: parseFloat(nuevoSaldo) || 0 } : c
    );
    setConfig({ ...config, cuentasBroker: actualizadas });
    setEditingSaldo(prev => ({ ...prev, [id]: false }));
  };
  
  const handleMetaUSD = (usd) => setConfig({ ...config, metaDiaria: Number(usd) });
  
  const handleMetaPercent = (pct) => { 
    const usd = (config.capitalInicial * (pct / 100)).toFixed(0); 
    setConfig({ ...config, metaDiaria: Number(usd) }); 
  };
  
  const metaPercentDisplay = config.capitalInicial > 0
    ? ((config.metaDiaria / config.capitalInicial) * 100).toFixed(2)
    : 0;

  // Calcular balance por cuenta
  const getAccountBalance = (cuentaId) => {
    // Obtener saldo inicial de la cuenta
    const cuenta = (config.cuentasBroker || []).find(c => c.id === cuentaId);
    const saldoInicial = cuenta?.saldoInicial || 0;

    // Sumar trades de esta cuenta
    const tradesPnL = trades
      .filter(t => t.cuentaId === cuentaId)
      .reduce((sum, t) => sum + (parseFloat(t.res) || 0) - (parseFloat(t.swap) || 0), 0);

    // Sumar depósitos a esta cuenta
    const deposits = movements
      .filter(m => m.type === 'deposit' && m.cuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    // Restar retiros de esta cuenta
    const withdrawals = movements
      .filter(m => m.type === 'withdrawal' && m.cuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    // Transferencias entrantes (usar monto convertido si existe)
    const transfersIn = movements
      .filter(m => m.type === 'transfer' && m.toCuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amountConverted || m.amount || 0), 0);

    // Transferencias salientes (siempre usar el monto original)
    const transfersOut = movements
      .filter(m => m.type === 'transfer' && m.fromCuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    return saldoInicial + tradesPnL + deposits - withdrawals + transfersIn - transfersOut;
  };

  const handleSave = () => {
    onSaveToCloud();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`rounded-2xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Settings size={20} className="text-blue-500"/> {t.title}
          </h3>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            <X size={20}/>
          </button>
        </div>
        
        <div className="space-y-5">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-blue-50 border-blue-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-3 block flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <User size={14}/> {t.personalization}
            </label>

            {/* Foto de perfil */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                {config.fotoPerfil ? (
                  <img
                    src={config.fotoPerfil}
                    alt="Perfil"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-slate-600' : 'bg-slate-200'
                  }`}>
                    <User size={28} className={isDark ? 'text-slate-400' : 'text-slate-400'} />
                  </div>
                )}
                <label
                  htmlFor="profile-photo-input"
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer transition-colors"
                >
                  <Camera size={12} className="text-white" />
                </label>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleProfilePhoto(file);
                    e.target.value = '';
                  }}
                />
              </div>
              <div className="flex-1">
                <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.profilePhoto}
                </p>
                {config.fotoPerfil && (
                  <button
                    type="button"
                    onClick={removeProfilePhoto}
                    className="text-xs text-red-500 hover:text-red-600 font-medium mt-1"
                  >
                    {t.removePhoto}
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.traderName}
              </label>
              <input
                type="text"
                placeholder={t.traderNamePlaceholder}
                className={`w-full p-2.5 border rounded-xl font-medium outline-none focus:border-blue-500 transition-colors text-sm ${
                  isDark
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={config.nombreTrader || ''}
                onChange={e => setConfig({...config, nombreTrader: e.target.value})}
              />
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-3 block flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              <Target size={14} className="text-blue-500"/> {t.dailyGoal}
            </label>

            {/* Toggle entre porcentaje y monto fijo */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, metaDiariaMode: 'percentage' })}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  config.metaDiariaMode === 'percentage'
                    ? 'bg-blue-500 text-white'
                    : isDark ? 'bg-slate-600 text-slate-400' : 'bg-slate-200 text-slate-500'
                }`}
              >
                % {t.percentageMode}
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, metaDiariaMode: 'amount' })}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  config.metaDiariaMode !== 'percentage'
                    ? 'bg-blue-500 text-white'
                    : isDark ? 'bg-slate-600 text-slate-400' : 'bg-slate-200 text-slate-500'
                }`}
              >
                $ {t.amountMode}
              </button>
            </div>

            {/* Input según el modo */}
            {config.metaDiariaMode === 'percentage' ? (
              <div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="2"
                    className={`w-full pr-7 p-2 border rounded-lg font-bold text-blue-500 outline-none focus:border-blue-500 text-sm ${
                      isDark
                        ? 'bg-slate-600 border-slate-500 placeholder:text-slate-500'
                        : 'bg-white border-slate-200 placeholder:text-slate-400'
                    }`}
                    value={config.metaDiariaPct || ''}
                    onChange={e => setConfig({ ...config, metaDiariaPct: Number(e.target.value) })}
                  />
                  <span className={`absolute right-3 top-2.5 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>%</span>
                </div>
                <p className={`text-[10px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.percentageDesc}
                </p>
              </div>
            ) : (
              <div className="relative">
                <span className={`absolute left-3 top-2.5 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
                <input
                  type="number"
                  placeholder="50"
                  className={`w-full pl-7 p-2 border rounded-lg font-bold outline-none focus:border-blue-500 text-sm ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400'
                  }`}
                  value={config.metaDiaria || ''}
                  onChange={e => handleMetaUSD(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Mis Activos / Pares */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-green-50 border-green-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-3 block flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <TrendingUp size={14}/> {t.myAssets}
            </label>
            <p className={`text-[10px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.assetsDescription}
            </p>

            {/* Input para agregar nuevo activo */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder={t.searchAsset}
                className={`w-full p-2.5 pr-10 border rounded-xl font-medium outline-none focus:border-green-500 transition-colors text-sm ${
                  isDark
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={nuevoActivo}
                onChange={e => {
                  setNuevoActivo(e.target.value);
                  setShowSugerencias(true);
                }}
                onFocus={() => setShowSugerencias(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    agregarActivoManual();
                  }
                }}
              />
              <button
                type="button"
                onClick={agregarActivoManual}
                disabled={!nuevoActivo.trim()}
                className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${
                  nuevoActivo.trim()
                    ? isDark ? 'hover:bg-slate-500 text-green-400' : 'hover:bg-green-100 text-green-500'
                    : 'opacity-30 cursor-not-allowed'
                } ${isDark ? 'text-slate-400' : 'text-slate-400'}`}
                title="Agregar activo"
              >
                <Plus size={16}/>
              </button>

              {/* Sugerencias dropdown */}
              {showSugerencias && sugerenciasFiltradas.length > 0 && (
                <div className={`absolute z-10 w-full mt-1 rounded-xl border shadow-lg max-h-48 overflow-y-auto ${
                  isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                }`}>
                  {sugerenciasFiltradas.map((activo) => (
                    <button
                      key={activo.symbol}
                      type="button"
                      onClick={() => agregarActivo(activo.symbol)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex justify-between items-center ${
                        isDark
                          ? 'hover:bg-slate-600 text-white'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold">{activo.symbol}</span>
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activo.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lista de activos guardados */}
            {(config.activosFavoritos || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(config.activosFavoritos || []).map((symbol) => (
                  <div
                    key={symbol}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                      isDark
                        ? 'bg-slate-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{symbol}</span>
                    <button
                      type="button"
                      onClick={() => eliminarActivo(symbol)}
                      className={`p-0.5 rounded transition-colors ${
                        isDark ? 'hover:bg-red-500/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <Trash2 size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs text-center py-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.noAssetsYet}
              </p>
            )}
          </div>

          {/* Cuentas de Broker */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-purple-50 border-purple-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              <Briefcase size={14}/> {t.brokerAccounts}
            </label>
            <p className={`text-[10px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.brokerAccountsDesc}
            </p>

            {/* Formulario para nueva cuenta */}
            <div className={`p-3 rounded-xl mb-3 space-y-2 ${isDark ? 'bg-slate-600/50' : 'bg-white border border-purple-200'}`}>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={t.brokerPlaceholder}
                  className={`w-full p-2 border rounded-lg font-medium outline-none focus:border-purple-500 transition-colors text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                  value={nuevaCuenta.broker}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, broker: e.target.value })}
                />
                <input
                  type="text"
                  placeholder={t.accountNumber}
                  className={`w-full p-2 border rounded-lg font-mono font-medium outline-none focus:border-purple-500 transition-colors text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                  value={nuevaCuenta.numero}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, numero: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder={t.serverPlaceholder}
                  className={`col-span-2 w-full p-2 border rounded-lg font-medium outline-none focus:border-purple-500 transition-colors text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                  value={nuevaCuenta.servidor}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, servidor: e.target.value })}
                />
                <select
                  className={`w-full p-2 border rounded-lg font-bold outline-none focus:border-purple-500 transition-colors text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-500 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                  value={nuevaCuenta.divisa}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, divisa: e.target.value })}
                  title={t.currency}
                >
                  <option value="USD">USD $</option>
                  <option value="MXN">MXN $</option>
                  <option value="EUR">EUR €</option>
                  <option value="GBP">GBP £</option>
                  <option value="JPY">JPY ¥</option>
                  <option value="CAD">CAD $</option>
                  <option value="AUD">AUD $</option>
                  <option value="CHF">CHF Fr</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className={`absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {nuevaCuenta.divisa === 'EUR' ? '€' : nuevaCuenta.divisa === 'GBP' ? '£' : nuevaCuenta.divisa === 'JPY' ? '¥' : '$'}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={t.initialBalance}
                    className={`w-full p-2 pl-6 border rounded-lg font-bold outline-none focus:border-purple-500 transition-colors text-sm ${
                      isDark
                        ? 'bg-slate-700 border-slate-500 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                    }`}
                    value={nuevaCuenta.saldoInicial}
                    onChange={e => setNuevaCuenta({ ...nuevaCuenta, saldoInicial: e.target.value })}
                  />
                </div>
                <input
                  type="password"
                  placeholder={t.investorPassword}
                  className={`w-full p-2 border rounded-lg font-medium outline-none focus:border-purple-500 transition-colors text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                  value={nuevaCuenta.password}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, password: e.target.value })}
                />
              </div>
              <p className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.investorPasswordHint}
              </p>
              <button
                type="button"
                onClick={agregarCuenta}
                disabled={!nuevaCuenta.broker.trim() || !nuevaCuenta.numero.trim()}
                className={`w-full py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                  nuevaCuenta.broker.trim() && nuevaCuenta.numero.trim()
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : isDark ? 'bg-slate-600 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus size={16}/> {t.addAccount}
              </button>
            </div>

            {/* Lista de cuentas guardadas */}
            {(config.cuentasBroker || []).length > 0 ? (
              <div className="space-y-2">
                {(config.cuentasBroker || []).map((cuenta, index) => (
                  <div
                    key={cuenta.id}
                    className={`p-3 rounded-lg ${isDark ? 'bg-slate-600' : 'bg-white border border-slate-200'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      {/* Flechas para ordenar */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => moverCuenta(index, -1)}
                          disabled={index === 0}
                          className={`p-0.5 rounded transition-colors ${
                            index === 0
                              ? 'opacity-30 cursor-not-allowed'
                              : isDark ? 'hover:bg-slate-500 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                          }`}
                          title={t.moveUp}
                        >
                          <ChevronUp size={14}/>
                        </button>
                        <button
                          type="button"
                          onClick={() => moverCuenta(index, 1)}
                          disabled={index === (config.cuentasBroker || []).length - 1}
                          className={`p-0.5 rounded transition-colors ${
                            index === (config.cuentasBroker || []).length - 1
                              ? 'opacity-30 cursor-not-allowed'
                              : isDark ? 'hover:bg-slate-500 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                          }`}
                          title={t.moveDown}
                        >
                          <ChevronDown size={14}/>
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {cuenta.broker}
                          </span>
                          <span className={`font-mono text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-500 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            #{cuenta.numero}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            cuenta.divisa === 'USD' ? 'bg-green-500/20 text-green-500' :
                            cuenta.divisa === 'MXN' ? 'bg-emerald-500/20 text-emerald-500' :
                            cuenta.divisa === 'EUR' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-amber-500/20 text-amber-500'
                          }`}>
                            {cuenta.divisa || 'USD'}
                          </span>
                        </div>
                        {cuenta.servidor && (
                          <div className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <Server size={10}/> {cuenta.servidor}
                          </div>
                        )}
                        {cuenta.password && (
                          <div className={`flex items-center gap-1 mt-1 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <button
                              type="button"
                              onClick={() => toggleShowPassword(cuenta.id)}
                              className="flex items-center gap-1 hover:text-purple-500 transition-colors"
                            >
                              {showPassword[cuenta.id] ? <EyeOff size={10}/> : <Eye size={10}/>}
                              <span className="font-mono">
                                {showPassword[cuenta.id] ? cuenta.password : '••••••••'}
                              </span>
                            </button>
                          </div>
                        )}
                        {/* Saldo inicial editable y balance */}
                        {(() => {
                          const balance = getAccountBalance(cuenta.id);
                          const currencySymbol = cuenta.divisa === 'EUR' ? '€' : cuenta.divisa === 'GBP' ? '£' : cuenta.divisa === 'JPY' ? '¥' : '$';
                          return (
                            <div className={`mt-2 pt-2 border-t space-y-1 ${isDark ? 'border-slate-500' : 'border-slate-200'}`}>
                              {/* Saldo inicial editable */}
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {t.initialBalance}
                                </span>
                                {editingSaldo[cuenta.id] ? (
                                  <div className="flex items-center gap-1">
                                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currencySymbol}</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      className={`w-24 p-1 text-xs font-bold text-right border rounded outline-none ${
                                        isDark ? 'bg-slate-700 border-slate-500 text-white' : 'bg-white border-slate-300 text-slate-700'
                                      }`}
                                      defaultValue={cuenta.saldoInicial || 0}
                                      onBlur={(e) => updateSaldoInicial(cuenta.id, e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') updateSaldoInicial(cuenta.id, e.target.value);
                                        if (e.key === 'Escape') setEditingSaldo(prev => ({ ...prev, [cuenta.id]: false }));
                                      }}
                                      autoFocus
                                    />
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setEditingSaldo(prev => ({ ...prev, [cuenta.id]: true }))}
                                    className={`flex items-center gap-1 text-xs hover:text-purple-500 transition-colors ${
                                      isDark ? 'text-slate-300' : 'text-slate-600'
                                    }`}
                                  >
                                    {currencySymbol}{(cuenta.saldoInicial || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    <Edit3 size={10} className="opacity-50" />
                                  </button>
                                )}
                              </div>
                              {/* Balance total */}
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {t.balance}
                                </span>
                                <span className={`text-sm font-black ${
                                  balance >= 0 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarCuenta(cuenta.id)}
                        className={`p-1.5 rounded transition-colors flex-shrink-0 ${
                          isDark ? 'hover:bg-red-500/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                        }`}
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs text-center py-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.noAccountsYet}
              </p>
            )}

            {/* Botón de movimientos de capital */}
            {onMovements && (
              <button
                type="button"
                onClick={onMovements}
                className={`w-full mt-3 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                }`}
              >
                <ArrowLeftRight size={16}/>
                {t.capitalMovements}
              </button>
            )}
          </div>

          {/* Reglas de Setup / Checklist */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-amber-50 border-amber-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              <ClipboardCheck size={14}/> {t.setupRules}
            </label>
            <p className={`text-[10px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.rulesDescription}
            </p>

            {/* Input para agregar regla */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder={t.rulePlaceholder}
                className={`flex-1 p-2.5 border rounded-xl font-medium outline-none focus:border-amber-500 transition-colors text-sm ${
                  isDark
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={nuevaRegla}
                onChange={e => setNuevaRegla(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    agregarRegla();
                  }
                }}
              />
              <button
                type="button"
                onClick={agregarRegla}
                disabled={!nuevaRegla.trim()}
                className={`px-3 rounded-xl font-bold text-sm transition-colors ${
                  nuevaRegla.trim()
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : isDark ? 'bg-slate-600 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus size={18}/>
              </button>
            </div>

            {/* Lista de reglas */}
            {(config.reglasSetup || []).length > 0 ? (
              <div className="space-y-2">
                {(config.reglasSetup || []).map((regla, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      isDark ? 'bg-slate-600' : 'bg-white border border-slate-200'
                    }`}
                  >
                    {/* Número */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {index + 1}
                    </span>
                    {/* Texto de la regla */}
                    <span className={`flex-1 font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                      {regla}
                    </span>
                    {/* Botones de ordenar */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => moverRegla(index, -1)}
                        disabled={index === 0}
                        className={`p-0.5 rounded transition-colors ${
                          index === 0
                            ? 'opacity-30 cursor-not-allowed'
                            : isDark ? 'hover:bg-slate-500 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title={t.moveUp}
                      >
                        <ChevronUp size={14}/>
                      </button>
                      <button
                        type="button"
                        onClick={() => moverRegla(index, 1)}
                        disabled={index === (config.reglasSetup || []).length - 1}
                        className={`p-0.5 rounded transition-colors ${
                          index === (config.reglasSetup || []).length - 1
                            ? 'opacity-30 cursor-not-allowed'
                            : isDark ? 'hover:bg-slate-500 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title={t.moveDown}
                      >
                        <ChevronDown size={14}/>
                      </button>
                    </div>
                    {/* Botón eliminar */}
                    <button
                      type="button"
                      onClick={() => eliminarRegla(index)}
                      className={`p-1 rounded transition-colors flex-shrink-0 ${
                        isDark ? 'hover:bg-red-500/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs text-center py-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.noRulesYet}
              </p>
            )}
          </div>

          {/* Botón para ver tour */}
          {onRestartTour && (
            <button
              onClick={() => {
                onRestartTour();
                onClose();
              }}
              className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <HelpCircle size={18} />
              {t.viewTour}
            </button>
          )}

          <button
            onClick={handleSave}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold active:scale-[0.98] transition-all shadow-lg"
          >
            {t.saveConfig}
          </button>
        </div>
      </div>
    </div>
  );
}