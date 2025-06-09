// POST endpoint for requesting a booking (non-instant)
import { NextRequest, NextResponse } from 'next/server';
import { bookingDb } from '@/lib/bookingStore';
import { listingDb } from '@/lib/listingStore';
import { userDb } from '@/lib/userStore'; // To get hostId if not directly on listing
import { BookingStatus } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const guestId = req.headers.get('x-user-id');
    if (!guestId) {
      return NextResponse.json({ message: 'Authentication required: User ID not found' }, { status: 401 });
    }

    const {
      listingId,
      checkInDate, // Expect YYYY-MM-DD string
      checkOutDate, // Expect YYYY-MM-DD string
      numberOfGuests,
      pricePerNight, // Price at the time of booking
      cleaningFee,
      serviceFee,
      totalPrice
    } = await req.json();

    if (!listingId || !checkInDate || !checkOutDate || !numberOfGuests || totalPrice === undefined) {
      return NextResponse.json({ message: 'Missing required booking details' }, { status: 400 });
    }

    const listing = await listingDb.findById(listingId);
    if (!listing) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
    }

    if (numberOfGuests > listing.maxGuests) {
        return NextResponse.json({ message: `Number of guests (${numberOfGuests}) exceeds maximum allowed (${listing.maxGuests}) for this listing.` }, { status: 400 });
    }

    // Basic date validation
    const today = new Date(); today.setHours(0,0,0,0);
    const parsedCheckIn = new Date(checkInDate);
    const parsedCheckOut = new Date(checkOutDate);
    if (parsedCheckIn < today || parsedCheckOut <= parsedCheckIn) {
        return NextResponse.json({ message: 'Invalid check-in or check-out dates.' }, { status: 400 });
    }

    // In a real app, verify availability, calculate price on backend, check for overlapping bookings, etc.

    const newBookingRequest = await bookingDb.createBooking({
      listingId,
      guestId,
      hostId: listing.hostId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      pricePerNight,
      cleaningFee: cleaningFee || 0,
      serviceFee: serviceFee || 0,
      totalPrice,
      status: 'pending_approval' as BookingStatus,
    });

    // TODO: Notify host (e.g., via email, push notification) - mock this for now
    console.log(`Host ${listing.hostId} should be notified for booking request ${newBookingRequest.id}`);

    return NextResponse.json({ message: 'Booking request submitted successfully. Awaiting host approval.', booking: newBookingRequest }, { status: 201 });

  } catch (error) {
    console.error('Booking Request API error:', error);
    if (error instanceof SyntaxError) { // Handle cases where req.json() fails
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
