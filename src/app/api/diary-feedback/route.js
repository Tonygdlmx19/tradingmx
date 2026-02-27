import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { entry, recentTrades, lang = 'es' } = await request.json();

    if (!entry || entry.trim() === '') {
      return NextResponse.json({ error: 'No diary entry provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build trades context
    const buildTradesContext = (trades, language) => {
      if (!trades || trades.length === 0) {
        return language === 'es'
          ? 'El trader aún no tiene trades registrados.'
          : 'The trader has no registered trades yet.';
      }

      const tradesInfo = trades.map((t, i) => {
        const resultado = t.resultado === 'ganado' ? (language === 'es' ? 'Ganado' : 'Won') : (language === 'es' ? 'Pérdida' : 'Loss');
        const monto = t.monto ? `$${Math.abs(t.monto).toFixed(2)}` : '';
        const emocion = t.emocion || t.emo || '';
        const notas = t.notas ? `"${t.notas.substring(0, 150)}${t.notas.length > 150 ? '...' : ''}"` : '';

        return `${i + 1}. ${t.fecha || 'N/A'} - ${t.activo || 'N/A'} - ${t.direccion || t.dir || 'N/A'} - ${resultado} ${monto} ${emocion ? `- Emoción: ${emocion}` : ''} ${notas ? `- Nota: ${notas}` : ''}`;
      }).join('\n');

      return language === 'es'
        ? `Últimos trades del trader:\n${tradesInfo}`
        : `Trader's recent trades:\n${tradesInfo}`;
    };

    const tradesContext = buildTradesContext(recentTrades, lang);

    // Build the prompt
    const prompts = {
      es: `Eres un mentor de trading experimentado y también un coach de mentalidad. Tu rol es ser un confidente para el trader, alguien que escucha sin juzgar pero que también ofrece retroalimentación honesta y constructiva.

CONTEXTO DEL TRADER:
${tradesContext}

ENTRADA DEL DIARIO DEL TRADER:
"${entry}"

INSTRUCCIONES:
1. **ESCUCHA ACTIVA**: Primero, demuestra que entiendes lo que el trader está sintiendo. Valida sus emociones sin minimizarlas.

2. **ANÁLISIS DE PATRONES**: Basándote en sus trades recientes y lo que escribió, identifica patrones de comportamiento (buenos o malos).

3. **RETROALIMENTACIÓN HONESTA**: Sé directo pero empático. Si detectas:
   - Exceso de confianza o ego → Señálalo con tacto pero firmeza
   - Miedo o inseguridad → Ofrece perspectiva y ánimo realista
   - Falta de disciplina → Identifica el patrón y sugiere soluciones
   - Buenas prácticas → Refuérzalas positivamente

4. **APOYO EMOCIONAL**: Recuerda que el trading es psicológicamente demandante. Ofrece apoyo genuino, no frases vacías.

5. **CONSEJOS PRÁCTICOS**: Termina con 1-2 acciones concretas que puede tomar.

FORMATO DE RESPUESTA:
- Usa un tono conversacional, como un mentor hablando con su alumno
- Sé conciso pero profundo (máximo 300 palabras)
- Usa emojis con moderación para dar calidez
- NO uses listas largas, prefiere párrafos fluidos
- Habla en segunda persona (tú)

Recuerda: El objetivo es ayudar al trader a:
1. Sentirse escuchado y comprendido
2. Ver sus puntos ciegos
3. Mejorar su disciplina y mentalidad
4. Seguir adelante con más claridad`,

      en: `You are an experienced trading mentor and mindset coach. Your role is to be a confidant for the trader, someone who listens without judgment but also offers honest and constructive feedback.

TRADER CONTEXT:
${tradesContext}

TRADER'S DIARY ENTRY:
"${entry}"

INSTRUCTIONS:
1. **ACTIVE LISTENING**: First, show that you understand what the trader is feeling. Validate their emotions without minimizing them.

2. **PATTERN ANALYSIS**: Based on their recent trades and what they wrote, identify behavioral patterns (good or bad).

3. **HONEST FEEDBACK**: Be direct but empathetic. If you detect:
   - Overconfidence or ego → Point it out tactfully but firmly
   - Fear or insecurity → Offer realistic perspective and encouragement
   - Lack of discipline → Identify the pattern and suggest solutions
   - Good practices → Positively reinforce them

4. **EMOTIONAL SUPPORT**: Remember that trading is psychologically demanding. Offer genuine support, not empty phrases.

5. **PRACTICAL ADVICE**: End with 1-2 concrete actions they can take.

RESPONSE FORMAT:
- Use a conversational tone, like a mentor talking to their student
- Be concise but deep (max 300 words)
- Use emojis sparingly for warmth
- DON'T use long lists, prefer flowing paragraphs
- Speak in second person (you)

Remember: The goal is to help the trader:
1. Feel heard and understood
2. See their blind spots
3. Improve their discipline and mindset
4. Move forward with more clarity`
    };

    const prompt = prompts[lang] || prompts.es;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    return NextResponse.json({ feedback });

  } catch (error) {
    console.error('Diary feedback error:', error);
    return NextResponse.json(
      { error: 'Error generating feedback', details: error.message },
      { status: 500 }
    );
  }
}
