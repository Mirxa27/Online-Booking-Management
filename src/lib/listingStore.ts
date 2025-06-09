import { Listing, Amenity, RoomType, SpecialOffer } from './types'; // Added SpecialOffer

const defaultAmenities: Amenity[] = [
  { id: '1', name: 'WiFi' },
  { id: '2', name: 'Pool' },
  { id: '3', name: 'Parking' },
  { id: '4', name: 'Gym' },
  { id: '5', name: 'Pet Friendly' },
  { id: '6', name: 'Air Conditioning' },
  { id: '7', name: 'Kitchen' },
  { id: '8', name: 'TV' },
  { id: '9', name: 'Washer' },
  { id: '10', name: 'Dryer' },
];

const sampleOffers: SpecialOffer[] = [
    {
        id: 'SO1', title: 'Weekly Discount', description: 'Stay 7 nights and get 15% off!',
        discountPercentage: 15, minNights: 7,
        validFrom: new Date('2024-01-01'), validUntil: new Date('2024-12-31')
    },
    {
        id: 'SO2', title: 'Last Minute Deal', description: 'Book within 2 days of arrival for 10% off.',
        discountPercentage: 10,
        // In a real system, this would need dynamic date checking relative to booking date vs arrival.
    },
    {
        id: 'SO3', title: 'Early Bird Special', description: 'Book 3 months in advance and save $50.',
        discountAmount: 50,
    }
];

const listings: Listing[] = [
  {
    id: 'L1',
    hostId: 'U1',
    title: 'Sunny Beachfront Condo with Ocean View',
    description: 'Enjoy breathtaking views from this beautiful 2-bedroom condo. Steps from the beach, with a shared pool and modern amenities.',
    location: { city: 'Miami Beach', country: 'USA', lat: 25.7907, lng: -80.1300, address: '123 Ocean Drive' },
    pricePerNight: 250,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: [defaultAmenities[0], defaultAmenities[1], defaultAmenities[5], defaultAmenities[6], defaultAmenities[7]],
    roomType: 'entire_place',
    images: ['https://via.placeholder.com/400x300.png?text=Beach+Condo+1', 'https://via.placeholder.com/400x300.png?text=Beach+Condo+2'],
    rating: 4.8,
    reviewsCount: 120,
    isInstantBookable: true, // Added
    specialOffers: [sampleOffers[0]], // Added
    cancellationPolicy: 'Moderate: Free cancellation within 48 hours of booking.', // Added
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-10-01'),
  },
  {
    id: 'L2',
    hostId: 'U2',
    title: 'Cozy Downtown Studio Apartment',
    description: 'A charming and compact studio in the heart of the city. Perfect for solo travelers or couples. Walking distance to shops and restaurants.',
    location: { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, address: '456 Main Street' },
    pricePerNight: 120,
    maxGuests: 2,
    bedrooms: 0,
    beds: 1,
    bathrooms: 1,
    amenities: [defaultAmenities[0], defaultAmenities[5], defaultAmenities[6], defaultAmenities[7]],
    roomType: 'entire_place',
    images: ['https://via.placeholder.com/400x300.png?text=Downtown+Studio'],
    rating: 4.5,
    reviewsCount: 85,
    isInstantBookable: false, // Added
    specialOffers: [sampleOffers[1], sampleOffers[2]], // Added
    cancellationPolicy: 'Flexible: Free cancellation up to 24 hours before check-in.', // Added
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-09-15'),
  },
  {
    id: 'L3',
    hostId: 'U1',
    title: 'Rustic Cabin in the Woods',
    description: 'Escape to nature in this peaceful cabin. Features a wood-burning stove, hiking trails nearby, and a serene atmosphere.',
    location: { city: 'Asheville', country: 'USA', lat: 35.5951, lng: -82.5515, address: '789 Forest Lane' },
    pricePerNight: 180,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: [defaultAmenities[2], defaultAmenities[4], defaultAmenities[6]],
    roomType: 'entire_place',
    images: ['https://via.placeholder.com/400x300.png?text=Rustic+Cabin'],
    rating: 4.9,
    reviewsCount: 210,
    isInstantBookable: true, // Added
    specialOffers: [], // No specific offers for this one
    cancellationPolicy: 'Strict: 50% refund up to 1 week prior to arrival, except fees.', // Added
    createdAt: new Date('2022-11-01'),
    updatedAt: new Date('2023-10-05'),
  },
  {
    id: 'L4',
    hostId: 'U3',
    title: 'Private Room in Victorian House',
    description: 'Spacious private room in a beautifully restored Victorian home. Shared kitchen and living spaces. Great for students or budget travelers.',
    location: { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, address: '101 Historic Ave' },
    pricePerNight: 80,
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: [defaultAmenities[0], defaultAmenities[8], defaultAmenities[9]],
    roomType: 'private_room',
    images: ['https://via.placeholder.com/400x300.png?text=Victorian+Room'],
    rating: 4.3,
    reviewsCount: 45,
    isInstantBookable: false, // Added
    cancellationPolicy: 'Flexible', // Added
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-09-20'),
  }
];

export const listingDb = {
  async searchListings(filters: {
    locationQuery?: string;
    checkIn?: string;
    checkOut?: string;
    amenities?: string[];
    priceMin?: number;
    priceMax?: number;
    roomType?: RoomType;
    guests?: number;
  }): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    let results = [...listings];

    if (filters.locationQuery) {
      const query = filters.locationQuery.toLowerCase();
      results = results.filter(l =>
        l.location.city.toLowerCase().includes(query) ||
        l.location.country.toLowerCase().includes(query) ||
        l.title.toLowerCase().includes(query) ||
        (l.location.address && l.location.address.toLowerCase().includes(query))
      );
    }
    if (filters.priceMin !== undefined) results = results.filter(l => l.pricePerNight >= filters.priceMin!);
    if (filters.priceMax !== undefined) results = results.filter(l => l.pricePerNight <= filters.priceMax!);
    if (filters.roomType) results = results.filter(l => l.roomType === filters.roomType);
    if (filters.guests && filters.guests > 0) results = results.filter(l => l.maxGuests >= filters.guests!);
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter(l =>
        filters.amenities!.every(reqAmenity =>
          l.amenities.some(listingAmenity => listingAmenity.name === reqAmenity || listingAmenity.id === reqAmenity)
        )
      );
    }
    return results;
  },

  async findById(id: string): Promise<Listing | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const listing = listings.find(l => l.id === id);
    // Ensure special offers are returned if they exist
    return listing ? { ...listing, specialOffers: listing.specialOffers || [] } : undefined;
  },

  async getAllListings(): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return [...listings].map(l => ({ ...l, specialOffers: l.specialOffers || [] }));
  },

  async getPopularListings(limit: number = 3): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return [...listings].sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)).slice(0, limit);
  },

  async getRecentlyAdded(limit: number = 3): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return [...listings].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  }
};

console.log('Mock listing store initialized with sample data including special offers and booking properties.');
