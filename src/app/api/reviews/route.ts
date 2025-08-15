import { NextRequest, NextResponse } from 'next/server';
import { reviewDb } from '@/lib/reviewStore';
import { bookingDb } from '@/lib/bookingStore';
import { listingDb } from '@/lib/listingStore'; // To update listing's average rating (optional)
import { ReviewRatings } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const guestId = req.headers.get('x-user-id');
    if (!guestId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const {
      bookingId,
      ratings, // Expected: { cleanliness: 5, accuracy: 4, ... }
      publicComment,
      privateFeedback,
    } = await req.json();

    if (!bookingId || !ratings || !publicComment) {
      return NextResponse.json({ message: 'Booking ID, ratings, and public comment are required.' }, { status: 400 });
    }

    // Validate ratings structure and values (1-5)
    const requiredRatingKeys: Array<keyof ReviewRatings> = ['cleanliness', 'accuracy', 'checkIn', 'communication', 'location', 'value'];
    for (const key of requiredRatingKeys) {
        if (typeof ratings[key] !== 'number' || ratings[key] < 1 || ratings[key] > 5) {
            return NextResponse.json({ message: `Invalid rating for ${key}. Must be a number between 1 and 5.`}, { status: 400 });
        }
    }


    const booking = await bookingDb.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }

    if (booking.guestId !== guestId) {
      return NextResponse.json({ message: 'You can only review your own bookings.' }, { status: 403 });
    }

    if (booking.status !== 'completed' && booking.status !== 'previous' /* Allow review for 'previous' if it implies completion */) {
      return NextResponse.json({ message: 'You can only review completed trips.' }, { status: 400 });
    }

    if (booking.hasBeenReviewed) {
      return NextResponse.json({ message: 'This booking has already been reviewed.' }, { status: 400 });
    }

    const existingReview = await reviewDb.getReviewByBookingId(bookingId);
    if(existingReview) {
        // This is a fallback, booking.hasBeenReviewed should be the primary check
        return NextResponse.json({ message: 'A review for this booking already exists.' }, { status: 400 });
    }


    const newReview = await reviewDb.addReview({
      bookingId,
      listingId: booking.listingId,
      guestId,
      hostId: booking.hostId,
      ratings,
      publicComment,
      privateFeedback: privateFeedback || undefined,
    });

    // Mark the booking as reviewed
    await bookingDb.updateBooking(bookingId, { hasBeenReviewed: true });

    // Optional: Update the average rating on the listing itself (denormalization)
    const listing = await listingDb.findById(booking.listingId);
    if (listing) {
        const avgData = await reviewDb.calculateAverageRatings(listing.id);
        if (avgData) {
            // In a real DB, you'd update the listing record. Here, we'd update listingStore if it had such a method.
            // For now, just log it. listingStore.ts's listings would need 'rating' and 'reviewsCount' updated.
            console.log(`Listing ${listing.id} average rating updated to ${avgData.averageRatings.overall}, reviews count ${avgData.totalReviews}`);
            // listing.rating = avgData.averageRatings.overall;
            // listing.reviewsCount = avgData.totalReviews;
            // await listingDb.updateListing(listing.id, { rating: avgData.averageRatings.overall, reviewsCount: avgData.totalReviews }); (if method exists)
        }
    }

    return NextResponse.json({ message: 'Review submitted successfully!', review: newReview }, { status: 201 });

  } catch (error) {
    console.error('Submit Review API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
