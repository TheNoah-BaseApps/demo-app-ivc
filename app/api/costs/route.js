import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cost from '@/models/Cost';
import { jwtVerify } from 'jose';
import { verify } from 'bcryptjs';

export async function GET(request) {
  try {
    await connectToDatabase();

    const costs = await Cost.find({})
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: costs
    });
  } catch (error) {
    console.error('Error fetching costs:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch costs',
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
    if (!data.name || !data.amount || !data.date) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name, amount, and date are required fields'
        },
        { status: 400 }
      );
    }

    // Create new cost
    const newCost = new Cost({
      name: data.name,
      amount: data.amount,
      date: data.date,
      description: data.description,
      category: data.category,
      product: data.product
    });

    const savedCost = await newCost.save();

    // Populate product name if available
    const populatedCost = await Cost.findById(savedCost._id)
      .populate('product', 'name');

    return NextResponse.json({
      success: true,
      data: populatedCost
    });
  } catch (error) {
    console.error('Error creating cost:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create cost',
        error: error.message 
      },
      { status: 500 }
    );
  }
}