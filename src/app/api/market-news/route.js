import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';

    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Finnhub API key not configured' }, { status: 500 });
    }

    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`,
      { next: { revalidate: 300 } } // Cache 5 min
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: res.status });
    }

    const news = await res.json();

    // Return last 20 news items, cleaned up
    const cleaned = (news || []).slice(0, 20).map(n => ({
      id: n.id,
      headline: n.headline,
      summary: n.summary?.slice(0, 200) || '',
      source: n.source,
      url: n.url,
      datetime: n.datetime,
      category: n.category,
      image: n.image,
      related: n.related,
    }));

    return NextResponse.json({ news: cleaned });
  } catch (error) {
    console.error('Market news error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}