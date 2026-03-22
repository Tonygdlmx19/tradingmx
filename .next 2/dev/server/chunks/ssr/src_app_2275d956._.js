module.exports = [
"[project]/src/app/utils/animations.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "celebrateGoal",
    ()=>celebrateGoal,
    "celebrateStreak",
    ()=>celebrateStreak,
    "celebrateWin",
    ()=>celebrateWin,
    "emojiBurst",
    ()=>emojiBurst,
    "moneyRain",
    ()=>moneyRain,
    "triggerFlash",
    ()=>triggerFlash,
    "triggerLossShake",
    ()=>triggerLossShake
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/canvas-confetti/dist/confetti.module.mjs [app-ssr] (ecmascript)");
"use client";
;
const celebrateWin = (amount = 0)=>{
    const duration = amount > 100 ? 4000 : 2500;
    const particleCount = Math.min(150, 50 + Math.floor(amount / 10));
    // First burst - green and gold
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
        particleCount: particleCount,
        spread: 70,
        origin: {
            y: 0.6
        },
        colors: [
            '#22c55e',
            '#16a34a',
            '#fbbf24',
            '#f59e0b',
            '#ffffff'
        ],
        shapes: [
            'circle',
            'square'
        ],
        gravity: 0.8,
        scalar: 1.2
    });
    // Second burst after delay
    setTimeout(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            particleCount: Math.floor(particleCount * 0.6),
            angle: 60,
            spread: 55,
            origin: {
                x: 0
            },
            colors: [
                '#22c55e',
                '#16a34a',
                '#fbbf24'
            ]
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            particleCount: Math.floor(particleCount * 0.6),
            angle: 120,
            spread: 55,
            origin: {
                x: 1
            },
            colors: [
                '#22c55e',
                '#16a34a',
                '#fbbf24'
            ]
        });
    }, 250);
    // Big win extra celebration
    if (amount > 100) {
        setTimeout(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
                particleCount: 100,
                spread: 100,
                origin: {
                    y: 0.5
                },
                colors: [
                    '#fbbf24',
                    '#f59e0b',
                    '#eab308'
                ],
                shapes: [
                    'star'
                ],
                scalar: 1.5
            });
        }, 500);
    }
};
const celebrateStreak = (streakCount)=>{
    const intensity = Math.min(streakCount, 10);
    // Fire colors
    const fireColors = [
        '#ef4444',
        '#f97316',
        '#fbbf24',
        '#facc15'
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
        particleCount: 50 + intensity * 15,
        spread: 60 + intensity * 5,
        origin: {
            y: 0.7
        },
        colors: fireColors,
        shapes: [
            'circle'
        ],
        gravity: 1.2,
        scalar: 1.5,
        drift: 0
    });
    // Side bursts for big streaks
    if (streakCount >= 5) {
        setTimeout(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
                particleCount: 30,
                angle: 60,
                spread: 40,
                origin: {
                    x: 0,
                    y: 0.6
                },
                colors: fireColors
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
                particleCount: 30,
                angle: 120,
                spread: 40,
                origin: {
                    x: 1,
                    y: 0.6
                },
                colors: fireColors
            });
        }, 200);
    }
};
const celebrateGoal = ()=>{
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const colors = [
        '#a855f7',
        '#8b5cf6',
        '#6366f1',
        '#fbbf24',
        '#22c55e'
    ];
    const frame = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: {
                x: 0
            },
            colors: colors
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: {
                x: 1
            },
            colors: colors
        });
        if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
        }
    };
    frame();
    // Center explosion
    setTimeout(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            particleCount: 150,
            spread: 180,
            origin: {
                y: 0.5
            },
            colors: [
                '#fbbf24',
                '#f59e0b',
                '#a855f7'
            ],
            shapes: [
                'star',
                'circle'
            ],
            scalar: 2
        });
    }, 500);
};
const moneyRain = ()=>{
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const frame = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            particleCount: 3,
            angle: 90,
            spread: 180,
            origin: {
                y: -0.1
            },
            colors: [
                '#22c55e',
                '#16a34a',
                '#15803d'
            ],
            shapes: [
                'square'
            ],
            gravity: 0.6,
            scalar: 2,
            drift: Math.random() - 0.5
        });
        if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
        }
    };
    frame();
};
const triggerLossShake = (elementId)=>{
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('animate-shake');
        setTimeout(()=>{
            element.classList.remove('animate-shake');
        }, 500);
    }
};
const triggerFlash = (elementId, type = 'success')=>{
    const element = document.getElementById(elementId);
    if (element) {
        const className = type === 'success' ? 'animate-flash-green' : 'animate-flash-red';
        element.classList.add(className);
        setTimeout(()=>{
            element.classList.remove(className);
        }, 700);
    }
};
const emojiBurst = (emoji = '🎉')=>{
    // Create floating emoji elements
    const container = document.createElement('div');
    container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
    document.body.appendChild(container);
    for(let i = 0; i < 15; i++){
        setTimeout(()=>{
            const emojiEl = document.createElement('div');
            const startX = Math.random() * 100;
            emojiEl.textContent = emoji;
            emojiEl.style.cssText = `
        position: absolute;
        font-size: ${24 + Math.random() * 24}px;
        left: ${startX}%;
        top: 100%;
        animation: floatUp 2s ease-out forwards;
        opacity: 0;
      `;
            container.appendChild(emojiEl);
        }, i * 100);
    }
    // Cleanup
    setTimeout(()=>{
        container.remove();
    }, 3500);
};
}),
"[project]/src/app/utils/fundingCalculations.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Funciones de cálculo para el simulador de fondeo
/**
 * Calcula el drawdown diario (pérdida del día vs capital inicial)
 */ __turbopack_context__.s([
    "calcularBalance",
    ()=>calcularBalance,
    "calcularDrawdownDiario",
    ()=>calcularDrawdownDiario,
    "calcularDrawdownTotal",
    ()=>calcularDrawdownTotal,
    "calcularPicoBalance",
    ()=>calcularPicoBalance,
    "calcularProgresoTarget",
    ()=>calcularProgresoTarget,
    "contarDiasOperados",
    ()=>contarDiasOperados,
    "formatPorcentaje",
    ()=>formatPorcentaje,
    "formatUSD",
    ()=>formatUSD,
    "generarDatosEquity",
    ()=>generarDatosEquity,
    "getColorRiesgo",
    ()=>getColorRiesgo,
    "verificarEstadoChallenge",
    ()=>verificarEstadoChallenge
]);
function calcularDrawdownDiario(trades, capitalInicial, fechaHoy) {
    const tradesHoy = trades.filter((t)=>t.fecha === fechaHoy);
    const pnlHoy = tradesHoy.reduce((sum, t)=>sum + t.res, 0);
    if (pnlHoy >= 0) return {
        usd: 0,
        porcentaje: 0
    };
    const ddUSD = Math.abs(pnlHoy);
    const ddPorcentaje = ddUSD / capitalInicial * 100;
    return {
        usd: ddUSD,
        porcentaje: ddPorcentaje
    };
}
function calcularDrawdownTotal(balanceActual, picoBalance) {
    if (balanceActual >= picoBalance) return {
        usd: 0,
        porcentaje: 0
    };
    const ddUSD = picoBalance - balanceActual;
    const ddPorcentaje = ddUSD / picoBalance * 100;
    return {
        usd: ddUSD,
        porcentaje: ddPorcentaje
    };
}
function calcularPicoBalance(trades, capitalInicial) {
    let balance = capitalInicial;
    let pico = capitalInicial;
    // Ordenar trades por fecha de creación
    const sortedTrades = [
        ...trades
    ].sort((a, b)=>{
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateA - dateB;
    });
    sortedTrades.forEach((t)=>{
        balance += t.res;
        if (balance > pico) pico = balance;
    });
    return pico;
}
function contarDiasOperados(trades) {
    const fechasUnicas = new Set(trades.map((t)=>t.fecha));
    return fechasUnicas.size;
}
function calcularProgresoTarget(pnlTotal, profitTargetUSD) {
    if (profitTargetUSD <= 0) return 0;
    return Math.min(100, pnlTotal / profitTargetUSD * 100);
}
function calcularBalance(trades, capitalInicial) {
    const pnlTotal = trades.reduce((sum, t)=>sum + t.res, 0);
    return capitalInicial + pnlTotal;
}
function generarDatosEquity(trades, capitalInicial, reglas) {
    const sortedTrades = [
        ...trades
    ].sort((a, b)=>{
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateA - dateB;
    });
    const data = [
        {
            name: 'Inicio',
            balance: capitalInicial,
            pico: capitalInicial
        }
    ];
    let balance = capitalInicial;
    let pico = capitalInicial;
    sortedTrades.forEach((t, i)=>{
        balance += t.res;
        if (balance > pico) pico = balance;
        data.push({
            name: `T${i + 1}`,
            balance: balance,
            pico: pico,
            fecha: t.fecha
        });
    });
    return {
        data,
        lineas: {
            target: capitalInicial + reglas.profitTargetUSD,
            limiteDD: capitalInicial * (1 - reglas.maxDrawdownTotal / 100)
        }
    };
}
function verificarEstadoChallenge(challenge, trades) {
    const { reglas, fechaInicio } = challenge;
    const hoy = new Date().toISOString().split('T')[0];
    // Calcular métricas
    const pnlTotal = trades.reduce((sum, t)=>sum + t.res, 0);
    const balanceActual = reglas.capitalInicial + pnlTotal;
    const picoBalance = calcularPicoBalance(trades, reglas.capitalInicial);
    const ddDiario = calcularDrawdownDiario(trades, reglas.capitalInicial, hoy);
    const ddTotal = calcularDrawdownTotal(balanceActual, picoBalance);
    const diasOperados = contarDiasOperados(trades);
    // Calcular días transcurridos (si fechaInicio es null/serverTimestamp pendiente, usar hoy)
    const fechaInicioDate = fechaInicio?.toDate?.() || (fechaInicio ? new Date(fechaInicio) : new Date());
    const diasTranscurridos = Math.floor((new Date() - fechaInicioDate) / (1000 * 60 * 60 * 24));
    const diasRestantes = reglas.tiempoLimite > 0 ? Math.max(0, reglas.tiempoLimite - diasTranscurridos) : null; // null = sin límite de tiempo
    // Verificar violaciones
    const violaciones = [];
    if (ddDiario.porcentaje >= reglas.maxDrawdownDiario) {
        violaciones.push({
            tipo: 'drawdown_diario',
            mensaje: `Drawdown diario excedido: ${ddDiario.porcentaje.toFixed(2)}% >= ${reglas.maxDrawdownDiario}%`,
            valor: ddDiario.porcentaje,
            limite: reglas.maxDrawdownDiario
        });
    }
    if (ddTotal.porcentaje >= reglas.maxDrawdownTotal) {
        violaciones.push({
            tipo: 'drawdown_total',
            mensaje: `Drawdown total excedido: ${ddTotal.porcentaje.toFixed(2)}% >= ${reglas.maxDrawdownTotal}%`,
            valor: ddTotal.porcentaje,
            limite: reglas.maxDrawdownTotal
        });
    }
    if (reglas.tiempoLimite > 0 && diasRestantes <= 0 && pnlTotal < reglas.profitTargetUSD) {
        violaciones.push({
            tipo: 'tiempo',
            mensaje: `Tiempo límite excedido sin alcanzar profit target`,
            valor: diasTranscurridos,
            limite: reglas.tiempoLimite
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
    const riesgoDDDiario = reglas.maxDrawdownDiario > 0 ? ddDiario.porcentaje / reglas.maxDrawdownDiario * 100 : 0;
    const riesgoDDTotal = reglas.maxDrawdownTotal > 0 ? ddTotal.porcentaje / reglas.maxDrawdownTotal * 100 : 0;
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
            pnlPorcentaje: pnlTotal / reglas.capitalInicial * 100,
            picoBalance,
            drawdownDiario: ddDiario,
            drawdownTotal: ddTotal,
            diasOperados,
            diasTranscurridos,
            diasRestantes,
            progresoTarget
        },
        nivelRiesgo
    };
}
function formatUSD(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}
function formatPorcentaje(value, decimales = 2) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimales)}%`;
}
function getColorRiesgo(porcentaje, limite) {
    const ratio = porcentaje / limite * 100;
    if (ratio >= 100) return 'red';
    if (ratio >= 80) return 'red';
    if (ratio >= 50) return 'amber';
    return 'green';
}
}),
"[project]/src/app/constants/fundingPresets.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Presets de empresas de fondeo con sus reglas de evaluación
__turbopack_context__.s([
    "FUNDING_PRESETS",
    ()=>FUNDING_PRESETS,
    "crearReglasPersonalizadas",
    ()=>crearReglasPersonalizadas,
    "getCuentasPorEmpresa",
    ()=>getCuentasPorEmpresa,
    "getEmpresas",
    ()=>getEmpresas,
    "presetToReglas",
    ()=>presetToReglas
]);
const FUNDING_PRESETS = {
    FTMO: {
        nombre: "FTMO",
        descripcion: "Una de las empresas de fondeo más populares y reconocidas",
        cuentas: [
            {
                capital: 10000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 4,
                tiempoLimite: 30
            },
            {
                capital: 25000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 4,
                tiempoLimite: 30
            },
            {
                capital: 50000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 4,
                tiempoLimite: 30
            },
            {
                capital: 100000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 4,
                tiempoLimite: 30
            },
            {
                capital: 200000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 4,
                tiempoLimite: 30
            }
        ]
    },
    MyForexFunds: {
        nombre: "MyForexFunds",
        descripcion: "Empresa de fondeo con reglas flexibles",
        cuentas: [
            {
                capital: 5000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 12,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 10000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 12,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 25000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 12,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 50000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 12,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 100000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 12,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 200000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 12,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 300000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 12,
                diasMin: 5,
                tiempoLimite: 30
            }
        ]
    },
    FundedNext: {
        nombre: "Funded Next",
        descripcion: "Sin límite de tiempo para completar el challenge",
        cuentas: [
            {
                capital: 6000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 0,
                tiempoLimite: 0
            },
            {
                capital: 15000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 0,
                tiempoLimite: 0
            },
            {
                capital: 25000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 0,
                tiempoLimite: 0
            },
            {
                capital: 50000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 0,
                tiempoLimite: 0
            },
            {
                capital: 100000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 0,
                tiempoLimite: 0
            },
            {
                capital: 200000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 0,
                tiempoLimite: 0
            }
        ]
    },
    TheFundedTrader: {
        nombre: "The Funded Trader",
        descripcion: "Empresa popular con múltiples opciones de cuenta",
        cuentas: [
            {
                capital: 5000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 3,
                tiempoLimite: 35
            },
            {
                capital: 10000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 3,
                tiempoLimite: 35
            },
            {
                capital: 25000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 3,
                tiempoLimite: 35
            },
            {
                capital: 50000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 3,
                tiempoLimite: 35
            },
            {
                capital: 100000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 3,
                tiempoLimite: 35
            },
            {
                capital: 200000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 3,
                tiempoLimite: 35
            },
            {
                capital: 400000,
                profitTarget: 10,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 3,
                tiempoLimite: 35
            }
        ]
    },
    E8Funding: {
        nombre: "E8 Funding",
        descripcion: "Proceso de evaluación en una fase",
        cuentas: [
            {
                capital: 25000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 8,
                diasMin: 0,
                tiempoLimite: 0
            },
            {
                capital: 50000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 8,
                diasMin: 0,
                tiempoLimite: 0
            },
            {
                capital: 100000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 8,
                diasMin: 0,
                tiempoLimite: 0
            },
            {
                capital: 250000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 8,
                diasMin: 0,
                tiempoLimite: 0
            }
        ]
    },
    TrueForexFunds: {
        nombre: "True Forex Funds",
        descripcion: "Reglas competitivas con drawdown generoso",
        cuentas: [
            {
                capital: 10000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 25000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 50000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 100000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 5,
                tiempoLimite: 30
            },
            {
                capital: 200000,
                profitTarget: 8,
                maxDDDiario: 5,
                maxDDTotal: 10,
                diasMin: 5,
                tiempoLimite: 30
            }
        ]
    }
};
function getCuentasPorEmpresa(empresaKey) {
    return FUNDING_PRESETS[empresaKey]?.cuentas || [];
}
function getEmpresas() {
    return Object.entries(FUNDING_PRESETS).map(([key, value])=>({
            key,
            nombre: value.nombre,
            descripcion: value.descripcion
        }));
}
function crearReglasPersonalizadas(config) {
    return {
        capitalInicial: config.capital || 10000,
        profitTarget: config.profitTarget || 10,
        profitTargetUSD: (config.capital || 10000) * ((config.profitTarget || 10) / 100),
        maxDrawdownDiario: config.maxDDDiario || 5,
        maxDrawdownDiarioUSD: (config.capital || 10000) * ((config.maxDDDiario || 5) / 100),
        maxDrawdownTotal: config.maxDDTotal || 10,
        maxDrawdownTotalUSD: (config.capital || 10000) * ((config.maxDDTotal || 10) / 100),
        diasMinimos: config.diasMin || 0,
        tiempoLimite: config.tiempoLimite || 30
    };
}
function presetToReglas(empresaKey, cuentaIndex) {
    const empresa = FUNDING_PRESETS[empresaKey];
    if (!empresa || !empresa.cuentas[cuentaIndex]) return null;
    const cuenta = empresa.cuentas[cuentaIndex];
    return crearReglasPersonalizadas({
        capital: cuenta.capital,
        profitTarget: cuenta.profitTarget,
        maxDDDiario: cuenta.maxDDDiario,
        maxDDTotal: cuenta.maxDDTotal,
        diasMin: cuenta.diasMin,
        tiempoLimite: cuenta.tiempoLimite
    });
}
}),
"[project]/src/app/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TradingJournalPRO
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/firebase.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/app/components/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$LoginPage$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LoginPage$3e$__ = __turbopack_context__.i("[project]/src/app/components/LoginPage.jsx [app-ssr] (ecmascript) <export default as LoginPage>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$LandingPage$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LandingPage$3e$__ = __turbopack_context__.i("[project]/src/app/components/LandingPage.jsx [app-ssr] (ecmascript) <export default as LandingPage>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Header$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Header$3e$__ = __turbopack_context__.i("[project]/src/app/components/Header.jsx [app-ssr] (ecmascript) <export default as Header>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$SettingsModal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SettingsModal$3e$__ = __turbopack_context__.i("[project]/src/app/components/SettingsModal.jsx [app-ssr] (ecmascript) <export default as SettingsModal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TradeDetailModal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TradeDetailModal$3e$__ = __turbopack_context__.i("[project]/src/app/components/TradeDetailModal.jsx [app-ssr] (ecmascript) <export default as TradeDetailModal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TradeForm$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TradeForm$3e$__ = __turbopack_context__.i("[project]/src/app/components/TradeForm.jsx [app-ssr] (ecmascript) <export default as TradeForm>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$StatsCards$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__StatsCards$3e$__ = __turbopack_context__.i("[project]/src/app/components/StatsCards.jsx [app-ssr] (ecmascript) <export default as StatsCards>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AdvancedStats$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AdvancedStats$3e$__ = __turbopack_context__.i("[project]/src/app/components/AdvancedStats.jsx [app-ssr] (ecmascript) <export default as AdvancedStats>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$EquityChart$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EquityChart$3e$__ = __turbopack_context__.i("[project]/src/app/components/EquityChart.jsx [app-ssr] (ecmascript) <export default as EquityChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$DrawdownChart$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DrawdownChart$3e$__ = __turbopack_context__.i("[project]/src/app/components/DrawdownChart.jsx [app-ssr] (ecmascript) <export default as DrawdownChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$EconomicCalendar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EconomicCalendar$3e$__ = __turbopack_context__.i("[project]/src/app/components/EconomicCalendar.jsx [app-ssr] (ecmascript) <export default as EconomicCalendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$CalendarView$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarView$3e$__ = __turbopack_context__.i("[project]/src/app/components/CalendarView.jsx [app-ssr] (ecmascript) <export default as CalendarView>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ThemeProvider$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ThemeProvider.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TradingAcademy$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TradingAcademy$3e$__ = __turbopack_context__.i("[project]/src/app/components/TradingAcademy.jsx [app-ssr] (ecmascript) <export default as TradingAcademy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$MovementsModal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/MovementsModal.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$UnauthorizedScreen$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/UnauthorizedScreen.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AdminPanel$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/AdminPanel.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TrialExpiringAlert$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/TrialExpiringAlert.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$OnboardingTour$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/OnboardingTour.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$animations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/animations.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$funding$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/app/components/funding/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$funding$2f$FundingSimulator$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FundingSimulator$3e$__ = __turbopack_context__.i("[project]/src/app/components/funding/FundingSimulator.jsx [app-ssr] (ecmascript) <export default as FundingSimulator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TraderDiary$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/TraderDiary.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ESTracker$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ESTracker.jsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const ADMIN_EMAIL = 'tonytrader19@gmail.com';
function TradingJournalPRO() {
    const { isDark } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ThemeProvider$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isAuthorized, setIsAuthorized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [checkingAuth, setCheckingAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showLogin, setShowLogin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSettings, setShowSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCalendar, setShowCalendar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFundingSimulator, setShowFundingSimulator] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAdminPanel, setShowAdminPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAcademy, setShowAcademy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMovements, setShowMovements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDiary, setShowDiary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showESTracker, setShowESTracker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [movements, setMovements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [authStatus, setAuthStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('checking'); // 'checking' | 'active' | 'expired' | 'unauthorized'
    const [userTrialEnd, setUserTrialEnd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userType, setUserType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userPlan, setUserPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hasTrackerAccess, setHasTrackerAccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        capitalInicial: 10000,
        metaDiaria: 200
    });
    const [trades, setTrades] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [viewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('mensual'); // Siempre mensual para coincidir con el calendario
    const [selectedMonth, setSelectedMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().getMonth());
    const [selectedYear, setSelectedYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().getFullYear());
    const [selectedTrade, setSelectedTrade] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showTradeDetail, setShowTradeDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [forceTourStart, setForceTourStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [diasNoOperativos, setDiasNoOperativos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]); // Array de fechas 'YYYY-MM-DD'
    const [selectedAccountId, setSelectedAccountId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null); // Se auto-selecciona la primera cuenta
    const [goalCelebratedToday, setGoalCelebratedToday] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // Track if goal was celebrated today
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        res: '',
        esGanancia: true,
        emo: 'Neutral',
        activo: 'MNQ',
        dir: 'Long',
        lotes: '1',
        entrada: '',
        salida: '',
        seguiPlan: false,
        respetoRiesgo: false,
        notas: '',
        imagen: null
    });
    // Escuchar cambios de autenticación
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["auth"], async (currentUser)=>{
            console.log('[AUTH] Estado:', currentUser?.email || 'sin usuario');
            if (currentUser) {
                // Verificar autorización ANTES de actualizar el estado del usuario
                try {
                    const email = currentUser.email?.toLowerCase();
                    const authDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "authorized_users", email);
                    const authDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(authDocRef);
                    if (authDoc.exists()) {
                        const data = authDoc.data();
                        const currentUserType = data.type || 'paid'; // backwards compat
                        setUserType(currentUserType);
                        setUserPlan(data.subscriptionPlan || null);
                        setHasTrackerAccess(data.hasTrackerAccess === true);
                        if (data.status === 'active') {
                            const now = new Date();
                            let isExpired = false;
                            // Check trial expiration
                            if (currentUserType === 'trial' && data.trialEnd) {
                                const trialEnd = data.trialEnd?.toDate?.() || new Date(data.trialEnd);
                                setUserTrialEnd(data.trialEnd);
                                if (now > trialEnd) {
                                    isExpired = true;
                                }
                            }
                            // Check subscription expiration
                            if (currentUserType === 'subscription' && data.subscriptionEnd) {
                                const subscriptionEnd = data.subscriptionEnd?.toDate?.() || new Date(data.subscriptionEnd);
                                if (now > subscriptionEnd) {
                                    isExpired = true;
                                }
                            }
                            if (isExpired) {
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(authDocRef, {
                                    status: 'expired'
                                });
                                setIsAuthorized(false);
                                setAuthStatus('expired');
                            } else {
                                setIsAuthorized(true);
                                setAuthStatus('active');
                            }
                        } else {
                            setIsAuthorized(false);
                            setAuthStatus(data.status === 'expired' ? 'expired' : 'unauthorized');
                        }
                    } else {
                        setIsAuthorized(false);
                        setAuthStatus('unauthorized');
                    }
                    console.log('[AUTH] Autorizado:', authDoc.exists() && authDoc.data()?.status === 'active');
                    setUser(currentUser);
                } catch (error) {
                    console.error('[AUTH] Error auth:', error);
                    setIsAuthorized(false);
                    setAuthStatus('unauthorized');
                    setUser(currentUser);
                }
            } else {
                setUser(null);
                setIsAuthorized(false);
                setAuthStatus('checking');
            }
            setCheckingAuth(false);
            setLoading(false);
        });
        return ()=>unsubscribe();
    }, []);
    // Actualizar activo por defecto cuando cambien los favoritos
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (config.activosFavoritos && config.activosFavoritos.length > 0) {
            // Solo actualizar si el activo actual no está en favoritos
            if (!config.activosFavoritos.includes(form.activo)) {
                setForm((prev)=>({
                        ...prev,
                        activo: config.activosFavoritos[0]
                    }));
            }
        }
    }, [
        config.activosFavoritos
    ]);
    // Auto-seleccionar la primera cuenta si no hay ninguna seleccionada
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const cuentas = config.cuentasBroker || [];
        if (cuentas.length > 0 && !selectedAccountId) {
            setSelectedAccountId(cuentas[0].id);
        }
    }, [
        config.cuentasBroker,
        selectedAccountId
    ]);
    // Escuchar cambios en authorized_users en tiempo real (para tracker access, plan, etc.)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!user) return;
        const email = user.email?.toLowerCase();
        if (!email) return;
        const unsubAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "authorized_users", email), (snap)=>{
            if (snap.exists()) {
                const data = snap.data();
                setHasTrackerAccess(data.hasTrackerAccess === true);
            }
        });
        return ()=>unsubAuth();
    }, [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!user || !isAuthorized) return;
        const unsubConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "users", user.uid), (docSnap)=>{
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.config) setConfig(data.config);
                if (data.diasNoOperativos) setDiasNoOperativos(data.diasNoOperativos);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "users", user.uid), {
                    config: {
                        capitalInicial: 10000,
                        metaDiaria: 200
                    },
                    diasNoOperativos: []
                }, {
                    merge: true
                });
            }
        });
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "trades"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("uid", "==", user.uid), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderBy"])("fecha", "asc"));
        const unsubTrades = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])(q, (snapshot)=>{
            const tradesData = snapshot.docs.map((doc)=>({
                    id: doc.id,
                    ...doc.data()
                }));
            setTrades(tradesData);
            setLoading(false);
        });
        // Suscripción a movimientos de capital (depósitos/retiros)
        const qMovements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "movements"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("uid", "==", user.uid), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderBy"])("fecha", "asc"));
        const unsubMovements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])(qMovements, (snapshot)=>{
            const movementsData = snapshot.docs.map((doc)=>({
                    id: doc.id,
                    ...doc.data()
                }));
            setMovements(movementsData);
        });
        return ()=>{
            unsubConfig();
            unsubTrades();
            unsubMovements();
        };
    }, [
        user,
        isAuthorized
    ]);
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["auth"]);
    }, []);
    const saveSettingsToCloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!user) return;
        // Clean config to remove undefined values (Firestore doesn't accept undefined)
        const cleanConfig = JSON.parse(JSON.stringify(config, (key, value)=>value === undefined ? null : value));
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "users", user.uid), {
            config: cleanConfig
        }, {
            merge: true
        });
    }, [
        user,
        config
    ]);
    const addTrade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (e, opciones = {})=>{
        e.preventDefault();
        // Usar resultado calculado si viene de opciones binarias, sino usar form.res
        const resultado = opciones.resCalculado !== undefined ? opciones.resCalculado : form.res;
        if (resultado === '' || resultado === undefined || resultado === null) {
            alert("Debes ingresar el resultado del trade.");
            return;
        }
        // Aplicar signo según el toggle WIN/LOSS
        // El swap se guarda aparte y se descuenta del balance, NO del trade
        const resultadoFinal = form.esGanancia !== false ? Math.abs(parseFloat(resultado)) : -Math.abs(parseFloat(resultado));
        const swapComision = parseFloat(form.swap) || 0;
        // Usar fechaSalida como fecha principal para compatibilidad
        const hoy = new Date().toISOString().split('T')[0];
        const fechaEntrada = form.fechaEntrada || hoy;
        const fechaSalida = form.fechaSalida || hoy;
        // Obtener info de la cuenta seleccionada
        const cuentaSeleccionada = form.cuentaId ? (config.cuentasBroker || []).find((c)=>c.id === form.cuentaId) : null;
        // Calcular puntos según dirección
        let puntos = null;
        if (form.entrada && form.salida) {
            const entrada = parseFloat(form.entrada);
            const salida = parseFloat(form.salida);
            puntos = form.dir === 'Long' ? salida - entrada : entrada - salida;
        }
        const tradeData = {
            uid: user.uid,
            fecha: fechaSalida,
            fechaEntrada: fechaEntrada,
            fechaSalida: fechaSalida,
            hora: form.hora || null,
            activo: form.activo,
            dir: form.dir,
            res: resultadoFinal,
            lotes: form.lotes ? parseFloat(form.lotes) : 1,
            entrada: form.entrada ? parseFloat(form.entrada) : null,
            salida: form.salida ? parseFloat(form.salida) : null,
            puntos: puntos,
            emo: form.emo,
            seguiPlan: form.seguiPlan,
            respetoRiesgo: form.respetoRiesgo,
            notas: form.notas || '',
            imagenes: form.imagenes || [],
            checklist: form.checklist || null,
            swap: swapComision,
            cuentaId: form.cuentaId || null,
            broker: cuentaSeleccionada?.broker || null,
            numeroCuenta: cuentaSeleccionada?.numero || null,
            preTradeAnalysis: form.preTradeAnalysis || null,
            preTradeImage: form.preTradeImage || null,
            preTradeDescription: form.preTradeDescription || null,
            createdAt: new Date()
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "trades"), tradeData);
        // Trigger animations based on trade result
        if (resultadoFinal >= 0) {
            // Calculate current winning streak
            let currentStreak = 1;
            const sortedTrades = [
                ...trades
            ].sort((a, b)=>new Date(b.fecha) - new Date(a.fecha));
            for (const t of sortedTrades){
                if (t.res >= 0) {
                    currentStreak++;
                } else {
                    break;
                }
            }
            // Winning trade - celebrate!
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$animations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["celebrateWin"])(Math.abs(resultadoFinal));
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$animations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerFlash"])('trade-form', 'success');
            // Extra celebration for streaks
            if (currentStreak >= 3) {
                setTimeout(()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$animations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["celebrateStreak"])(currentStreak);
                }, 1500);
            }
        } else {
            // Losing trade - subtle feedback
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$animations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerFlash"])('trade-form', 'error');
        }
        setForm({
            ...form,
            res: '',
            esGanancia: true,
            lotes: '1',
            entrada: '',
            salida: '',
            emo: 'Neutral',
            seguiPlan: false,
            respetoRiesgo: false,
            notas: '',
            imagenes: [],
            checklist: null,
            swap: '',
            preTradeAnalysis: null,
            preTradeImage: null,
            preTradeDescription: null
        });
    }, [
        form,
        user
    ]);
    const deleteTrade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (id)=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "trades", id));
    }, []);
    const updateTrade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (id, updates)=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "trades", id), updates);
        if (selectedTrade && selectedTrade.id === id) {
            setSelectedTrade({
                ...selectedTrade,
                ...updates
            });
        }
    }, [
        selectedTrade
    ]);
    const handleTradeClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((trade)=>{
        setSelectedTrade(trade);
        setShowTradeDetail(true);
    }, []);
    // Toggle día no operativo
    const toggleDiaNoOperativo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (fecha)=>{
        if (!user) return;
        const newDias = diasNoOperativos.includes(fecha) ? diasNoOperativos.filter((d)=>d !== fecha) : [
            ...diasNoOperativos,
            fecha
        ];
        setDiasNoOperativos(newDias);
        // Guardar en Firestore
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], "users", user.uid), {
                diasNoOperativos: newDias
            });
        } catch (error) {
            console.error('Error guardando día no operativo:', error);
        }
    }, [
        user,
        diasNoOperativos
    ]);
    const filteredTrades = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return trades.filter((t)=>{
            const exitDate = t.fechaSalida || t.fecha;
            const entryDate = t.fechaEntrada || t.fecha;
            const [exitY, exitM] = exitDate.split('-').map(Number);
            const [entryY, entryM] = entryDate.split('-').map(Number);
            if (viewMode === 'global') {
                // En vista global, incluir si cualquier parte del trade está en el año
                return exitY === selectedYear || entryY === selectedYear;
            }
            // En vista mensual, incluir si:
            // 1. El trade cierra en este mes
            // 2. El trade abre en este mes
            // 3. El trade cruza este mes (abre antes, cierra después)
            const isExitInMonth = exitY === selectedYear && exitM - 1 === selectedMonth;
            const isEntryInMonth = entryY === selectedYear && entryM - 1 === selectedMonth;
            // Para swing trades que cruzan el mes
            const monthStart = new Date(selectedYear, selectedMonth, 1);
            const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);
            const tradeEntry = new Date(entryDate);
            const tradeExit = new Date(exitDate);
            const crossesMonth = tradeEntry <= monthEnd && tradeExit >= monthStart;
            return isExitInMonth || isEntryInMonth || crossesMonth;
        });
    }, [
        trades,
        viewMode,
        selectedMonth,
        selectedYear
    ]);
    // Obtener cuenta seleccionada
    const selectedAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!selectedAccountId) return null;
        return (config.cuentasBroker || []).find((c)=>c.id === selectedAccountId) || null;
    }, [
        selectedAccountId,
        config.cuentasBroker
    ]);
    // Símbolo de moneda de la cuenta seleccionada
    const currencySymbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!selectedAccount) return '$';
        const divisa = selectedAccount.divisa || 'USD';
        const symbols = {
            USD: '$',
            MXN: 'MX$',
            EUR: '€',
            GBP: '£',
            JPY: '¥',
            CAD: 'C$',
            AUD: 'A$',
            CHF: 'CHF '
        };
        return symbols[divisa] || '$';
    }, [
        selectedAccount
    ]);
    // Filtrar trades por cuenta seleccionada
    const accountFilteredTrades = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!selectedAccountId) return filteredTrades; // Sin filtro = todos
        return filteredTrades.filter((t)=>t.cuentaId === selectedAccountId);
    }, [
        filteredTrades,
        selectedAccountId
    ]);
    // Filtrar movimientos por cuenta seleccionada
    const accountFilteredMovements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!selectedAccountId) return movements; // Sin filtro = todos
        return movements.filter((m)=>{
            if (m.type === 'transfer') {
                return m.fromCuentaId === selectedAccountId || m.toCuentaId === selectedAccountId;
            }
            return m.cuentaId === selectedAccountId;
        });
    }, [
        movements,
        selectedAccountId
    ]);
    // Calcular stats para la cuenta seleccionada
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // Verificar si la cuenta tiene depósitos o transferencias entrantes
        const hasIncomingMovements = selectedAccountId ? accountFilteredMovements.some((m)=>m.type === 'deposit' || m.type === 'transfer' && m.toCuentaId === selectedAccountId) : movements.some((m)=>m.type === 'deposit');
        // Capital inicial:
        // - Si hay depósitos/transferencias → usar 0 (los movimientos son el capital)
        // - Si NO hay movimientos → usar saldoInicial manual
        let capitalInicial = 0;
        if (selectedAccount) {
            if (hasIncomingMovements) {
                // La cuenta tiene depósitos/transferencias, esos son el capital inicial
                capitalInicial = 0;
            } else {
                // Sin movimientos, usar saldoInicial manual
                capitalInicial = parseFloat(selectedAccount.saldoInicial) || 0;
            }
        } else {
            // Sin cuenta seleccionada
            if (hasIncomingMovements) {
                capitalInicial = 0;
            } else {
                const sumaSaldos = (config.cuentasBroker || []).reduce((sum, c)=>sum + (parseFloat(c.saldoInicial) || 0), 0);
                capitalInicial = sumaSaldos > 0 ? sumaSaldos : config.capitalInicial || 0;
            }
        }
        // Trades para el periodo seleccionado (ya filtrados por cuenta)
        const allAccountTrades = selectedAccountId ? trades.filter((t)=>t.cuentaId === selectedAccountId) : trades;
        // Filtrar trades y movimientos de periodos anteriores
        const tradesPrevios = allAccountTrades.filter((t)=>{
            const [y, m] = t.fecha.split('-').map(Number);
            if (viewMode === 'global') return y < selectedYear;
            return y < selectedYear || y === selectedYear && m - 1 < selectedMonth;
        });
        const movementsPrevios = accountFilteredMovements.filter((m)=>{
            const [y, mo] = m.fecha.split('-').map(Number);
            if (viewMode === 'global') return y < selectedYear;
            return y < selectedYear || y === selectedYear && mo - 1 < selectedMonth;
        });
        // Filtrar movimientos del periodo actual
        const periodMovements = accountFilteredMovements.filter((m)=>{
            const [y, mo] = m.fecha.split('-').map(Number);
            if (viewMode === 'global') return y === selectedYear;
            return y === selectedYear && mo - 1 === selectedMonth;
        });
        // Calcular impacto de periodos anteriores
        const pnlPrevio = tradesPrevios.reduce((acc, t)=>acc + parseFloat(t.res), 0);
        let depositsPrevio = 0;
        let withdrawalsPrevio = 0;
        movementsPrevios.forEach((m)=>{
            if (m.type === 'deposit') {
                depositsPrevio += m.amount;
            } else if (m.type === 'withdrawal') {
                withdrawalsPrevio += m.amount;
            } else if (m.type === 'transfer') {
                if (m.fromCuentaId === selectedAccountId) {
                    withdrawalsPrevio += m.amount;
                }
                if (m.toCuentaId === selectedAccountId) {
                    depositsPrevio += m.amountConverted || m.amount;
                }
            // Si no hay cuenta seleccionada, las transferencias no afectan el total
            }
        });
        const startBalance = capitalInicial + pnlPrevio + depositsPrevio - withdrawalsPrevio;
        let currentBalance = startBalance;
        let maxBal = startBalance;
        let grossWin = 0, grossLoss = 0;
        let winCount = 0;
        const data = [
            {
                name: 'Inicio',
                bal: startBalance,
                dd: 0
            }
        ];
        // Combinar trades y movimientos ordenados cronológicamente
        const sortedTrades = [
            ...accountFilteredTrades
        ].map((t)=>({
                ...t,
                eventType: 'trade'
            }));
        const sortedMovements = [
            ...periodMovements
        ].map((m)=>({
                ...m,
                eventType: m.type
            }));
        const allEvents = [
            ...sortedTrades,
            ...sortedMovements
        ].sort((a, b)=>{
            const dateCompare = new Date(a.fecha) - new Date(b.fecha);
            if (dateCompare !== 0) return dateCompare;
            const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return aTime - bTime;
        });
        // Métricas
        let totalPuntos = 0, puntosGanadores = 0, puntosPerdedores = 0, tradesConPuntos = 0;
        let totalSwap = 0, tradeIndex = 0, depositIndex = 0, withdrawalIndex = 0;
        let depositsTotal = 0, withdrawalsTotal = 0;
        allEvents.forEach((event)=>{
            if (event.eventType === 'trade') {
                const r = parseFloat(event.res);
                const swap = parseFloat(event.swap) || 0;
                totalSwap += swap;
                currentBalance += r - swap;
                if (r > 0) {
                    grossWin += r;
                    winCount++;
                } else {
                    grossLoss += Math.abs(r);
                }
                if (currentBalance > maxBal) maxBal = currentBalance;
                const dd = maxBal > 0 ? (maxBal - currentBalance) / maxBal * 100 : 0;
                if (event.puntos !== null && event.puntos !== undefined) {
                    totalPuntos += event.puntos;
                    tradesConPuntos++;
                    if (r > 0) puntosGanadores += event.puntos;
                    else puntosPerdedores += event.puntos;
                }
                const tradeTime = event.createdAt?.toDate ? event.createdAt.toDate() : new Date(event.createdAt || event.fecha);
                const hora = tradeTime.toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                tradeIndex++;
                data.push({
                    name: `T${tradeIndex}`,
                    bal: currentBalance,
                    dd: -parseFloat(dd.toFixed(2)),
                    rawDD: dd,
                    fecha: event.fechaSalida || event.fecha,
                    hora: hora
                });
            } else if (event.eventType === 'deposit') {
                currentBalance += event.amount;
                depositsTotal += event.amount;
                if (currentBalance > maxBal) maxBal = currentBalance;
                const dd = maxBal > 0 ? (maxBal - currentBalance) / maxBal * 100 : 0;
                depositIndex++;
                data.push({
                    name: `D${depositIndex}`,
                    bal: currentBalance,
                    dd: -parseFloat(dd.toFixed(2)),
                    rawDD: dd,
                    fecha: event.fecha,
                    hora: event.hora || '',
                    isMovement: true,
                    movementType: 'deposit',
                    amount: event.amount
                });
            } else if (event.eventType === 'withdrawal') {
                currentBalance -= event.amount;
                withdrawalsTotal += event.amount;
                if (currentBalance > maxBal) maxBal = currentBalance;
                const dd = maxBal > 0 ? (maxBal - currentBalance) / maxBal * 100 : 0;
                withdrawalIndex++;
                data.push({
                    name: `W${withdrawalIndex}`,
                    bal: currentBalance,
                    dd: -parseFloat(dd.toFixed(2)),
                    rawDD: dd,
                    fecha: event.fecha,
                    hora: event.hora || '',
                    isMovement: true,
                    movementType: 'withdrawal',
                    amount: event.amount
                });
            } else if (event.eventType === 'transfer' && selectedAccountId) {
                // Solo procesar transferencias si hay cuenta seleccionada
                let amountChange = 0;
                if (event.fromCuentaId === selectedAccountId) {
                    amountChange -= event.amount;
                    withdrawalsTotal += event.amount;
                }
                if (event.toCuentaId === selectedAccountId) {
                    const incomingAmount = event.amountConverted || event.amount;
                    amountChange += incomingAmount;
                    depositsTotal += incomingAmount;
                }
                if (amountChange !== 0) {
                    currentBalance += amountChange;
                    if (currentBalance > maxBal) maxBal = currentBalance;
                    const dd = maxBal > 0 ? (maxBal - currentBalance) / maxBal * 100 : 0;
                    data.push({
                        name: amountChange > 0 ? `TI${++depositIndex}` : `TO${++withdrawalIndex}`,
                        bal: currentBalance,
                        dd: -parseFloat(dd.toFixed(2)),
                        rawDD: dd,
                        fecha: event.fecha,
                        hora: event.hora || '',
                        isMovement: true,
                        movementType: amountChange > 0 ? 'transfer_in' : 'transfer_out',
                        amount: Math.abs(amountChange)
                    });
                }
            }
        });
        const totalPnl = currentBalance - startBalance - depositsTotal + withdrawalsTotal;
        const winRate = tradeIndex > 0 ? winCount / tradeIndex * 100 : 0;
        const maxDD = Math.max(...data.map((d)=>d.rawDD || 0), 0);
        const profitFactor = grossLoss === 0 ? grossWin : grossWin / grossLoss;
        const promedioPuntos = tradesConPuntos > 0 ? totalPuntos / tradesConPuntos : 0;
        // Capital efectivo = saldo inicial + depósitos (el dinero disponible para operar)
        const effectiveCapital = startBalance + depositsTotal;
        return {
            balance: currentBalance,
            startBalance,
            effectiveCapital,
            totalPnl,
            winRate,
            maxDD,
            profitFactor,
            data,
            tradeCount: tradeIndex,
            totalPuntos,
            promedioPuntos,
            puntosGanadores,
            puntosPerdedores,
            tradesConPuntos,
            totalSwap,
            depositsTotal,
            withdrawalsTotal,
            netCapitalChange: depositsTotal - withdrawalsTotal
        };
    }, [
        accountFilteredTrades,
        trades,
        accountFilteredMovements,
        config,
        viewMode,
        selectedMonth,
        selectedYear,
        selectedAccountId,
        selectedAccount
    ]);
    const todayStr = new Date().toISOString().split('T')[0];
    // P&L de hoy (filtrado por cuenta si está seleccionada)
    const pnlHoy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const todayTrades = selectedAccountId ? trades.filter((t)=>t.fecha === todayStr && t.cuentaId === selectedAccountId) : trades.filter((t)=>t.fecha === todayStr);
        return todayTrades.reduce((acc, t)=>acc + parseFloat(t.res || 0), 0);
    }, [
        trades,
        todayStr,
        selectedAccountId
    ]);
    // Meta diaria basada en el modo (porcentaje o monto fijo) y cuenta seleccionada
    const metaDiaria = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // Modo porcentaje: calcular sobre el saldo de la cuenta
        if (config.metaDiariaMode === 'percentage') {
            const pct = config.metaDiariaPct || 2; // Default 2%
            if (selectedAccount) {
                // Usar saldo actual de la cuenta (saldoInicial + trades + movimientos)
                return stats.balance * pct / 100;
            }
            // Sin cuenta seleccionada, usar capital inicial global
            return config.capitalInicial * pct / 100;
        }
        // Modo monto fijo: usar el valor configurado
        return config.metaDiaria || 0;
    }, [
        config.metaDiariaMode,
        config.metaDiariaPct,
        config.metaDiaria,
        config.capitalInicial,
        selectedAccount,
        stats.balance
    ]);
    const progresoMeta = metaDiaria > 0 ? Math.min(pnlHoy / metaDiaria * 100, 100) : 0;
    // Calcular el porcentaje que representa la meta
    const metaDiariaPct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (config.metaDiariaMode === 'percentage') {
            return config.metaDiariaPct || 2;
        }
        // Modo monto fijo: calcular el % sobre el balance actual
        if (selectedAccount) {
            return stats.balance > 0 ? (metaDiaria / stats.balance * 100).toFixed(1) : '0';
        }
        return config.capitalInicial > 0 ? (config.metaDiaria / config.capitalInicial * 100).toFixed(1) : '0';
    }, [
        config.metaDiariaMode,
        config.metaDiariaPct,
        config.metaDiaria,
        config.capitalInicial,
        selectedAccount,
        stats.balance,
        metaDiaria
    ]);
    // Reset goal celebration flag when day changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGoalCelebratedToday(false);
    }, [
        todayStr
    ]);
    // Celebrate when daily goal is reached
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (metaDiaria > 0 && pnlHoy >= metaDiaria && !goalCelebratedToday && !loading) {
            // Goal reached! Celebrate!
            setGoalCelebratedToday(true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$animations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["celebrateGoal"])();
        }
    }, [
        pnlHoy,
        metaDiaria,
        goalCelebratedToday,
        loading
    ]);
    if (loading || checkingAuth) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-slate-900 flex flex-col items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-end justify-center gap-1 mb-4 h-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 bg-emerald-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]",
                                style: {
                                    height: '60%',
                                    animationDelay: '0ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 756,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 bg-red-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]",
                                style: {
                                    height: '40%',
                                    animationDelay: '100ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 757,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 bg-emerald-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]",
                                style: {
                                    height: '80%',
                                    animationDelay: '200ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 758,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 bg-red-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]",
                                style: {
                                    height: '50%',
                                    animationDelay: '300ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 759,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 bg-emerald-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]",
                                style: {
                                    height: '70%',
                                    animationDelay: '400ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 760,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 755,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-400 text-sm",
                        children: "Cargando..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 762,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 754,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 753,
            columnNumber: 7
        }, this);
    }
    if (!user) {
        if (showLogin) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$LoginPage$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LoginPage$3e$__["LoginPage"], {
                onBack: ()=>setShowLogin(false)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 770,
                columnNumber: 14
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$LandingPage$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LandingPage$3e$__["LandingPage"], {
            onLogin: ()=>setShowLogin(true)
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 772,
            columnNumber: 12
        }, this);
    }
    const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;
    // Usuario logueado pero no autorizado
    if (!isAuthorized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$UnauthorizedScreen$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            user: user,
            onLogout: handleLogout,
            authStatus: authStatus
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 779,
            columnNumber: 12
        }, this);
    }
    // Mostrar panel de admin
    if (showAdminPanel && isAdmin) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AdminPanel$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            user: user,
            onClose: ()=>setShowAdminPanel(false)
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 784,
            columnNumber: 12
        }, this);
    }
    // Mostrar simulador de fondeo
    if (showFundingSimulator) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$funding$2f$FundingSimulator$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FundingSimulator$3e$__["FundingSimulator"], {
            user: user,
            onClose: ()=>setShowFundingSimulator(false)
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 790,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `min-h-screen font-sans pb-20 transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$SettingsModal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SettingsModal$3e$__["SettingsModal"], {
                isOpen: showSettings,
                onClose: ()=>setShowSettings(false),
                config: config,
                setConfig: setConfig,
                onSaveToCloud: saveSettingsToCloud,
                onRestartTour: ()=>setForceTourStart(true),
                trades: trades,
                movements: movements,
                onMovements: ()=>setShowMovements(true)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 801,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TradeDetailModal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TradeDetailModal$3e$__["TradeDetailModal"], {
                trade: selectedTrade,
                isOpen: showTradeDetail,
                onClose: ()=>{
                    setShowTradeDetail(false);
                    setSelectedTrade(null);
                },
                onUpdate: updateTrade,
                onDelete: deleteTrade,
                cuentasBroker: config.cuentasBroker || [],
                userId: user?.uid,
                userEmail: user?.email,
                userType: userType,
                userPlan: userPlan
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 813,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Header$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Header$3e$__["Header"], {
                user: user,
                config: config,
                pnlHoy: pnlHoy,
                metaDiaria: metaDiaria,
                metaDiariaPct: metaDiariaPct,
                progresoMeta: progresoMeta,
                selectedAccountId: selectedAccountId,
                setSelectedAccountId: setSelectedAccountId,
                selectedAccount: selectedAccount,
                currencySymbol: currencySymbol,
                onSettings: ()=>setShowSettings(true),
                onCalendar: ()=>setShowCalendar(true),
                onFundingSimulator: ()=>setShowFundingSimulator(true),
                onAcademy: ()=>setShowAcademy(true),
                onESTracker: ()=>setShowESTracker(true),
                hasTrackerAccess: hasTrackerAccess,
                isAdmin: isAdmin,
                onAdmin: ()=>setShowAdminPanel(true),
                onLogout: handleLogout,
                userType: userType
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 829,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$EconomicCalendar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EconomicCalendar$3e$__["EconomicCalendar"], {
                isOpen: showCalendar,
                onClose: ()=>setShowCalendar(false)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 852,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TradingAcademy$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TradingAcademy$3e$__["TradingAcademy"], {
                isOpen: showAcademy,
                onClose: ()=>setShowAcademy(false),
                userId: user?.uid
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 857,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$MovementsModal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showMovements,
                onClose: ()=>setShowMovements(false),
                userId: user?.uid,
                movements: movements,
                cuentasBroker: config.cuentasBroker || [],
                trades: trades
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 863,
                columnNumber: 7
            }, this),
            userType === 'trial' && userTrialEnd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TrialExpiringAlert$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                trialEnd: userTrialEnd,
                userEmail: user?.email
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 874,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$OnboardingTour$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                userEmail: user?.email,
                forceStart: forceTourStart,
                onForceStartHandled: ()=>setForceTourStart(false)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 881,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-8 space-y-6 lg:space-y-8 order-2 lg:order-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$StatsCards$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__StatsCards$3e$__["StatsCards"], {
                                    stats: stats,
                                    currencySymbol: currencySymbol,
                                    selectedAccount: selectedAccount
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.js",
                                    lineNumber: 890,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AdvancedStats$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AdvancedStats$3e$__["AdvancedStats"], {
                                    trades: accountFilteredTrades,
                                    capitalInicial: stats.effectiveCapital,
                                    balance: stats.balance,
                                    currencySymbol: currencySymbol
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.js",
                                    lineNumber: 891,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    "data-tour": "charts",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$EquityChart$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EquityChart$3e$__["EquityChart"], {
                                        data: stats.data,
                                        startBalance: stats.startBalance,
                                        currencySymbol: currencySymbol
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 893,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.js",
                                    lineNumber: 892,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    "data-tour": "drawdown",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$DrawdownChart$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DrawdownChart$3e$__["DrawdownChart"], {
                                        data: stats.data
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 896,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.js",
                                    lineNumber: 895,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$CalendarView$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarView$3e$__["CalendarView"], {
                                    trades: filteredTrades,
                                    selectedMonth: selectedMonth,
                                    setSelectedMonth: setSelectedMonth,
                                    selectedYear: selectedYear,
                                    setSelectedYear: setSelectedYear,
                                    onTradeClick: handleTradeClick,
                                    tradeCount: stats.tradeCount,
                                    diasNoOperativos: diasNoOperativos,
                                    onToggleDiaNoOperativo: toggleDiaNoOperativo
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.js",
                                    lineNumber: 898,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 889,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-4 space-y-6 order-1 lg:order-2 lg:sticky lg:top-24 h-fit",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TradeForm$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TradeForm$3e$__["TradeForm"], {
                                onSubmit: addTrade,
                                form: form,
                                setForm: setForm,
                                activosFavoritos: config.activosFavoritos,
                                estrategias: config.estrategias || [],
                                reglasSetup: config.reglasSetup || [],
                                cuentasBroker: config.cuentasBroker || [],
                                userId: user?.uid,
                                userEmail: user?.email,
                                userType: userType,
                                userPlan: userPlan,
                                trades: trades
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 912,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 911,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 888,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 887,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ESTracker$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showESTracker,
                onClose: ()=>setShowESTracker(false),
                isAdmin: isAdmin
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 931,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TraderDiary$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showDiary,
                onClose: ()=>setShowDiary(false),
                trades: trades,
                userId: user?.uid,
                userEmail: user?.email,
                userType: userType,
                userPlan: userPlan
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 938,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowDiary(true),
                className: "fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 group",
                title: "Diario del Trader",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    className: "group-hover:scale-110 transition-transform",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 966,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M8 7h6"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 967,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M8 11h8"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 968,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 954,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 949,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.js",
        lineNumber: 798,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_app_2275d956._.js.map