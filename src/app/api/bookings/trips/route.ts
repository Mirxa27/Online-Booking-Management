// GET endpoint for fetching user's trips, filterable by status
import { NextRequest, NextResponse } from 'next/server';
import { bookingDb, getTripTimeStatus } from '@/lib/bookingStore';
import { listingDb } from '@/lib/listingStore'; // To enrich booking data with listing details
import { Booking, Listing } from '@/lib/types';

interface EnrichedBooking extends Booking {
    listingDetails?: Omit<Listing, 'amenities' | 'description' | 'rules' | 'specialOffers' | 'availability'>; // Send partial listing info
    tripTimeStatus?: 'upcoming' | 'current' | 'previous' | 'pending';
}

export async function GET(req: NextRequest) {
  try {
    const guestId = req.headers.get('x-user-id');
    if (!guestId) {
      return NextResponse.json({ message: 'Authentication required: User ID not found' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') as 'pending' | 'upcoming' | 'current' | 'previous' | null;

    const userBookings = await bookingDb.findByGuestId(guestId);
    const enrichedBookings: EnrichedBooking[] = [];

    for (const booking of userBookings) {
        const listing = await listingDb.findById(booking.listingId);
        let listingDetails;
        if (listing) {
            listingDetails = {
                id: listing.id,
                title: listing.title,
                location: listing.location,
                images: listing.images.slice(0,1), // Send only the first image
                pricePerNight: listing.pricePerNight, // Could be useful context
                hostId: listing.hostId, // For "contact host" on trip card
            };
        }

        const tripTimeStatus = getTripTimeStatus(booking);

        if (statusFilter && statusFilter !== tripTimeStatus) {
            // If a status filter is applied and this booking doesn't match, skip it.
            // Special handling for 'previous' to include various end-state booking statuses.
            if (statusFilter === 'previous' &&
                !['completed', 'cancelled_by_guest', 'cancelled_by_host', 'declined_by_host', 'no_show'].includes(booking.status) &&
                tripTimeStatus !== 'previous' // Ensure truly past confirmed bookings are included
            ) {
                 continue;
            } else if (statusFilter !== 'previous' && tripTimeStatus !== statusFilter) {
                continue;
            }
        }

        enrichedBookings.push({ ...booking, listingDetails, tripTimeStatus });
    }

    // Sort by check-in date descending for most relevant first, or by requestedAt for pending
    enrichedBookings.sort((a, b) => {
        if (a.status === 'pending_approval' && b.status !== 'pending_approval') return -1;
        if (b.status === 'pending_approval' && a.status !== 'pending_approval') return 1;
        if (a.status === 'pending_approval' && b.status === 'pending_approval') {
            return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
        }
        return new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime();
    });


    return NextResponse.json(enrichedBookings, { status: 200 });

  } catch (error) {
    console.error('Get Trips API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
