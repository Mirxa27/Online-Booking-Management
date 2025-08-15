import { Booking, BookingStatus, PaymentStatus, CancellationPolicyName } from './types';

const bookings: Booking[] = [];

export const getTripTimeStatus = (booking: Booking): 'upcoming' | 'current' | 'previous' | 'pending' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);

    if (booking.status === 'pending_approval' || (booking.status === 'awaiting_payment' && booking.paymentStatus === 'pending')) return 'pending';
    if (booking.status === 'confirmed' && booking.paymentStatus === 'succeeded') {
        if (checkIn > today) return 'upcoming';
        if (checkIn <= today && checkOut >= today) return 'current';
    }
    return 'previous';
};

export const bookingDb = {
  async createBooking(bookingData: Omit<Booking, 'id' | 'requestedAt' | 'paymentStatus' | 'hasBeenReviewed' | 'disputeId'>): Promise<Booking> {
    const newBooking: Booking = {
      id: `B${Date.now()}${Math.random().toString(16).slice(2)}`,
      requestedAt: new Date(),
      paymentStatus: 'pending',
      hasBeenReviewed: false,
      disputeId: undefined, // Initialize disputeId as undefined
      ...bookingData,
    };
    bookings.push(newBooking);
    console.log(`Booking created: ${newBooking.id}, Status: ${newBooking.status}, Payment: ${newBooking.paymentStatus}, Reviewed: ${newBooking.hasBeenReviewed}, DisputeID: ${newBooking.disputeId}`);
    return newBooking;
  },

  async findById(bookingId: string): Promise<Booking | undefined> {
    return bookings.find(b => b.id === bookingId);
  },

  async findByGuestId(guestId: string): Promise<Booking[]> {
    return bookings.filter(b => b.guestId === guestId).sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  },

  async findByHostId(hostId: string): Promise<Booking[]> {
    return bookings.filter(b => b.hostId === hostId).sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  },

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      return undefined;
    }
    bookings[bookingIndex] = { ...bookings[bookingIndex], ...updates };
    console.log(`Booking ${bookingId} updated. Status: ${bookings[bookingIndex].status}, Payment: ${bookings[bookingIndex].paymentStatus}, Reviewed: ${bookings[bookingIndex].hasBeenReviewed}, DisputeID: ${bookings[bookingIndex].disputeId}`);
    return bookings[bookingIndex];
  },

  getAllBookings(): Booking[] {
    return [...bookings];
  }
};

// Initialize with some dummy bookings
(async () => {
  if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && bookings.length === 0) {
      const createInitialBooking = (data: Partial<Booking>, idSuffix: string) => {
          const baseBooking: Omit<Booking, 'id' | 'requestedAt' | 'paymentStatus' | 'hasBeenReviewed' | 'disputeId'> = {
              listingId: 'L1', guestId: '0', hostId: 'U1',
              checkInDate: new Date(Date.now() - 30 * 24*60*60*1000).toISOString().split('T')[0],
              checkOutDate: new Date(Date.now() - 25 * 24*60*60*1000).toISOString().split('T')[0],
              numberOfGuests: 2, pricePerNight: 250, cleaningFee: 50, serviceFee: 30, totalPrice: (250*5)+50+30,
              status: 'completed',
              confirmedAt: new Date(Date.now() - 32 * 24*60*60*1000),
              ...data
          };
          const fullBooking: Booking = {
              id: `B_init_${idSuffix}_${baseBooking.listingId}`, // Ensure this ID format is used by disputeStore if needed
              requestedAt: data.requestedAt || new Date(Date.now() - 35 * 24*60*60*1000),
              paymentStatus: data.paymentStatus || 'succeeded',
              hasBeenReviewed: data.hasBeenReviewed || false,
              disputeId: data.disputeId || undefined,
              ...baseBooking,
              ...data,
          };
          bookings.push(fullBooking);
      };

      createInitialBooking({
          listingId: 'L1', hostId: 'U1', status: 'completed', paymentStatus: 'succeeded',
          cancellationPolicyApplied: 'Moderate', hasBeenReviewed: true,
      }, "1");

      createInitialBooking({
          listingId: 'L2', hostId: 'U2',
          checkInDate: new Date(Date.now() + 10 * 24*60*60*1000).toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() + 15 * 24*60*60*1000).toISOString().split('T')[0],
          numberOfGuests: 1, pricePerNight: 120, cleaningFee: 20, serviceFee: 15, totalPrice: (120*5)+20+15,
          status: 'confirmed', paymentStatus: 'succeeded',
          confirmedAt: new Date(Date.now() - 2 * 24*60*60*1000),
          cancellationPolicyApplied: 'Flexible',
      }, "2");

       createInitialBooking({
          listingId: 'L3', hostId: 'U1',
          checkInDate: new Date(Date.now() + 40 * 24*60*60*1000).toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() + 43 * 24*60*60*1000).toISOString().split('T')[0],
          numberOfGuests: 3, pricePerNight: 180, cleaningFee: 30, serviceFee: 20, totalPrice: (180*3)+30+20,
          status: 'pending_approval', paymentStatus: 'pending',
      }, "3");

      createInitialBooking({
          listingId: 'L4', hostId: 'U3',
          checkInDate: new Date(Date.now() - 1 * 24*60*60*1000).toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() + 2 * 24*60*60*1000).toISOString().split('T')[0],
          numberOfGuests: 2, pricePerNight: 80, cleaningFee: 10, serviceFee: 5, totalPrice: (80*3)+10+5,
          status: 'confirmed', paymentStatus: 'succeeded',
          confirmedAt: new Date(Date.now() - 5 * 24*60*60*1000),
          cancellationPolicyApplied: 'Flexible',
      }, "4");

      createInitialBooking({ // This booking ID will be used by disputeStore: B_init_5_L1
          listingId: 'L1', guestId: '0', hostId: 'U1',
          status: 'completed', paymentStatus: 'succeeded',
          checkInDate: new Date(Date.now() - 90 * 24*60*60*1000).toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() - 85 * 24*60*60*1000).toISOString().split('T')[0], // Ended 85 days ago
          hasBeenReviewed: false,
      }, "5");

      // Add a cancelled trip eligible for dispute
       createInitialBooking({
          id: 'B_init_6_L2_cancelled', // Specific ID for disputeStore
          listingId: 'L2', guestId: '0', hostId: 'U2',
          status: 'cancelled_by_guest', paymentStatus: 'refunded', // or partially_refunded
          checkInDate: new Date(Date.now() - 20 * 24*60*60*1000).toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() - 10 * 24*60*60*1000).toISOString().split('T')[0], // Ended 10 days ago
          hasBeenReviewed: false,
          cancelledAt: new Date(Date.now() - 12 * 24*60*60*1000),
          refundAmount: 100, cancellationPolicyApplied: 'Flexible',
      }, "6");


      console.log('Mock booking store initialized with dummy data, including `disputeId` field.');
  }
})();
