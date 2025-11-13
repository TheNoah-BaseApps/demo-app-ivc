import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { validateProduct } from '@/lib/validation';

export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch products',
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

    // Validate product data
    const validation = validateProduct(data);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    // Check if product code already exists
    const existingProduct = await Product.findOne({ 
      code: data.code 
    });

    if (existingProduct) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product with this code already exists' 
        },
        { status: 409 }
      );
    }

    // Create new product
    const product = new Product({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedProduct = await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create product',
        error: error.message 
      },
      { status: 500 }
    );
  }
}