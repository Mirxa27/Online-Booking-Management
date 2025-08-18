'use client'

import { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'

interface PaymentButtonProps {
  amount: number
  currency: string
  bookingId: string
  propertyName: string
  provider: 'myfatoorah' | 'paypal'
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function PaymentButton({
  amount,
  currency,
  bookingId,
  propertyName,
  provider,
  onSuccess,
  onError
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          bookingId,
          propertyName,
          provider
        })
      })

      const data = await response.json()

      if (data.success && data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = data.paymentUrl
      } else {
        throw new Error(data.error || 'Payment initiation failed')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      if (onError) {
        onError(error.message)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const getProviderName = () => {
    switch (provider) {
      case 'myfatoorah':
        return 'MyFatoorah'
      case 'paypal':
        return 'PayPal'
      default:
        return 'Payment Gateway'
    }
  }

  const getProviderColor = () => {
    switch (provider) {
      case 'myfatoorah':
        return 'bg-green-600 hover:bg-green-700'
      case 'paypal':
        return 'bg-blue-600 hover:bg-blue-700'
      default:
        return 'bg-habibistay-blue hover:bg-habibistay-600'
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className={`w-full flex items-center justify-center space-x-2 px-6 py-3 text-white rounded-lg transition-colors ${
        isProcessing ? 'bg-gray-400 cursor-not-allowed' : getProviderColor()
      }`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          <span>Pay {currency} {amount} with {getProviderName()}</span>
        </>
      )}
    </button>
  )
}