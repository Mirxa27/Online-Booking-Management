import { NextRequest, NextResponse } from 'next/server';
import { listingDb } from '@/lib/listingStore';

export async function GET(req: NextRequest) {
  try {
    // For now, we'll return a few predefined categories of recommendations.
    // This could be expanded based on user preferences, location context, etc.

    const popular = await listingDb.getPopularListings(3);
    const recentlyAdded = await listingDb.getRecentlyAdded(3);
    // Add more recommendation types if needed, e.g., based on specific criteria or ML models.

    // Example: "Top Rated in [City]" - would require location context
    // const userLocation = req.headers.get('x-user-city') || 'New York'; // Example, if available
    // const topInCity = await listingDb.searchListings({ locationQuery: userLocation, /* other filters */ });
    // topInCity.sort((a,b) => (b.rating || 0) - (a.rating || 0));


    const recommendations = {
      popular: {
        title: "Popular Stays",
        items: popular,
      },
      recentlyAdded: {
        title: "New Listings",
        items: recentlyAdded,
      },
      // You could add more dynamic sections here:
      // "deals": { title: "Great Deals", items: await listingDb.searchListings({ priceMax: 100 })},
    };

    return NextResponse.json(recommendations, { status: 200 });

  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json({ message: 'Error fetching recommendations', error: (error as Error).message }, { status: 500 });
  }
}
