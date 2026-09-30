import { NextResponse } from 'next/server';

// Sentimiento de mercado para el tracker y el análisis IA.
// Regla: solo datos reales. Si una fuente falla, el campo va en null y la UI
// y el prompt lo omiten. Nunca se estima ni se sustituye por otro índice.
export const dynamic = 'force-dynamic';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchFearGreed() {
  const res = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
    cache: 'no-store',
    headers: { 'User-Agent': UA, Accept: 'application/json', Referer: 'https://www.cnn.com/markets/fear-and-greed' },
  });
  if (!res.ok) return null;
  const fg = (await res.json())?.fear_and_greed;
  if (!fg || fg.score == null) return null;
  const cap = (s) => (s || '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    score: Math.round(fg.score),
    rating: cap(fg.rating),
    previousClose: fg.previous_close != null ? Math.round(fg.previous_close) : null,
    oneWeekAgo: fg.previous_1_week != null ? Math.round(fg.previous_1_week) : null,
    oneMonthAgo: fg.previous_1_month != null ? Math.round(fg.previous_1_month) : null,
    updatedAt: fg.timestamp || null,
    source: 'CNN',
  };
}

async function fetchVix() {
  // Índice ^VIX real. range=5d para tener el cierre previo aunque el mercado esté cerrado.
  const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?range=5d&interval=1d', {
    cache: 'no-store',
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) return null;
  const result = (await res.json())?.chart?.result?.[0];
  const closes = (result?.indicators?.quote?.[0]?.close || []).filter(v => v != null);
  const current = result?.meta?.regularMarketPrice ?? closes[closes.length - 1];
  if (!current) return null;
  // Cierre previo: penúltimo cierre distinto del actual (evita el +0.00 cuando la última vela es hoy)
  const prev = result?.meta?.chartPreviousClose ?? (closes.length > 1 ? closes[closes.length - 2] : null);
  const change = prev ? current - prev : null;
  return {
    current: Number(current.toFixed(2)),
    previousClose: prev != null ? Number(prev.toFixed(2)) : null,
    change: change != null ? Number(change.toFixed(2)) : null,
    changePercent: change != null && prev ? Number(((change / prev) * 100).toFixed(2)) : null,
    marketTime: result?.meta?.regularMarketTime || null,
    label: 'VIX',
    source: 'Yahoo Finance',
  };
}

export async function GET() {
  const [fearGreed, vix] = await Promise.all([
    fetchFearGreed().catch(() => null),
    fetchVix().catch(() => null),
  ]);
  return NextResponse.json({ fearGreed, vix, fetchedAt: new Date().toISOString() });
}
