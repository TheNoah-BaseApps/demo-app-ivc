import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cost from '@/models/Cost';
import { authenticateToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    // Authenticate and get user from token
    const user = await authenticateToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Fetch all costs with populated product information
    const costs = await Cost.find()
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: costs
    });
  } catch (error) {
    console.error('Error fetching costs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch costs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Authenticate and get user from token
    const user = await authenticateToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const data = await request.json();

    // Validate required fields
    if (!data.productId || !data.amount || !data.type) {
      return NextResponse.json(
        { error: 'productId, amount, and type are required' },
        { status: 400 }
      );
    }

    // Create new cost record
    const cost = new Cost({
      productId: data.productId,
      amount: data.amount,
      type: data.type,
      description: data.description || '',
      createdBy: user.id
    });

    // Save to database
    const savedCost = await cost.save();

    // Populate the product information
    const populatedCost = await Cost.findById(savedCost._id)
      .populate('productId', 'name sku')
      .populate('createdBy', 'name email');

    return NextResponse.json({
      success: true,
      data: populatedCost
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating cost:', error);
    return NextResponse.json(
      { error: 'Failed to create cost' },
      { status: 500 }
    );
  }
}