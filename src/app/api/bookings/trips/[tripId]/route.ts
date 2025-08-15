// GET endpoint for fetching a specific trip's itinerary (detailed booking)
import { NextRequest, NextResponse } from 'next/server';
import { bookingDb, getTripTimeStatus } from '@/lib/bookingStore';
import { listingDb } from '@/lib/listingStore';
import { userDb } from '@/lib/userStore'; // To potentially get host details
import { Booking, Listing, User } from '@/lib/types';

interface DetailedTrip extends Booking {
    listingDetails?: Listing; // Full listing details
    hostDetails?: Pick<User, 'id' | 'name' | 'profilePhotoUrl'>; // Partial host details
    tripTimeStatus?: 'upcoming' | 'current' | 'previous' | 'pending';
}

export async function GET(
  req: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id'); // Guest or Host checking the trip
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { tripId } = params;
    if (!tripId) {
      return NextResponse.json({ message: 'Trip ID is required' }, { status: 400 });
    }

    const booking = await bookingDb.findById(tripId);

    if (!booking) {
      return NextResponse.json({ message: 'Trip not found' }, { status: 404 });
    }

    // Security check: Ensure the user requesting is either the guest or the host of the booking
    if (booking.guestId !== userId && booking.hostId !== userId) {
      return NextResponse.json({ message: 'Forbidden: You do not have access to this trip' }, { status: 403 });
    }

    const listing = await listingDb.findById(booking.listingId);
    const host = await userDb.findById(booking.hostId);

    let hostDetails;
    if (host) {
        hostDetails = {
            id: host.id,
            name: host.name,
            profilePhotoUrl: host.profilePhotoUrl
        };
    }

    const tripTimeStatus = getTripTimeStatus(booking);

    const detailedTrip: DetailedTrip = {
        ...booking,
        listingDetails: listing,
        hostDetails,
        tripTimeStatus
    };

    return NextResponse.json(detailedTrip, { status: 200 });

  } catch (error) {
    console.error('Get Trip Itinerary API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
