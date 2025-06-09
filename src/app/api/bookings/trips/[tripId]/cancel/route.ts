// PUT endpoint for cancelling a booking
import { NextRequest, NextResponse } from 'next/server';
import { bookingDb } from '@/lib/bookingStore';
import { BookingStatus, PaymentStatus, CancellationPolicyName } from '@/lib/types';
import { listingDb } from '@/lib/listingStore';
import { calculateRefund } from '@/lib/cancellationPolicies'; // Import the new logic
import { paymentDb } from '@/lib/paymentStore'; // To record refund transaction if applicable

export async function PUT(
  req: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id'); // User cancelling the trip
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { tripId } = params;
    if (!tripId) {
      return NextResponse.json({ message: 'Trip ID is required' }, { status: 400 });
    }

    const { reason } = await req.json(); // Optional reason for cancellation

    const booking = await bookingDb.findById(tripId);

    if (!booking) {
      return NextResponse.json({ message: 'Trip not found' }, { status: 404 });
    }

    if (booking.guestId !== userId) {
      return NextResponse.json({ message: 'Forbidden: You cannot cancel this trip' }, { status: 403 });
    }

    const cancellableStatuses: BookingStatus[] = ['pending_approval', 'confirmed', 'awaiting_payment'];
    if (!cancellableStatuses.includes(booking.status)) {
      return NextResponse.json({ message: `Booking cannot be cancelled in its current status: ${booking.status}` }, { status: 400 });
    }

    const listing = await listingDb.findById(booking.listingId);
    if (!listing) {
        // This should ideally not happen if booking exists
        return NextResponse.json({ message: 'Associated listing not found' }, { status: 500 });
    }

    const cancellationDate = new Date();
    const { refundAmount, policyApplied } = calculateRefund(booking, listing, cancellationDate);

    let finalPaymentStatus: PaymentStatus = booking.paymentStatus;
    if (refundAmount > 0 && booking.paymentStatus === 'succeeded') {
        // Simulate creating a refund transaction
        await paymentDb.createTransaction({
            bookingId: booking.id,
            amount: -refundAmount, // Negative amount for refund
            currency: 'USD', // Assume USD
            paymentMethod: 'refund_simulation', // Indicate it's a refund
            status: 'succeeded', // Mock refund transaction success
            gatewayTransactionId: `mock_refund_${Date.now()}`,
            notes: `Refund for cancellation of booking ${booking.id} based on ${policyApplied} policy.`,
        });
        finalPaymentStatus = 'refunded'; // Or 'partially_refunded' if applicable based on more complex logic
    } else if (booking.paymentStatus === 'pending' && booking.status === 'pending_approval') {
        // If pending approval and payment also pending, no refund needed, payment just won't proceed.
        finalPaymentStatus = 'failed'; // Or 'cancelled' if such a payment status exists
    }


    const updatedBooking = await bookingDb.updateBooking(tripId, {
        status: 'cancelled_by_guest',
        cancelledAt: cancellationDate,
        cancellationReason: reason || "Cancelled by guest",
        cancellationPolicyApplied: policyApplied,
        customCancellationPolicyAppliedDetails: policyApplied === 'Custom' ? listing.customCancellationPolicyDetails : undefined,
        refundAmount: refundAmount,
        paymentStatus: finalPaymentStatus,
    });

    if (!updatedBooking) {
        return NextResponse.json({ message: 'Failed to update booking status for cancellation' }, { status: 500 });
    }

    console.log(`Host ${updatedBooking.hostId} should be notified of cancellation for booking ${updatedBooking.id} by guest ${userId}.`);
    if (refundAmount > 0) {
        console.log(`Refund of $${refundAmount.toFixed(2)} processing initiated for booking ${updatedBooking.id}.`);
    }


    return NextResponse.json({
        message: 'Booking cancelled successfully',
        booking: updatedBooking,
        refundAmount: refundAmount,
        policyApplied: policyApplied
    }, { status: 200 });

  } catch (error) {
    console.error('Cancel Trip API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload for cancellation reason' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
