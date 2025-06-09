import { NextRequest, NextResponse } from 'next/server';
import { reviewDb } from '@/lib/reviewStore';
import { listingDb } from '@/lib/listingStore'; // To verify listing exists

export async function GET(
  req: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    const { listingId } = params;
    if (!listingId) {
      return NextResponse.json({ message: 'Listing ID is required' }, { status: 400 });
    }

    const listing = await listingDb.findById(listingId);
    if (!listing) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
    }

    const reviews = await reviewDb.getReviewsByListingId(listingId);
    const averageRatingData = await reviewDb.calculateAverageRatings(listingId);

    // Enrich reviews with guest avatars/names if needed (mocked or fetched from userDb)
    // For now, reviewStore dummy data might already have guestName.

    return NextResponse.json({
      reviews,
      averageRatings: averageRatingData?.averageRatings || null, // Overall and per category
      totalReviews: averageRatingData?.totalReviews || 0,
    }, { status: 200 });

  } catch (error) {
    console.error('Get Listing Reviews API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
