import { NextResponse } from 'next/server';

// Este webhook recibe notificaciones de PayPal
// Los emails autorizados se guardan y se verifican desde el cliente

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('📩 Webhook recibido de PayPal:', JSON.stringify(body, null, 2));
    
    // Verificar que es un evento de pago completado
    const eventType = body.event_type;
    
    if (eventType === 'CHECKOUT.ORDER.APPROVED' || 
        eventType === 'PAYMENT.CAPTURE.COMPLETED' ||
        eventType === 'PAYMENT.SALE.COMPLETED') {
      
      // Extraer email del comprador
      let email = null;
      
      if (body.resource?.payer?.email_address) {
        email = body.resource.payer.email_address;
      } else if (body.resource?.purchaser?.email_address) {
        email = body.resource.purchaser.email_address;
      }
      
      if (email) {
        console.log('✅ Pago recibido de:', email);
        
        // Por ahora solo logueamos - agregaremos a Firestore manualmente
        // o configuraremos una Cloud Function después
        
        return NextResponse.json({ 
          success: true, 
          message: `Pago recibido de ${email}`,
          email: email.toLowerCase()
        });
      }
    }
    
    return NextResponse.json({ success: true, message: 'Evento recibido' });
    
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'PayPal webhook endpoint activo' 
  });
}