import { NextRequest, NextResponse } from 'next/server';
import { bookingDb } from '@/lib/bookingStore';
import { paymentDb } from '@/lib/paymentStore';
import { listingDb } from '@/lib/listingStore'; // To get listing details for host confirmation
import { BookingStatus, PaymentStatus } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { bookingId, paymentMethod, paymentToken } = await req.json(); // paymentToken could be from Stripe.js, PayPal SDK, etc.

    if (!bookingId || !paymentMethod) {
      return NextResponse.json({ message: 'Booking ID and payment method are required' }, { status: 400 });
    }

    const booking = await bookingDb.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    if (booking.guestId !== userId) {
        return NextResponse.json({ message: 'Forbidden: You cannot pay for this booking' }, { status: 403 });
    }

    if (booking.paymentStatus === 'succeeded' && booking.status === 'confirmed') {
        return NextResponse.json({ message: 'This booking is already paid and confirmed.' }, { status: 400 });
    }
    if (booking.status !== 'awaiting_payment' && booking.status !== 'pending_approval' && booking.status !== 'confirmed' /* for re-payment attempts */) {
        return NextResponse.json({ message: `Booking cannot be paid in its current status: ${booking.status}`}, { status: 400});
    }


    // --- Mock Payment Gateway Interaction ---
    console.log(`Simulating payment for booking ${bookingId} via ${paymentMethod} with token: ${paymentToken || 'N/A'}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate gateway delay

    const paymentSuccess = Math.random() > 0.15; // 85% success rate for mock

    let transactionStatus: PaymentStatus = paymentSuccess ? 'succeeded' : 'failed';
    let newBookingStatus: BookingStatus = booking.status;
    let paymentNotes = paymentSuccess ? `Mock ${paymentMethod} payment successful.` : `Mock ${paymentMethod} payment failed.`;

    const transaction = await paymentDb.createTransaction({
      bookingId,
      amount: booking.totalPrice,
      currency: 'USD', // Assume USD for now
      paymentMethod,
      status: transactionStatus,
      gatewayTransactionId: `mock_gw_${Date.now()}`,
      notes: paymentNotes,
    });

    if (paymentSuccess) {
      // Determine next booking status based on current status and listing type
      const listing = await listingDb.findById(booking.listingId);
      if (booking.status === 'awaiting_payment' || (booking.status === 'confirmed' && booking.paymentStatus !== 'succeeded')) {
          // If it was already confirmed (e.g. by host) but payment failed, now it's truly confirmed.
          newBookingStatus = 'confirmed';
      } else if (listing?.isInstantBookable || booking.status === 'pending_approval') {
          // If it's instant bookable and was awaiting payment, or was pending approval (host approved, now paid)
          newBookingStatus = 'confirmed';
      }
      // If it was 'pending_approval' and NOT instant bookable, it might go to 'confirmed' (paid, awaiting host to finally confirm the slot)
      // or directly to 'confirmed' if payment implies host already approved.
      // For simplicity: if payment is successful, and it was pending_approval, we move it to 'confirmed'.
      // A more complex flow could have 'paid_pending_final_confirmation'.

      await bookingDb.updateBooking(bookingId, {
        paymentStatus: 'succeeded',
        status: newBookingStatus,
        paymentTransactionId: transaction.id,
        confirmedAt: (newBookingStatus === 'confirmed' && !booking.confirmedAt) ? new Date() : booking.confirmedAt,
      });
      console.log(`Booking ${bookingId} status updated to ${newBookingStatus}, payment successful.`);
      // TODO: Notify guest and host of successful payment and confirmation
      if (newBookingStatus === 'confirmed') {
          console.log(`Notifications: Booking ${bookingId} confirmed for guest ${booking.guestId} and host ${booking.hostId}.`);
      }

      return NextResponse.json({
        message: 'Payment successful!',
        bookingStatus: newBookingStatus,
        transactionId: transaction.id
      }, { status: 200 });

    } else {
      // Payment failed
      await bookingDb.updateBooking(bookingId, {
        paymentStatus: 'failed',
        status: booking.status === 'awaiting_payment' ? 'payment_failed' : booking.status, // Update status if it was specifically awaiting_payment
        paymentTransactionId: transaction.id,
      });
      console.log(`Booking ${bookingId} payment failed.`);
      // TODO: Notify guest of payment failure
      console.log(`Notifications: Payment failed for booking ${bookingId} for guest ${booking.guestId}.`);

      return NextResponse.json({
        message: 'Payment failed. Please try again or use a different payment method.',
        bookingStatus: booking.status, // Or 'payment_failed'
        transactionId: transaction.id
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment Processing API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
