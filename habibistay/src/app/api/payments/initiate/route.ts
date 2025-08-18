import { NextRequest, NextResponse } from 'next/server'
import myFatoorahService from '@/lib/payment/myfatoorah'
import paypalService from '@/lib/payment/paypal'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, bookingId, propertyName, provider, customerInfo } = body

    let result

    switch (provider) {
      case 'myfatoorah':
        result = await myFatoorahService.initiatePayment({
          amount,
          currency,
          customerName: customerInfo?.name || 'Guest',
          customerEmail: customerInfo?.email || 'guest@habibistay.com',
          customerPhone: customerInfo?.phone,
          bookingId,
          propertyName,
          checkIn: body.checkIn || '',
          checkOut: body.checkOut || ''
        })
        break

      case 'paypal':
        result = await paypalService.createOrder({
          amount,
          currency,
          bookingId,
          propertyName,
          customerEmail: customerInfo?.email || 'guest@habibistay.com'
        })
        
        if (result.success) {
          result.paymentUrl = result.approvalUrl
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid payment provider' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}