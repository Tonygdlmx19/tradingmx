const functions = require("firebase-functions");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const SITE_URL = "https://tjpromx.app";

// Palabras clave de noticias por activo (mismas que usa el cliente en ESTracker)
const ASSET_KEYWORDS = {
  ES: "S&P 500,SPX,stocks,equities,Fed",
  NQ: "Nasdaq,QQQ,technology,tech stocks",
  CL: "crude oil,oil,energy,petroleum,OPEC",
  GC: "gold,precious metals,safe haven",
  YM: "Dow Jones,DJIA,blue chip",
  RTY: "Russell 2000,small cap",
  SI: "silver,precious metals",
  NG: "natural gas,energy,LNG",
};

// Genera el análisis institucional de un activo llamando al endpoint del sitio
// (el prompt y la API key de Anthropic viven en Netlify, no aquí).
async function generateAssetAnalysis(assetId, records, today) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const last = sorted[sorted.length - 1];

  // Sin datos recientes no hay nada útil que analizar
  const daysSinceLast = (new Date(today) - new Date(last.date)) / 86400000;
  if (daysSinceLast > 7) return { skipped: "stale-data" };

  const docId = `${assetId}_${today}`;
  const existing = await db.collection("tracker_analyses").doc(docId).get();
  if (existing.exists) return { skipped: "already-exists" };

  let marketNews = [];
  let marketSentiment = null;
  try {
    const newsRes = await fetch(
      `${SITE_URL}/api/market-news?asset=${assetId}&keywords=${encodeURIComponent(ASSET_KEYWORDS[assetId] || "")}`
    );
    const newsData = await newsRes.json();
    marketNews = (newsData.news || []).slice(0, 10).map((n) => ({
      headline: n.headline, source: n.source, datetime: n.datetime,
      datetimeType: n.datetimeType, sentiment: n.sentiment, sentimentLabel: n.sentimentLabel,
    }));
  } catch (e) { console.warn(`[preSession] news failed for ${assetId}:`, e.message); }
  try {
    const sentRes = await fetch(`${SITE_URL}/api/market-sentiment`);
    marketSentiment = await sentRes.json();
  } catch (e) { console.warn("[preSession] sentiment failed:", e.message); }

  const res = await fetch(`${SITE_URL}/api/tracker-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assetData: sorted.slice(-60),
      totalSessions: sorted.length,
      assetTicker: assetId,
      language: "es",
      calculatedVwap: null,
      calculatedLevels: null,
      tradingTimeframe: "5m",
      marketNews,
      userStrategies: [],
      marketSentiment,
    }),
  });

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const err = await res.json();
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const analysis = await res.text();
  if (!analysis || analysis.length < 100) {
    throw new Error(`respuesta sospechosamente corta (${analysis.length} chars)`);
  }

  await db.collection("tracker_analyses").doc(docId).set({
    asset: assetId,
    ticker: assetId,
    date: today,
    analysis,
    language: "es",
    sessionsCount: sorted.length,
    lastClose: last.close,
    createdAt: new Date(),
    auto: true,
  });
  return { ok: true, chars: analysis.length };
}

// Análisis pre-sesión automático: L-V a las 7:00 (CDMX), antes de la apertura de NY.
// Genera el análisis institucional de cada activo con datos recientes y lo deja
// guardado en tracker_analyses para que esté listo al abrir la app.
exports.preSessionAnalysis = onSchedule(
  { schedule: "0 7 * * 1-5", timeZone: "America/Mexico_City", timeoutSeconds: 540, memory: "512MiB" },
  async () => {
    const snap = await db.collection("market_tracker").doc("data").get();
    if (!snap.exists) { console.log("[preSession] sin datos de tracker"); return; }
    const allData = snap.data() || {};
    const today = new Date().toISOString().slice(0, 10);

    for (const assetId of Object.keys(allData)) {
      const records = allData[assetId];
      if (!Array.isArray(records) || records.length < 5) continue;
      try {
        const result = await generateAssetAnalysis(assetId, records, today);
        console.log(`[preSession] ${assetId}:`, JSON.stringify(result));
      } catch (e) {
        console.error(`[preSession] ${assetId} falló:`, e.message);
      }
    }
  }
);

exports.paypalWebhook = functions.https.onRequest(async (req, res) => {
  // Permitir CORS
  res.set("Access-Control-Allow-Origin", "*");
  
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST, GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).send("");
  }

  if (req.method === "GET") {
    return res.status(200).json({ status: "ok", message: "PayPal webhook activo" });
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const body = req.body;
    console.log("Webhook PayPal recibido:", JSON.stringify(body, null, 2));

    const eventType = body.event_type;

    if (
      eventType === "CHECKOUT.ORDER.APPROVED" ||
      eventType === "PAYMENT.CAPTURE.COMPLETED" ||
      eventType === "PAYMENT.SALE.COMPLETED"
    ) {
      // Extraer email del comprador
      const email =
        body.resource?.payer?.email_address ||
        body.resource?.purchaser?.email_address ||
        body.resource?.subscriber?.email_address;

      if (email) {
        const emailLower = email.toLowerCase();
        
        // Agregar a authorized_users
        await db.collection("authorized_users").doc(emailLower).set({
          email: emailLower,
          status: "active",
          type: "paid",
          trialStart: null,
          trialEnd: null,
          authorizedAt: admin.firestore.FieldValue.serverTimestamp(),
          paypalEvent: eventType,
          paypalTransactionId: body.resource?.id || body.id,
        }, { merge: true });

        console.log("Usuario autorizado:", emailLower);
        return res.status(200).json({ success: true, email: emailLower });
      }
    }

    return res.status(200).json({ success: true, message: "Evento recibido" });
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
