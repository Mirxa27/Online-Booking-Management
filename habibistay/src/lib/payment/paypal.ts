import axios from 'axios'

interface PayPalConfig {
  clientId: string
  clientSecret: string
  baseUrl: string
  isTestMode: boolean
}

interface PaymentRequest {
  amount: number
  currency: string
  bookingId: string
  propertyName: string
  customerEmail: string
}

export class PayPalService {
  private config: PayPalConfig
  private accessToken: string | null = null

  constructor() {
    this.config = {
      clientId: process.env.PAYPAL_CLIENT_ID || '',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
      baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://api-m.paypal.com' 
        : 'https://api-m.sandbox.paypal.com',
      isTestMode: process.env.NODE_ENV !== 'production'
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')
      
      const response = await axios.post(
        `${this.config.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      this.accessToken = response.data.access_token
      return this.accessToken
    } catch (error) {
      console.error('PayPal auth error:', error)
      throw new Error('Failed to authenticate with PayPal')
    }
  }

  async createOrder(request: PaymentRequest): Promise<any> {
    try {
      const token = await this.getAccessToken()

      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: request.bookingId,
            amount: {
              currency_code: request.currency,
              value: request.amount.toFixed(2)
            },
            description: `Booking for ${request.propertyName}`
          }
        ],
        application_context: {
          brand_name: 'Habibistay',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXTAUTH_URL}/api/payments/paypal/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/booking/payment-cancelled`
        }
      }

      const response = await axios.post(
        `${this.config.baseUrl}/v2/checkout/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        orderId: response.data.id,
        approvalUrl: response.data.links.find((link: any) => link.rel === 'approve')?.href
      }
    } catch (error) {
      console.error('PayPal order creation error:', error)
      return {
        success: false,
        error: 'Failed to create PayPal order'
      }
    }
  }

  async captureOrder(orderId: string): Promise<any> {
    try {
      const token = await this.getAccessToken()

      const response = await axios.post(
        `${this.config.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        captureId: response.data.purchase_units[0].payments.captures[0].id,
        status: response.data.status
      }
    } catch (error) {
      console.error('PayPal capture error:', error)
      return {
        success: false,
        error: 'Failed to capture PayPal payment'
      }
    }
  }

  async refundPayment(captureId: string, amount?: number, reason?: string): Promise<any> {
    try {
      const token = await this.getAccessToken()

      const refundData: any = {
        note_to_payer: reason || 'Refund processed'
      }

      if (amount) {
        refundData.amount = {
          value: amount.toFixed(2),
          currency_code: 'USD'
        }
      }

      const response = await axios.post(
        `${this.config.baseUrl}/v2/payments/captures/${captureId}/refund`,
        refundData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        refundId: response.data.id,
        status: response.data.status
      }
    } catch (error) {
      console.error('PayPal refund error:', error)
      return {
        success: false,
        error: 'Failed to process refund'
      }
    }
  }
}

export default new PayPalService()