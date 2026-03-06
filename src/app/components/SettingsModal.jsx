"use client";
import { useState } from 'react';
import { Settings, X, Target, User, TrendingUp, Plus, Trash2, ClipboardCheck, HelpCircle, Briefcase, Eye, EyeOff, Server, ChevronUp, ChevronDown, Camera, ArrowLeftRight, Edit3, ImagePlus, Image, Maximize2, Wallet, BarChart3, AlertTriangle, AlertCircle, Info, Pencil, Check } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState('profile');
  const [nuevoActivo, setNuevoActivo] = useState('');
  const [showSugerencias, setShowSugerencias] = useState(false);
  // Strategy and rules state
  const [selectedStrategyId, setSelectedStrategyId] = useState(null);
  const [nuevaEstrategia, setNuevaEstrategia] = useState('');
  const [nuevaRegla, setNuevaRegla] = useState('');
  const [nuevaReglaDescripcion, setNuevaReglaDescripcion] = useState('');
  const [nuevaReglaImagen, setNuevaReglaImagen] = useState(null);
  const [nuevaReglaImportancia, setNuevaReglaImportancia] = useState('media');
  const [editingRuleIndex, setEditingRuleIndex] = useState(null);
  const [editingRuleData, setEditingRuleData] = useState(null); // { index, texto, descripcion }
  const [editingStrategyName, setEditingStrategyName] = useState(null); // { id, nombre }
  const [openImportanceDropdown, setOpenImportanceDropdown] = useState(null); // index of rule with open dropdown
  const [viewingRuleImage, setViewingRuleImage] = useState(null);
  const [expandedRules, setExpandedRules] = useState({});
  const [nuevaCuenta, setNuevaCuenta] = useState({ broker: '', numero: '', servidor: '', password: '', divisa: 'USD', saldoInicial: '' });
  const [showPassword, setShowPassword] = useState({});
  const [editingSaldo, setEditingSaldo] = useState({});

  const labels = {
    es: {
      title: 'Configuracion',
      profile: 'Perfil',
      goals: 'Objetivos',
      assets: 'Activos',
      accounts: 'Cuentas',
      strategies: 'Estrategias',
      traderName: 'Nombre de trader',
      traderNamePlaceholder: 'Ej: Carlos, El Trader, etc.',
      profilePhoto: 'Foto de perfil',
      changePhoto: 'Cambiar foto',
      removePhoto: 'Quitar foto',
      dailyGoal: 'Meta Diaria',
      myAssets: 'Mis Activos',
      assetsDescription: 'Agrega los pares o activos que operas frecuentemente',
      searchAsset: 'Escribe o busca un activo...',
      noAssetsYet: 'No has agregado activos aun',
      setupRules: 'Estrategias de Trading',
      rulesDescription: 'Crea diferentes estrategias con sus reglas. Cada regla puede tener descripcion e imagen de referencia.',
      rulePlaceholder: 'Nombre de la regla...',
      ruleDescPlaceholder: 'Describe cuando aplicar esta regla...',
      noRulesYet: 'No hay reglas en esta estrategia',
      noStrategiesYet: 'No has creado estrategias aun',
      addImage: 'Imagen',
      changeImage: 'Cambiar',
      removeImage: 'Quitar',
      viewImage: 'Ver imagen',
      ruleImageHint: 'Captura de tu setup ideal',
      newStrategy: 'Nueva estrategia',
      strategyPlaceholder: 'Ej: Tendencial, Rango, Breakout...',
      addStrategy: 'Crear',
      deleteStrategy: 'Eliminar estrategia',
      rules: 'reglas',
      addRule: 'Agregar',
      editRule: 'Editar',
      description: 'Descripcion',
      importance: 'Importancia',
      importanceHigh: 'Alta',
      importanceMedium: 'Media',
      importanceLow: 'Baja',
      moveUp: 'Mover arriba',
      moveDown: 'Mover abajo',
      viewTour: 'Ver tour de la app',
      saveConfig: 'Guardar Cambios',
      brokerAccounts: 'Cuentas de Broker',
      brokerAccountsDesc: 'Guarda la informacion de tus cuentas de trading',
      brokerName: 'Broker',
      brokerPlaceholder: 'Ej: WelTrade, XM...',
      accountNumber: 'Numero de cuenta',
      serverName: 'Servidor',
      serverPlaceholder: 'Ej: WelTrade-Live',
      investorPassword: 'Password inversor',
      investorPasswordHint: 'Solo lectura, no permite operar',
      addAccount: 'Agregar cuenta',
      noAccountsYet: 'No has agregado cuentas aun',
      currency: 'Divisa',
      capitalMovements: 'Movimientos de Capital',
      initialBalance: 'Saldo Inicial',
      balance: 'Saldo Actual',
      dailyGoalMode: 'Tipo de meta',
      percentageMode: 'Porcentaje',
      amountMode: 'Monto fijo',
      percentageDesc: 'Se calcula sobre el saldo de la cuenta activa',
      close: 'Cerrar',
    },
    en: {
      title: 'Settings',
      profile: 'Profile',
      goals: 'Goals',
      assets: 'Assets',
      accounts: 'Accounts',
      strategies: 'Strategies',
      traderName: 'Trader name',
      traderNamePlaceholder: 'Ex: Carlos, The Trader, etc.',
      profilePhoto: 'Profile photo',
      changePhoto: 'Change photo',
      removePhoto: 'Remove photo',
      dailyGoal: 'Daily Goal',
      myAssets: 'My Assets',
      assetsDescription: 'Add the pairs or assets you trade frequently',
      searchAsset: 'Type or search for an asset...',
      noAssetsYet: 'You haven\'t added any assets yet',
      setupRules: 'Trading Strategies',
      rulesDescription: 'Create different strategies with their rules. Each rule can have description and reference image.',
      rulePlaceholder: 'Rule name...',
      ruleDescPlaceholder: 'Describe when to apply this rule...',
      noRulesYet: 'No rules in this strategy',
      noStrategiesYet: 'You haven\'t created any strategies yet',
      addImage: 'Image',
      changeImage: 'Change',
      removeImage: 'Remove',
      viewImage: 'View image',
      ruleImageHint: 'Screenshot of your ideal setup',
      newStrategy: 'New strategy',
      strategyPlaceholder: 'Ex: Trend, Range, Breakout...',
      addStrategy: 'Create',
      deleteStrategy: 'Delete strategy',
      rules: 'rules',
      addRule: 'Add',
      editRule: 'Edit',
      description: 'Description',
      importance: 'Importance',
      importanceHigh: 'High',
      importanceMedium: 'Medium',
      importanceLow: 'Low',
      moveUp: 'Move up',
      moveDown: 'Move down',
      viewTour: 'View app tour',
      saveConfig: 'Save Changes',
      brokerAccounts: 'Broker Accounts',
      brokerAccountsDesc: 'Save your trading accounts information',
      brokerName: 'Broker',
      brokerPlaceholder: 'Ex: WelTrade, XM...',
      accountNumber: 'Account number',
      serverName: 'Server',
      serverPlaceholder: 'Ex: WelTrade-Live',
      investorPassword: 'Investor password',
      investorPasswordHint: 'Read-only, cannot trade',
      addAccount: 'Add account',
      noAccountsYet: 'You haven\'t added any accounts yet',
      currency: 'Currency',
      capitalMovements: 'Capital Movements',
      initialBalance: 'Initial Balance',
      balance: 'Current Balance',
      dailyGoalMode: 'Goal type',
      percentageMode: 'Percentage',
      amountMode: 'Fixed amount',
      percentageDesc: 'Calculated on active account balance',
      close: 'Close',
    },
  };
  const t = labels[language];

  if (!isOpen) return null;

  // Navigation sections
  const sections = [
    { id: 'profile', label: t.profile, icon: User },
    { id: 'goals', label: t.goals, icon: Target },
    { id: 'assets', label: t.assets, icon: TrendingUp },
    { id: 'accounts', label: t.accounts, icon: Briefcase },
    { id: 'strategies', label: t.strategies, icon: ClipboardCheck },
  ];

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

  // Helper to normalize strategies (migrate from old reglasSetup format)
  const getStrategies = () => {
    if (config.estrategias && Array.isArray(config.estrategias)) {
      return config.estrategias;
    }
    if (config.reglasSetup && config.reglasSetup.length > 0) {
      const migratedRules = config.reglasSetup.map(rule => {
        if (typeof rule === 'string') {
          return { texto: rule, descripcion: '', imagen: null };
        }
        return { ...rule, descripcion: rule.descripcion || '' };
      });
      return [{
        id: 'default',
        nombre: language === 'es' ? 'Mi Estrategia' : 'My Strategy',
        reglas: migratedRules
      }];
    }
    return [];
  };

  const strategies = getStrategies();
  const selectedStrategy = strategies.find(s => s.id === selectedStrategyId) || strategies[0];

  // Compress rule image
  const compressRuleImage = (file, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.onerror = () => reject(new Error('Error loading image'));
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
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

  const handleRuleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressRuleImage(file);
      setNuevaReglaImagen(compressed);
    } catch (err) {
      console.error('Error compressing rule image:', err);
    }
  };

  // Strategy functions
  const agregarEstrategia = () => {
    const nombre = nuevaEstrategia.trim();
    if (!nombre) return;
    const newStrategy = {
      id: Date.now().toString(),
      nombre,
      reglas: []
    };
    const updated = [...strategies, newStrategy];
    setConfig({ ...config, estrategias: updated, reglasSetup: null });
    setNuevaEstrategia('');
    setSelectedStrategyId(newStrategy.id);
  };

  const eliminarEstrategia = (strategyId) => {
    const updated = strategies.filter(s => s.id !== strategyId);
    setConfig({ ...config, estrategias: updated });
    if (selectedStrategyId === strategyId) {
      setSelectedStrategyId(updated[0]?.id || null);
    }
  };

  const startEditingStrategyName = () => {
    if (!selectedStrategy) return;
    setEditingStrategyName({ id: selectedStrategy.id, nombre: selectedStrategy.nombre });
  };

  const saveStrategyName = () => {
    if (!editingStrategyName || !editingStrategyName.nombre.trim()) return;
    const updatedStrategies = strategies.map(s => {
      if (s.id === editingStrategyName.id) {
        return { ...s, nombre: editingStrategyName.nombre.trim() };
      }
      return s;
    });
    setConfig({ ...config, estrategias: updatedStrategies });
    setEditingStrategyName(null);
  };

  const cancelEditingStrategyName = () => {
    setEditingStrategyName(null);
  };

  // Rule functions
  const agregarRegla = () => {
    if (!selectedStrategy) return;
    const texto = nuevaRegla.trim();
    if (!texto) return;

    const newRule = {
      texto,
      descripcion: nuevaReglaDescripcion.trim(),
      imagen: nuevaReglaImagen,
      importancia: nuevaReglaImportancia
    };

    const updatedStrategies = strategies.map(s => {
      if (s.id === selectedStrategy.id) {
        return { ...s, reglas: [...s.reglas, newRule] };
      }
      return s;
    });

    setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
    setNuevaRegla('');
    setNuevaReglaDescripcion('');
    setNuevaReglaImagen(null);
    setNuevaReglaImportancia('media');
  };

  const eliminarRegla = (index) => {
    if (!selectedStrategy) return;
    const updatedStrategies = strategies.map(s => {
      if (s.id === selectedStrategy.id) {
        return { ...s, reglas: s.reglas.filter((_, i) => i !== index) };
      }
      return s;
    });
    setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
  };

  const moverRegla = (index, direccion) => {
    if (!selectedStrategy) return;
    const reglas = [...selectedStrategy.reglas];
    const nuevoIndex = index + direccion;
    if (nuevoIndex < 0 || nuevoIndex >= reglas.length) return;
    [reglas[index], reglas[nuevoIndex]] = [reglas[nuevoIndex], reglas[index]];

    const updatedStrategies = strategies.map(s => {
      if (s.id === selectedStrategy.id) {
        return { ...s, reglas };
      }
      return s;
    });
    setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
  };

  const handleEditRuleImage = async (index, e) => {
    if (!selectedStrategy) return;
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressRuleImage(file);
      const updatedStrategies = strategies.map(s => {
        if (s.id === selectedStrategy.id) {
          const reglas = [...s.reglas];
          reglas[index] = { ...reglas[index], imagen: compressed };
          return { ...s, reglas };
        }
        return s;
      });
      setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
    } catch (err) {
      console.error('Error compressing rule image:', err);
    }
  };

  const removeRuleImage = (index) => {
    if (!selectedStrategy) return;
    const updatedStrategies = strategies.map(s => {
      if (s.id === selectedStrategy.id) {
        const reglas = [...s.reglas];
        reglas[index] = { ...reglas[index], imagen: null };
        return { ...s, reglas };
      }
      return s;
    });
    setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
  };

  // Strategy reference images (Context, Execution, Order Flow)
  const handleStrategyImage = async (field, e) => {
    if (!selectedStrategy) return;
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressRuleImage(file, 1200);
      const updatedStrategies = strategies.map(s => {
        if (s.id === selectedStrategy.id) {
          return {
            ...s,
            [field]: {
              ...s[field],
              imagen: compressed
            }
          };
        }
        return s;
      });
      setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
    } catch (err) {
      console.error('Error compressing strategy image:', err);
    }
  };

  const updateStrategyImageName = (field, nombre) => {
    if (!selectedStrategy) return;
    const updatedStrategies = strategies.map(s => {
      if (s.id === selectedStrategy.id) {
        return {
          ...s,
          [field]: {
            ...s[field],
            nombre
          }
        };
      }
      return s;
    });
    setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
  };

  const removeStrategyImage = (field) => {
    if (!selectedStrategy) return;
    const updatedStrategies = strategies.map(s => {
      if (s.id === selectedStrategy.id) {
        return {
          ...s,
          [field]: {
            nombre: s[field]?.nombre || '',
            imagen: null
          }
        };
      }
      return s;
    });
    setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
  };

  const updateRuleImportance = (index, importancia) => {
    if (!selectedStrategy) return;
    const updatedStrategies = strategies.map(s => {
      if (s.id === selectedStrategy.id) {
        const reglas = [...s.reglas];
        reglas[index] = { ...reglas[index], importancia };
        return { ...s, reglas };
      }
      return s;
    });
    setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
  };

  const startEditingRule = (index) => {
    const regla = selectedStrategy?.reglas[index];
    if (!regla) return;
    setEditingRuleData({
      index,
      texto: regla.texto || '',
      descripcion: regla.descripcion || ''
    });
  };

  const saveEditingRule = () => {
    if (!selectedStrategy || !editingRuleData) return;
    const { index, texto, descripcion } = editingRuleData;
    if (!texto.trim()) return;

    const updatedStrategies = strategies.map(s => {
      if (s.id === selectedStrategy.id) {
        const reglas = [...s.reglas];
        reglas[index] = { ...reglas[index], texto: texto.trim(), descripcion: descripcion.trim() };
        return { ...s, reglas };
      }
      return s;
    });
    setConfig({ ...config, estrategias: updatedStrategies, reglasSetup: null });
    setEditingRuleData(null);
  };

  const cancelEditingRule = () => {
    setEditingRuleData(null);
  };

  // Helper to get importance styling
  const getImportanceStyle = (importancia) => {
    switch (importancia) {
      case 'alta':
        return { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30', icon: AlertTriangle, label: language === 'es' ? 'Alta' : 'High' };
      case 'baja':
        return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30', icon: Info, label: language === 'es' ? 'Baja' : 'Low' };
      default: // media
        return { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/30', icon: AlertCircle, label: language === 'es' ? 'Media' : 'Medium' };
    }
  };

  const toggleRuleExpanded = (index) => {
    setExpandedRules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const moverCuenta = (index, direccion) => {
    const actuales = [...(config.cuentasBroker || [])];
    const nuevoIndex = index + direccion;
    if (nuevoIndex < 0 || nuevoIndex >= actuales.length) return;
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

  // Calcular balance por cuenta
  const getAccountBalance = (cuentaId) => {
    const cuenta = (config.cuentasBroker || []).find(c => c.id === cuentaId);
    const saldoInicial = cuenta?.saldoInicial || 0;

    const tradesPnL = trades
      .filter(t => t.cuentaId === cuentaId)
      .reduce((sum, t) => sum + (parseFloat(t.res) || 0) - (parseFloat(t.swap) || 0), 0);

    const deposits = movements
      .filter(m => m.type === 'deposit' && m.cuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    const withdrawals = movements
      .filter(m => m.type === 'withdrawal' && m.cuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    const transfersIn = movements
      .filter(m => m.type === 'transfer' && m.toCuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amountConverted || m.amount || 0), 0);

    const transfersOut = movements
      .filter(m => m.type === 'transfer' && m.fromCuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    return saldoInicial + tradesPnL + deposits - withdrawals + transfersIn - transfersOut;
  };

  const handleSave = () => {
    onSaveToCloud();
    onClose();
  };

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {t.profile}
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'es' ? 'Personaliza tu perfil de trader' : 'Customize your trader profile'}
              </p>
            </div>

            {/* Profile Photo */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {config.fotoPerfil ? (
                    <img
                      src={config.fotoPerfil}
                      alt="Perfil"
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-500 shadow-lg"
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg ${
                      isDark ? 'bg-slate-600' : 'bg-slate-200'
                    }`}>
                      <User size={40} className={isDark ? 'text-slate-400' : 'text-slate-400'} />
                    </div>
                  )}
                  <label
                    htmlFor="profile-photo-input"
                    className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 cursor-pointer transition-all shadow-lg hover:scale-105"
                  >
                    <Camera size={16} className="text-white" />
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
                  <h4 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    {t.profilePhoto}
                  </h4>
                  <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'es' ? 'JPG, PNG. Max 5MB' : 'JPG, PNG. Max 5MB'}
                  </p>
                  {config.fotoPerfil && (
                    <button
                      type="button"
                      onClick={removeProfilePhoto}
                      className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      {t.removePhoto}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Trader Name */}
            <div>
              <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.traderName}
              </label>
              <input
                type="text"
                placeholder={t.traderNamePlaceholder}
                className={`w-full p-4 border-2 rounded-xl font-medium outline-none focus:border-blue-500 transition-all text-base ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={config.nombreTrader || ''}
                onChange={e => setConfig({...config, nombreTrader: e.target.value})}
              />
            </div>

            {/* App Tour */}
            {onRestartTour && (
              <button
                onClick={() => {
                  onRestartTour();
                  onClose();
                }}
                className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                  isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <HelpCircle size={20} />
                {t.viewTour}
              </button>
            )}
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {t.goals}
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'es' ? 'Define tus objetivos de trading' : 'Define your trading goals'}
              </p>
            </div>

            <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Target size={24} className="text-blue-500" />
                </div>
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    {t.dailyGoal}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'es' ? 'Tu meta de ganancias diarias' : 'Your daily profit target'}
                  </p>
                </div>
              </div>

              {/* Goal Type Toggle */}
              <div className="flex gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, metaDiariaMode: 'percentage' })}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    config.metaDiariaMode === 'percentage'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : isDark ? 'bg-slate-600 text-slate-400 hover:bg-slate-500' : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  % {t.percentageMode}
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, metaDiariaMode: 'amount' })}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    config.metaDiariaMode !== 'percentage'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : isDark ? 'bg-slate-600 text-slate-400 hover:bg-slate-500' : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  $ {t.amountMode}
                </button>
              </div>

              {/* Goal Input */}
              {config.metaDiariaMode === 'percentage' ? (
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="2"
                      className={`w-full pr-12 p-4 border-2 rounded-xl font-bold text-2xl text-blue-500 outline-none focus:border-blue-500 transition-all ${
                        isDark
                          ? 'bg-slate-600 border-slate-500 placeholder:text-slate-500'
                          : 'bg-white border-slate-200 placeholder:text-slate-400'
                      }`}
                      value={config.metaDiariaPct || ''}
                      onChange={e => setConfig({ ...config, metaDiariaPct: Number(e.target.value) })}
                    />
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xl ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>%</span>
                  </div>
                  <p className={`text-sm mt-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.percentageDesc}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
                  <input
                    type="number"
                    placeholder="50"
                    className={`w-full pl-10 p-4 border-2 rounded-xl font-bold text-2xl outline-none focus:border-blue-500 transition-all ${
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
          </div>
        );

      case 'assets':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {t.myAssets}
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.assetsDescription}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchAsset}
                className={`w-full p-4 pr-12 border-2 rounded-xl font-medium outline-none focus:border-green-500 transition-all ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
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
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                  nuevoActivo.trim()
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'opacity-30 cursor-not-allowed'
                } ${isDark ? 'text-slate-400' : 'text-slate-400'}`}
              >
                <Plus size={18}/>
              </button>

              {/* Suggestions */}
              {showSugerencias && sugerenciasFiltradas.length > 0 && (
                <div className={`absolute z-10 w-full mt-2 rounded-xl border-2 shadow-xl max-h-64 overflow-y-auto ${
                  isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                }`}>
                  {sugerenciasFiltradas.map((activo) => (
                    <button
                      key={activo.symbol}
                      type="button"
                      onClick={() => agregarActivo(activo.symbol)}
                      className={`w-full text-left px-4 py-3 transition-colors flex justify-between items-center ${
                        isDark
                          ? 'hover:bg-slate-600 text-white'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold">{activo.symbol}</span>
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activo.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assets List */}
            {(config.activosFavoritos || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(config.activosFavoritos || []).map((symbol) => (
                  <div
                    key={symbol}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all hover:scale-105 ${
                      isDark
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-slate-700 border-2 border-slate-200'
                    }`}
                  >
                    <span>{symbol}</span>
                    <button
                      type="button"
                      onClick={() => eliminarActivo(symbol)}
                      className={`p-1 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-red-500/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <X size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                <TrendingUp size={40} className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t.noAssetsYet}
                </p>
              </div>
            )}
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {t.brokerAccounts}
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.brokerAccountsDesc}
              </p>
            </div>

            {/* Add Account Form */}
            <div className={`p-5 rounded-2xl space-y-4 ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t.brokerPlaceholder}
                  className={`w-full p-3 border-2 rounded-xl font-medium outline-none focus:border-purple-500 transition-all ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                  value={nuevaCuenta.broker}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, broker: e.target.value })}
                />
                <input
                  type="text"
                  placeholder={t.accountNumber}
                  className={`w-full p-3 border-2 rounded-xl font-mono font-medium outline-none focus:border-purple-500 transition-all ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                  value={nuevaCuenta.numero}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, numero: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder={t.serverPlaceholder}
                  className={`col-span-2 w-full p-3 border-2 rounded-xl font-medium outline-none focus:border-purple-500 transition-all ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                  value={nuevaCuenta.servidor}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, servidor: e.target.value })}
                />
                <select
                  className={`w-full p-3 border-2 rounded-xl font-bold outline-none focus:border-purple-500 transition-all ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                  value={nuevaCuenta.divisa}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, divisa: e.target.value })}
                >
                  <option value="USD">USD $</option>
                  <option value="MXN">MXN $</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {nuevaCuenta.divisa === 'EUR' ? '€' : nuevaCuenta.divisa === 'GBP' ? '£' : '$'}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={t.initialBalance}
                    className={`w-full p-3 pl-7 border-2 rounded-xl font-bold outline-none focus:border-purple-500 transition-all ${
                      isDark
                        ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                        : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                    }`}
                    value={nuevaCuenta.saldoInicial}
                    onChange={e => setNuevaCuenta({ ...nuevaCuenta, saldoInicial: e.target.value })}
                  />
                </div>
                <input
                  type="password"
                  placeholder={t.investorPassword}
                  className={`w-full p-3 border-2 rounded-xl font-medium outline-none focus:border-purple-500 transition-all ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                  value={nuevaCuenta.password}
                  onChange={e => setNuevaCuenta({ ...nuevaCuenta, password: e.target.value })}
                />
              </div>
              <button
                type="button"
                onClick={agregarCuenta}
                disabled={!nuevaCuenta.broker.trim() || !nuevaCuenta.numero.trim()}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  nuevaCuenta.broker.trim() && nuevaCuenta.numero.trim()
                    ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
                    : isDark ? 'bg-slate-600 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus size={18}/> {t.addAccount}
              </button>
            </div>

            {/* Accounts List */}
            {(config.cuentasBroker || []).length > 0 ? (
              <div className="space-y-3">
                {(config.cuentasBroker || []).map((cuenta, index) => {
                  const balance = getAccountBalance(cuenta.id);
                  const currencySymbol = cuenta.divisa === 'EUR' ? '€' : cuenta.divisa === 'GBP' ? '£' : '$';
                  return (
                    <div
                      key={cuenta.id}
                      className={`p-4 rounded-2xl transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white border-2 border-slate-100 hover:border-slate-200'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1">
                          <button type="button" onClick={() => moverCuenta(index, -1)} disabled={index === 0} className={`p-1 rounded ${index === 0 ? 'opacity-30' : 'hover:bg-slate-600'}`}>
                            <ChevronUp size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'}/>
                          </button>
                          <button type="button" onClick={() => moverCuenta(index, 1)} disabled={index === (config.cuentasBroker || []).length - 1} className={`p-1 rounded ${index === (config.cuentasBroker || []).length - 1 ? 'opacity-30' : 'hover:bg-slate-600'}`}>
                            <ChevronDown size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'}/>
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{cuenta.broker}</span>
                            <span className={`font-mono text-sm px-2 py-0.5 rounded-lg ${isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                              #{cuenta.numero}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-lg font-bold ${
                              cuenta.divisa === 'USD' ? 'bg-green-500/20 text-green-500' :
                              cuenta.divisa === 'EUR' ? 'bg-blue-500/20 text-blue-500' :
                              'bg-amber-500/20 text-amber-500'
                            }`}>{cuenta.divisa}</span>
                          </div>
                          {cuenta.servidor && (
                            <div className={`flex items-center gap-1 text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              <Server size={12}/> {cuenta.servidor}
                            </div>
                          )}
                          <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-slate-600' : 'border-slate-100'}`}>
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.balance}</span>
                            <span className={`font-black text-lg ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarCuenta(cuenta.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`text-center py-12 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                <Briefcase size={40} className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t.noAccountsYet}
                </p>
              </div>
            )}

            {/* Capital Movements Button */}
            {onMovements && (
              <button
                type="button"
                onClick={onMovements}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                }`}
              >
                <ArrowLeftRight size={20}/>
                {t.capitalMovements}
              </button>
            )}
          </div>
        );

      case 'strategies':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {t.setupRules}
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.rulesDescription}
              </p>
            </div>

            {/* Create Strategy */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder={t.strategyPlaceholder}
                className={`flex-1 p-3 border-2 rounded-xl font-medium outline-none focus:border-amber-500 transition-all ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
                value={nuevaEstrategia}
                onChange={e => setNuevaEstrategia(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    agregarEstrategia();
                  }
                }}
              />
              <button
                type="button"
                onClick={agregarEstrategia}
                disabled={!nuevaEstrategia.trim()}
                className={`px-5 rounded-xl font-bold transition-all ${
                  nuevaEstrategia.trim()
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : isDark ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {t.addStrategy}
              </button>
            </div>

            {/* Strategies Tabs */}
            {strategies.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {strategies.map(strategy => (
                    <button
                      key={strategy.id}
                      type="button"
                      onClick={() => setSelectedStrategyId(strategy.id)}
                      className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        selectedStrategy?.id === strategy.id
                          ? 'bg-amber-500 text-white shadow-lg'
                          : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {strategy.nombre}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${selectedStrategy?.id === strategy.id ? 'bg-amber-600' : isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>
                        {strategy.reglas?.length || 0}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected Strategy */}
                {selectedStrategy && (
                  <div className={`p-5 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-4">
                      {editingStrategyName?.id === selectedStrategy.id ? (
                        <div className="flex items-center gap-2 flex-1 mr-4">
                          <input
                            type="text"
                            value={editingStrategyName.nombre}
                            onChange={(e) => setEditingStrategyName({ ...editingStrategyName, nombre: e.target.value })}
                            className={`flex-1 p-2 border-2 rounded-lg font-bold outline-none focus:border-amber-500 ${
                              isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveStrategyName();
                              if (e.key === 'Escape') cancelEditingStrategyName();
                            }}
                          />
                          <button
                            type="button"
                            onClick={saveStrategyName}
                            className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            <Check size={16}/>
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditingStrategyName}
                            className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-500 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                          >
                            <X size={16}/>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startEditingStrategyName}
                          className={`font-bold text-lg flex items-center gap-2 hover:opacity-70 transition-opacity ${isDark ? 'text-white' : 'text-slate-700'}`}
                          title={language === 'es' ? 'Clic para editar nombre' : 'Click to edit name'}
                        >
                          {selectedStrategy.nombre}
                          <Pencil size={14} className={isDark ? 'text-slate-400' : 'text-slate-400'}/>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(language === 'es' ? `¿Eliminar "${selectedStrategy.nombre}"?` : `Delete "${selectedStrategy.nombre}"?`)) {
                            eliminarEstrategia(selectedStrategy.id);
                          }
                        }}
                        className="text-sm px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        {t.deleteStrategy}
                      </button>
                    </div>

                    {/* Strategy Reference Images */}
                    <div className={`mb-5 p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-100/50'}`}>
                      <p className={`text-xs font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'es' ? 'Imagenes de referencia' : 'Reference images'}
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {/* Context Image */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder={language === 'es' ? 'Contexto' : 'Context'}
                            value={selectedStrategy.imagenContexto?.nombre || ''}
                            onChange={(e) => updateStrategyImageName('imagenContexto', e.target.value)}
                            className={`w-full p-2 text-xs border rounded-lg outline-none focus:border-amber-500 ${
                              isDark ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                            }`}
                          />
                          {selectedStrategy.imagenContexto?.imagen ? (
                            <div className="relative group">
                              <img
                                src={selectedStrategy.imagenContexto.imagen}
                                alt="Contexto"
                                className="w-full h-20 object-cover rounded-lg cursor-pointer"
                                onClick={() => setViewingRuleImage(selectedStrategy.imagenContexto.imagen)}
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                <label className="p-1.5 bg-white/20 rounded-full cursor-pointer hover:bg-white/30">
                                  <ImagePlus size={14} className="text-white"/>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStrategyImage('imagenContexto', e)} />
                                </label>
                                <button type="button" onClick={() => removeStrategyImage('imagenContexto')} className="p-1.5 bg-red-500/80 rounded-full hover:bg-red-500">
                                  <X size={14} className="text-white"/>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className={`w-full h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                              isDark ? 'border-slate-500 hover:border-slate-400 text-slate-500' : 'border-slate-300 hover:border-slate-400 text-slate-400'
                            }`}>
                              <ImagePlus size={20}/>
                              <span className="text-[10px] mt-1">{language === 'es' ? 'Agregar' : 'Add'}</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStrategyImage('imagenContexto', e)} />
                            </label>
                          )}
                        </div>

                        {/* Execution Image */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder={language === 'es' ? 'Ejecucion' : 'Execution'}
                            value={selectedStrategy.imagenEjecucion?.nombre || ''}
                            onChange={(e) => updateStrategyImageName('imagenEjecucion', e.target.value)}
                            className={`w-full p-2 text-xs border rounded-lg outline-none focus:border-amber-500 ${
                              isDark ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                            }`}
                          />
                          {selectedStrategy.imagenEjecucion?.imagen ? (
                            <div className="relative group">
                              <img
                                src={selectedStrategy.imagenEjecucion.imagen}
                                alt="Ejecucion"
                                className="w-full h-20 object-cover rounded-lg cursor-pointer"
                                onClick={() => setViewingRuleImage(selectedStrategy.imagenEjecucion.imagen)}
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                <label className="p-1.5 bg-white/20 rounded-full cursor-pointer hover:bg-white/30">
                                  <ImagePlus size={14} className="text-white"/>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStrategyImage('imagenEjecucion', e)} />
                                </label>
                                <button type="button" onClick={() => removeStrategyImage('imagenEjecucion')} className="p-1.5 bg-red-500/80 rounded-full hover:bg-red-500">
                                  <X size={14} className="text-white"/>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className={`w-full h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                              isDark ? 'border-slate-500 hover:border-slate-400 text-slate-500' : 'border-slate-300 hover:border-slate-400 text-slate-400'
                            }`}>
                              <ImagePlus size={20}/>
                              <span className="text-[10px] mt-1">{language === 'es' ? 'Agregar' : 'Add'}</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStrategyImage('imagenEjecucion', e)} />
                            </label>
                          )}
                        </div>

                        {/* Order Flow Image */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Order Flow"
                            value={selectedStrategy.imagenOrderFlow?.nombre || ''}
                            onChange={(e) => updateStrategyImageName('imagenOrderFlow', e.target.value)}
                            className={`w-full p-2 text-xs border rounded-lg outline-none focus:border-amber-500 ${
                              isDark ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                            }`}
                          />
                          {selectedStrategy.imagenOrderFlow?.imagen ? (
                            <div className="relative group">
                              <img
                                src={selectedStrategy.imagenOrderFlow.imagen}
                                alt="Order Flow"
                                className="w-full h-20 object-cover rounded-lg cursor-pointer"
                                onClick={() => setViewingRuleImage(selectedStrategy.imagenOrderFlow.imagen)}
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                <label className="p-1.5 bg-white/20 rounded-full cursor-pointer hover:bg-white/30">
                                  <ImagePlus size={14} className="text-white"/>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStrategyImage('imagenOrderFlow', e)} />
                                </label>
                                <button type="button" onClick={() => removeStrategyImage('imagenOrderFlow')} className="p-1.5 bg-red-500/80 rounded-full hover:bg-red-500">
                                  <X size={14} className="text-white"/>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className={`w-full h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                              isDark ? 'border-slate-500 hover:border-slate-400 text-slate-500' : 'border-slate-300 hover:border-slate-400 text-slate-400'
                            }`}>
                              <ImagePlus size={20}/>
                              <span className="text-[10px] mt-1">{language === 'es' ? 'Agregar' : 'Add'}</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStrategyImage('imagenOrderFlow', e)} />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add Rule */}
                    <div className="space-y-3 mb-5">
                      <input
                        type="text"
                        placeholder={t.rulePlaceholder}
                        className={`w-full p-3 border-2 rounded-xl font-medium outline-none focus:border-amber-500 transition-all ${
                          isDark
                            ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                            : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                        }`}
                        value={nuevaRegla}
                        onChange={e => setNuevaRegla(e.target.value)}
                      />
                      <textarea
                        placeholder={t.ruleDescPlaceholder}
                        className={`w-full p-3 border-2 rounded-xl font-medium outline-none focus:border-amber-500 transition-all resize-none ${
                          isDark
                            ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                            : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                        }`}
                        rows={2}
                        value={nuevaReglaDescripcion}
                        onChange={e => setNuevaReglaDescripcion(e.target.value)}
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Importance selector */}
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-medium mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.importance}:</span>
                          <button
                            type="button"
                            onClick={() => setNuevaReglaImportancia('alta')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              nuevaReglaImportancia === 'alta'
                                ? 'bg-red-500 text-white'
                                : isDark ? 'bg-slate-600 text-slate-400 hover:bg-slate-500' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {t.importanceHigh}
                          </button>
                          <button
                            type="button"
                            onClick={() => setNuevaReglaImportancia('media')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              nuevaReglaImportancia === 'media'
                                ? 'bg-amber-500 text-white'
                                : isDark ? 'bg-slate-600 text-slate-400 hover:bg-slate-500' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {t.importanceMedium}
                          </button>
                          <button
                            type="button"
                            onClick={() => setNuevaReglaImportancia('baja')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              nuevaReglaImportancia === 'baja'
                                ? 'bg-slate-500 text-white'
                                : isDark ? 'bg-slate-600 text-slate-400 hover:bg-slate-500' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {t.importanceLow}
                          </button>
                        </div>
                        <label className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                          isDark ? 'bg-slate-600 hover:bg-slate-500 text-slate-300' : 'bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}>
                          <ImagePlus size={16}/>
                          {nuevaReglaImagen ? t.changeImage : t.addImage}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleRuleImageChange}
                          />
                        </label>
                        {nuevaReglaImagen && (
                          <>
                            <img src={nuevaReglaImagen} alt="Preview" className="h-10 w-16 object-cover rounded-lg" />
                            <button type="button" onClick={() => setNuevaReglaImagen(null)} className="text-red-400 hover:text-red-300">
                              <X size={16}/>
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={agregarRegla}
                          disabled={!nuevaRegla.trim()}
                          className={`ml-auto px-5 py-2 rounded-xl font-bold transition-all ${
                            nuevaRegla.trim()
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : isDark ? 'bg-slate-600 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {t.addRule}
                        </button>
                      </div>
                    </div>

                    {/* Rules List */}
                    {selectedStrategy.reglas?.length > 0 ? (
                      <div className="space-y-2 overflow-visible">
                        {selectedStrategy.reglas.map((regla, index) => {
                          const importancia = regla.importancia || 'media';
                          const impStyle = getImportanceStyle(importancia);
                          const ImpIcon = impStyle.icon;
                          const isEditing = editingRuleData?.index === index;

                          return (
                            <div
                              key={index}
                              className={`rounded-xl overflow-visible transition-all border-l-4 ${impStyle.border} ${isDark ? 'bg-slate-600' : 'bg-white border-2 border-slate-100'}`}
                            >
                              {isEditing ? (
                                /* Edit Mode */
                                <div className="p-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0">
                                      {index + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={editingRuleData.texto}
                                      onChange={(e) => setEditingRuleData({ ...editingRuleData, texto: e.target.value })}
                                      className={`flex-1 p-2 border-2 rounded-lg font-medium outline-none focus:border-amber-500 text-sm ${
                                        isDark ? 'bg-slate-700 border-slate-500 text-white' : 'bg-white border-slate-200 text-slate-700'
                                      }`}
                                      autoFocus
                                    />
                                  </div>
                                  <textarea
                                    value={editingRuleData.descripcion}
                                    onChange={(e) => setEditingRuleData({ ...editingRuleData, descripcion: e.target.value })}
                                    placeholder={t.ruleDescPlaceholder}
                                    className={`w-full p-2 border-2 rounded-lg font-medium outline-none focus:border-amber-500 text-xs resize-none ${
                                      isDark ? 'bg-slate-700 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                                    }`}
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={cancelEditingRule}
                                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${isDark ? 'text-slate-400 hover:bg-slate-500' : 'text-slate-500 hover:bg-slate-100'}`}
                                    >
                                      {language === 'es' ? 'Cancelar' : 'Cancel'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={saveEditingRule}
                                      className="px-3 py-1.5 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1"
                                    >
                                      <Check size={14}/> {language === 'es' ? 'Guardar' : 'Save'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* View Mode - Mobile friendly layout */
                                <>
                                  <div className="p-3 space-y-2">
                                    {/* Row 1: Number + Importance + Info badge */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
                                        {index + 1}
                                      </span>
                                      {/* Importance indicator - click to change (inline buttons) */}
                                      {openImportanceDropdown === index ? (
                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() => { updateRuleImportance(index, 'alta'); setOpenImportanceDropdown(null); }}
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${importancia === 'alta' ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-red-500/20 text-red-500 hover:bg-red-500/40'}`}
                                            title={t.importanceHigh}
                                          >
                                            <AlertTriangle size={14}/>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => { updateRuleImportance(index, 'media'); setOpenImportanceDropdown(null); }}
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${importancia === 'media' ? 'bg-amber-500 text-white ring-2 ring-amber-300' : 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/40'}`}
                                            title={t.importanceMedium}
                                          >
                                            <AlertCircle size={14}/>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => { updateRuleImportance(index, 'baja'); setOpenImportanceDropdown(null); }}
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${importancia === 'baja' ? 'bg-slate-500 text-white ring-2 ring-slate-300' : 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/40'}`}
                                            title={t.importanceLow}
                                          >
                                            <Info size={14}/>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setOpenImportanceDropdown(null)}
                                            className={`w-6 h-6 rounded-lg flex items-center justify-center ${isDark ? 'text-slate-400 hover:bg-slate-500' : 'text-slate-400 hover:bg-slate-200'}`}
                                          >
                                            <X size={12}/>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setOpenImportanceDropdown(index)}
                                          className={`px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold transition-all hover:scale-105 ${impStyle.bg} ${impStyle.text}`}
                                          title={t.importance}
                                        >
                                          <ImpIcon size={10}/>
                                          {impStyle.label}
                                        </button>
                                      )}
                                      {regla.descripcion && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                          +info
                                        </span>
                                      )}
                                      {regla.imagen && (
                                        <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>
                                          <Image size={14}/>
                                        </span>
                                      )}
                                    </div>

                                    {/* Row 2: Rule text (full width) */}
                                    <button
                                      type="button"
                                      onClick={() => toggleRuleExpanded(index)}
                                      className={`w-full text-left text-sm font-medium leading-snug ${isDark ? 'text-white' : 'text-slate-700'}`}
                                    >
                                      {regla.texto}
                                    </button>

                                    {/* Row 3: Action buttons */}
                                    <div className="flex items-center gap-1 pt-1">
                                      {/* Edit button */}
                                      <button
                                        type="button"
                                        onClick={() => startEditingRule(index)}
                                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-blue-400 hover:bg-blue-500/20' : 'text-blue-500 hover:bg-blue-50'}`}
                                        title={t.editRule}
                                      >
                                        <Pencil size={14}/>
                                      </button>
                                      {/* Image button - add or view */}
                                      <label className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                        regla.imagen
                                          ? 'text-emerald-400 hover:bg-emerald-500/20'
                                          : isDark ? 'text-slate-400 hover:bg-slate-500' : 'text-slate-400 hover:bg-slate-100'
                                      }`} title={regla.imagen ? t.changeImage : t.addImage}>
                                        <ImagePlus size={14}/>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleEditRuleImage(index, e)} />
                                      </label>
                                      {regla.imagen && (
                                        <button type="button" onClick={() => setViewingRuleImage(regla.imagen)} className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded-lg" title={t.viewImage}>
                                          <Eye size={14}/>
                                        </button>
                                      )}
                                      <div className="flex-1"></div>
                                      <div className="flex gap-0.5">
                                        <button type="button" onClick={() => moverRegla(index, -1)} disabled={index === 0} className={`p-1 rounded ${index === 0 ? 'opacity-30' : ''}`}>
                                          <ChevronUp size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'}/>
                                        </button>
                                        <button type="button" onClick={() => moverRegla(index, 1)} disabled={index === selectedStrategy.reglas.length - 1} className={`p-1 rounded ${index === selectedStrategy.reglas.length - 1 ? 'opacity-30' : ''}`}>
                                          <ChevronDown size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'}/>
                                        </button>
                                      </div>
                                      <button type="button" onClick={() => eliminarRegla(index)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg">
                                        <Trash2 size={14}/>
                                      </button>
                                    </div>
                                  </div>
                                  {expandedRules[index] && regla.descripcion && (
                                    <div className={`px-3 pb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                      <p className={`p-3 rounded-lg text-sm ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                                        {regla.descripcion}
                                      </p>
                                    </div>
                                  )}
                                  {regla.imagen && (
                                    <div className="px-3 pb-3 relative group">
                                      <img
                                        src={regla.imagen}
                                        alt={regla.texto}
                                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setViewingRuleImage(regla.imagen)}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeRuleImage(index)}
                                        className="absolute top-1 right-4 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        title={t.removeImage}
                                      >
                                        <X size={12}/>
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <ClipboardCheck size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">{t.noRulesYet}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className={`text-center py-12 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                <ClipboardCheck size={40} className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t.noStrategiesYet}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-3xl shadow-2xl border overflow-hidden flex flex-col md:flex-row ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
        style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh' }}
      >
        {/* Sidebar Navigation */}
        <div className={`w-full md:w-56 flex-shrink-0 p-4 md:p-5 border-b md:border-b-0 md:border-r ${
          isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Settings size={20} className="text-blue-500"/> {t.title}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all md:hidden ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-400'}`}
            >
              <X size={20}/>
            </button>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeSection === section.id
                      ? isDark
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-blue-50 text-blue-600'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Desktop only */}
          <div className={`hidden md:flex items-center justify-end p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <X size={20}/>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            {renderSectionContent()}
          </div>

          {/* Footer */}
          <div className={`p-4 md:p-5 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              onClick={handleSave}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold active:scale-[0.98] transition-all shadow-lg text-base"
            >
              {t.saveConfig}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for viewing rule image fullscreen */}
      {viewingRuleImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setViewingRuleImage(null)}
        >
          <button
            onClick={() => setViewingRuleImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/20 rounded-full hover:bg-white/30 text-white transition-all"
          >
            <X size={24}/>
          </button>
          <img
            src={viewingRuleImage}
            alt="Rule reference"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
