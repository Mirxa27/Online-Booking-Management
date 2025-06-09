import { Dispute, DisputeStatus, DisputeMessage, DisputeReason } from './types';

const disputes: Dispute[] = [];

export const disputeDb = {
  async addDispute(disputeData: Omit<Dispute, 'id' | 'raisedAt' | 'updatedAt' | 'status' | 'messages'>): Promise<Dispute> {
    const newDispute: Dispute = {
      id: `D${Date.now()}${Math.random().toString(16).slice(2)}`,
      raisedAt: new Date(),
      updatedAt: new Date(),
      status: disputeData.raisedByUserId === disputeData.guestId ? 'AWAITING_HOST_RESPONSE' : 'AWAITING_GUEST_RESPONSE', // Initial status
      messages: [],
      ...disputeData,
    };
    disputes.push(newDispute);
    console.log(`Dispute ${newDispute.id} raised for booking ${newDispute.bookingId}. Status: ${newDispute.status}.`);
    return newDispute;
  },

  async getDisputeById(disputeId: string): Promise<Dispute | undefined> {
    return disputes.find(d => d.id === disputeId);
  },

  async getDisputeByBookingId(bookingId: string): Promise<Dispute | undefined> {
    return disputes.find(d => d.bookingId === bookingId);
  },

  async updateDispute(disputeId: string, updates: Partial<Omit<Dispute, 'id' | 'bookingId' | 'listingId' | 'guestId' | 'hostId' | 'raisedAt' | 'raisedByUserId'>>): Promise<Dispute | undefined> {
    const disputeIndex = disputes.findIndex(d => d.id === disputeId);
    if (disputeIndex === -1) {
      return undefined;
    }
    disputes[disputeIndex] = {
        ...disputes[disputeIndex],
        ...updates,
        updatedAt: new Date()
    };
    console.log(`Dispute ${disputeId} updated. New status: ${disputes[disputeIndex].status}. Admin involved: ${disputes[disputeIndex].adminInvolvedUserId}`);
    return disputes[disputeIndex];
  },

  async addMessageToDispute(disputeId: string, messageData: Omit<DisputeMessage, 'id' | 'disputeId' | 'sentAt'>) : Promise<Dispute | undefined> {
    const dispute = await this.getDisputeById(disputeId);
    if (!dispute) return undefined;

    const newMessage: DisputeMessage = {
        id: `DM${Date.now()}`,
        disputeId,
        sentAt: new Date(),
        ...messageData
    };
    dispute.messages = [...(dispute.messages || []), newMessage];
    dispute.updatedAt = new Date();
    // Potentially update status based on message sender, e.g., if host responds, status changes.
    // For now, status updates are manual via updateDispute.
    console.log(`Message added to dispute ${disputeId} by user ${messageData.userId}`);
    return dispute;
  },

  // Mock function for admin involvement
  async assignAdminToDispute(disputeId: string, adminUserId: string): Promise<Dispute | undefined> {
    return this.updateDispute(disputeId, { adminInvolvedUserId: adminUserId, status: 'UNDER_ADMIN_REVIEW' });
  },

  getAllDisputes(): Dispute[] { // For inspection or admin
    return [...disputes];
  }
};

// Initialize with some dummy disputes for testing
(async () => {
  if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && disputes.length === 0) {
    // Assume booking 'B_init_5_L1' (a completed trip for user '0' on listing 'L1' by host 'U1') exists
    // This requires coordination with bookingStore's dummy data.
    disputeDb.addDispute({
      bookingId: 'B_init_5_L1', // Example, ensure this booking ID exists and is completed/cancelled
      listingId: 'L1',
      guestId: '0',
      hostId: 'U1',
      raisedByUserId: '0', // Raised by guest
      reason: 'cleanliness_issues' as DisputeReason,
      explanation: 'The bathroom was not clean upon arrival. Hairs in the shower and a dirty toilet.',
      desiredResolution: 'Partial refund of cleaning fee.',
    });
    // Simulate a dispute that's further along
    const d2 = await disputeDb.addDispute({
      bookingId: 'B_another_completed_L1', // Needs another completed booking
      listingId: 'L1',
      guestId: '1',
      hostId: 'U1',
      raisedByUserId: '1',
      reason: 'property_not_as_described' as DisputeReason,
      explanation: 'The listing mentioned a sea view, but it was mostly obstructed by a new building.',
      desiredResolution: '20% refund.',
    });
    if (d2) {
        await disputeDb.addMessageToDispute(d2.id, {userId: 'U1', message: 'I apologize for the view, the new construction was unexpected. I can offer a 10% refund.'});
        await disputeDb.assignAdminToDispute(d2.id, 'adminUser123');
    }

    console.log('Mock dispute store initialized with dummy data.');
  }
})();
