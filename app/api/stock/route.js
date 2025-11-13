import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Stock from '@/models/Stock';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();

    const stocks = await Stock.find()
      .populate('productId', 'name sku')
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      data: stocks
    });
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch stock data',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const data = await request.json();

    // Validate required fields
    if (!data.productId || !data.quantity || data.quantity < 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product ID and valid quantity are required' 
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

    // Check if stock already exists for this product
    let stock = await Stock.findOne({ productId: data.productId });

    if (stock) {
      // Update existing stock
      stock.quantity = data.quantity;
      stock.updatedAt = new Date();
      await stock.save();
    } else {
      // Create new stock record
      stock = new Stock({
        productId: data.productId,
        quantity: data.quantity
      });
      await stock.save();
    }

    // Populate the product name for response
    const populatedStock = await Stock.findById(stock._id)
      .populate('productId', 'name sku');

    return NextResponse.json({
      success: true,
      message: 'Stock updated successfully',
      data: populatedStock
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update stock',
        error: error.message 
      },
      { status: 500 }
    );
  }
}