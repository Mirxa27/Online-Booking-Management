import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/userStore'; // Assuming @ refers to src path
import { User } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Verification token is missing' }, { status: 400 });
    }

    // Find user by token - In a real DB, you'd query this.
    // Here, we iterate. This is inefficient for large numbers of users.
    // Consider adding a method to userDb like findByEmailVerificationToken if this becomes a bottleneck.
    let userToVerify: User | undefined = undefined;
    const allUsers = userDb.getAllUsers(); // Get all users from the mock store
    for (const u of allUsers) {
        if (u.emailVerificationToken === token) {
            userToVerify = u;
            break;
        }
    }

    if (!userToVerify) {
      return NextResponse.json({ message: 'Invalid or expired verification token.' }, { status: 400 });
    }

    if (!userToVerify.emailVerificationTokenExpiry || new Date() > new Date(userToVerify.emailVerificationTokenExpiry)) {
      // Optionally, clear the expired token from the user record
      await userDb.updateUser(userToVerify.id, {
        emailVerificationToken: undefined,
        emailVerificationTokenExpiry: undefined,
        // Potentially revert status if needed, or leave as is
      });
      return NextResponse.json({ message: 'Verification token has expired.' }, { status: 400 });
    }

    // Mark email as verified
    await userDb.updateUser(userToVerify.id, {
      emailVerified: true,
      emailVerificationToken: undefined, // Clear the token
      emailVerificationTokenExpiry: undefined,
      verificationStatus: 'email_verified', // Update status
    });

    // In a real app, you might redirect to a success page.
    // For an API, returning a success message is typical.
    return NextResponse.json({ message: 'Email verified successfully. You can now login.' }, { status: 200 });

  } catch (error) {
    console.error('Email Verification error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
