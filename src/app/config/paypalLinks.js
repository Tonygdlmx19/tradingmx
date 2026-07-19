// Enlaces de pago de PayPal — ÚNICO lugar donde se definen.
// Para actualizarlos: PayPal Business > Herramientas de venta > Enlaces y botones de pago.
//
// null = enlace no disponible (cuenta PayPal limitada, 2026-07-18). Mientras un
// plan no tenga enlace, el botón de pago abre WhatsApp con un mensaje prellenado.
// Al recuperar la cuenta, basta con poner aquí los enlaces nuevos.
export const PAYPAL_LINKS = {
  '1month': null,
  '3months': null,
  '1year': null,
  lifetime: null,
};

export const PAYMENT_WHATSAPP = '523316145522';

export function isPayPalAvailable(planId) {
  return Boolean(PAYPAL_LINKS[planId]);
}

// Abre el pago del plan: PayPal si hay enlace, si no WhatsApp con mensaje prellenado.
export function openPayment(plan, lang = 'es') {
  if (!plan) return;
  if (PAYPAL_LINKS[plan.id]) {
    window.open(PAYPAL_LINKS[plan.id], '_blank');
    return;
  }
  const message = lang === 'en'
    ? `Hi, I want to purchase the ${plan.name} plan ($${plan.price} USD) of Trading Journal PRO. How can I pay?`
    : `Hola, quiero contratar el plan ${plan.name} ($${plan.price} USD) de Trading Journal PRO. ¿Me indican cómo pagar?`;
  window.open(`https://wa.me/${PAYMENT_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
}
