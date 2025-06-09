// PUT endpoint for hosts to decline a booking request
import { NextRequest, NextResponse } from 'next/server';
import { bookingDb } from '@/lib/bookingStore';
import { BookingStatus } from '@/lib/types';

export async function PUT(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const hostId = req.headers.get('x-user-id');
    if (!hostId) {
      return NextResponse.json({ message: 'Authentication required: Host User ID not found' }, { status: 401 });
    }

    const { requestId } = params; // This is the booking ID
    if (!requestId) {
      return NextResponse.json({ message: 'Booking Request ID is required' }, { status: 400 });
    }

    const { reason } = await req.json(); // Optional reason for declining

    const booking = await bookingDb.findById(requestId);

    if (!booking) {
      return NextResponse.json({ message: 'Booking request not found' }, { status: 404 });
    }

    // Security check: Ensure the user declining is the host of the booking
    if (booking.hostId !== hostId) {
      return NextResponse.json({ message: 'Forbidden: You are not the host for this booking' }, { status: 403 });
    }

    if (booking.status !== 'pending_approval') {
      return NextResponse.json({ message: `Booking request is not pending approval (current status: ${booking.status})` }, { status: 400 });
    }

    const declinedBooking = await bookingDb.updateBookingStatus(
      requestId,
      'declined_by_host' as BookingStatus,
      reason || "Declined by host"
    );

    if (!declinedBooking) {
         return NextResponse.json({ message: 'Failed to decline booking' }, { status: 500 });
    }

    // TODO: Notify guest that their booking request was declined
    console.log(`Guest ${declinedBooking.guestId} should be notified that booking request ${declinedBooking.id} was declined by host ${hostId}.`);

    return NextResponse.json({ message: 'Booking request declined successfully', booking: declinedBooking }, { status: 200 });

  } catch (error) {
    console.error('Decline Booking Request API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload for decline reason' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
