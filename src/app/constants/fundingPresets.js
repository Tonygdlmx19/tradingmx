// Presets de empresas de fondeo con sus reglas de evaluación

export const FUNDING_PRESETS = {
  FTMO: {
    nombre: "FTMO",
    descripcion: "Una de las empresas de fondeo más populares y reconocidas",
    cuentas: [
      { capital: 10000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 4, tiempoLimite: 30 },
      { capital: 25000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 4, tiempoLimite: 30 },
      { capital: 50000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 4, tiempoLimite: 30 },
      { capital: 100000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 4, tiempoLimite: 30 },
      { capital: 200000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 4, tiempoLimite: 30 },
    ]
  },
  MyForexFunds: {
    nombre: "MyForexFunds",
    descripcion: "Empresa de fondeo con reglas flexibles",
    cuentas: [
      { capital: 5000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 12, diasMin: 5, tiempoLimite: 30 },
      { capital: 10000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 12, diasMin: 5, tiempoLimite: 30 },
      { capital: 25000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 12, diasMin: 5, tiempoLimite: 30 },
      { capital: 50000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 12, diasMin: 5, tiempoLimite: 30 },
      { capital: 100000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 12, diasMin: 5, tiempoLimite: 30 },
      { capital: 200000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 12, diasMin: 5, tiempoLimite: 30 },
      { capital: 300000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 12, diasMin: 5, tiempoLimite: 30 },
    ]
  },
  FundedNext: {
    nombre: "Funded Next",
    descripcion: "Sin límite de tiempo para completar el challenge",
    cuentas: [
      { capital: 6000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 0, tiempoLimite: 0 },
      { capital: 15000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 0, tiempoLimite: 0 },
      { capital: 25000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 0, tiempoLimite: 0 },
      { capital: 50000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 0, tiempoLimite: 0 },
      { capital: 100000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 0, tiempoLimite: 0 },
      { capital: 200000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 0, tiempoLimite: 0 },
    ]
  },
  TheFundedTrader: {
    nombre: "The Funded Trader",
    descripcion: "Empresa popular con múltiples opciones de cuenta",
    cuentas: [
      { capital: 5000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 3, tiempoLimite: 35 },
      { capital: 10000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 3, tiempoLimite: 35 },
      { capital: 25000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 3, tiempoLimite: 35 },
      { capital: 50000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 3, tiempoLimite: 35 },
      { capital: 100000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 3, tiempoLimite: 35 },
      { capital: 200000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 3, tiempoLimite: 35 },
      { capital: 400000, profitTarget: 10, maxDDDiario: 5, maxDDTotal: 10, diasMin: 3, tiempoLimite: 35 },
    ]
  },
  E8Funding: {
    nombre: "E8 Funding",
    descripcion: "Proceso de evaluación en una fase",
    cuentas: [
      { capital: 25000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 8, diasMin: 0, tiempoLimite: 0 },
      { capital: 50000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 8, diasMin: 0, tiempoLimite: 0 },
      { capital: 100000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 8, diasMin: 0, tiempoLimite: 0 },
      { capital: 250000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 8, diasMin: 0, tiempoLimite: 0 },
    ]
  },
  TrueForexFunds: {
    nombre: "True Forex Funds",
    descripcion: "Reglas competitivas con drawdown generoso",
    cuentas: [
      { capital: 10000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 10, diasMin: 5, tiempoLimite: 30 },
      { capital: 25000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 10, diasMin: 5, tiempoLimite: 30 },
      { capital: 50000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 10, diasMin: 5, tiempoLimite: 30 },
      { capital: 100000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 10, diasMin: 5, tiempoLimite: 30 },
      { capital: 200000, profitTarget: 8, maxDDDiario: 5, maxDDTotal: 10, diasMin: 5, tiempoLimite: 30 },
    ]
  },
};

// Función helper para obtener las cuentas de una empresa
export function getCuentasPorEmpresa(empresaKey) {
  return FUNDING_PRESETS[empresaKey]?.cuentas || [];
}

// Función helper para obtener lista de empresas
export function getEmpresas() {
  return Object.entries(FUNDING_PRESETS).map(([key, value]) => ({
    key,
    nombre: value.nombre,
    descripcion: value.descripcion,
  }));
}

// Función para crear reglas personalizadas
export function crearReglasPersonalizadas(config) {
  return {
    capitalInicial: config.capital || 10000,
    profitTarget: config.profitTarget || 10,
    profitTargetUSD: (config.capital || 10000) * ((config.profitTarget || 10) / 100),
    maxDrawdownDiario: config.maxDDDiario || 5,
    maxDrawdownDiarioUSD: (config.capital || 10000) * ((config.maxDDDiario || 5) / 100),
    maxDrawdownTotal: config.maxDDTotal || 10,
    maxDrawdownTotalUSD: (config.capital || 10000) * ((config.maxDDTotal || 10) / 100),
    diasMinimos: config.diasMin || 0,
    tiempoLimite: config.tiempoLimite || 30,
  };
}

// Función para convertir preset a reglas
export function presetToReglas(empresaKey, cuentaIndex) {
  const empresa = FUNDING_PRESETS[empresaKey];
  if (!empresa || !empresa.cuentas[cuentaIndex]) return null;

  const cuenta = empresa.cuentas[cuentaIndex];
  return crearReglasPersonalizadas({
    capital: cuenta.capital,
    profitTarget: cuenta.profitTarget,
    maxDDDiario: cuenta.maxDDDiario,
    maxDDTotal: cuenta.maxDDTotal,
    diasMin: cuenta.diasMin,
    tiempoLimite: cuenta.tiempoLimite,
  });
}
