import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'No API key' }, { status: 500 });
    }

    // Fetch available models directly from API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const data = await response.json();

    // Filter models that support generateContent
    const models = data.models?.filter(m =>
      m.supportedGenerationMethods?.includes('generateContent')
    ).map(m => ({
      name: m.name,
      displayName: m.displayName,
      methods: m.supportedGenerationMethods
    }));

    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
