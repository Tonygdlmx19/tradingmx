import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const results = { fearGreed: null, vix: null };

    // ── Fear & Greed Index via CNN (primary) + Alternative.me (fallback) ──
    // Try CNN first
    try {
      const fgRes = await fetch(
        'https://production.dataviz.cnn.io/index/fearandgreed/graphdata',
        { cache: 'no-store', headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.cnn.com/markets/fear-and-greed',
        } }
      );
      if (fgRes.ok) {
        const fgData = await fgRes.json();
        const fg = fgData?.fear_and_greed;
        if (fg) {
          results.fearGreed = {
            score: Math.round(fg.score),
            rating: fg.rating?.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            previousClose: fg.previous_close ? Math.round(fg.previous_close) : null,
            oneWeekAgo: fg.previous_1_week ? Math.round(fg.previous_1_week) : null,
            oneMonthAgo: fg.previous_1_month ? Math.round(fg.previous_1_month) : null,
            source: 'CNN',
          };
        }
      }
    } catch (_) { /* CNN failed */ }

    // Fallback: Alternative.me (crypto-based but reliable from any server)
    if (!results.fearGreed) {
      try {
        const altRes = await fetch(
          'https://api.alternative.me/fng/?limit=31&format=json',
          { cache: 'no-store' }
        );
        if (altRes.ok) {
          const altData = await altRes.json();
          const entries = altData?.data;
          if (entries?.length > 0) {
            const today = entries[0];
            results.fearGreed = {
              score: parseInt(today.value),
              rating: today.value_classification?.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              previousClose: entries[1] ? parseInt(entries[1].value) : null,
              oneWeekAgo: entries[7] ? parseInt(entries[7].value) : null,
              oneMonthAgo: entries[30] ? parseInt(entries[30].value) : null,
              source: 'Alternative.me',
            };
          }
        }
      } catch (_) { /* Alternative.me also failed */ }
    }

    // ── VIX via Alpha Vantage (VIXY ETF as proxy) ──
    const avKey = process.env.ALPHAVANTAGE_API_KEY;
    if (avKey) {
      try {
        const vixRes = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VIXY&apikey=${avKey}`,
          { cache: 'no-store' }
        );
        if (vixRes.ok) {
          const vixData = await vixRes.json();
          const q = vixData?.['Global Quote'];
          if (q && q['05. price']) {
            // VIXY tracks VIX futures, price is not VIX value directly
            // We use the percentage change which mirrors VIX behavior
            const price = parseFloat(q['05. price']);
            const prevClose = parseFloat(q['08. previous close'] || 0);
            const change = parseFloat(q['09. change'] || 0);
            const changePct = parseFloat((q['10. change percent'] || '0').replace('%', ''));

            results.vix = {
              current: price,
              change,
              changePercent: changePct,
              previousClose: prevClose,
              isETF: true, // flag that this is VIXY not raw VIX
              label: 'VIXY',
            };
          }
        }
      } catch (_) { /* Alpha Vantage failed */ }
    }

    // Fallback VIX: try Yahoo Finance
    if (!results.vix) {
      try {
        const yRes = await fetch(
          'https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?range=1d&interval=1d',
          { cache: 'no-store', headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          } }
        );
        if (yRes.ok) {
          const yData = await yRes.json();
          const meta = yData?.chart?.result?.[0]?.meta;
          if (meta) {
            results.vix = {
              current: meta.regularMarketPrice,
              change: meta.regularMarketPrice - meta.chartPreviousClose,
              changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100,
              previousClose: meta.chartPreviousClose,
              isETF: false,
              label: 'VIX',
            };
          }
        }
      } catch (_) { /* Yahoo also failed */ }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Market sentiment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
