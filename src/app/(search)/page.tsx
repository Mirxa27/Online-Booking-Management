// app/(search)/page.tsx
"use client"; // Since MapView and potentially filters will have client-side interactions

import React from 'react'; // Ensure React is imported if not already
import SearchFilters from './components/SearchFilters';
import InteractiveMapView from './components/InteractiveMapView';
import ListingCard, { Listing as ListingType } from '@/components/listings/ListingCard'; // Import ListingCard and its type

// Mock data for listings - replace with actual data fetching
const mockListingsData: ListingType[] = [ // Use ListingType for mock data
  {
    id: '1',
    name: 'Cozy Apartment in Downtown',
    price: 120,
    location: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' }, // Added city/country
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Cozy+Apartment' // Placeholder image
  },
  {
    id: '2',
    name: 'Spacious Villa with Pool',
    price: 350,
    location: { lat: 34.0550, lng: -118.2500, city: 'Beverly Hills', country: 'USA' },
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Villa+with+Pool'
  },
  {
    id: '3',
    name: 'Charming Studio near Park',
    price: 90,
    location: { lat: 34.0500, lng: -118.2400, city: 'Santa Monica', country: 'USA' },
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Studio+Near+Park'
  },
];

export default function SearchPage() {
  const handleMarkerClick = (listingId: string) => {
    console.log("Marker clicked for listing:", listingId);
    // Potentially scroll to the listing card or open a detailed modal
    const element = document.getElementById(`listing-${listingId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the card briefly
      element.classList.add('ring-2', 'ring-indigo-500', 'transition-all', 'duration-300');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-indigo-500');
      }, 2000);
    }
  };

  const handleViewDetails = (listingId: string) => {
    alert(`Navigate to details page for listing ${listingId}`);
    // router.push(`/listings/${listingId}`); // Example navigation
  };

  const handleToggleWishlist = (listingId: string, isWishlisted: boolean) => {
    console.log(`Listing ${listingId} is now ${isWishlisted ? 'wishlisted' : 'unwishlisted'}. (Update backend state)`);
    // API call to update wishlist status would go here
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Find Your Next Stay</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filters Section */}
        <div className="lg:col-span-4 xl:col-span-3 sticky top-4 self-start"> {/* Made filters sticky */}
          <SearchFilters />
        </div>

        {/* Listings and Map Section */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="mb-6">
            {/* Pass ListingType[] to InteractiveMapView if its props expect it */}
            <InteractiveMapView
              listings={mockListingsData.map(l => ({ id: l.id, name: l.name, location: l.location! }))}
              onMarkerClick={handleMarkerClick}
            />
          </div>

          {/* Search Recommendations */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Discover More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Example Recommendation Items - these could be links or trigger searches */}
              <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ring-1 ring-gray-200 hover:ring-indigo-500">
                <h4 className="font-semibold text-indigo-700">Popular Destinations</h4>
                <p className="text-sm text-gray-600">Explore top-rated cities</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ring-1 ring-gray-200 hover:ring-indigo-500">
                <h4 className="font-semibold text-indigo-700">Unique Stays</h4>
                <p className="text-sm text-gray-600">Castles, treehouses, and more</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ring-1 ring-gray-200 hover:ring-indigo-500">
                <h4 className="font-semibold text-indigo-700">Last Minute Deals</h4>
                <p className="text-sm text-gray-600">Save on spontaneous trips</p>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Results ({mockListingsData.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockListingsData.map(listing => (
                <div id={`listing-${listing.id}`} key={listing.id}> {/* Added ID for scrolling */}
                  <ListingCard
                    listing={listing}
                    onViewDetails={handleViewDetails}
                    onToggleWishlist={handleToggleWishlist}
                    // isInitiallyWishlisted={/* check if listing.id is in user's wishlist */}
                  />
                </div>
              ))}
            </div>
            {mockListingsData.length === 0 && (
              <p className="text-gray-600 mt-6 text-center">
                No listings found matching your criteria. Try adjusting your filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
