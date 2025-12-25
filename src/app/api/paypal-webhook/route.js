import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializar Firebase Admin (solo una vez)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminDb = getFirestore();

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
      let payerName = null;
      
      // Intentar obtener email de diferentes estructuras de PayPal
      if (body.resource?.payer?.email_address) {
        email = body.resource.payer.email_address;
        payerName = body.resource.payer.name?.given_name || '';
      } else if (body.resource?.purchaser?.email_address) {
        email = body.resource.purchaser.email_address;
      } else if (body.resource?.subscriber?.email_address) {
        email = body.resource.subscriber.email_address;
      }
      
      if (email) {
        // Agregar a usuarios autorizados
        await adminDb.collection('authorized_users').doc(email.toLowerCase()).set({
          email: email.toLowerCase(),
          name: payerName,
          authorizedAt: new Date(),
          paypalTransactionId: body.resource?.id || body.id,
          eventType: eventType,
          status: 'active'
        }, { merge: true });
        
        console.log('✅ Usuario autorizado:', email);
        
        return NextResponse.json({ 
          success: true, 
          message: `Usuario ${email} autorizado correctamente` 
        });
      } else {
        console.log('⚠️ No se encontró email en el webhook');
        return NextResponse.json({ 
          success: false, 
          message: 'No se encontró email del comprador' 
        }, { status: 400 });
      }
    }
    
    // Para otros eventos, solo confirmar recepción
    console.log('ℹ️ Evento recibido (no requiere acción):', eventType);
    return NextResponse.json({ success: true, message: 'Evento recibido' });
    
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// Manejar verificación de PayPal (GET request para verificar endpoint)
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'PayPal webhook endpoint activo' 
  });
}