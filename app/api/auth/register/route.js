import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { hash } from 'bcryptjs';
import { z } from 'zod';

// Validation schema for registration data
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user'], 'Invalid role'),
});

export async function POST(request) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse and validate request body
    const requestData = await request.json();
    const validatedData = registerSchema.parse(requestData);

    const { name, email, password, role } = validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Return success response with user data (excluding password)
    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}