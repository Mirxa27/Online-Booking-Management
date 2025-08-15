// app/(account-pages)/disputes/components/RaiseDisputeForm.tsx
"use client";

import React, { useState } from 'react';

export interface DisputeData {
  bookingId: string;
  tripName: string; // For context in the form
  reason: '' | 'property_not_as_described' | 'cleanliness_issues' | 'host_cancelled_refund_issue' | 'safety_concern' | 'other';
  explanation: string;
  desiredResolution?: string; // e.g., "Full refund", "Partial refund", "Apology"
}

interface RaiseDisputeFormProps {
  bookingId: string;
  tripName: string; // e.g., "Stay at Cozy Cabin"
  onSubmitDispute: (disputeData: Omit<DisputeData, 'tripName'>) => void; // tripName is for UI only
  onCancel?: () => void;
}

const disputeReasons = [
  { value: 'property_not_as_described', label: 'Property not as described' },
  { value: 'cleanliness_issues', label: 'Cleanliness issues' },
  { value: 'host_cancelled_refund_issue', label: 'Host cancelled - refund issue' },
  { value: 'safety_concern', label: 'Safety concern' },
  { value: 'other', label: 'Other' },
];

const RaiseDisputeForm: React.FC<RaiseDisputeFormProps> = ({
  bookingId,
  tripName,
  onSubmitDispute,
  onCancel,
}) => {
  const [reason, setReason] = useState<DisputeData['reason']>('');
  const [explanation, setExplanation] = useState('');
  const [desiredResolution, setDesiredResolution] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert('Please select a reason for the dispute.');
      return;
    }
    if (!explanation.trim()) {
      alert('Please provide a detailed explanation of the issue.');
      return;
    }
    onSubmitDispute({
      bookingId,
      reason,
      explanation,
      desiredResolution: desiredResolution.trim() || undefined
    });
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Raise a Dispute</h2>
      <p className="text-md text-indigo-600 mb-6">Regarding your trip: {tripName}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reason for Dispute */}
        <div>
          <label htmlFor="disputeReason" className="block text-sm font-medium text-gray-700">
            Reason for Dispute <span className="text-red-500">*</span>
          </label>
          <select
            id="disputeReason"
            value={reason}
            onChange={(e) => setReason(e.target.value as DisputeData['reason'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="" disabled>Select a reason</option>
            {disputeReasons.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Detailed Explanation */}
        <div>
          <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
            Detailed Explanation <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1">Please provide as much detail as possible, including dates and specific issues.</p>
          <textarea
            id="explanation"
            rows={5}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe the issue(s) you encountered..."
            required
          />
        </div>

        {/* Desired Resolution (Optional) */}
        <div>
          <label htmlFor="desiredResolution" className="block text-sm font-medium text-gray-700">
            Desired Resolution (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-1">What outcome are you hoping for? (e.g., full refund, partial refund of $X, apology)</p>
          <input
            type="text"
            id="desiredResolution"
            value={desiredResolution}
            onChange={(e) => setDesiredResolution(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Full refund"
          />
        </div>

        <p className="text-xs text-gray-500">
            Disputes should ideally be raised within 14 days of your checkout date.
            Our support team will review your case and may contact you for more information.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Submit Dispute
          </button>
        </div>
      </form>
    </div>
  );
};

export default RaiseDisputeForm;
