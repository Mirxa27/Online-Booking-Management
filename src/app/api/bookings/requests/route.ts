// GET endpoint for hosts to view their pending booking requests
import { NextRequest, NextResponse } from 'next/server';
import { bookingDb } from '@/lib/bookingStore';
import { listingDb } from '@/lib/listingStore';
import { userDb } from '@/lib/userStore'; // To get guest details
import { Booking, Listing, User } from '@/lib/types';

interface EnrichedBookingRequest extends Booking {
    listingDetails?: Pick<Listing, 'id' | 'title' | 'images'>;
    guestDetails?: Pick<User, 'id' | 'name' | 'profilePhotoUrl'>;
}

export async function GET(req: NextRequest) {
  try {
    const hostId = req.headers.get('x-user-id');
    if (!hostId) {
      return NextResponse.json({ message: 'Authentication required: Host User ID not found' }, { status: 401 });
    }

    const hostBookings = await bookingDb.findByHostId(hostId);

    // Filter for pending requests
    const pendingRequests = hostBookings.filter(b => b.status === 'pending_approval');

    const enrichedRequests: EnrichedBookingRequest[] = [];
    for (const booking of pendingRequests) {
        const listing = await listingDb.findById(booking.listingId);
        const guest = await userDb.findById(booking.guestId);

        enrichedRequests.push({
            ...booking,
            listingDetails: listing ? { id: listing.id, title: listing.title, images: listing.images.slice(0,1) } : undefined,
            guestDetails: guest ? { id: guest.id, name: guest.name, profilePhotoUrl: guest.profilePhotoUrl } : undefined,
        });
    }

    // Sort by requestedAt date, oldest first to encourage timely response
    enrichedRequests.sort((a,b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime());

    return NextResponse.json(enrichedRequests, { status: 200 });

  } catch (error) {
    console.error('Get Host Booking Requests API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
