import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay-utils';

interface VerifyPaymentRequestBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  db_order_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyPaymentRequestBody = await request.json();

    // Validate required fields
    if (
      !body.razorpay_order_id ||
      !body.razorpay_payment_id ||
      !body.razorpay_signature ||
      !body.db_order_id
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not configured');
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 500 }
      );
    }

    // Verify the Razorpay payment signature using HMAC-SHA256
    const isValid = verifyRazorpaySignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature,
      secret
    );

    if (!isValid) {
      console.error('Payment signature verification failed');
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Mock: Update order status to "Paid" in Supabase
    // In production, this would use the Supabase service role client:
    // const { error } = await supabase
    //   .from('orders')
    //   .update({
    //     status: 'Paid',
    //     razorpay_payment_id: body.razorpay_payment_id,
    //   })
    //   .eq('id', body.db_order_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
