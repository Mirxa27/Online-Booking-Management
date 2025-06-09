// app/(account-pages)/wishlist/page.tsx
"use client"; // For potential client-side interactions like removing from wishlist

import React from 'react';
import ListingCard, { Listing as ListingType } from '@/components/listings/ListingCard'; // Reusing the ListingCard
import Link from 'next/link';

// Mock data for wishlisted items - replace with actual data fetching
const mockWishlistItems: ListingType[] = [
  {
    id: 'w1', // Different ID for wishlist item if needed, or use listing ID
    name: 'Dreamy Beachfront Villa',
    price: 450,
    location: { city: 'Malibu', country: 'USA' },
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Beachfront+Villa'
  },
  {
    id: 'w2',
    name: 'Rustic Mountain Cabin',
    price: 180,
    location: { city: 'Aspen', country: 'USA' },
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Mountain+Cabin'
  },
  {
    id: 'w3',
    name: 'Urban Loft with City Views',
    price: 220,
    location: { city: 'New York', country: 'USA' },
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Urban+Loft'
  },
];


export default function WishlistPage() {

  const handleRemoveFromWishlist = (listingId: string, isWishlisted: boolean) => {
    if (!isWishlisted) { // ListingCard's onToggleWishlist returns the new state
      console.log(`Listing ${listingId} removed from wishlist. (Update backend and local state)`);
      // Here you would filter out the item from the local state if managing it here
      // For now, we just log it. A real implementation would re-fetch or update state.
      alert(`Listing ${listingId} removed from wishlist (mock).`);
    }
  };

  const handleViewDetails = (listingId: string) => {
    alert(`Navigate to details page for listing ${listingId}`);
    // router.push(`/listings/${listingId}`); // Example navigation
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
        <Link href="/search" className="text-indigo-600 hover:text-indigo-800 font-medium">
          Continue Browsing
        </Link>
      </div>

      {mockWishlistItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">❤️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty!</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven’t added anything to your wishlist yet. Start exploring and save your favorites!
          </p>
          <Link href="/search">
            <button className="py-2 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
              Find Stays
            </button>
          </Link>
        </div>
      )}

      {mockWishlistItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockWishlistItems.map(item => (
            <ListingCard
              key={item.id}
              listing={item}
              onViewDetails={handleViewDetails}
              onToggleWishlist={handleRemoveFromWishlist} // This will be called when heart icon is clicked
              isInitiallyWishlisted={true} // All items on this page are wishlisted
            />
          ))}
        </div>
      )}
    </div>
  );
}
