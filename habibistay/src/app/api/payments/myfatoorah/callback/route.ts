import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import myFatoorahService from '@/lib/payment/myfatoorah'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')
    const bookingId = searchParams.get('Id') // MyFatoorah sends booking ID as 'Id'
    
    if (!paymentId) {
      return NextResponse.redirect(
        new URL('/booking/payment-failed?error=Missing payment ID', request.url)
      )
    }
    
    // Verify payment with MyFatoorah
    const paymentStatus = await myFatoorahService.verifyPayment(paymentId)
    
    if (paymentStatus.IsSuccess && paymentStatus.Data.InvoiceStatus === 'Paid') {
      // Update booking status
      const booking = await prisma.booking.update({
        where: { id: bookingId || paymentStatus.Data.CustomerReference },
        data: {
          status: 'CONFIRMED',
          paymentId: paymentId,
          paidAt: new Date(),
          paymentMethod: 'MYFATOORAH'
        },
        include: {
          property: true,
          guest: true
        }
      })
      
      // TODO: Send confirmation email
      
      return NextResponse.redirect(
        new URL(`/booking/success?bookingId=${booking.id}&checkInCode=${booking.checkInCode}`, request.url)
      )
    } else {
      return NextResponse.redirect(
        new URL('/booking/payment-failed?error=Payment verification failed', request.url)
      )
    }
    
  } catch (error) {
    console.error('MyFatoorah callback error:', error)
    return NextResponse.redirect(
      new URL('/booking/payment-failed?error=Payment processing error', request.url)
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { Data } = body
    
    if (!Data) {
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      )
    }
    
    // Verify payment
    const paymentStatus = await myFatoorahService.verifyPayment(Data.InvoiceId)
    
    if (paymentStatus.IsSuccess && paymentStatus.Data.InvoiceStatus === 'Paid') {
      // Update booking
      await prisma.booking.update({
        where: { id: paymentStatus.Data.CustomerReference },
        data: {
          status: 'CONFIRMED',
          paymentId: Data.InvoiceId,
          paidAt: new Date(),
          paymentMethod: 'MYFATOORAH'
        }
      })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('MyFatoorah webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}