// This route is protected by the middleware.ts as it's under /api (implicitly if matcher is /api/:path*)
// However, for requesting email verification, the user might not be fully "active" yet.
// For this example, let's assume it's for an already authenticated user (via JWT from login).
// A public version might be needed if users can request verification before first login,
// or if their session expired.

import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/userStore';
import crypto from 'crypto'; // For generating a random token
import { User } from '@/lib/types';

// Mock email sending function
async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
  console.log(`---- VERIFICATION EMAIL ----`);
  console.log(`To: ${email}`);
  console.log(`Subject: Verify your email address`);
  console.log(`Click this link to verify your email: ${verificationLink}`);
  console.log(`This link will expire in 1 hour.`);
  console.log(`--------------------------`);
  // In a real application, use a service like SendGrid, Mailgun, AWS SES, etc.
  return Promise.resolve();
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const user = await userDb.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email is already verified' }, { status: 400 });
    }

    // Generate a verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // Token expires in 1 hour

    // Update user with token and expiry
    await userDb.updateUser(userId, {
      emailVerificationToken: token,
      emailVerificationTokenExpiry: expiryDate,
      verificationStatus: 'pending_email_verification',
    });

    // Send the verification email (mocked)
    await sendVerificationEmail(user.email, token);

    return NextResponse.json({ message: 'Verification email sent. Please check your inbox.' }, { status: 200 });

  } catch (error) {
    console.error('Request Email Verification error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
