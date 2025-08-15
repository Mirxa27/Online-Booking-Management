import { NextRequest, NextResponse } from 'next/server';
import { listingDb } from '@/lib/listingStore';
import { RoomType } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters = {
      locationQuery: searchParams.get('location') || undefined,
      checkIn: searchParams.get('checkIn') || undefined,
      checkOut: searchParams.get('checkOut') || undefined,
      amenities: searchParams.getAll('amenities') || undefined, // amenities=WiFi&amenities=Pool
      priceMin: searchParams.has('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.has('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      roomType: searchParams.get('roomType') as RoomType || undefined,
      guests: searchParams.has('guests') ? Number(searchParams.get('guests')) : undefined,
    };

    // Basic validation example (more can be added)
    if (filters.priceMin !== undefined && filters.priceMax !== undefined && filters.priceMin > filters.priceMax) {
        return NextResponse.json({ message: 'Invalid price range: minPrice cannot be greater than maxPrice.' }, { status: 400 });
    }
    if (filters.guests !== undefined && filters.guests < 1) {
        return NextResponse.json({ message: 'Number of guests must be at least 1.' }, { status: 400 });
    }

    const listings = await listingDb.searchListings(filters);

    // The searchListings function in listingStore already provides location data (lat, lng)
    // So, no specific transformation is needed here for map integration based on current setup.

    return NextResponse.json(listings, { status: 200 });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ message: 'Error processing search request', error: (error as Error).message }, { status: 500 });
  }
}
