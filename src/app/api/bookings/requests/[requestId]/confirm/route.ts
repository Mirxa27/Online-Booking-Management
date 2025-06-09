// PUT endpoint for hosts to confirm a booking request
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

    const booking = await bookingDb.findById(requestId);

    if (!booking) {
      return NextResponse.json({ message: 'Booking request not found' }, { status: 404 });
    }

    // Security check: Ensure the user confirming is the host of the booking
    if (booking.hostId !== hostId) {
      return NextResponse.json({ message: 'Forbidden: You are not the host for this booking' }, { status: 403 });
    }

    if (booking.status !== 'pending_approval') {
      return NextResponse.json({ message: `Booking request is not pending approval (current status: ${booking.status})` }, { status: 400 });
    }

    // In a real app, you might check for availability conflicts again before confirming.

    const confirmedBooking = await bookingDb.updateBookingStatus(
      requestId,
      'confirmed' as BookingStatus
    );

    if (!confirmedBooking) {
         return NextResponse.json({ message: 'Failed to confirm booking' }, { status: 500 });
    }

    // TODO: Notify guest that their booking is confirmed
    console.log(`Guest ${confirmedBooking.guestId} should be notified that booking ${confirmedBooking.id} is confirmed by host ${hostId}.`);

    return NextResponse.json({ message: 'Booking request confirmed successfully', booking: confirmedBooking }, { status: 200 });

  } catch (error) {
    console.error('Confirm Booking Request API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
