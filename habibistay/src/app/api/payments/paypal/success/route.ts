import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import paypalService from '@/lib/payment/paypal'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') // PayPal order ID
    const payerId = searchParams.get('PayerID')
    
    if (!token || !payerId) {
      return NextResponse.redirect(
        new URL('/booking/payment-failed?error=Invalid payment data', request.url)
      )
    }
    
    // Capture the payment
    const captureResult = await paypalService.captureOrder(token)
    
    if (captureResult.success) {
      // Find booking by PayPal order ID (stored temporarily in paymentId)
      const booking = await prisma.booking.findFirst({
        where: { paymentId: token }
      })
      
      if (booking) {
        // Update booking with capture details
        const updatedBooking = await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CONFIRMED',
            paymentId: captureResult.captureId,
            paidAt: new Date(),
            paymentMethod: 'PAYPAL'
          },
          include: {
            property: true,
            guest: true
          }
        })
        
        // TODO: Send confirmation email
        
        return NextResponse.redirect(
          new URL(`/booking/success?bookingId=${updatedBooking.id}&checkInCode=${updatedBooking.checkInCode}`, request.url)
        )
      }
    }
    
    return NextResponse.redirect(
      new URL('/booking/payment-failed?error=Payment capture failed', request.url)
    )
    
  } catch (error) {
    console.error('PayPal success callback error:', error)
    return NextResponse.redirect(
      new URL('/booking/payment-failed?error=Payment processing error', request.url)
    )
  }
}