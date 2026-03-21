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

    // Build comprehensive data summary
    const dataTable = sorted.map((r, i) => {
      const prevR = i > 0 ? sorted[i - 1] : null;
      const body = Math.abs(r.close - r.open);
      const range = r.high - r.low;
      const eff = range > 0 ? ((body / range) * 100).toFixed(1) : '0';
      const dir = r.close >= r.open ? 'UP' : 'DOWN';
      const volDelta = prevR ? (((r.vol - prevR.vol) / prevR.vol) * 100).toFixed(1) + '%' : '—';
      const oiDelta = prevR ? (((r.oi - prevR.oi) / prevR.oi) * 100).toFixed(1) + '%' : '—';
      const foiPct = r.foi && r.oi ? ((r.foi / r.oi) * 100).toFixed(1) + '%' : '—';
      return `${r.date} | O:${r.open} H:${r.high} L:${r.low} C:${r.close} | Dir:${dir} Body:${body.toFixed(2)} Range:${range.toFixed(2)} Eff:${eff}% | Vol:${r.vol} (${volDelta}) OI:${r.oi} (${oiDelta}) FOI:${foiPct}`;
    }).join('\n');

    // Compute aggregate stats
    const avgRange5 = last5.reduce((s, r) => s + (r.high - r.low), 0) / last5.length;
    const avgVol5 = last5.reduce((s, r) => s + r.vol, 0) / last5.length;
    const avgRange10 = last10.length > 0 ? last10.reduce((s, r) => s + (r.high - r.low), 0) / last10.length : avgRange5;
    const totalChange = last.close - sorted[0].open;
    const totalChangePct = ((totalChange / sorted[0].open) * 100).toFixed(2);

    const es = language === 'es';

    const systemPrompt = es
      ? `Eres un analista institucional de futuros con experiencia en flujo de órdenes, estructura de mercado y análisis de volumen/open interest. Respondes siempre en español. Tu análisis debe ser profesional, conciso y accionable para un trader activo.`
      : `You are an institutional futures analyst with expertise in order flow, market structure, and volume/open interest analysis. You always respond in English. Your analysis should be professional, concise, and actionable for an active trader.`;

    const userPrompt = es
      ? `Analiza los siguientes datos de ${assetTicker} futuros y proporciona un análisis institucional completo.

## DATOS DE ${assetTicker} (${sorted.length} sesiones)
${dataTable}

## ESTADÍSTICAS AGREGADAS
- Rango promedio 5 sesiones: ${avgRange5.toFixed(2)} pts
- Rango promedio 10 sesiones: ${avgRange10.toFixed(2)} pts
- Volumen promedio 5 sesiones: ${(avgVol5 / 1e6).toFixed(2)}M
- Cambio total período: ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)} (${totalChangePct}%)
- Último cierre: ${last.close} (${last.close >= last.open ? 'alcista' : 'bajista'})

## INSTRUCCIONES DE ANÁLISIS
Proporciona tu análisis en las siguientes secciones. Usa formato Markdown:

### 1. RESUMEN DE MERCADO
Contexto general del período analizado (2-3 frases).

### 2. ANÁLISIS DE ESTRUCTURA
- Tendencia dominante y fuerza
- Niveles clave de soporte y resistencia basados en los datos
- Tipo de mercado (tendencial, rango, transición)

### 3. FLUJO INSTITUCIONAL (Volumen & OI)
- Interpretación de los cambios en volumen y open interest
- Señales de dinero institucional (entrada/salida de posiciones)
- Divergencias o confirmaciones volumen/precio

### 4. CLASIFICACIÓN DE SESIONES RECIENTES
Analiza las últimas 3-5 sesiones: tipo de día, eficiencia, señales.

### 5. SESGO OPERATIVO
- Sesgo direccional para la próxima sesión (alcista/bajista/neutral)
- Escenarios probables (bullish/bearish)
- Niveles a vigilar (soporte, resistencia, pivots)

### 6. ALERTAS Y RIESGOS
- Señales de alerta activas
- Factores de riesgo a considerar
- Roll de contrato si aplica (front month OI)`
      : `Analyze the following ${assetTicker} futures data and provide a comprehensive institutional analysis.

## ${assetTicker} DATA (${sorted.length} sessions)
${dataTable}

## AGGREGATE STATISTICS
- Average range 5 sessions: ${avgRange5.toFixed(2)} pts
- Average range 10 sessions: ${avgRange10.toFixed(2)} pts
- Average volume 5 sessions: ${(avgVol5 / 1e6).toFixed(2)}M
- Total period change: ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)} (${totalChangePct}%)
- Last close: ${last.close} (${last.close >= last.open ? 'bullish' : 'bearish'})

## ANALYSIS INSTRUCTIONS
Provide your analysis in the following sections. Use Markdown format:

### 1. MARKET SUMMARY
General context of the analyzed period (2-3 sentences).

### 2. STRUCTURE ANALYSIS
- Dominant trend and strength
- Key support and resistance levels based on data
- Market type (trending, range, transition)

### 3. INSTITUTIONAL FLOW (Volume & OI)
- Interpretation of volume and open interest changes
- Institutional money signals (position entry/exit)
- Volume/price divergences or confirmations

### 4. RECENT SESSION CLASSIFICATION
Analyze the last 3-5 sessions: day type, efficiency, signals.

### 5. TRADING BIAS
- Directional bias for next session (bullish/bearish/neutral)
- Probable scenarios (bullish/bearish)
- Levels to watch (support, resistance, pivots)

### 6. ALERTS AND RISKS
- Active alert signals
- Risk factors to consider
- Contract roll if applicable (front month OI)`;

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