const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

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
