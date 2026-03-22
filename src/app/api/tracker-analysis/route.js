import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { assetData, assetTicker, language = 'es' } = await request.json();

    if (!assetData || !assetData.length) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Anthropic API key not configured. Add ANTHROPIC_API_KEY to .env.local' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const sorted = [...assetData].sort((a, b) => a.date.localeCompare(b.date));
    const last = sorted[sorted.length - 1];
    const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
    const last5 = sorted.slice(-5);
    const last10 = sorted.slice(-10);

    // ── Calculate VWAP ──
    let cumTPV = 0, cumVol = 0;
    const vwapValues = sorted.map(r => {
      const tp = (r.high + r.low + r.close) / 3;
      cumTPV += tp * r.vol;
      cumVol += r.vol;
      return cumVol > 0 ? cumTPV / cumVol : tp;
    });
    const currentVwap = vwapValues[vwapValues.length - 1];

    // VWAP StdDev
    let sumSqDiff = 0;
    sorted.forEach((r, i) => {
      const tp = (r.high + r.low + r.close) / 3;
      sumSqDiff += r.vol * Math.pow(tp - currentVwap, 2);
    });
    const vwapStdDev = cumVol > 0 ? Math.sqrt(sumSqDiff / cumVol) : 0;

    // Build data table with POC/VAH/VAL
    const dataTable = sorted.slice(-30).map((r, i, arr) => {
      const prevR = i > 0 ? arr[i - 1] : null;
      const body = Math.abs(r.close - r.open);
      const range = r.high - r.low;
      const eff = range > 0 ? ((body / range) * 100).toFixed(1) : '0';
      const dir = r.close >= r.open ? 'UP' : 'DOWN';
      const volDelta = prevR ? (((r.vol - prevR.vol) / prevR.vol) * 100).toFixed(1) + '%' : '—';
      const oiDelta = prevR ? (((r.oi - prevR.oi) / prevR.oi) * 100).toFixed(1) + '%' : '—';
      const foiPct = r.foi && r.oi ? ((r.foi / r.oi) * 100).toFixed(1) + '%' : '—';
      const vpData = [
        r.poc ? `POC:${r.poc}` : null,
        r.vah ? `VAH:${r.vah}` : null,
        r.val ? `VAL:${r.val}` : null,
      ].filter(Boolean).join(' ');
      return `${r.date} | O:${r.open} H:${r.high} L:${r.low} C:${r.close} | Dir:${dir} Body:${body.toFixed(2)} Range:${range.toFixed(2)} Eff:${eff}% | Vol:${r.vol} (${volDelta}) OI:${r.oi} (${oiDelta}) FOI:${foiPct}${vpData ? ' | ' + vpData : ''}`;
    }).join('\n');

    // Aggregate stats
    const avgRange5 = last5.reduce((s, r) => s + (r.high - r.low), 0) / last5.length;
    const avgVol5 = last5.reduce((s, r) => s + r.vol, 0) / last5.length;
    const avgRange10 = last10.length > 0 ? last10.reduce((s, r) => s + (r.high - r.low), 0) / last10.length : avgRange5;
    const totalChange = last.close - sorted[0].open;
    const totalChangePct = ((totalChange / sorted[0].open) * 100).toFixed(2);

    // 52w high/low
    const data52w = sorted.slice(-260);
    const high52 = Math.max(...data52w.map(r => r.high));
    const low52 = Math.min(...data52w.map(r => r.low));
    const position52 = ((last.close - low52) / (high52 - low52) * 100).toFixed(1);

    // Fibonacci levels
    const range52 = high52 - low52;
    const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].map(f => ({
      pct: (f * 100).toFixed(1) + '%',
      level: (low52 + range52 * f).toFixed(2)
    }));

    // Pivot points
    const pp = (last.high + last.low + last.close) / 3;
    const r1 = 2 * pp - last.low;
    const s1 = 2 * pp - last.high;
    const r2 = pp + (last.high - last.low);
    const s2 = pp - (last.high - last.low);

    // Volume Profile summary (last sessions with data)
    const vpSessions = sorted.filter(r => r.poc).slice(-10);
    const vpSummary = vpSessions.length > 0
      ? vpSessions.map(r => `${r.date}: POC=${r.poc}${r.vah ? ' VAH=' + r.vah : ''}${r.val ? ' VAL=' + r.val : ''}`).join('\n')
      : 'No volume profile data available';

    const es = language === 'es';

    const systemPrompt = es
      ? `Eres un analista institucional de futuros con experiencia en flujo de órdenes, estructura de mercado, Volume Profile (POC, VAH, VAL), VWAP y análisis de volumen/open interest. Respondes siempre en español. Tu análisis debe ser profesional, conciso y accionable para un trader activo de futuros.`
      : `You are an institutional futures analyst with expertise in order flow, market structure, Volume Profile (POC, VAH, VAL), VWAP and volume/open interest analysis. You always respond in English. Your analysis should be professional, concise, and actionable for an active futures trader.`;

    const userPrompt = es
      ? `Analiza los siguientes datos de ${assetTicker} futuros y proporciona un análisis técnico institucional completo.

## DATOS DE ${assetTicker} (últimas 30 sesiones de ${sorted.length} totales)
${dataTable}

## VWAP (Volume Weighted Average Price)
- VWAP actual: ${currentVwap.toFixed(2)}
- Desviación estándar: ${vwapStdDev.toFixed(2)}
- VWAP +1σ: ${(currentVwap + vwapStdDev).toFixed(2)}  |  VWAP -1σ: ${(currentVwap - vwapStdDev).toFixed(2)}
- VWAP +2σ: ${(currentVwap + 2 * vwapStdDev).toFixed(2)}  |  VWAP -2σ: ${(currentVwap - 2 * vwapStdDev).toFixed(2)}
- Precio vs VWAP: ${last.close > currentVwap ? 'POR ENCIMA (+' + (last.close - currentVwap).toFixed(2) + ')' : 'POR DEBAJO (' + (last.close - currentVwap).toFixed(2) + ')'}

## VOLUME PROFILE (POC, VAH, VAL de ATAS)
${vpSummary}

## NIVELES FIBONACCI (52 semanas: Low ${low52.toFixed(2)} → High ${high52.toFixed(2)})
${fibLevels.map(f => `${f.pct}: ${f.level}`).join(' | ')}
Posición en rango 52s: ${position52}%

## PIVOT POINTS (última sesión)
R2: ${r2.toFixed(2)} | R1: ${r1.toFixed(2)} | PP: ${pp.toFixed(2)} | S1: ${s1.toFixed(2)} | S2: ${s2.toFixed(2)}

## ESTADÍSTICAS AGREGADAS
- Rango promedio 5 sesiones: ${avgRange5.toFixed(2)} pts
- Rango promedio 10 sesiones: ${avgRange10.toFixed(2)} pts
- Volumen promedio 5 sesiones: ${(avgVol5 / 1e6).toFixed(2)}M
- Cambio total período: ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)} (${totalChangePct}%)
- Último cierre: ${last.close} (${last.close >= last.open ? 'alcista' : 'bajista'})
- 52w High: ${high52.toFixed(2)} | 52w Low: ${low52.toFixed(2)}

## INSTRUCCIONES DE ANÁLISIS
Proporciona tu análisis en las siguientes secciones. Usa formato Markdown:

### 1. RESUMEN DE MERCADO
Contexto general del período analizado (2-3 frases).

### 2. ANÁLISIS DE ESTRUCTURA DE PRECIO
- Tendencia dominante y fuerza
- Niveles clave de soporte y resistencia
- Tipo de mercado (tendencial, rango, transición)
- Relación del precio con los retrocesos de Fibonacci

### 3. VWAP Y VOLUME PROFILE
- Posición del precio respecto al VWAP y sus desviaciones
- Interpretación de las bandas VWAP (±1σ, ±2σ) — zonas de valor/sobreprecio
- Análisis de POC, VAH y VAL: ¿dónde se concentra el volumen institucional?
- ¿El precio está dentro o fuera del Value Area?
- Confluencias entre VWAP, POC y niveles de Fibonacci

### 4. FLUJO INSTITUCIONAL (Volumen & OI)
- Interpretación de los cambios en volumen y open interest
- Señales de dinero institucional (entrada/salida de posiciones)
- Divergencias o confirmaciones volumen/precio

### 5. CLASIFICACIÓN DE SESIONES RECIENTES
Analiza las últimas 3-5 sesiones: tipo de día, eficiencia, señales.

### 6. SESGO OPERATIVO
- Sesgo direccional para la próxima sesión (alcista/bajista/neutral)
- Escenarios probables con niveles específicos
- Niveles clave a vigilar: Pivot Points, VWAP, POC, Fibonacci
- Zonas de entrada potencial basadas en confluencias

### 7. ALERTAS Y RIESGOS
- Señales de alerta activas
- Factores de riesgo
- Roll de contrato si aplica`
      : `Analyze the following ${assetTicker} futures data and provide a comprehensive institutional technical analysis.

## ${assetTicker} DATA (last 30 sessions of ${sorted.length} total)
${dataTable}

## VWAP (Volume Weighted Average Price)
- Current VWAP: ${currentVwap.toFixed(2)}
- Standard deviation: ${vwapStdDev.toFixed(2)}
- VWAP +1σ: ${(currentVwap + vwapStdDev).toFixed(2)}  |  VWAP -1σ: ${(currentVwap - vwapStdDev).toFixed(2)}
- VWAP +2σ: ${(currentVwap + 2 * vwapStdDev).toFixed(2)}  |  VWAP -2σ: ${(currentVwap - 2 * vwapStdDev).toFixed(2)}
- Price vs VWAP: ${last.close > currentVwap ? 'ABOVE (+' + (last.close - currentVwap).toFixed(2) + ')' : 'BELOW (' + (last.close - currentVwap).toFixed(2) + ')'}

## VOLUME PROFILE (POC, VAH, VAL from ATAS)
${vpSummary}

## FIBONACCI LEVELS (52 weeks: Low ${low52.toFixed(2)} → High ${high52.toFixed(2)})
${fibLevels.map(f => `${f.pct}: ${f.level}`).join(' | ')}
Position in 52w range: ${position52}%

## PIVOT POINTS (last session)
R2: ${r2.toFixed(2)} | R1: ${r1.toFixed(2)} | PP: ${pp.toFixed(2)} | S1: ${s1.toFixed(2)} | S2: ${s2.toFixed(2)}

## AGGREGATE STATISTICS
- Average range 5 sessions: ${avgRange5.toFixed(2)} pts
- Average range 10 sessions: ${avgRange10.toFixed(2)} pts
- Average volume 5 sessions: ${(avgVol5 / 1e6).toFixed(2)}M
- Total period change: ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)} (${totalChangePct}%)
- Last close: ${last.close} (${last.close >= last.open ? 'bullish' : 'bearish'})
- 52w High: ${high52.toFixed(2)} | 52w Low: ${low52.toFixed(2)}

## ANALYSIS INSTRUCTIONS
Provide your analysis in the following sections. Use Markdown format:

### 1. MARKET SUMMARY
General context (2-3 sentences).

### 2. PRICE STRUCTURE ANALYSIS
- Dominant trend and strength
- Key support and resistance levels
- Market type (trending, range, transition)
- Price relationship with Fibonacci retracements

### 3. VWAP AND VOLUME PROFILE
- Price position relative to VWAP and its deviations
- VWAP bands interpretation (±1σ, ±2σ) — value/overpriced zones
- POC, VAH, VAL analysis: where is institutional volume concentrated?
- Is price inside or outside the Value Area?
- Confluences between VWAP, POC and Fibonacci levels

### 4. INSTITUTIONAL FLOW (Volume & OI)
- Volume and open interest changes interpretation
- Institutional money signals (position entry/exit)
- Volume/price divergences or confirmations

### 5. RECENT SESSION CLASSIFICATION
Analyze last 3-5 sessions: day type, efficiency, signals.

### 6. TRADING BIAS
- Directional bias for next session (bullish/bearish/neutral)
- Probable scenarios with specific levels
- Key levels to watch: Pivot Points, VWAP, POC, Fibonacci
- Potential entry zones based on confluences

### 7. ALERTS AND RISKS
- Active alert signals
- Risk factors
- Contract roll if applicable`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        { role: 'user', content: userPrompt }
      ],
      system: systemPrompt,
    });

    const analysis = message.content[0]?.text || '';

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Tracker analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Error generating analysis' },
      { status: 500 }
    );
  }
}