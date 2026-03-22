import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const topics = searchParams.get('topics') || 'economy_macro,finance,financial_markets';

    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Alpha Vantage API key not configured' }, { status: 500 });
    }

    const res = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=${topics}&sort=LATEST&limit=50&apikey=${apiKey}`,
      { next: { revalidate: 300 } } // Cache 5 min
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: res.status });
    }

    const data = await res.json();

    if (data.Information || !data.feed) {
      return NextResponse.json({ error: data.Information || 'No news data' }, { status: 429 });
    }

    // Sentiment label helper
    const sentimentLabel = (score) => {
      if (score <= -0.35) return 'Bearish';
      if (score <= -0.15) return 'Somewhat Bearish';
      if (score < 0.15) return 'Neutral';
      if (score < 0.35) return 'Somewhat Bullish';
      return 'Bullish';
    };

    const cleaned = (data.feed || []).slice(0, 20).map(n => ({
      id: n.url,
      headline: n.title,
      summary: n.summary?.slice(0, 250) || '',
      source: n.source,
      url: n.url,
      datetime: n.time_published, // format: YYYYMMDDTHHMMSS
      image: n.banner_image || null,
      sentiment: n.overall_sentiment_score || 0,
      sentimentLabel: sentimentLabel(n.overall_sentiment_score || 0),
      topics: (n.topics || []).map(t => t.topic).slice(0, 3),
    }));

    return NextResponse.json({ news: cleaned });
  } catch (error) {
    console.error('Market news error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}