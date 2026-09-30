// Genera un conjunto de trades de demostración realista y determinista.
// Se usa desde el panel de admin para llenar la pantalla en capturas y videos.

export const DEMO_ACCOUNT = {
  id: 'demo-account',
  broker: 'Demo Broker',
  numero: 'DEMO-001',
  servidor: null,
  password: null,
  divisa: 'USD',
  saldoInicial: 10000,
  esBinarias: false,
};

// RNG determinista (mulberry32) para que la demo sea siempre la misma
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ASSETS = [
  { symbol: 'MNQ', price: 20150, tick: 0.25, pointValue: 2, weight: 4 },
  { symbol: 'NQ', price: 20150, tick: 0.25, pointValue: 20, weight: 1 },
  { symbol: 'ES', price: 5620, tick: 0.25, pointValue: 50, weight: 2 },
  { symbol: 'EUR/USD', price: 1.0842, tick: 0.0001, pointValue: 10, weight: 2 },
  { symbol: 'XAU/USD', price: 2358, tick: 0.1, pointValue: 1, weight: 1 },
];

const NOTAS_WIN = [
  'Entrada limpia en retroceso al VWAP, salida en objetivo.',
  'Respeté el plan: 1 contrato, stop fijo, objetivo 2R.',
  'Ruptura de máximo previo con volumen, buen seguimiento.',
  'Rechazo de POC de ayer, gestión parcial en 1R.',
  'Tendencia clara desde apertura, no perseguí precio.',
  '',
  '',
];
const NOTAS_LOSS = [
  'Entré antes de la confirmación. Error de paciencia.',
  'Stop respetado. El setup era válido, simplemente no funcionó.',
  'Operé en noticia sin revisar el calendario. No repetir.',
  'Sobreoperé después de una pérdida. Revisar regla de máximo 3 trades.',
  '',
  '',
];

function round(v, step) {
  return Math.round(v / step) * step;
}

export function buildDemoTrades(uid, { weeks = 9, seed = 20260929 } = {}) {
  const rand = rng(seed);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const pickWeighted = (arr) => {
    const total = arr.reduce((s, a) => s + a.weight, 0);
    let r = rand() * total;
    for (const a of arr) { r -= a.weight; if (r <= 0) return a; }
    return arr[arr.length - 1];
  };

  const trades = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - weeks * 7);

  let drift = 0; // pequeña deriva de precio para que entradas no sean idénticas
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;          // fines de semana
    if (rand() < 0.28) continue;                   // días sin operar
    const nTrades = rand() < 0.65 ? 1 : 2;
    drift += (rand() - 0.5) * 0.01;

    for (let i = 0; i < nTrades; i++) {
      const asset = pickWeighted(ASSETS);
      const dir = rand() < 0.55 ? 'Long' : 'Short';
      const isWin = rand() < 0.58;
      // Ganancia media ~ 190, pérdida media ~ 125 (profit factor > 1.5)
      const amount = isWin
        ? 90 + Math.round(rand() * 330)
        : -(60 + Math.round(rand() * 190));
      const lotes = asset.symbol === 'MNQ' ? 1 + Math.floor(rand() * 3) : 1;
      const points = amount / (asset.pointValue * lotes);
      const entrada = round(asset.price * (1 + drift) + (rand() - 0.5) * asset.price * 0.004, asset.tick);
      const salida = round(dir === 'Long' ? entrada + points : entrada - points, asset.tick);
      const puntos = dir === 'Long' ? salida - entrada : entrada - salida;

      const hourFloat = 8.5 + rand() * 3; // 08:30 - 11:30
      const hh = String(Math.floor(hourFloat)).padStart(2, '0');
      const mm = String(Math.floor((hourFloat % 1) * 60)).padStart(2, '0');
      const fecha = d.toISOString().split('T')[0];

      const emo = isWin
        ? pick(['Neutral', 'Neutral', 'Calmado', 'Calmado', 'Eufórico'])
        : pick(['Neutral', 'Ansioso', 'Frustrado', 'Calmado', 'Miedo']);

      trades.push({
        uid,
        demo: true,
        fecha,
        fechaEntrada: fecha,
        fechaSalida: fecha,
        hora: `${hh}:${mm}`,
        activo: asset.symbol,
        dir,
        res: amount,
        lotes,
        entrada,
        salida,
        puntos: Number(puntos.toFixed(asset.tick < 0.01 ? 4 : 2)),
        emo,
        seguiPlan: isWin ? rand() < 0.9 : rand() < 0.65,
        respetoRiesgo: rand() < 0.88,
        notas: isWin ? pick(NOTAS_WIN) : pick(NOTAS_LOSS),
        imagenes: [],
        checklist: null,
        swap: 0,
        cuentaId: DEMO_ACCOUNT.id,
        broker: DEMO_ACCOUNT.broker,
        numeroCuenta: DEMO_ACCOUNT.numero,
        preTradeAnalysis: null,
        preTradeImage: null,
        preTradeDescription: null,
        createdAt: new Date(`${fecha}T${hh}:${mm}:00`),
      });
    }
  }
  return trades;
}
