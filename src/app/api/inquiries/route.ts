// POST endpoint for creating a host inquiry
import { NextRequest, NextResponse } from 'next/server';
import { inquiryDb } from '@/lib/inquiryStore';
import { listingDb } from '@/lib/listingStore';
import { userDb } from '@/lib/userStore'; // Required for checking if user is a host
import { HostInquiry, Listing, User } from '@/lib/types'; // Import necessary types

export async function POST(req: NextRequest) {
  try {
    const guestId = req.headers.get('x-user-id');
    if (!guestId) {
      return NextResponse.json({ message: 'Authentication required: User ID not found' }, { status: 401 });
    }

    const {
      listingId,
      message,
      checkInDate,
      checkOutDate,
      numberOfGuests
    } = await req.json();

    if (!listingId || !message) {
      return NextResponse.json({ message: 'Listing ID and message content are required' }, { status: 400 });
    }

    const listing = await listingDb.findById(listingId);
    if (!listing) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
    }

    if (checkInDate && checkOutDate) {
        const today = new Date(); today.setHours(0,0,0,0);
        const parsedCheckIn = new Date(checkInDate);
        const parsedCheckOut = new Date(checkOutDate);
        if (parsedCheckIn < today || parsedCheckOut <= parsedCheckIn) {
            console.warn(`Inquiry ${guestId} for ${listingId} submitted with invalid dates.`);
        }
    }

    const newInquiry = await inquiryDb.createInquiry({
      listingId,
      guestId,
      hostId: listing.hostId,
      message,
      checkInDate: checkInDate || undefined,
      checkOutDate: checkOutDate || undefined,
      numberOfGuests: numberOfGuests || undefined,
    });

    console.log(`Host ${listing.hostId} should be notified for new inquiry ${newInquiry.id} from guest ${guestId}.`);
    return NextResponse.json({ message: 'Inquiry sent successfully.', inquiry: newInquiry }, { status: 201 });

  } catch (error) {
    console.error('Host Inquiry API error:', error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

// GET endpoint for retrieving inquiries
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const viewMode = searchParams.get('viewMode') || 'guest'; // 'guest' or 'host'

    let userInquiries: HostInquiry[] = [];

    if (viewMode === 'host') {
      // Check if user is actually a host of any listings.
      // This is a simplified check; a real app might have a user.role or more direct host status.
      const userListings = await listingDb.searchListings({ /* no filters, effectively all */ });
      const isHost = userListings.some(listing => listing.hostId === userId);

      if (!isHost) {
        // If user is not a host of any listing, they can't view inquiries as a host.
        // Or, more leniently, return empty array if they own no listings that received inquiries.
         return NextResponse.json({ message: 'User is not a host or has no listings with inquiries.' , inquiries: [] }, { status: 200 }); // or 403 if strict
      }
      userInquiries = await inquiryDb.findByHostId(userId);
    } else { // Default to 'guest' view
      userInquiries = await inquiryDb.findByGuestId(userId);
    }

    // Enrich inquiries with basic listing title and guest/host names for display
    const enrichedInquiries = await Promise.all(userInquiries.map(async (inquiry) => {
        const listing = await listingDb.findById(inquiry.listingId);
        const guest = await userDb.findById(inquiry.guestId);
        const host = await userDb.findById(inquiry.hostId);
        return {
            ...inquiry,
            listingTitle: listing?.title,
            guestName: guest?.name,
            hostName: host?.name,
        };
    }));

    return NextResponse.json(enrichedInquiries, { status: 200 });

  } catch (error) {
    console.error('Get Inquiries API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
