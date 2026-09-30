const functions = require("firebase-functions");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const { defineSecret } = require("firebase-functions/params");

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

// ─────────────────────────────────────────────────────────────────────────────
// Datos de mercado diarios: L-V a las 18:30 (CDMX), después del cierre de Globex.
// Toma la sesión del día de Yahoo Finance (contrato continuo) para cada activo del
// tracker y la agrega a market_tracker/data sin pisar lo que ya exista (OI, perfil
// de volumen y datos de CME cargados a mano tienen prioridad).
// ─────────────────────────────────────────────────────────────────────────────
const YAHOO_SYMBOLS = { ES: "ES=F", NQ: "NQ=F", CL: "CL=F", GC: "GC=F", YM: "YM=F", RTY: "RTY=F", SI: "SI=F", NG: "NG=F" };
const DECIMALS = { ES: 2, NQ: 2, CL: 2, GC: 2, YM: 0, RTY: 2, SI: 3, NG: 3 };

async function fetchYahooDaily(symbol, decimals, range = "1mo") {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Yahoo ${res.status}`);
  const json = await res.json();
  const result = json.chart?.result?.[0];
  if (!result) throw new Error("Yahoo sin resultado");
  const q = result.indicators.quote[0];
  const rnd = (v) => (v == null ? null : Number(Number(v).toFixed(decimals)));
  const rows = [];
  (result.timestamp || []).forEach((t, i) => {
    if (q.close[i] == null) return;
    rows.push({
      date: new Date(t * 1000).toISOString().slice(0, 10),
      open: rnd(q.open[i]), high: rnd(q.high[i]), low: rnd(q.low[i]), close: rnd(q.close[i]),
      vol: q.volume[i] || 0,
    });
  });
  return rows;
}

async function updateDailyMarketData(range = "1mo") {
  const ref = db.collection("market_tracker").doc("data");
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" }); // YYYY-MM-DD
  const summary = {};

  for (const [assetId, symbol] of Object.entries(YAHOO_SYMBOLS)) {
    let rows;
    try {
      rows = await fetchYahooDaily(symbol, DECIMALS[assetId] ?? 2, range);
    } catch (e) {
      summary[assetId] = `error: ${e.message}`;
      continue;
    }
    // Solo sesiones cerradas: hasta hoy inclusive (la función corre tras el cierre)
    rows = rows.filter((r) => r.date <= today);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const allData = snap.exists ? snap.data() : {};
      const records = Array.isArray(allData[assetId]) ? [...allData[assetId]] : [];
      const byDate = new Map(records.map((r) => [r.date, r]));
      // Yahoo repite el volumen del día anterior en la última barra y lo corrige al
      // día siguiente, así que las sesiones recientes que vinieron de Yahoo se
      // refrescan en cada corrida. Las que ya tienen OI (CME o captura manual) no se tocan.
      const refreshFrom = new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10);
      let added = 0, filled = 0;
      for (const r of rows) {
        const ex = byDate.get(r.date);
        if (!ex) {
          records.push({ ...r, oi: null, foi: null, delta: null, poc: null, vah: null, val: null, vwap: null, source: "yahoo" });
          added++;
        } else if (ex.source === "yahoo" && ex.oi == null && r.date >= refreshFrom) {
          if (ex.open !== r.open || ex.high !== r.high || ex.low !== r.low || ex.close !== r.close || ex.vol !== r.vol) {
            Object.assign(ex, { open: r.open, high: r.high, low: r.low, close: r.close, vol: r.vol });
            filled++;
          }
        } else if (!ex.vol && r.vol) {
          ex.vol = r.vol; filled++;
        }
      }
      if (added || filled) {
        records.sort((a, b) => a.date.localeCompare(b.date));
        tx.set(ref, { [assetId]: records }, { merge: true });
      }
      summary[assetId] = `+${added} sesiones, ${filled} actualizadas, última ${records[records.length - 1]?.date || "-"}`;
    });
  }
  console.log("[dailyMarketData]", JSON.stringify(summary));
  return summary;
}

exports.dailyMarketData = onSchedule(
  { schedule: "30 18 * * 1-5", timeZone: "America/Mexico_City", timeoutSeconds: 300, memory: "256MiB" },
  async () => { await updateDailyMarketData(); }
);

// Disparo manual (GET) para probar o rellenar histórico: requiere el token
// DAILY_DATA_TOKEN en Secret Manager y ?token=... en la URL. Opcional ?range=1y
// (valores de Yahoo: 5d, 1mo, 3mo, 6mo, 1y) para rellenar sesiones faltantes.
const DAILY_DATA_TOKEN = defineSecret("DAILY_DATA_TOKEN");
exports.runDailyMarketData = functions.https.onRequest({ secrets: [DAILY_DATA_TOKEN] }, async (req, res) => {
  if (!req.query.token || req.query.token !== DAILY_DATA_TOKEN.value()) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const range = /^(5d|1mo|3mo|6mo|1y|2y)$/.test(req.query.range || "") ? req.query.range : "1mo";
    const summary = await updateDailyMarketData(range);
    return res.status(200).json({ ok: true, range, summary });
  } catch (e) {
    console.error("[dailyMarketData] error:", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Webhook de PayPal: activa el acceso del comprador automáticamente.
//
// PayPal llama a esta URL cada vez que ocurre un evento (pago completado, etc.).
// Antes de confiar en el evento se verifica su firma contra la API de PayPal,
// de modo que nadie pueda inventarse un pago y darse acceso.
//
// Secretos requeridos (firebase functions:secrets:set NOMBRE):
//   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET  -> app REST en developer.paypal.com
//   PAYPAL_WEBHOOK_ID                       -> ID del webhook creado en esa app
// ─────────────────────────────────────────────────────────────────────────────

const PAYPAL_CLIENT_ID = defineSecret("PAYPAL_CLIENT_ID");
const PAYPAL_CLIENT_SECRET = defineSecret("PAYPAL_CLIENT_SECRET");
const PAYPAL_WEBHOOK_ID = defineSecret("PAYPAL_WEBHOOK_ID");
// "live" (producción) o "sandbox" (pruebas). Se puede cambiar con la variable
// de entorno PAYPAL_ENV en functions/.env; sin ella se usa producción.
const PAYPAL_ENV = process.env.PAYPAL_ENV || "live";

// Monto en USD -> plan. Debe coincidir con los precios de los enlaces de pago.
const PLAN_BY_AMOUNT = {
  "10.00": { id: "1month", months: 1 },
  "20.00": { id: "3months", months: 3 },
  "50.00": { id: "1year", months: 12 },
  "100.00": { id: "lifetime", months: null },
};

// Eventos que confirman dinero recibido. CHECKOUT.ORDER.APPROVED se ignora a
// propósito: el comprador aprobó pero el cobro aún no se ha capturado.
const PAID_EVENTS = new Set(["PAYMENT.CAPTURE.COMPLETED", "PAYMENT.SALE.COMPLETED"]);

function paypalApiBase() {
  return PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

async function paypalAccessToken() {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID.value()}:${PAYPAL_CLIENT_SECRET.value()}`
  ).toString("base64");
  const res = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal OAuth falló: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

// Pide a PayPal que confirme que este evento lo firmó PayPal para nuestro webhook.
// Se envía el cuerpo crudo tal cual llegó: cualquier re-serialización rompe la firma.
async function verifyPaypalSignature(req, token) {
  const h = (name) => req.get(name) || "";
  const payload =
    `{"auth_algo":${JSON.stringify(h("paypal-auth-algo"))},` +
    `"cert_url":${JSON.stringify(h("paypal-cert-url"))},` +
    `"transmission_id":${JSON.stringify(h("paypal-transmission-id"))},` +
    `"transmission_sig":${JSON.stringify(h("paypal-transmission-sig"))},` +
    `"transmission_time":${JSON.stringify(h("paypal-transmission-time"))},` +
    `"webhook_id":${JSON.stringify(PAYPAL_WEBHOOK_ID.value())},` +
    `"webhook_event":${req.rawBody.toString("utf8")}}`;

  const res = await fetch(`${paypalApiBase()}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: payload,
  });
  if (!res.ok) {
    // PayPal no pudo validar (cabeceras mal formadas, etc.): se trata como firma inválida.
    console.warn(`Verificación de firma rechazada: ${res.status} ${await res.text()}`);
    return false;
  }
  return (await res.json()).verification_status === "SUCCESS";
}

// Los eventos de captura no traen el correo del comprador; se obtiene de la orden.
async function fetchOrderPayerEmail(orderId, token) {
  if (!orderId) return null;
  const res = await fetch(`${paypalApiBase()}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.warn(`No se pudo leer la orden ${orderId}: ${res.status}`);
    return null;
  }
  const order = await res.json();
  return order.payer?.email_address || null;
}

function extractPayment(body) {
  const r = body.resource || {};
  const amount = r.amount || r.purchase_units?.[0]?.amount || {};
  return {
    email:
      r.payer?.email_address ||
      r.purchaser?.email_address ||
      r.subscriber?.email_address ||
      null,
    orderId: r.supplementary_data?.related_ids?.order_id || null,
    amountValue: amount.value != null ? Number(amount.value).toFixed(2) : null,
    currency: amount.currency_code || null,
    transactionId: r.id || null,
  };
}

// Activa o extiende el plan del usuario. Un pago encima de una suscripción
// vigente se suma al final de la vigencia; un lifetime nunca se degrada.
async function grantAccess(email, plan, payment, eventType) {
  const ref = db.collection("authorized_users").doc(email);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists ? snap.data() : {};
    const now = new Date();

    const keepsLifetime = current.type === "lifetime" && current.status === "active";
    let type, subscriptionEnd;

    if (plan.months === null || keepsLifetime) {
      type = "lifetime";
      subscriptionEnd = null;
    } else {
      type = "subscription";
      const currentEnd = current.subscriptionEnd?.toDate?.() || null;
      const base =
        current.type === "subscription" && current.status === "active" && currentEnd && currentEnd > now
          ? currentEnd
          : now;
      subscriptionEnd = new Date(base);
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + plan.months);
    }

    tx.set(
      ref,
      {
        email,
        status: "active",
        type,
        subscriptionPlan: keepsLifetime ? current.subscriptionPlan || "lifetime" : plan.id,
        subscriptionStart: admin.firestore.FieldValue.serverTimestamp(),
        subscriptionEnd,
        trialStart: null,
        trialEnd: null,
        authorizedAt: admin.firestore.FieldValue.serverTimestamp(),
        paypalEvent: eventType,
        paypalTransactionId: payment.transactionId,
        paypalAmount: `${payment.amountValue} ${payment.currency}`,
        lastPaymentAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
}

exports.paypalWebhook = functions.https.onRequest(
  { secrets: [PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID] },
  async (req, res) => {
    if (req.method === "GET") {
      return res.status(200).json({ status: "ok", message: "PayPal webhook activo" });
    }
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    const body = req.body || {};
    const eventId = body.id;
    const eventType = body.event_type;

    // Sin cabeceras de firma no vale la pena ni preguntarle a PayPal.
    const SIGNATURE_HEADERS = ["paypal-transmission-id", "paypal-transmission-sig", "paypal-cert-url", "paypal-auth-algo", "paypal-transmission-time"];
    if (SIGNATURE_HEADERS.some((h) => !req.get(h)) || !eventId || !req.rawBody) {
      console.warn("Webhook rechazado: faltan cabeceras de firma", { eventId, eventType });
      return res.status(400).json({ success: false, error: "missing signature" });
    }

    try {
      const token = await paypalAccessToken();

      const verified = await verifyPaypalSignature(req, token);
      if (!verified) {
        console.warn("Webhook rechazado: firma inválida", { eventId, eventType });
        return res.status(400).json({ success: false, error: "invalid signature" });
      }

      if (!PAID_EVENTS.has(eventType)) {
        return res.status(200).json({ success: true, ignored: eventType });
      }

      // PayPal reintenta si no recibe 200; cada evento se procesa una sola vez.
      const eventRef = db.collection("paypal_events").doc(eventId);
      if ((await eventRef.get()).exists) {
        return res.status(200).json({ success: true, duplicate: true });
      }

      const payment = extractPayment(body);
      if (!payment.email) {
        payment.email = await fetchOrderPayerEmail(payment.orderId, token);
      }
      const email = payment.email ? payment.email.toLowerCase().trim() : null;
      const plan = payment.currency === "USD" ? PLAN_BY_AMOUNT[payment.amountValue] : null;

      const record = {
        eventType,
        email,
        amount: payment.amountValue,
        currency: payment.currency,
        transactionId: payment.transactionId,
        orderId: payment.orderId,
        receivedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (!email || !plan) {
        // Pago real pero no se pudo mapear: queda registrado para activarlo a mano.
        await eventRef.set({ ...record, status: "needs_review",
          reason: !email ? "sin correo del comprador" : "monto no coincide con ningún plan" });
        console.warn("Pago requiere revisión manual:", record);
        return res.status(200).json({ success: true, needsReview: true });
      }

      await grantAccess(email, plan, payment, eventType);
      await eventRef.set({ ...record, status: "processed", plan: plan.id });
      console.log(`Acceso activado: ${email} -> ${plan.id}`);
      return res.status(200).json({ success: true, email, plan: plan.id });
    } catch (error) {
      // 500 hace que PayPal reintente más tarde. No se exponen detalles internos.
      console.error("Error procesando webhook:", error);
      return res.status(500).json({ success: false });
    }
  }
);
