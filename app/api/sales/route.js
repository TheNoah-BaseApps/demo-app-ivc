import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import Stock from '@/models/Stock';
import { validateSale } from '@/lib/validation';

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const sales = await Sale.find()
      .populate('customerId', 'name email')
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sale.countDocuments();

    return NextResponse.json({
      sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const data = await request.json();
    const validationResult = validateSale(data);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { customerId, productId, quantity, unitPrice, discount = 0, notes = '' } = data;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    const stock = await Stock.findOne({ productId });
    if (!stock || stock.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock available' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const subtotal = unitPrice * quantity;
    const discountAmount = subtotal * (discount / 100);
    const totalAmount = subtotal - discountAmount;

    // Create sale
    const sale = new Sale({
      customerId,
      productId,
      quantity,
      unitPrice,
      discount,
      subtotal,
      discountAmount,
      totalAmount,
      notes
    });

    const savedSale = await sale.save();

    // Update stock
    stock.quantity -= quantity;
    await stock.save();

    // Populate the response
    const populatedSale = await Sale.findById(savedSale._id)
      .populate('customerId', 'name email')
      .populate('productId', 'name sku');

    return NextResponse.json(populatedSale, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}