import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'all';

    const results = [];

    // ── Finnhub (fast, real-time news) ──
    const finnhubKey = process.env.FINNHUB_API_KEY;
    if (finnhubKey && (source === 'all' || source === 'finnhub')) {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`,
          { next: { revalidate: 300 } }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            data.slice(0, 15).forEach(n => {
              results.push({
                id: `fh-${n.id}`,
                headline: n.headline,
                summary: n.summary?.slice(0, 250) || '',
                source: n.source,
                url: n.url,
                datetime: n.datetime, // Unix timestamp
                datetimeType: 'unix',
                image: n.image || null,
                sentiment: null,
                sentimentLabel: null,
                provider: 'Finnhub',
              });
            });
          }
        }
      } catch (_) { /* finnhub failed */ }
    }

    // ── Alpha Vantage (sentiment analysis) ──
    const avKey = process.env.ALPHAVANTAGE_API_KEY;
    if (avKey && (source === 'all' || source === 'alphavantage')) {
      try {
        const res = await fetch(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=economy_macro,finance,financial_markets&sort=LATEST&limit=20&apikey=${avKey}`,
          { next: { revalidate: 300 } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.feed) {
            const sentimentLabel = (score) => {
              if (score <= -0.35) return 'Bearish';
              if (score <= -0.15) return 'Somewhat Bearish';
              if (score < 0.15) return 'Neutral';
              if (score < 0.35) return 'Somewhat Bullish';
              return 'Bullish';
            };
            data.feed.slice(0, 10).forEach(n => {
              results.push({
                id: `av-${n.url}`,
                headline: n.title,
                summary: n.summary?.slice(0, 250) || '',
                source: n.source,
                url: n.url,
                datetime: n.time_published, // YYYYMMDDTHHMMSS
                datetimeType: 'alphavantage',
                image: n.banner_image || null,
                sentiment: n.overall_sentiment_score || 0,
                sentimentLabel: sentimentLabel(n.overall_sentiment_score || 0),
                provider: 'Alpha Vantage',
              });
            });
          }
        }
      } catch (_) { /* alpha vantage failed */ }
    }

    // Sort by time (most recent first), deduplicate similar headlines
    const seen = new Set();
    const unique = results.filter(n => {
      const key = n.headline.slice(0, 50).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort: convert all to unix for comparison
    unique.sort((a, b) => {
      const getUnix = (n) => {
        if (n.datetimeType === 'unix') return n.datetime;
        const d = String(n.datetime);
        if (d.length >= 13) {
          return new Date(`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}T${d.slice(9,11)}:${d.slice(11,13)}:00`).getTime() / 1000;
        }
        return 0;
      };
      return getUnix(b) - getUnix(a);
    });

    return NextResponse.json({ news: unique.slice(0, 20) });
  } catch (error) {
    console.error('Market news error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}