import { NextRequest, NextResponse } from 'next/server';
import { disputeDb } from '@/lib/disputeStore';
import { bookingDb } from '@/lib/bookingStore';

export async function GET(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { bookingId } = params;
    if (!bookingId) {
      return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
    }

    const booking = await bookingDb.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // User must be guest or host of the booking to view its dispute
    if (booking.guestId !== userId && booking.hostId !== userId) {
      return NextResponse.json({ message: 'Forbidden: You do not have access to this booking\'s dispute information.' }, { status: 403 });
    }

    const dispute = await disputeDb.getDisputeByBookingId(bookingId);

    if (!dispute) {
      return NextResponse.json({ message: 'No dispute found for this booking.' }, { status: 404 });
    }

    // Optionally, enrich dispute with more details if needed (e.g., user names) here

    return NextResponse.json(dispute, { status: 200 });

  } catch (error) {
    console.error('Get Dispute by Booking ID API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
