import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { verifyAuth } from '@/lib/jwt';
import { z } from 'zod';

const paymentSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['sale', 'purchase', 'other']),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reference: z.string().optional(),
  customerId: z.string().optional(),
  supplierId: z.string().optional(),
});

export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('customerId', 'name')
      .populate('supplierId', 'name');

    const total = await Payment.countDocuments();

    return NextResponse.json({
      data: payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
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
    const auth = await verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    await connectToDatabase();

    const rawData = await request.json();
    const validatedData = paymentSchema.parse(rawData);

    const payment = new Payment({
      ...validatedData,
      date: new Date(validatedData.date),
    });

    const savedPayment = await payment.save();

    return NextResponse.json(
      { 
        message: 'Payment created successfully',
        data: savedPayment 
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}