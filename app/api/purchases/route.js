import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import Product from '@/models/Product';
import Stock from '@/models/Stock';
import { validatePurchaseData } from '@/lib/validation';

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const purchases = await Purchase.find()
      .populate('productId', 'name code')
      .populate('supplierId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Purchase.countDocuments();

    return NextResponse.json({
      success: true,
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
    return NextResponse.json(
      { success: false, message: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const data = await request.json();

    const validation = await validatePurchaseData(data);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(data.productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Create purchase
    const purchase = new Purchase({
      ...data,
      totalAmount: data.quantity * data.unitPrice,
      createdBy: data.createdBy || null
    });

    const savedPurchase = await purchase.save();

    // Update stock
    const stockUpdate = await Stock.findOneAndUpdate(
      { productId: data.productId },
      { 
        $inc: { currentStock: data.quantity },
        $push: { stockTransactions: {
          type: 'purchase',
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          reference: savedPurchase._id,
          date: new Date()
        }}
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      data: savedPurchase
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create purchase' },
      { status: 500 }
    );
  }
}