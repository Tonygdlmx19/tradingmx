import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Webhook recibido:', JSON.stringify(body, null, 2));
    
    const eventType = body.event_type;
    
    if (eventType === 'CHECKOUT.ORDER.APPROVED' || 
        eventType === 'PAYMENT.CAPTURE.COMPLETED' ||
        eventType === 'PAYMENT.SALE.COMPLETED') {
      
      let email = body.resource?.payer?.email_address || 
                  body.resource?.purchaser?.email_address;
      
      if (email) {
        console.log('Pago recibido de:', email);
        return NextResponse.json({ success: true, email: email.toLowerCase() });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
