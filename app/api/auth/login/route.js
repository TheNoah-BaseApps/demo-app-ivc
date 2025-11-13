import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { compare } from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      name: user.name
    });

    // Return success response with token and user info
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    }, {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600`
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error during login' 
      },
      { status: 500 }
    );
  }
}