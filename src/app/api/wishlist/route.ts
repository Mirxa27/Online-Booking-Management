// This route is protected by the middleware.ts (if config covers /api/wishlist)
// Ensure your middleware.ts config includes this path, e.g., '/api/wishlist/:path*' or '/api/:path*'

import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/userStore';
import { listingDb } from '@/lib/listingStore'; // To fetch full listing details
import { Listing } from '@/lib/types';

// GET user's wishlist
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required: User ID not found' }, { status: 401 });
    }

    const user = await userDb.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const wishlistIds = user.wishlistIds || [];
    const wishlistListings: Listing[] = [];

    for (const listingId of wishlistIds) {
      const listing = await listingDb.findById(listingId);
      if (listing) {
        wishlistListings.push(listing);
      }
      // Optionally handle cases where a wishlisted listing ID no longer exists
    }

    return NextResponse.json(wishlistListings, { status: 200 });

  } catch (error) {
    console.error('Get Wishlist error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

// POST to add a listing to wishlist
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required: User ID not found' }, { status: 401 });
    }

    const { listingId } = await req.json();
    if (!listingId) {
      return NextResponse.json({ message: 'Listing ID is required' }, { status: 400 });
    }

    // Check if listing exists (optional, but good practice)
    const listingExists = await listingDb.findById(listingId);
    if (!listingExists) {
        return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
    }

    const updatedUser = await userDb.addToListingToWishlist(userId, listingId);
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found or update failed' }, { status: 404 });
    }

    // Fetch the updated full wishlist to return it
    const wishlistIds = updatedUser.wishlistIds || [];
    const wishlistListings: Listing[] = [];
     for (const id of wishlistIds) {
      const listing = await listingDb.findById(id);
      if (listing) {
        wishlistListings.push(listing);
      }
    }

    return NextResponse.json({ message: 'Listing added to wishlist', wishlist: wishlistListings }, { status: 200 });

  } catch (error) {
    console.error('Add to Wishlist error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

// DELETE a listing from wishlist
// We'll use a query parameter for the listingId to remove, e.g., /api/wishlist?listingId=L1
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required: User ID not found' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json({ message: 'Listing ID is required as a query parameter' }, { status: 400 });
    }

    const updatedUser = await userDb.removeListingFromWishlist(userId, listingId);
    if (!updatedUser) {
      // This could mean user not found, or listingId was not in their wishlist (which is fine for a DELETE)
      const userExists = await userDb.findById(userId);
      if (!userExists) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      // If user exists but item wasn't in wishlist, it's still a successful outcome for DELETE.
    }

    // Fetch the updated full wishlist to return it
    const wishlistIds = updatedUser ? (updatedUser.wishlistIds || []) : (await userDb.getWishlistIds(userId));
    const wishlistListings: Listing[] = [];
     for (const id of wishlistIds) {
      const listing = await listingDb.findById(id);
      if (listing) {
        wishlistListings.push(listing);
      }
    }

    return NextResponse.json({ message: 'Listing removed from wishlist', wishlist: wishlistListings }, { status: 200 });

  } catch (error) {
    console.error('Remove from Wishlist error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
