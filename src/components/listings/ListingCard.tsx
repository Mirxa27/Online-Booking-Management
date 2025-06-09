// components/listings/ListingCard.tsx
"use client";

import React, { useState } from 'react';

// Placeholder for an Icon component (e.g., from heroicons or react-icons)
const HeartIcon: React.FC<{ className?: string; isFilled?: boolean }> = ({ className = "w-6 h-6", isFilled }) => (
  <svg xmlns="http://www.w3.org/2000/svg"
       fill={isFilled ? "currentColor" : "none"}
       viewBox="0 0 24 24"
       strokeWidth={1.5}
       stroke="currentColor"
       className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);


export interface Listing {
  id: string;
  name: string;
  price: number;
  imageUrl?: string; // Optional image URL
  location?: { // Optional, for displaying city/area
    city?: string;
    country?: string;
  };
  // Add other relevant listing properties
}

interface ListingCardProps {
  listing: Listing;
  onViewDetails?: (listingId: string) => void;
  onToggleWishlist?: (listingId: string, isWishlisted: boolean) => void;
  isInitiallyWishlisted?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onViewDetails,
  onToggleWishlist,
  isInitiallyWishlisted = false
}) => {
  const [isWishlisted, setIsWishlisted] = useState(isInitiallyWishlisted);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking wishlist button
    const newWishlistStatus = !isWishlisted;
    setIsWishlisted(newWishlistStatus);
    if (onToggleWishlist) {
      onToggleWishlist(listing.id, newWishlistStatus);
    }
    console.log(`Listing ${listing.id} wishlisted: ${newWishlistStatus}`);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(listing.id);
    } else {
      alert(`Viewing details for ${listing.name}`);
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className={`relative ${listing.imageUrl ? '' : 'animate-pulse'}`}>
        {listing.imageUrl ? (
          <img src={listing.imageUrl} alt={listing.name} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gray-300"></div>
        )}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors
                      ${isWishlisted ? 'bg-pink-500 text-white' : 'bg-white/70 text-gray-700 hover:bg-pink-100'}`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon isFilled={isWishlisted} className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 text-gray-800 truncate" title={listing.name}>
          {listing.name}
        </h3>
        {listing.location?.city && (
          <p className="text-sm text-gray-600 mb-1">{listing.location.city}{listing.location.country ? `, ${listing.location.country}` : ''}</p>
        )}
        <p className="text-gray-800 font-medium mb-2">${listing.price} / night</p>
        {onViewDetails && ( // Only show button if handler is provided
            <button
                onClick={(e) => { e.stopPropagation(); handleCardClick(); }} // ensure card click logic is run
                className="w-full py-2 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                View Details
            </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
