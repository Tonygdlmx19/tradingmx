import { NextResponse } from 'next/server';

// Map asset IDs to Alpha Vantage tickers and topics
const ASSET_TOPICS = {
  ES: { topics: 'economy_macro,financial_markets', tickers: 'SPY' },
  NQ: { topics: 'technology,financial_markets', tickers: 'QQQ' },
  CL: { topics: 'energy_transportation,economy_macro', tickers: 'USO' },
  GC: { topics: 'financial_markets,economy_macro', tickers: 'GLD' },
  YM: { topics: 'financial_markets,economy_macro', tickers: 'DIA' },
  RTY: { topics: 'financial_markets,economy_macro', tickers: 'IWM' },
  SI: { topics: 'financial_markets,economy_macro', tickers: 'SLV' },
  NG: { topics: 'energy_transportation,economy_macro', tickers: 'UNG' },
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const asset = searchParams.get('asset') || 'ES';
    const keywords = searchParams.get('keywords') || '';

    const assetConfig = ASSET_TOPICS[asset] || ASSET_TOPICS.ES;
    const results = [];

    // ── Finnhub (real-time news) ──
    const finnhubKey = process.env.FINNHUB_API_KEY;
    if (finnhubKey) {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`,
          { cache: 'no-store' }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Filter by keywords relevance
            const kws = keywords.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
            const filtered = data.filter(n => {
              if (kws.length === 0) return true;
              const text = `${n.headline} ${n.summary}`.toLowerCase();
              return kws.some(kw => text.includes(kw));
            });
            // Take filtered first, then general to fill up
            const relevant = [...filtered.slice(0, 10), ...data.filter(n => !filtered.includes(n)).slice(0, 5)];
            relevant.slice(0, 15).forEach(n => {
              const isRelevant = filtered.includes(n);
              results.push({
                id: `fh-${n.id}`,
                headline: n.headline,
                summary: n.summary?.slice(0, 250) || '',
                source: n.source,
                url: n.url,
                datetime: n.datetime,
                datetimeType: 'unix',
                image: n.image || null,
                sentiment: null,
                sentimentLabel: null,
                relevant: isRelevant,
                provider: 'Finnhub',
              });
            });
          }
        }
      } catch (_) { /* finnhub failed */ }
    }

    // ── Alpha Vantage (with sentiment) ──
    const avKey = process.env.ALPHAVANTAGE_API_KEY;
    if (avKey) {
      try {
        const res = await fetch(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${assetConfig.tickers}&topics=${assetConfig.topics}&sort=LATEST&limit=20&apikey=${avKey}`,
          { cache: 'no-store' }
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
                datetime: n.time_published,
                datetimeType: 'alphavantage',
                image: n.banner_image || null,
                sentiment: n.overall_sentiment_score || 0,
                sentimentLabel: sentimentLabel(n.overall_sentiment_score || 0),
                relevant: true,
                provider: 'Alpha Vantage',
              });
            });
          }
        }
      } catch (_) { /* alpha vantage failed */ }
    }

    // Deduplicate
    const seen = new Set();
    const unique = results.filter(n => {
      const key = n.headline.slice(0, 50).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort: relevant first, then by time
    const getUnix = (n) => {
      if (n.datetimeType === 'unix') return n.datetime;
      const d = String(n.datetime);
      if (d.length >= 13) {
        return new Date(`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}T${d.slice(9,11)}:${d.slice(11,13)}:00`).getTime() / 1000;
      }
      return 0;
    };
    unique.sort((a, b) => {
      if (a.relevant !== b.relevant) return a.relevant ? -1 : 1;
      return getUnix(b) - getUnix(a);
    });

    // Calculate overall sentiment
    const withSentiment = unique.filter(n => n.sentiment != null);
    const avgSentiment = withSentiment.length > 0
      ? withSentiment.reduce((s, n) => s + n.sentiment, 0) / withSentiment.length
      : null;

    return NextResponse.json({
      news: unique.slice(0, 20),
      sentiment: avgSentiment,
      sentimentCount: { bullish: withSentiment.filter(n => n.sentiment >= 0.15).length, bearish: withSentiment.filter(n => n.sentiment <= -0.15).length, neutral: withSentiment.filter(n => n.sentiment > -0.15 && n.sentiment < 0.15).length },
    });
  } catch (error) {
    console.error('Market news error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}