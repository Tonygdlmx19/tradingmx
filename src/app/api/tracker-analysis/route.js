export async function POST(request) {
  try {
    const { assetData, assetTicker, language = 'es', calculatedVwap, calculatedLevels, userStrategies, tradingTimeframe = '5m', marketNews, marketSentiment } = await request.json();

    if (!assetData || !assetData.length) {
      return new Response(JSON.stringify({ error: 'No data provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const sorted = [...assetData].sort((a, b) => a.date.localeCompare(b.date));
    const last = sorted[sorted.length - 1];
    const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
    const last5 = sorted.slice(-5);
    const last10 = sorted.slice(-10);

    const currentVwap = calculatedVwap?.vwap || 0;

    const last30 = sorted.slice(-30);
    const dataTable = last30.map((r, i, arr) => {
      const prevR = i > 0 ? arr[i - 1] : null;
      const body = Math.abs(r.close - r.open);
      const range = r.high - r.low;
      const eff = range > 0 ? ((body / range) * 100).toFixed(1) : '0';
      const dir = r.close >= r.open ? 'UP' : 'DOWN';
      const volDelta = prevR ? (((r.vol - prevR.vol) / prevR.vol) * 100).toFixed(1) + '%' : '-';
      const oiDelta = prevR ? (((r.oi - prevR.oi) / prevR.oi) * 100).toFixed(1) + '%' : '-';
      const foiPct = r.foi && r.oi ? ((r.foi / r.oi) * 100).toFixed(1) + '%' : '-';
      const idx5 = Math.max(0, i - 4);
      const d5d = arr.slice(idx5, i + 1).reduce((s, d) => s + (d.delta || 0), 0);
      const hasD5d = arr.slice(idx5, i + 1).some(d => d.delta != null);
      const priceUp = r.close >= r.open;
      const deltaUp = r.delta != null ? r.delta >= 0 : null;
      const div = r.delta != null ? (priceUp !== deltaUp ? 'DIVERGENCIA' : 'OK') : '-';
      const vpData = [
        r.poc ? `POC:${r.poc}` : null, r.vah ? `VAH:${r.vah}` : null, r.val ? `VAL:${r.val}` : null,
        r.delta != null ? `Delta:${r.delta}` : null, hasD5d ? `D5d:${d5d}` : null, r.delta != null ? `Div:${div}` : null,
      ].filter(Boolean).join(' ');
      return `${r.date} | O:${r.open} H:${r.high} L:${r.low} C:${r.close} | Dir:${dir} Body:${body.toFixed(2)} Range:${range.toFixed(2)} Eff:${eff}% | Vol:${r.vol} (${volDelta}) OI:${r.oi} (${oiDelta}) FOI:${foiPct}${vpData ? ' | ' + vpData : ''}`;
    }).join('\n');

    const avgRange5 = last5.reduce((s, r) => s + (r.high - r.low), 0) / last5.length;
    const avgVol5 = last5.reduce((s, r) => s + r.vol, 0) / last5.length;
    const avgRange10 = last10.length > 0 ? last10.reduce((s, r) => s + (r.high - r.low), 0) / last10.length : avgRange5;
    const totalChange = last.close - sorted[0].open;
    const totalChangePct = ((totalChange / sorted[0].open) * 100).toFixed(2);

    const high52 = calculatedLevels?.high52 || Math.max(...sorted.slice(-260).map(r => r.high));
    const low52 = calculatedLevels?.low52 || Math.min(...sorted.slice(-260).map(r => r.low));
    const position52 = calculatedLevels?.position52 || '50.0';
    const techPeriodDays = calculatedLevels?.techPeriodDays || 260;
    const fibLevels = calculatedLevels?.fib || [];
    const pivotLevels = calculatedLevels?.pivots || [];
    const pp = calculatedLevels?.pp || (last.high + last.low + last.close) / 3;

    const vpSessions = sorted.filter(r => r.poc).slice(-10);
    const vpSummary = vpSessions.length > 0
      ? vpSessions.map(r => `${r.date}: POC=${r.poc}${r.vah ? ' VAH=' + r.vah : ''}${r.val ? ' VAL=' + r.val : ''}${r.delta != null ? ' Delta=' + r.delta : ''}`).join('\n')
      : 'No volume profile data available';

    const newsText = marketNews && marketNews.length > 0
      ? marketNews.map(n => {
          const dt = String(n.datetime || '');
          let time = '';
          if (n.datetimeType === 'alphavantage' && dt.includes('T') && dt.length >= 13) {
            time = `${dt.slice(6,8)}/${dt.slice(4,6)} ${dt.slice(9,11)}:${dt.slice(11,13)}`;
          } else if (n.datetimeType === 'unix' && dt) {
            const d = new Date(parseInt(dt) * 1000);
            time = d.toLocaleString('es-MX', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
          }
          const sent = n.sentimentLabel ? ` [${n.sentimentLabel}]` : '';
          return `${time ? '[' + time + '] ' : ''}${n.source}: ${n.headline}${sent}`;
        }).join('\n')
      : null;

    let sentimentText = null;
    if (marketSentiment) {
      const parts = [];
      if (marketSentiment.fearGreed) {
        const fg = marketSentiment.fearGreed;
        parts.push(`Fear & Greed Index: ${fg.score}/100 (${fg.rating})${fg.previousClose != null ? ` | Prev: ${fg.previousClose}` : ''}${fg.oneWeekAgo != null ? ` | 1w: ${fg.oneWeekAgo}` : ''}${fg.oneMonthAgo != null ? ` | 1m: ${fg.oneMonthAgo}` : ''}`);
      }
      if (marketSentiment.vix) {
        const vx = marketSentiment.vix;
        const level = vx.current < 15 ? 'Low' : vx.current < 20 ? 'Normal' : vx.current < 25 ? 'Elevated' : 'High';
        parts.push(`VIX: ${vx.current.toFixed(2)} (${level}) | Change: ${vx.change >= 0 ? '+' : ''}${vx.change.toFixed(2)} (${vx.changePercent.toFixed(1)}%)`);
      }
      if (parts.length > 0) sentimentText = parts.join('\n');
    }

    const strategiesText = userStrategies && userStrategies.length > 0
      ? userStrategies.map(s => {
          const rules = (s.reglas || []).map(r => `  - ${r.texto}${r.descripcion ? ': ' + r.descripcion : ''}`).join('\n');
          return `Estrategia: ${s.nombre}\n${rules}`;
        }).join('\n\n')
      : null;

    const es = language === 'es';

    const systemPrompt = es
      ? `Eres un analista institucional de futuros con experiencia en flujo de órdenes, estructura de mercado, Volume Profile (POC, VAH, VAL), VWAP y análisis de volumen/open interest. Respondes siempre en español.

CONTEXTO DEL TRADER:
- El trader opera en temporalidad de ${tradingTimeframe} (${tradingTimeframe === '1D' ? 'swing/posicional' : tradingTimeframe === '4H' || tradingTimeframe === '1H' ? 'intradía medio plazo' : 'scalping/intradía corto plazo'})
- Los datos que recibes son DIARIOS (1D) y sirven como contexto macro e institucional
- Tu trabajo es usar estos niveles diarios (POC, VAH, VAL, VWAP, Fibonacci, Pivots) para dar recomendaciones ACCIONABLES en el timeframe de ${tradingTimeframe}
- Las entradas, stops y targets deben ser específicos para operaciones en ${tradingTimeframe}

NOTA: El campo "Delta" es el delta diario de sesión (diferencia entre volumen de compra y venta agresiva). Delta positivo = presión compradora neta, negativo = presión vendedora neta.

REGLAS DE FORMATO:
- Usa emojis para hacer el texto visual y facil de escanear
- NO uses caracteres especiales como triangulos, flechas Unicode, sigma, plusminus
- Usa guiones (-) para listas
- Escribe los titulos de seccion en MAYUSCULAS
- NUNCA uses porcentajes de probabilidad (60%, 40%, etc.) ni la palabra "probabilidad", "probable", "confianza"
- En lugar de "60% alcista / 40% bajista" usa "Escenario primario: alcista" y "Escenario alternativo: bajista" SIN porcentajes
- Cuando menciones niveles de precio consecutivos, SIEMPRE separa con espacios y flechas de texto: "6755 a 6637 a 6598", NUNCA concatenes numeros juntos
- Los horarios SIEMPRE en hora CST (Centro de Mexico/Guadalajara). Apertura NY = 8:30 CST, Cierre London = 10:00 CST, Cierre NY = 15:00 CST
- Cuando el analisis macro (1D) difiera del setup intraday, EXPLICA claramente: "La estructura de fondo es X, pero en ${tradingTimeframe} el setup es Y porque Z". No dejes contradicciones sin resolver
- Se profesional, conciso y accionable.`
      : `You are an institutional futures analyst with expertise in order flow, market structure, Volume Profile (POC, VAH, VAL), VWAP and volume/open interest analysis. You always respond in English.

TRADER CONTEXT:
- The trader operates on ${tradingTimeframe} timeframe (${tradingTimeframe === '1D' ? 'swing/positional' : tradingTimeframe === '4H' || tradingTimeframe === '1H' ? 'intraday medium term' : 'scalping/short-term intraday'})
- The data you receive is DAILY (1D) and serves as macro/institutional context
- Your job is to use these daily levels (POC, VAH, VAL, VWAP, Fibonacci, Pivots) to give ACTIONABLE recommendations for the ${tradingTimeframe} timeframe
- Entries, stops and targets must be specific for ${tradingTimeframe} operations

NOTE: The "Delta" field is the daily session delta (difference between aggressive buy and sell volume). Positive delta = net buying pressure, negative = net selling pressure.

FORMAT RULES:
- Use emojis to make text visual and easy to scan
- DO NOT use special characters like triangles, Unicode arrows, sigma, plusminus
- Use dashes (-) for lists
- Write section titles in UPPERCASE
- NEVER use probability percentages (60%, 40%, etc.) or the words "probability", "probable", "confidence"
- Instead of "60% bullish / 40% bearish" use "Primary scenario: bullish" and "Alternative scenario: bearish" WITHOUT percentages
- When mentioning consecutive price levels, ALWAYS separate with spaces and text arrows: "6755 to 6637 to 6598", NEVER concatenate numbers together
- All times ALWAYS in CST (Central Mexico/Guadalajara). NY open = 8:30 CST, London close = 10:00 CST, NY close = 15:00 CST
- When macro analysis (1D) differs from intraday setup, EXPLAIN clearly: "The background structure is X, but on ${tradingTimeframe} the setup is Y because Z". Do not leave contradictions unresolved
- Be professional, concise and actionable.`;

    const userPrompt = es
      ? `Analiza los siguientes datos de ${assetTicker} futuros y proporciona un análisis técnico institucional completo.

## DATOS DE ${assetTicker} (últimas 30 sesiones de ${sorted.length} totales)
${dataTable}

## VWAP (Session VWAP from ATAS)
- VWAP última sesión: ${currentVwap > 0 ? currentVwap.toFixed(2) : 'No disponible'}
${currentVwap > 0 ? `- Precio vs VWAP: ${last.close > currentVwap ? 'POR ENCIMA (+' + (last.close - currentVwap).toFixed(2) + ')' : 'POR DEBAJO (' + (last.close - currentVwap).toFixed(2) + ')'}` : ''}

## VOLUME PROFILE (POC, VAH, VAL)
${vpSummary}

## NIVELES FIBONACCI (${techPeriodDays} dias: Low ${low52.toFixed(2)} - High ${high52.toFixed(2)})
${fibLevels.map(f => `${f.label}: ${f.level.toFixed(2)}`).join(' | ')}
Posicion en rango: ${position52}%

## PIVOT POINTS (ultima sesion: H:${last.high} L:${last.low} C:${last.close})
${pivotLevels.map(p => `${p.label}: ${p.level.toFixed(2)}`).join(' | ')}
PP: ${pp.toFixed(2)}

## ESTADÍSTICAS AGREGADAS
- Rango promedio 5 sesiones: ${avgRange5.toFixed(2)} pts
- Rango promedio 10 sesiones: ${avgRange10.toFixed(2)} pts
- Volumen promedio 5 sesiones: ${(avgVol5 / 1e6).toFixed(2)}M
- Cambio total período: ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)} (${totalChangePct}%)
- Último cierre: ${last.close} (${last.close >= last.open ? 'alcista' : 'bajista'})
- 52w High: ${high52.toFixed(2)} | 52w Low: ${low52.toFixed(2)}
${strategiesText ? `\n## ESTRATEGIAS DEL TRADER\n${strategiesText}` : ''}${newsText ? `\n## NOTICIAS RECIENTES\n${newsText}` : ''}${sentimentText ? `\n## SENTIMIENTO DE MERCADO\nFear & Greed por debajo de 25 = miedo extremo (zona de rebote). VIX por encima de 25 = alta volatilidad (stops amplios, posiciones chicas).\n${sentimentText}` : ''}

## INSTRUCCIONES
Analisis conciso en Markdown con secciones: 1) RESUMEN 2) ESTRUCTURA DE PRECIO 3) VWAP Y VOLUME PROFILE 4) FLUJO INSTITUCIONAL 5) SESIONES RECIENTES ${strategiesText ? '6) ESTRATEGIAS ' : ''}${strategiesText ? '7' : '6'}) SESGO OPERATIVO ${tradingTimeframe} con escenarios y niveles ${newsText ? `${strategiesText ? '8' : '7'}) NOTICIAS` : ''} ${newsText ? (strategiesText ? '9' : '8') : (strategiesText ? '8' : '7')}) ALERTAS Y RIESGOS`
      : `Analyze ${assetTicker} futures data. Provide institutional technical analysis.

## ${assetTicker} DATA (last 30 of ${sorted.length} sessions)
${dataTable}

## VWAP: ${currentVwap > 0 ? currentVwap.toFixed(2) : 'N/A'}
## VOLUME PROFILE
${vpSummary}
## FIBONACCI (${techPeriodDays}d: ${low52.toFixed(2)}-${high52.toFixed(2)})
${fibLevels.map(f => `${f.label}: ${f.level.toFixed(2)}`).join(' | ')} | Pos: ${position52}%
## PIVOTS (H:${last.high} L:${last.low} C:${last.close})
${pivotLevels.map(p => `${p.label}: ${p.level.toFixed(2)}`).join(' | ')} | PP: ${pp.toFixed(2)}
## STATS
Avg range 5d: ${avgRange5.toFixed(2)} | 10d: ${avgRange10.toFixed(2)} | Vol 5d: ${(avgVol5/1e6).toFixed(2)}M | Change: ${totalChange >= 0?'+':''}${totalChange.toFixed(2)} (${totalChangePct}%) | 52w: ${high52.toFixed(2)}/${low52.toFixed(2)}
${strategiesText ? `\n## STRATEGIES\n${strategiesText}` : ''}${newsText ? `\n## NEWS\n${newsText}` : ''}${sentimentText ? `\n## SENTIMENT\n${sentimentText}` : ''}

Concise Markdown analysis: 1) SUMMARY 2) PRICE STRUCTURE 3) VWAP & VP 4) INSTITUTIONAL FLOW 5) RECENT SESSIONS ${strategiesText ? '6) STRATEGIES ' : ''}${strategiesText ? '7' : '6'}) TRADING BIAS ${tradingTimeframe} with scenarios ${newsText ? `${strategiesText ? '8' : '7'}) NEWS` : ''} ${newsText ? (strategiesText ? '9' : '8') : (strategiesText ? '8' : '7')}) ALERTS`;

    // ── Streaming response from Anthropic ──
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        stream: true,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: `Anthropic ${anthropicRes.status}: ${errText}` }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream the response through to the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = anthropicRes.body.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6).trim();
                if (jsonStr === '[DONE]') continue;
                try {
                  const event = JSON.parse(jsonStr);
                  if (event.type === 'content_block_delta' && event.delta?.text) {
                    controller.enqueue(encoder.encode(event.delta.text));
                  }
                } catch (_) { /* skip malformed JSON */ }
              }
            }
          }
        } catch (err) {
          controller.enqueue(encoder.encode(`\n\n[Error: ${err.message}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Tracker analysis error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Error generating analysis' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
