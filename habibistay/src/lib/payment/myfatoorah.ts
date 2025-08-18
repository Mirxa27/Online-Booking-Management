import axios from 'axios'

interface MyFatoorahConfig {
  apiKey: string
  baseUrl: string
  isTestMode: boolean
}

interface PaymentRequest {
  amount: number
  currency: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  bookingId: string
  propertyName: string
  checkIn: string
  checkOut: string
}

interface PaymentResponse {
  success: boolean
  paymentUrl?: string
  paymentId?: string
  error?: string
}

export class MyFatoorahService {
  private config: MyFatoorahConfig

  constructor() {
    this.config = {
      apiKey: process.env.MYFATOORAH_API_KEY || '',
      baseUrl: process.env.MYFATOORAH_BASE_URL || 'https://apitest.myfatoorah.com',
      isTestMode: process.env.NODE_ENV !== 'production'
    }
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentData = {
        PaymentMethodId: 2, // Visa/Master Direct
        InvoiceValue: request.amount,
        CustomerName: request.customerName,
        CustomerEmail: request.customerEmail,
        CustomerMobile: request.customerPhone || '',
        CallBackUrl: `${process.env.NEXTAUTH_URL}/api/payments/myfatoorah/callback`,
        ErrorUrl: `${process.env.NEXTAUTH_URL}/booking/payment-failed`,
        Language: 'en',
        DisplayCurrencyIso: request.currency,
        CustomerReference: request.bookingId,
        InvoiceItems: [
          {
            ItemName: `Booking: ${request.propertyName}`,
            Quantity: 1,
            UnitPrice: request.amount,
            Description: `Stay from ${request.checkIn} to ${request.checkOut}`
          }
        ]
      }

      const response = await axios.post(
        `${this.config.baseUrl}/v2/SendPayment`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.IsSuccess) {
        return {
          success: true,
          paymentUrl: response.data.Data.InvoiceURL,
          paymentId: response.data.Data.InvoiceId
        }
      } else {
        return {
          success: false,
          error: response.data.Message || 'Payment initiation failed'
        }
      }
    } catch (error) {
      console.error('MyFatoorah payment error:', error)
      return {
        success: false,
        error: 'Failed to process payment'
      }
    }
  }

  async verifyPayment(paymentId: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/v2/GetPaymentStatus`,
        {
          Key: paymentId,
          KeyType: 'InvoiceId'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('MyFatoorah verification error:', error)
      throw error
    }
  }

  async refundPayment(paymentId: string, amount: number, reason: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/v2/MakeRefund`,
        {
          KeyType: 'InvoiceId',
          Key: paymentId,
          RefundChargeOnCustomer: false,
          ServiceChargeOnCustomer: false,
          Amount: amount,
          Comment: reason
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('MyFatoorah refund error:', error)
      throw error
    }
  }
}

export default new MyFatoorahService()