// This route is protected by the middleware.ts
// It uses the x-user-id header set by the middleware.

import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/userStore'; // Assuming @ refers to src path
import { User } from '@/lib/types';

// GET handler to fetch current user's profile
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      // This should technically be caught by middleware, but as a safeguard:
      return NextResponse.json({ message: 'User ID not found in request' }, { status: 401 });
    }

    const user = await userDb.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Exclude password and other sensitive fields if necessary
    const { password, emailVerificationToken, emailVerificationTokenExpires, ...profileData } = user;

    return NextResponse.json(profileData, { status: 200 });

  } catch (error) {
    console.error('Get Profile error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT handler to update current user's profile
export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ message: 'User ID not found in request' }, { status: 401 });
    }

    const updates = await req.json();

    // Fields that can be updated by the user
    const allowedUpdates: (keyof User)[] = ['name', 'phone', 'bio', 'languagePreferences', 'profilePhotoUrl'];
    const filteredUpdates: Partial<User> = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        (filteredUpdates as any)[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    const updatedUser = await userDb.updateUser(userId, filteredUpdates);

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found or update failed' }, { status: 404 });
    }

    const { password, emailVerificationToken, emailVerificationTokenExpires, ...profileData } = updatedUser;

    return NextResponse.json(profileData, { status: 200 });

  } catch (error) {
    console.error('Update Profile error:', error);
    if (error instanceof SyntaxError) { // Handle cases where req.json() fails
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
