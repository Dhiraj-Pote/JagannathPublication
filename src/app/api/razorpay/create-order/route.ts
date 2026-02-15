import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Lazy-initialize Razorpay so the build doesn't crash without env vars
function getRazorpay() {
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
    key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
  });
}

interface CreateOrderRequestBody {
  amount: number;
  items: { book_id: string; title: string; price: number; quantity: number }[];
  shipping_name: string;
  shipping_address: string;
  shipping_pincode: string;
  user_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequestBody = await request.json();

    // Validate required fields
    if (
      !body.amount ||
      !body.items ||
      !body.shipping_name ||
      !body.shipping_address ||
      !body.shipping_pincode ||
      !body.user_id
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than zero' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items must be a non-empty array' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const razorpayOrder = await getRazorpay().orders.create({
      amount: body.amount, // amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    // Mock: Insert a Pending order in Supabase
    // In production, this would use the Supabase service role client to insert into the orders table
    const dbOrderId = `db_order_${Date.now()}`;
    // const { data, error } = await supabase.from('orders').insert({
    //   user_id: body.user_id,
    //   items: body.items,
    //   total_amount: body.amount,
    //   shipping_name: body.shipping_name,
    //   shipping_address: body.shipping_address,
    //   shipping_pincode: body.shipping_pincode,
    //   razorpay_order_id: razorpayOrder.id,
    //   status: 'Pending',
    // }).select().single();

    return NextResponse.json({
      order_id: dbOrderId,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Unable to initiate payment, please try again' },
      { status: 500 }
    );
  }
}
