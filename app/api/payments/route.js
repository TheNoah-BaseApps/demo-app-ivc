import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { verifyAuth } from '@/lib/jwt';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const payments = await Payment.find()
      .populate('sale', 'id customer amount date')
      .populate('purchase', 'id supplier amount date')
      .sort({ date: -1 });

    return NextResponse.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();

    // Validate required fields
    if (!data.amount || !data.date || !data.type) {
      return NextResponse.json(
        { error: 'Amount, date, and type are required' },
        { status: 400 }
      );
    }

    // Validate payment type
    if (!['sale', 'purchase'].includes(data.type)) {
      return NextResponse.json(
        { error: 'Invalid payment type. Must be "sale" or "purchase"' },
        { status: 400 }
      );
    }

    // Create payment
    const payment = new Payment({
      ...data,
      amount: parseFloat(data.amount),
      date: new Date(data.date)
    });

    const savedPayment = await payment.save();

    return NextResponse.json({
      success: true,
      data: savedPayment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}