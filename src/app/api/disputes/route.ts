import { NextRequest, NextResponse } from 'next/server';
import { disputeDb } from '@/lib/disputeStore';
import { bookingDb } from '@/lib/bookingStore';
import { DisputeReason } from '@/lib/types';

// Helper: Check if trip is within dispute window (e.g., 14 days after checkout)
const isWithinDisputeWindow = (checkoutDateStr: string, daysWindow: number = 14): boolean => {
  const checkoutDate = new Date(checkoutDateStr);
  const today = new Date();
  // Ensure checkout has actually passed or is today for cancelled trips that might not have "completed"
  if (checkoutDate > today && checkoutDate.toDateString() !== today.toDateString()) {
      return false; // Cannot raise dispute for future stays unless already cancelled and problematic
  }
  const daysSinceCheckout = (today.getTime() - checkoutDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceCheckout <= daysWindow;
};


export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const {
      bookingId,
      reason, // as DisputeReason
      explanation,
      desiredResolution,
    } = await req.json();

    if (!bookingId || !reason || !explanation) {
      return NextResponse.json({ message: 'Booking ID, reason, and explanation are required.' }, { status: 400 });
    }

    const booking = await bookingDb.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }

    // Validate user is the guest for the booking
    if (booking.guestId !== userId) {
      return NextResponse.json({ message: 'You can only raise disputes for your own bookings.' }, { status: 403 });
    }

    // Validate booking status: must be completed or cancelled
    if (booking.status !== 'completed' && booking.status !== 'cancelled_by_guest' && booking.status !== 'cancelled_by_host' && booking.status !== 'no_show') {
      return NextResponse.json({ message: 'Disputes can only be raised for completed or cancelled trips.' }, { status: 400 });
    }

    // Validate if within dispute window (e.g., 14 days after checkout)
    if (!isWithinDisputeWindow(booking.checkOutDate, 14)) {
      return NextResponse.json({ message: 'The window for raising a dispute for this trip has passed (must be within 14 days of checkout).' }, { status: 400 });
    }

    // Check if a dispute already exists for this booking
    const existingDispute = await disputeDb.getDisputeByBookingId(bookingId);
    if (existingDispute) {
      return NextResponse.json({ message: 'A dispute already exists for this booking.', disputeId: existingDispute.id }, { status: 409 });
    }

    if (booking.disputeId) { // Fallback check on booking object itself
         return NextResponse.json({ message: 'Booking already has an associated dispute.', disputeId: booking.disputeId }, { status: 409 });
    }


    const newDispute = await disputeDb.addDispute({
      bookingId,
      listingId: booking.listingId,
      guestId, // This is userId
      hostId: booking.hostId,
      raisedByUserId: userId,
      reason: reason as DisputeReason,
      explanation,
      desiredResolution: desiredResolution || undefined,
    });

    // Update the booking with the new disputeId
    await bookingDb.updateBooking(bookingId, { disputeId: newDispute.id });

    // TODO: Notify host and admin (mock)
    console.log(`Dispute ${newDispute.id} raised. Host ${newDispute.hostId} and admin should be notified.`);

    return NextResponse.json({ message: 'Dispute raised successfully.', dispute: newDispute }, { status: 201 });

  } catch (error) {
    console.error('Raise Dispute API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
