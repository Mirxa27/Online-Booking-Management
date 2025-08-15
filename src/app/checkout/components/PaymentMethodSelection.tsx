// app/checkout/components/PaymentMethodSelection.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image'; // For logos

// Placeholder icons (replace with actual icons or SVGs if available)
const PayPalLogo = () => (
  <Image src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal Logo" width={100} height={25} className="inline-block" />
);
const MyfatoorahLogo = () => (
    <span className="inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256" className="mr-2">
            <path fill="#2C4A9B" d="M189.3 50.9H66.7c-8.9 0-15.9 7.1-15.9 15.9v54.3h154.3V66.7c0-8.8-7.1-15.8-15.8-15.8"/>
            <path fill="#253C7C" d="M205.1 121.1H50.9v15.9c0 8.9 7.1 15.9 15.9 15.9h122.5c8.9 0 15.9-7.1 15.9-15.9V121.1z"/>
            <path fill="#FFFFFF" d="M106.6 131.3c-.1-.1-.2-.2-.3-.3l-3.2-3c-.8-.8-.8-2 0-2.8l10.6-10.2c.8-.8 2.1-.8 2.8 0 .8.8.8 2 0 2.8l-9.2 8.8 1.8 1.7c.8.8.8 2 0 2.8-.7.8-2 .8-2.7.1zm13.1-1.2c.1.1.2.2.3.3l3.2 3c.8.8.8 2 0 2.8l-10.6 10.2c-.8.8-2.1.8-2.8 0-.8-.8-.8-2 0-2.8l9.2-8.8-1.8-1.7c-.8-.8-.8-2 0-2.8.8-.7 2-.7 2.8 0zm-29.6 19.1c.8.8 2.1.8 2.8 0l10.6-10.2c.8-.8.8-2 0-2.8s-2-.8-2.8 0l-10.6 10.2c-.8.8-.8 2 0 2.8zm42.5-21.9c.8-.8.8-2.1 0-2.8L122.1 114c-.8-.8-2.1-.8-2.8 0-.8.8-.8 2.1 0 2.8l10.6 10.2c.8.7 2 .7 2.8-.1z"/>
            <path fill="#253C7C" d="M50.9 152.9h154.3v36.3c0 8.9-7.1 15.9-15.9 15.9H66.7c-8.9 0-15.9-7.1-15.9-15.9v-36.3z"/>
            <path fill="#203369" d="M205.1 189.2H50.9V205c0 8.9 7.1 15.9 15.9 15.9h122.5c8.9 0 15.9-7.1 15.9-15.9v-15.8z"/>
        </svg>
         Myfatoorah
    </span>
);


interface PaymentMethodSelectionProps {
  totalAmount: number;
  onPaymentSuccess: (method: string, details: any) => void;
  onPaymentError: (method: string, error: any) => void;
}

type PaymentMethod = 'paypal' | 'myfatoorah' | 'credit_card' | '';

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  // Credit Card state placeholders
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method.');
      return;
    }

    setProcessingPayment(true);
    setPaymentMessage(null);
    console.log(`Processing payment of $${totalAmount.toFixed(2)} via ${selectedMethod}`);

    // Simulate API call to payment gateway
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

    // Mock success/failure
    const isSuccess = Math.random() > 0.2; // 80% success rate

    if (isSuccess) {
      onPaymentSuccess(selectedMethod, { transactionId: `mock_txn_${Date.now()}` });
      setPaymentMessage(`Payment with ${selectedMethod} successful!`);
    } else {
      onPaymentError(selectedMethod, { message: 'Mock payment failed. Please try again.' });
      setPaymentMessage(`Payment with ${selectedMethod} failed. Please try another method or try again.`);
    }
    setProcessingPayment(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Choose Payment Method</h2>

      <div className="space-y-4 mb-6">
        {/* PayPal */}
        <div
          onClick={() => setSelectedMethod('paypal')}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'paypal' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <label className="flex items-center space-x-3">
            <input type="radio" name="paymentMethod" value="paypal" checked={selectedMethod === 'paypal'} onChange={() => setSelectedMethod('paypal')} className="form-radio h-5 w-5 text-blue-600"/>
            <PayPalLogo />
          </label>
        </div>

        {/* Myfatoorah */}
        <div
          onClick={() => setSelectedMethod('myfatoorah')}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'myfatoorah' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <label className="flex items-center space-x-3">
            <input type="radio" name="paymentMethod" value="myfatoorah" checked={selectedMethod === 'myfatoorah'} onChange={() => setSelectedMethod('myfatoorah')} className="form-radio h-5 w-5 text-indigo-600"/>
            <MyfatoorahLogo />
          </label>
        </div>

        {/* Credit Card Placeholder */}
        <div
          className={`p-4 border rounded-lg transition-all ${selectedMethod === 'credit_card' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <div onClick={() => setSelectedMethod('credit_card')} className="cursor-pointer">
            <label className="flex items-center space-x-3 mb-3">
              <input type="radio" name="paymentMethod" value="credit_card" checked={selectedMethod === 'credit_card'} onChange={() => setSelectedMethod('credit_card')} className="form-radio h-5 w-5 text-green-600"/>
              <span className="font-medium text-gray-700">Credit or Debit Card</span>
            </label>
          </div>
          {selectedMethod === 'credit_card' && (
            <div className="mt-4 space-y-3 pl-8 animate-fadeIn">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                <input type="text" id="cardNumber" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="•••• •••• •••• ••••"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input type="text" id="expiryDate" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="MM/YY"/>
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC / CVV</label>
                  <input type="text" id="cvc" value={cvc} onChange={e => setCvc(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="•••"/>
                </div>
              </div>
               <p className="text-xs text-gray-500 mt-1">Secure payment processing (placeholder).</p>
            </div>
          )}
        </div>
      </div>

      {paymentMessage && (
        <div className={`p-3 mb-4 rounded-md text-sm ${paymentMessage.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {paymentMessage}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={!selectedMethod || processingPayment}
        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processingPayment ? `Processing with ${selectedMethod}...` : `Pay $${totalAmount.toFixed(2)}`}
      </button>
      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PaymentMethodSelection;
