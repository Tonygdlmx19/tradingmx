import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageBase64, multipleImages, tradeData, userNotes, isPreTrade, assetHistory, language = 'es', userPreTradeNotes, preTradeEnhanced } = await request.json();

    if (!imageBase64 && (!multipleImages || multipleImages.length === 0)) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Configure model with Google Search grounding if sentiment analysis is requested
    const useSentimentSearch = isPreTrade && preTradeEnhanced?.includeSentiment;

    const modelConfig = {
      model: 'gemini-2.5-flash',
    };

    // Add Google Search tool for sentiment analysis
    if (useSentimentSearch) {
      modelConfig.tools = [
        {
          googleSearch: {},
        },
      ];
    }

    const model = genAI.getGenerativeModel(modelConfig);

    // Helper to clean base64 data
    const cleanBase64 = (data) => data.replace(/^data:image\/\w+;base64,/, '');

    // Build image parts for multiple images or single image
    const imageParts = [];
    let timeframeInfo = '';

    if (multipleImages && multipleImages.length > 0) {
      // Multiple images with timeframes
      multipleImages.forEach((img, index) => {
        imageParts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64(img.base64),
          },
        });
      });
      // Build timeframe info for the prompt
      const timeframes = multipleImages.map(img => img.timeframe).join(', ');
      timeframeInfo = language === 'es'
        ? `\nTemporalidades proporcionadas: ${timeframes}\nANALIZA TODAS LAS TEMPORALIDADES para tener una visión más completa del contexto del mercado.\n`
        : `\nTimeframes provided: ${timeframes}\nANALYZE ALL TIMEFRAMES to have a more complete view of the market context.\n`;
    } else {
      // Single image (backward compatibility)
      imageParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64(imageBase64),
        },
      });
    }

    // Remove data URL prefix if present (for backward compatibility)
    const base64Data = imageBase64 ? cleanBase64(imageBase64) : '';

    // Build notes section if user provided notes
    const notesSection = {
      es: userNotes ? `
Notas del trader sobre este trade:
"${userNotes}"

Toma en cuenta estas notas del trader para entender su perspectiva y darle retroalimentación más personalizada y relevante.
` : '',
      en: userNotes ? `
Trader's notes about this trade:
"${userNotes}"

Take these notes into account to understand the trader's perspective and provide more personalized and relevant feedback.
` : ''
    };

    // Build history section for pre-trade analysis
    const buildHistorySection = (history, lang) => {
      if (!history || history.length === 0) return '';

      const historyText = history.map((t, i) => {
        const resultado = t.res >= 0 ? (lang === 'es' ? 'Ganancia' : 'Profit') : (lang === 'es' ? 'Pérdida' : 'Loss');
        const monto = `$${Math.abs(t.res || 0).toFixed(2)}`;
        const puntos = t.puntos ? `${t.puntos.toFixed(1)} pts` : '';
        const notas = t.notas ? `"${t.notas.substring(0, 100)}${t.notas.length > 100 ? '...' : ''}"` : '';
        const analisis = t.aiAnalysis ? `Análisis previo: "${t.aiAnalysis.substring(0, 150)}..."` : '';

        return `${i + 1}. ${t.fecha} - ${t.dir} - ${resultado} ${monto} ${puntos ? `(${puntos})` : ''} ${t.emo ? `- Emoción: ${t.emo}` : ''} ${notas ? `- Nota: ${notas}` : ''} ${analisis}`;
      }).join('\n');

      if (lang === 'es') {
        return `
HISTORIAL DEL TRADER EN ESTE ACTIVO (últimos ${history.length} trades):
${historyText}

IMPORTANTE: Usa este historial para dar retroalimentación personalizada. Si ves patrones repetitivos (errores o aciertos), mencionálos. Si el trader tuvo pérdidas en situaciones similares, advierte sobre ello.
`;
      } else {
        return `
TRADER'S HISTORY ON THIS ASSET (last ${history.length} trades):
${historyText}

IMPORTANT: Use this history to provide personalized feedback. If you see repetitive patterns (mistakes or successes), mention them. If the trader had losses in similar situations, warn about it.
`;
      }
    };

    const historySection = isPreTrade ? buildHistorySection(assetHistory, language) : '';

    // Build user's pre-trade notes section
    const buildUserPreTradeSection = (notes, lang) => {
      if (!notes || notes.trim() === '') return '';

      if (lang === 'es') {
        return `
LO QUE EL TRADER DICE QUE VE:
"${notes}"

IMPORTANTE: El trader te comparte su análisis y perspectiva. Evalúa si su lectura del gráfico es correcta. Si está viendo algo que no existe o malinterpretando patrones, corrígelo con respeto. Si su análisis es bueno, valídalo. Esto ayuda al trader a mejorar su forma de leer los gráficos.
`;
      } else {
        return `
WHAT THE TRADER SAYS THEY SEE:
"${notes}"

IMPORTANT: The trader is sharing their analysis and perspective. Evaluate if their chart reading is correct. If they're seeing something that doesn't exist or misinterpreting patterns, correct them respectfully. If their analysis is good, validate it. This helps the trader improve their chart reading skills.
`;
      }
    };

    const userPreTradeSection = isPreTrade ? buildUserPreTradeSection(userPreTradeNotes, language) : '';

    // Build market session and sentiment section
    const buildMarketContextSection = (enhanced, lang) => {
      if (!enhanced) return '';

      const { asset, primaryTimeframe, marketSession, sessionLabel, includeSentiment, currentTime, currentDay, userTimezone } = enhanced;

      if (lang === 'es') {
        let section = `
CONTEXTO DE MERCADO:
- Activo: ${asset}
- Temporalidad principal de análisis: ${primaryTimeframe}
- Sesión de mercado activa: ${sessionLabel}
- Hora actual del trader: ${currentTime} (${currentDay})
- Zona horaria: ${userTimezone}

`;
        if (includeSentiment) {
          section += `ANÁLISIS DE SENTIMIENTO REQUERIDO:
Busca información reciente sobre ${asset}:
- Noticias relevantes de las últimas 24-48 horas
- Eventos económicos que puedan afectar el activo
- Sentimiento general del mercado (alcista/bajista/neutral)
- Niveles técnicos clave mencionados por analistas
- Cualquier dato fundamental relevante (earnings, datos económicos, decisiones de bancos centrales, etc.)

IMPORTANTE: Considera que la sesión ${sessionLabel} afecta la volatilidad y liquidez. Durante la sesión asiática hay menos volumen en pares USD, durante la americana hay más volatilidad en índices americanos, etc.
`;
        }
        return section;
      } else {
        let section = `
MARKET CONTEXT:
- Asset: ${asset}
- Primary analysis timeframe: ${primaryTimeframe}
- Active market session: ${sessionLabel}
- Trader's current time: ${currentTime} (${currentDay})
- Timezone: ${userTimezone}

`;
        if (includeSentiment) {
          section += `SENTIMENT ANALYSIS REQUIRED:
Search for recent information about ${asset}:
- Relevant news from the last 24-48 hours
- Economic events that may affect the asset
- General market sentiment (bullish/bearish/neutral)
- Key technical levels mentioned by analysts
- Any relevant fundamental data (earnings, economic data, central bank decisions, etc.)

IMPORTANT: Consider that the ${sessionLabel} session affects volatility and liquidity. During the Asian session there's less volume in USD pairs, during the American session there's more volatility in US indices, etc.
`;
        }
        return section;
      }
    };

    const marketContextSection = isPreTrade && preTradeEnhanced ? buildMarketContextSection(preTradeEnhanced, language) : '';

    // Pre-trade prompts (before entering a trade) - CONCISE VERSION
    const preTradePrompts = {
      es: `Eres un mentor de trading. Analiza ${multipleImages && multipleImages.length > 1 ? 'las imágenes' : 'la imagen'} y da tu opinión sobre el trade ${tradeData.dir?.toUpperCase() || ''} en ${tradeData.activo || 'este activo'}.

${marketContextSection}${userPreTradeSection}${historySection}
RESPONDE DE FORMA CONCISA:

## 🚦 VEREDICTO
[✅ OPERAR / ⚠️ ESPERAR / ❌ NO OPERAR] - Explica en 1-2 líneas por qué.

## 💡 IDEA DE TRADE ${tradeData.dir === 'Long' ? '📈' : '📉'}

🚀 **Entrada:** [precio exacto]
🛡️ **Stop Loss:** [precio] ([X] pips de riesgo)
💰 **TP1:** [precio] (R:R [X:1]) - Cerrar 40%
💎 **TP2:** [precio] (R:R [X:1]) - Cerrar 40%
🏆 **TP3:** [precio] (R:R [X:1]) - Cerrar 20%

## 📊 RESUMEN RÁPIDO
- **A favor:** [2-3 puntos clave]
- **En contra:** [2-3 riesgos]
${preTradeEnhanced?.includeSentiment ? `- **Sentimiento:** [Alcista/Bajista/Neutral] - [razón breve]` : ''}

## 💡 TIP
[Un consejo específico para este trade]

---
⚠️ Análisis educativo. No es asesoría financiera.`,

      en: `You are a trading mentor. Analyze ${multipleImages && multipleImages.length > 1 ? 'the images' : 'the image'} and give your opinion on the ${tradeData.dir?.toUpperCase() || ''} trade on ${tradeData.activo || 'this asset'}.

${marketContextSection}${userPreTradeSection}${historySection}
RESPOND CONCISELY:

## 🚦 VERDICT
[✅ TRADE / ⚠️ WAIT / ❌ DO NOT TRADE] - Explain in 1-2 lines why.

## 💡 TRADE IDEA ${tradeData.dir === 'Long' ? '📈' : '📉'}

🚀 **Entry:** [exact price]
🛡️ **Stop Loss:** [price] ([X] pips at risk)
💰 **TP1:** [price] (R:R [X:1]) - Close 40%
💎 **TP2:** [price] (R:R [X:1]) - Close 40%
🏆 **TP3:** [price] (R:R [X:1]) - Close 20%

## 📊 QUICK SUMMARY
- **In favor:** [2-3 key points]
- **Against:** [2-3 risks]
${preTradeEnhanced?.includeSentiment ? `- **Sentiment:** [Bullish/Bearish/Neutral] - [brief reason]` : ''}

## 💡 TIP
[One specific tip for this trade]

---
⚠️ Educational analysis. Not financial advice.`
    };

    const prompts = {
      es: `Eres un mentor experto en trading. Analiza este gráfico de trading y proporciona retroalimentación constructiva.

Datos del trade:
- Activo: ${tradeData.activo || 'No especificado'}
- Dirección: ${tradeData.dir || 'No especificada'}
- Resultado: ${tradeData.res >= 0 ? 'Ganancia' : 'Pérdida'} de $${Math.abs(tradeData.res || 0).toFixed(2)}
- Precio entrada: ${tradeData.entrada || 'No especificado'}
- Precio salida: ${tradeData.salida || 'No especificado'}
- Puntos: ${tradeData.puntos?.toFixed(2) || 'No calculados'}
${notesSection.es}
Por favor analiza:
1. **Entrada**: ¿Fue un buen punto de entrada? ¿Qué señales técnicas justifican la entrada?
2. **Salida**: ¿Se salió en buen momento? ¿Se pudo haber optimizado?
3. **Gestión de riesgo**: ¿Se ve un stop loss apropiado?
4. **Patrones**: ¿Qué patrones técnicos identificas en el gráfico?
5. **Mejoras**: Basándote en el gráfico${userNotes ? ' y las notas del trader' : ''}, ¿qué podría mejorar para futuros trades similares?

Sé conciso pero útil. Responde en español. Usa formato con bullets para facilitar la lectura.${userNotes ? ' Si el trader mencionó algo específico en sus notas, comenta al respecto.' : ''}`,

      en: `You are an expert trading mentor. Analyze this trading chart and provide constructive feedback.

Trade data:
- Asset: ${tradeData.activo || 'Not specified'}
- Direction: ${tradeData.dir || 'Not specified'}
- Result: ${tradeData.res >= 0 ? 'Profit' : 'Loss'} of $${Math.abs(tradeData.res || 0).toFixed(2)}
- Entry price: ${tradeData.entrada || 'Not specified'}
- Exit price: ${tradeData.salida || 'Not specified'}
- Points: ${tradeData.puntos?.toFixed(2) || 'Not calculated'}
${notesSection.en}
Please analyze:
1. **Entry**: Was it a good entry point? What technical signals justify the entry?
2. **Exit**: Was the exit well-timed? Could it have been optimized?
3. **Risk management**: Is there an appropriate stop loss visible?
4. **Patterns**: What technical patterns do you identify in the chart?
5. **Improvements**: Based on the chart${userNotes ? ' and the trader\'s notes' : ''}, what could be improved for similar future trades?

Be concise but helpful. Respond in English. Use bullet points for easy reading.${userNotes ? ' If the trader mentioned something specific in their notes, comment on it.' : ''}`
    };

    // Select the appropriate prompt based on whether it's pre-trade or post-trade
    const selectedPrompt = isPreTrade
      ? (preTradePrompts[language] || preTradePrompts.es)
      : (prompts[language] || prompts.es);

    // Send all images followed by the prompt
    const result = await model.generateContent([
      ...imageParts,
      selectedPrompt,
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });

  } catch (error) {
    console.error('Error analyzing trade:', error);
    return NextResponse.json(
      { error: error.message || 'Error analyzing image' },
      { status: 500 }
    );
  }
}
