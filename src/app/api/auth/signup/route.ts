// NOTE: Required dependencies: bcryptjs, jsonwebtoken
// Install with: npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
// NOTE: Required dependencies: bcryptjs
// Install with: npm install bcryptjs @types/bcryptjs
// This route uses the mock userStore.

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userDb } from '@/lib/userStore'; // Assuming @ refers to src path
import { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await userDb.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user using the store
    // The createUser function in userStore now handles the structure.
    const newUserInput: Partial<User> = {
        email,
        password: hashedPassword,
        name: name || '', // Optional name field during signup
    };

    const newUser = await userDb.createUser(newUserInput as any); // Cast to any to satisfy Omit, actual User type is created in store

    // For simplicity, not logging in or returning JWT. Client should redirect to login.
    return NextResponse.json({ message: 'User created successfully. Please login.', userId: newUser.id }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    // Log the current state of the mock DB for debugging if needed
    // console.log('Current users in store during error:', userDb.getAllUsers());
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
