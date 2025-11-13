import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Stock from '@/models/Stock';
import Product from '@/models/Product';
import { auth } from '@/lib/jwt';

export async function GET() {
  try {
    await connectToDatabase();
    const stocks = await Stock.find()
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: stocks
    });
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch stock data' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const user = await auth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.productId || !data.quantity) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product ID and quantity are required' 
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(data.productId);
    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product not found' 
        },
        { status: 404 }
      );
    }

    // Create or update stock record
    let stockRecord = await Stock.findOne({ productId: data.productId });

    if (stockRecord) {
      // Update existing stock
      stockRecord.quantity += data.quantity;
      stockRecord.updatedAt = new Date();
      await stockRecord.save();
    } else {
      // Create new stock record
      stockRecord = await Stock.create({
        productId: data.productId,
        quantity: data.quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Fetch updated stock with product details
    const updatedStock = await Stock.findById(stockRecord._id)
      .populate('productId', 'name sku')
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedStock
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update stock' 
      },
      { status: 500 }
    );
  }
}