import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { z } from 'zod';

export async function GET(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Fetch all users (excluding password)
    const users = await User.find({}, { password: 0 }).lean();

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Parse request body
    const userData = await request.json();

    // Validate input data
    const userSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      role: z.enum(['admin', 'manager', 'user'], 'Invalid role')
    });

    const validatedData = userSchema.parse(userData);

    // Check if user with email already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      role: validatedData.role
    });

    await newUser.save();

    // Return created user without password
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}