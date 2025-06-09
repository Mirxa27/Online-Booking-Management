// components/booking/RefundInfoModal.tsx
"use client";

import React from 'react';

interface RefundInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  refundAmount?: number; // If $0, it means no refund
  currency?: string;
  policyName?: string; // e.g., "Flexible", "Moderate"
  message?: string; // Custom message if needed
}

const RefundInfoModal: React.FC<RefundInfoModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  refundAmount = 0,
  currency = "$",
  policyName,
  message,
}) => {
  if (!isOpen) return null;

  const hasRefund = refundAmount > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center animate-fadeInUp">
        <div className="mb-4">
          {hasRefund ? (
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ) : (
            <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          )}
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {hasRefund ? "Cancellation Confirmed & Refund Processed" : "Cancellation Confirmed"}
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Your booking (ID: {bookingId}) has been successfully cancelled.
        </p>

        {message ? (
          <p className="text-md text-gray-700 mb-4">{message}</p>
        ) : (
          <>
            {hasRefund ? (
              <p className="text-lg text-green-600 font-semibold mb-2">
                A refund of {currency}{refundAmount.toFixed(2)} is being processed.
              </p>
            ) : (
              <p className="text-md text-gray-700 mb-2">
                No refund is applicable for this cancellation.
              </p>
            )}
            {policyName && (
              <p className="text-xs text-gray-500">
                This was processed according to the "{policyName}" cancellation policy.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Refunds may take 5-10 business days to appear in your account, depending on your bank.
            </p>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-6 py-2 px-6 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
      <style jsx global>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Example of how it might be used (e.g., on the ManageTripsPage after a cancellation action)
export const ExampleRefundInfoUsage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refundDetails, setRefundDetails] = useState<Omit<RefundInfoModalProps, 'isOpen' | 'onClose'>>({ bookingId: '' });

  const handleOpenModal = (details: Omit<RefundInfoModalProps, 'isOpen' | 'onClose'>) => {
    setRefundDetails(details);
    setIsModalOpen(true);
  };

  return (
    <div className="p-5 text-center">
      <button onClick={() => handleOpenModal({ bookingId: 'BK123', refundAmount: 50.00, policyName: 'Flexible'})} className="bg-blue-500 text-white p-2 rounded mr-2">Simulate Refund</button>
      <button onClick={() => handleOpenModal({ bookingId: 'BK456', refundAmount: 0, policyName: 'Strict', message: 'Cancellation was too close to check-in date.'})} className="bg-orange-500 text-white p-2 rounded">Simulate No Refund</button>

      <RefundInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...refundDetails}
      />
    </div>
  );
};

export default RefundInfoModal;
