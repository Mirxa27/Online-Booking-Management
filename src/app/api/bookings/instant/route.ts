// POST endpoint for instant booking
import { NextRequest, NextResponse } from 'next/server';
import { bookingDb } from '@/lib/bookingStore';
import { listingDb } from '@/lib/listingStore';
import { userDb } from '@/lib/userStore';
import { BookingStatus } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const guestId = req.headers.get('x-user-id');
    if (!guestId) {
      return NextResponse.json({ message: 'Authentication required: User ID not found' }, { status: 401 });
    }

    const {
      listingId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      pricePerNight,
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

    if (!listing.isInstantBookable) {
      return NextResponse.json({ message: 'This listing is not available for instant booking. Please use "Request to Book".' }, { status: 403 });
    }

    if (numberOfGuests > listing.maxGuests) {
        return NextResponse.json({ message: `Number of guests (${numberOfGuests}) exceeds maximum allowed (${listing.maxGuests}) for this listing.` }, { status: 400 });
    }

    const today = new Date(); today.setHours(0,0,0,0);
    const parsedCheckIn = new Date(checkInDate);
    const parsedCheckOut = new Date(checkOutDate);
    if (parsedCheckIn < today || parsedCheckOut <= parsedCheckIn) {
        return NextResponse.json({ message: 'Invalid check-in or check-out dates.' }, { status: 400 });
    }

    // In a real app: verify availability, check for overlapping bookings, process payment.

    const newBooking = await bookingDb.createBooking({
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
      status: 'confirmed' as BookingStatus, // Key difference from request
      confirmedAt: new Date(), // Confirmed immediately
    });

    // TODO: Notify guest and host of confirmed booking
    console.log(`Booking ${newBooking.id} confirmed instantly. Guest ${guestId} and Host ${listing.hostId} should be notified.`);

    return NextResponse.json({ message: 'Booking confirmed successfully!', booking: newBooking }, { status: 201 });

  } catch (error) {
    console.error('Instant Booking API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
