// NOTE: Required dependency: jsonwebtoken
// Install with: npm install jsonwebtoken @types/jsonwebtoken
// This middleware protects routes by verifying JWT.

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AuthJWTPayload } from '@/lib/types'; // Assuming @ refers to src

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-for-dev';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    console.log('Middleware: No token found');
    return NextResponse.json({ message: 'Authentication required: No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthJWTPayload;
    // Attach user information to the request headers to be accessed in API routes
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-email', decoded.email);

    // console.log(`Middleware: Token verified for userId: ${decoded.userId}`);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Middleware: Invalid token', error);
    // Clear the invalid token cookie
    const response = NextResponse.json({ message: 'Authentication failed: Invalid token' }, { status: 401 });
    response.cookies.delete('token');
    return response;
  }
}

// Specify which paths the middleware should apply to
export const config = {
  matcher: [
    '/api/profile/:path*', // Protect all routes under /api/profile
    // Add other paths that need protection
    // Example: '/api/some-other-protected-route/:path*'
  ],
};
