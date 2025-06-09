import { HostInquiry } from './types';

// In-memory store for host inquiries
const inquiries: HostInquiry[] = [];

export const inquiryDb = {
  async createInquiry(inquiryData: Omit<HostInquiry, 'id' | 'sentAt'>): Promise<HostInquiry> {
    const newInquiry: HostInquiry = {
      id: `I${Date.now()}${Math.random().toString(16).slice(2)}`,
      sentAt: new Date(),
      ...inquiryData,
    };
    inquiries.push(newInquiry);
    console.log(`Inquiry created: ${newInquiry.id}, Total Inquiries: ${inquiries.length}`);
    return newInquiry;
  },

  async findById(inquiryId: string): Promise<HostInquiry | undefined> {
    return inquiries.find(i => i.id === inquiryId);
  },

  async findByHostId(hostId: string): Promise<HostInquiry[]> {
    return inquiries.filter(i => i.hostId === hostId).sort((a,b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  },

  async findByGuestId(guestId: string): Promise<HostInquiry[]> {
    return inquiries.filter(i => i.guestId === guestId).sort((a,b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  },

  async markAsRead(inquiryId: string): Promise<HostInquiry | undefined> {
    const inquiryIndex = inquiries.findIndex(i => i.id === inquiryId);
    if (inquiryIndex === -1) {
        return undefined;
    }
    if (!inquiries[inquiryIndex].readAt) { // Only update if not already read to avoid changing timestamp
        inquiries[inquiryIndex].readAt = new Date();
    }
    return inquiries[inquiryIndex];
  },

  getAllInquiries(): HostInquiry[] { // For inspection or admin purposes
    return [...inquiries];
  }
};

// Initialize with some dummy inquiries for testing
(async () => {
  if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && inquiries.length === 0) {
      // Assuming user '0' (guest) and host 'U1' (for listing 'L1')
      inquiryDb.createInquiry({
          listingId: 'L1',
          guestId: '0',
          hostId: 'U1',
          message: 'Hello, I am interested in your beachfront condo for next month. Is there any flexibility on the price for a 10-day stay?',
          checkInDate: new Date(Date.now() + 35 * 24*60*60*1000).toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() + 45 * 24*60*60*1000).toISOString().split('T')[0],
          numberOfGuests: 2,
      });
      inquiryDb.createInquiry({
          listingId: 'L3',
          guestId: '1', // User '1'
          hostId: 'U1', // Host of L3
          message: 'Is your cabin pet-friendly for two small dogs?',
          numberOfGuests: 2,
      });
      console.log('Mock inquiry store initialized with dummy data.');
  }
})();
