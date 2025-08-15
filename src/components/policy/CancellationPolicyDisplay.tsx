// components/policy/CancellationPolicyDisplay.tsx
"use client";

import React, { useState } from 'react';

export type PolicyType = 'Flexible' | 'Moderate' | 'Strict' | 'Custom';

interface PolicyDetails {
  summary: string;
  fullText: string; // Could be more structured, e.g., array of points
}

const policyDetailsMap: Record<Exclude<PolicyType, 'Custom'>, PolicyDetails> = {
  Flexible: {
    summary: "Free cancellation until 24 hours before check-in.",
    fullText: "Cancel up to 24 hours before check-in for a full refund. If you cancel less than 24 hours before check-in, the first night is non-refundable. No refund for cancellations made after check-in.",
  },
  Moderate: {
    summary: "Free cancellation until 5 days before check-in.",
    fullText: "Cancel up to 5 days before check-in for a full refund. If you cancel less than 5 days before check-in, the first night plus 50% of all nights after that are non-refundable. Service fees are non-refundable.",
  },
  Strict: {
    summary: "Cancel within 48 hours of booking and at least 14 days before check-in for a full refund.",
    fullText: "For a full refund, cancel within 48 hours of booking and at least 14 full days prior to listing's local check-in time. If you cancel 7 to 14 days before check-in, you’ll be charged 50% for all nights. If you cancel less than 7 days before check-in, you’ll be charged 100% for all nights. Service fees are non-refundable.",
  },
};

interface CancellationPolicyDisplayProps {
  policyType: PolicyType;
  customPolicyDetails?: string; // For 'Custom' policy type
}

const CancellationPolicyDisplay: React.FC<CancellationPolicyDisplayProps> = ({
  policyType,
  customPolicyDetails,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const details = policyType === 'Custom'
    ? { summary: customPolicyDetails || "Custom policy applies.", fullText: customPolicyDetails || "Host has set a custom cancellation policy. Please review carefully." }
    : policyDetailsMap[policyType];

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-md font-semibold text-gray-800">Cancellation Policy: {policyType}</h4>
          <p className="text-sm text-gray-600">{details.summary}</p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200 animate-fadeIn">
          <p className="text-sm text-gray-700 whitespace-pre-line">{details.fullText}</p>
        </div>
      )}
       <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Example Usage (can be placed on a listing detail page)
export const ExampleCancellationPolicyUsage: React.FC = () => {
  return (
    <div className="space-y-4 max-w-lg mx-auto p-5">
      <CancellationPolicyDisplay policyType="Flexible" />
      <CancellationPolicyDisplay policyType="Moderate" />
      <CancellationPolicyDisplay policyType="Strict" />
      <CancellationPolicyDisplay policyType="Custom" customPolicyDetails="This host offers a 50% refund if cancelled up to 30 days before check-in. No refund afterwards." />
    </div>
  );
};

export default CancellationPolicyDisplay;
