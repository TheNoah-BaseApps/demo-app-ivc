import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const sales = await Sale.find()
      .populate('productId', 'name')
      .populate('customerId', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Sale.countDocuments();

    return NextResponse.json({
      sales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();

    const product = await Product.findById(data.productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.stock < data.quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    const sale = new Sale({
      ...data,
      totalAmount: product.price * data.quantity,
      createdBy: decoded.userId
    });

    const savedSale = await sale.save();

    // Update product stock
    product.stock -= data.quantity;
    await product.save();

    return NextResponse.json({
      message: 'Sale created successfully',
      sale: {
        ...savedSale.toObject(),
        product: {
          name: product.name,
          price: product.price
        }
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation failed', details: Object.values(error.errors) }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}