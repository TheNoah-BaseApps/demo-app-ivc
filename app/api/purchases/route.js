import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import Product from '@/models/Product';
import { verifyAuth } from '@/lib/jwt';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const purchases = await Purchase.find()
      .populate('productId', 'name')
      .populate('supplierId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Purchase.countDocuments();

    return NextResponse.json({
      data: purchases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
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

    const purchase = new Purchase({
      ...data,
      createdBy: user.id
    });

    const savedPurchase = await purchase.save();

    // Update product stock
    const product = await Product.findById(data.productId);
    if (product) {
      product.stock += data.quantity;
      await product.save();
    }

    return NextResponse.json(savedPurchase, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 });
  }
}