// Funciones de cálculo para el simulador de fondeo

/**
 * Calcula el drawdown diario (pérdida del día vs capital inicial)
 */
export function calcularDrawdownDiario(trades, capitalInicial, fechaHoy) {
  const tradesHoy = trades.filter(t => t.fecha === fechaHoy);
  const pnlHoy = tradesHoy.reduce((sum, t) => sum + t.res, 0);

  if (pnlHoy >= 0) return { usd: 0, porcentaje: 0 };

  const ddUSD = Math.abs(pnlHoy);
  const ddPorcentaje = (ddUSD / capitalInicial) * 100;

  return { usd: ddUSD, porcentaje: ddPorcentaje };
}

/**
 * Calcula el drawdown total desde el pico (high water mark)
 */
export function calcularDrawdownTotal(balanceActual, picoBalance) {
  if (balanceActual >= picoBalance) return { usd: 0, porcentaje: 0 };

  const ddUSD = picoBalance - balanceActual;
  const ddPorcentaje = (ddUSD / picoBalance) * 100;

  return { usd: ddUSD, porcentaje: ddPorcentaje };
}

/**
 * Calcula el pico de balance histórico (high water mark)
 */
export function calcularPicoBalance(trades, capitalInicial) {
  let balance = capitalInicial;
  let pico = capitalInicial;

  // Ordenar trades por fecha de creación
  const sortedTrades = [...trades].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateA - dateB;
  });

  sortedTrades.forEach(t => {
    balance += t.res;
    if (balance > pico) pico = balance;
  });

  return pico;
}

/**
 * Cuenta días únicos con trades
 */
export function contarDiasOperados(trades) {
  const fechasUnicas = new Set(trades.map(t => t.fecha));
  return fechasUnicas.size;
}

/**
 * Calcula progreso hacia el profit target
 */
export function calcularProgresoTarget(pnlTotal, profitTargetUSD) {
  if (profitTargetUSD <= 0) return 0;
  return Math.min(100, (pnlTotal / profitTargetUSD) * 100);
}

/**
 * Calcula el balance actual
 */
export function calcularBalance(trades, capitalInicial) {
  const pnlTotal = trades.reduce((sum, t) => sum + t.res, 0);
  return capitalInicial + pnlTotal;
}

/**
 * Genera datos para la gráfica de equity con líneas de referencia
 */
export function generarDatosEquity(trades, capitalInicial, reglas) {
  const sortedTrades = [...trades].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateA - dateB;
  });

  const data = [{ name: 'Inicio', balance: capitalInicial, pico: capitalInicial }];
  let balance = capitalInicial;
  let pico = capitalInicial;

  sortedTrades.forEach((t, i) => {
    balance += t.res;
    if (balance > pico) pico = balance;
    data.push({
      name: `T${i + 1}`,
      balance: balance,
      pico: pico,
      fecha: t.fecha,
    });
  });

  return {
    data,
    lineas: {
      target: capitalInicial + reglas.profitTargetUSD,
      limiteDD: capitalInicial * (1 - reglas.maxDrawdownTotal / 100),
    }
  };
}

/**
 * Verifica todas las reglas y retorna estado completo del challenge
 */
export function verificarEstadoChallenge(challenge, trades) {
  const { reglas, fechaInicio } = challenge;
  const hoy = new Date().toISOString().split('T')[0];

  // Calcular métricas
  const pnlTotal = trades.reduce((sum, t) => sum + t.res, 0);
  const balanceActual = reglas.capitalInicial + pnlTotal;
  const picoBalance = calcularPicoBalance(trades, reglas.capitalInicial);
  const ddDiario = calcularDrawdownDiario(trades, reglas.capitalInicial, hoy);
  const ddTotal = calcularDrawdownTotal(balanceActual, picoBalance);
  const diasOperados = contarDiasOperados(trades);

  // Calcular días transcurridos
  const fechaInicioDate = fechaInicio?.toDate?.() || new Date(fechaInicio);
  const diasTranscurridos = Math.floor(
    (new Date() - fechaInicioDate) / (1000 * 60 * 60 * 24)
  );
  const diasRestantes = reglas.tiempoLimite > 0
    ? Math.max(0, reglas.tiempoLimite - diasTranscurridos)
    : null; // null = sin límite de tiempo

  // Verificar violaciones
  const violaciones = [];

  if (ddDiario.porcentaje >= reglas.maxDrawdownDiario) {
    violaciones.push({
      tipo: 'drawdown_diario',
      mensaje: `Drawdown diario excedido: ${ddDiario.porcentaje.toFixed(2)}% >= ${reglas.maxDrawdownDiario}%`,
      valor: ddDiario.porcentaje,
      limite: reglas.maxDrawdownDiario,
    });
  }

  if (ddTotal.porcentaje >= reglas.maxDrawdownTotal) {
    violaciones.push({
      tipo: 'drawdown_total',
      mensaje: `Drawdown total excedido: ${ddTotal.porcentaje.toFixed(2)}% >= ${reglas.maxDrawdownTotal}%`,
      valor: ddTotal.porcentaje,
      limite: reglas.maxDrawdownTotal,
    });
  }

  if (reglas.tiempoLimite > 0 && diasRestantes <= 0 && pnlTotal < reglas.profitTargetUSD) {
    violaciones.push({
      tipo: 'tiempo',
      mensaje: `Tiempo límite excedido sin alcanzar profit target`,
      valor: diasTranscurridos,
      limite: reglas.tiempoLimite,
    });
  }

  // Determinar estado
  let estado = 'activo';
  let motivoFallo = null;

  if (violaciones.length > 0) {
    estado = 'fallido';
    motivoFallo = violaciones[0].tipo;
  } else if (pnlTotal >= reglas.profitTargetUSD) {
    // Verificar días mínimos si aplica
    if (reglas.diasMinimos > 0 && diasOperados < reglas.diasMinimos) {
      // Aún no cumple días mínimos pero ya tiene el profit
      estado = 'activo';
    } else {
      estado = 'aprobado';
    }
  }

  // Calcular nivel de riesgo para UI (0-100)
  const riesgoDDDiario = reglas.maxDrawdownDiario > 0
    ? (ddDiario.porcentaje / reglas.maxDrawdownDiario) * 100
    : 0;
  const riesgoDDTotal = reglas.maxDrawdownTotal > 0
    ? (ddTotal.porcentaje / reglas.maxDrawdownTotal) * 100
    : 0;
  const nivelRiesgo = Math.max(riesgoDDDiario, riesgoDDTotal);

  // Calcular progreso hacia el target
  const progresoTarget = calcularProgresoTarget(pnlTotal, reglas.profitTargetUSD);

  return {
    estado,
    motivoFallo,
    violaciones,
    metricas: {
      balanceActual,
      pnlTotal,
      pnlPorcentaje: (pnlTotal / reglas.capitalInicial) * 100,
      picoBalance,
      drawdownDiario: ddDiario,
      drawdownTotal: ddTotal,
      diasOperados,
      diasTranscurridos,
      diasRestantes,
      progresoTarget,
    },
    nivelRiesgo,
  };
}

/**
 * Formatea número como moneda USD
 */
export function formatUSD(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formatea porcentaje
 */
export function formatPorcentaje(value, decimales = 2) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimales)}%`;
}

/**
 * Determina el color según el nivel de riesgo
 */
export function getColorRiesgo(porcentaje, limite) {
  const ratio = (porcentaje / limite) * 100;
  if (ratio >= 100) return 'red';
  if (ratio >= 80) return 'red';
  if (ratio >= 50) return 'amber';
  return 'green';
}
