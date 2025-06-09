import { PaymentTransaction, PaymentStatus } from './types';

const transactions: PaymentTransaction[] = [];

export const paymentDb = {
  async createTransaction(data: Omit<PaymentTransaction, 'id' | 'transactionTimestamp'>): Promise<PaymentTransaction> {
    const newTransaction: PaymentTransaction = {
      id: `txn_${Date.now()}${Math.random().toString(16).slice(2)}`,
      transactionTimestamp: new Date(),
      ...data,
    };
    transactions.push(newTransaction);
    console.log(`Payment transaction ${newTransaction.id} created for booking ${newTransaction.bookingId} with status ${newTransaction.status}.`);
    return newTransaction;
  },

  async findByBookingId(bookingId: string): Promise<PaymentTransaction[]> {
    return transactions.filter(t => t.bookingId === bookingId).sort((a,b) => b.transactionTimestamp.getTime() - a.transactionTimestamp.getTime());
  },

  async findById(transactionId: string): Promise<PaymentTransaction | undefined> {
    return transactions.find(t => t.id === transactionId);
  },

  async updateTransactionStatus(transactionId: string, status: PaymentStatus, notes?: string): Promise<PaymentTransaction | undefined> {
    const txIndex = transactions.findIndex(t => t.id === transactionId);
    if (txIndex === -1) return undefined;
    transactions[txIndex].status = status;
    if (notes) {
        transactions[txIndex].notes = notes;
    }
    console.log(`Payment transaction ${transactionId} status updated to ${status}.`);
    return transactions[txIndex];
  },

  getAllTransactions(): PaymentTransaction[] {
    return [...transactions];
  }
};

// Example: Initialize with a successful transaction for one of the dummy bookings
(async () => {
    if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && transactions.length === 0) {
        // Find a confirmed or completed booking from bookingStore to associate this with.
        // This requires bookingStore to be initialized first, or careful coordination.
        // For simplicity, we'll assume a bookingId 'B...' might exist.
        // Let's say booking 'B_completed_trip_for_user_0' (needs actual ID from bookingStore init)
        // For now, using a placeholder bookingId. This should align with bookingStore's dummy data.
        // const exampleBookingId = bookingDb.getAllBookings().find(b => b.status === 'completed')?.id || 'B_dummy_completed';

        // This part is tricky because stores are separate. In real app, DB handles relations.
        // We'll just add one without a real booking ID for now, or assume one.
        // If bookingStore.ts dummy data creates a booking with ID like the one from its own init:
        // const completedBooking = (await import('@/lib/bookingStore')).bookingDb.getAllBookings().find(b => b.status === 'completed');
        // if (completedBooking) {
        //     paymentDb.createTransaction({
        //         bookingId: completedBooking.id,
        //         amount: completedBooking.totalPrice,
        //         currency: 'USD',
        //         paymentMethod: 'credit_card',
        //         status: 'succeeded',
        //         gatewayTransactionId: 'mock_gateway_completed'
        //     });
        // }
        // console.log('Mock payment store initialized.');
    }
})();
