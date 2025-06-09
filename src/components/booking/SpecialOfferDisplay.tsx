// components/booking/SpecialOfferDisplay.tsx
"use client";

import React from 'react';

interface SpecialOffer {
  id: string;
  title: string; // e.g., "Weekly Discount", "Last Minute Deal"
  description: string; // e.g., "Stay 7 nights, pay for 6!", "20% off for bookings this week"
  discountPercentage?: number;
  discountAmount?: number;
  validUntil?: Date; // Optional validity date
}

interface SpecialOfferDisplayProps {
  offer: SpecialOffer;
  onClaimOffer?: (offerId: string) => void; // Optional: if offers can be "claimed"
}

const SpecialOfferDisplay: React.FC<SpecialOfferDisplayProps> = ({ offer, onClaimOffer }) => {
  return (
    <div className="p-4 my-4 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 text-white rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{offer.title}</h3>
          <p className="text-sm mt-1">{offer.description}</p>
          {offer.validUntil && (
            <p className="text-xs mt-1 opacity-90">
              Valid until: {new Date(offer.validUntil).toLocaleDateString()}
            </p>
          )}
        </div>
        {offer.discountPercentage && (
          <div className="text-3xl font-extrabold ml-4">
            {offer.discountPercentage}% <span className="text-xl">OFF</span>
          </div>
        )}
        {offer.discountAmount && !offer.discountPercentage && (
           <div className="text-3xl font-extrabold ml-4">
            ${offer.discountAmount} <span className="text-xl">OFF</span>
          </div>
        )}
      </div>
      {onClaimOffer && (
        <button
          onClick={() => onClaimOffer(offer.id)}
          className="mt-3 text-sm font-semibold bg-white text-yellow-700 py-1 px-3 rounded-full hover:bg-yellow-50 transition-colors"
        >
          Claim Offer
        </button>
      )}
    </div>
  );
};

// Example of how it might be used (for demonstration)
export const ExampleOfferUsage: React.FC = () => {
  const sampleOffer: SpecialOffer = {
    id: 'offer123',
    title: 'Summer Special!',
    description: 'Get 20% off your stay if you book by the end of this month.',
    discountPercentage: 20,
    validUntil: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) // End of current month
  };

  const sampleOffer2: SpecialOffer = {
    id: 'offer456',
    title: 'Weekend Getaway Discount',
    description: 'Save $50 on any 2-night weekend booking.',
    discountAmount: 50,
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <SpecialOfferDisplay offer={sampleOffer} onClaimOffer={(id) => alert(`Claiming offer ${id}`)} />
      <SpecialOfferDisplay offer={sampleOffer2} />
    </div>
  );
};

export default SpecialOfferDisplay;
