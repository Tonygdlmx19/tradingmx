import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageBase64, tradeData, language = 'es' } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompts = {
      es: `Eres un mentor experto en trading. Analiza este gráfico de trading y proporciona retroalimentación constructiva.

Datos del trade:
- Activo: ${tradeData.activo || 'No especificado'}
- Dirección: ${tradeData.dir || 'No especificada'}
- Resultado: ${tradeData.res >= 0 ? 'Ganancia' : 'Pérdida'} de $${Math.abs(tradeData.res || 0).toFixed(2)}
- Precio entrada: ${tradeData.entrada || 'No especificado'}
- Precio salida: ${tradeData.salida || 'No especificado'}
- Puntos: ${tradeData.puntos?.toFixed(2) || 'No calculados'}

Por favor analiza:
1. **Entrada**: ¿Fue un buen punto de entrada? ¿Qué señales técnicas justifican la entrada?
2. **Salida**: ¿Se salió en buen momento? ¿Se pudo haber optimizado?
3. **Gestión de riesgo**: ¿Se ve un stop loss apropiado?
4. **Patrones**: ¿Qué patrones técnicos identificas en el gráfico?
5. **Mejoras**: ¿Qué podría mejorar el trader para futuros trades similares?

Sé conciso pero útil. Responde en español. Usa formato con bullets para facilitar la lectura.`,

      en: `You are an expert trading mentor. Analyze this trading chart and provide constructive feedback.

Trade data:
- Asset: ${tradeData.activo || 'Not specified'}
- Direction: ${tradeData.dir || 'Not specified'}
- Result: ${tradeData.res >= 0 ? 'Profit' : 'Loss'} of $${Math.abs(tradeData.res || 0).toFixed(2)}
- Entry price: ${tradeData.entrada || 'Not specified'}
- Exit price: ${tradeData.salida || 'Not specified'}
- Points: ${tradeData.puntos?.toFixed(2) || 'Not calculated'}

Please analyze:
1. **Entry**: Was it a good entry point? What technical signals justify the entry?
2. **Exit**: Was the exit well-timed? Could it have been optimized?
3. **Risk management**: Is there an appropriate stop loss visible?
4. **Patterns**: What technical patterns do you identify in the chart?
5. **Improvements**: What could the trader improve for similar future trades?

Be concise but helpful. Respond in English. Use bullet points for easy reading.`
    };

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      },
      prompts[language] || prompts.es,
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
