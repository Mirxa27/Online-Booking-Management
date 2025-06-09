// NOTE: Required dependencies: bcryptjs, jsonwebtoken
// Install with: npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
// Remember to set a JWT_SECRET environment variable.

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userDb } from '@/lib/userStore'; // Assuming @ refers to src path
import { User } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-for-dev';
if (JWT_SECRET === 'your-default-secret-key-for-dev' && process.env.NODE_ENV !== 'test') {
  console.warn("Using default JWT_SECRET. Set a strong secret in your environment variables for production.");
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await userDb.findByEmail(email);

    if (!user || !user.password) { // user.password might be undefined if not set during creation
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Payload
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword, // Send user data (without password)
      token
    }, { status: 200 });

    // Set JWT in an HTTP-Only cookie for security
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Or 'lax' depending on your needs
      maxAge: 3600, // 1 hour in seconds
      path: '/', // Cookie available across the entire site
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
