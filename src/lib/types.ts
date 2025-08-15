export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  phone: string;
  bio: string;
  languagePreferences: string;
  profilePhotoUrl: string;
  verificationStatus: 'not_verified' | 'pending_email_verification' | 'email_verified' | 'pending_document_review' | 'verified' | 'rejected';
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: Date;
  uploadedDocuments?: Array<{
    id: string;
    url: string;
    fileName: string;
    documentType: string;
    uploadedAt: Date;
    status: 'pending_review' | 'approved' | 'rejected';
    reviewedAt?: Date;
    rejectionReason?: string;
  }>;
  wishlistIds?: string[];
}

export interface AuthJWTPayload {
  userId: string;
  email: string;
  // Could add 'isAdmin' role here for admin-specific actions
}

export interface Location {
  address?: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  lat: number;
  lng: number;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export type RoomType = 'entire_place' | 'private_room' | 'shared_room';

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  discountAmount?: number;
  minNights?: number;
  maxNights?: number;
  validFrom?: Date;
  validUntil?: Date;
}

export type CancellationPolicyName = 'Flexible' | 'Moderate' | 'Strict' | 'NonRefundable' | 'Custom';

export interface Listing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  location: Location;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: Amenity[];
  roomType: RoomType;
  images: string[];
  availability?: any;
  rules?: string[];
  rating?: number;
  reviewsCount?: number;
  isInstantBookable?: boolean;
  specialOffers?: SpecialOffer[];
  cancellationPolicy: CancellationPolicyName;
  customCancellationPolicyDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  userId: string;
  listingId: string;
  addedAt: Date;
}

export interface UserWithWishlist extends User {
  wishlist: Listing[];
}

export type BookingStatus =
  | 'pending_approval'
  | 'confirmed'
  | 'declined_by_host'
  | 'cancelled_by_guest'
  | 'cancelled_by_host'
  | 'awaiting_payment'
  | 'payment_failed'
  | 'completed'
  | 'no_show';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded';

export interface PaymentTransaction {
    id: string;
    bookingId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionTimestamp: Date;
    status: PaymentStatus;
    gatewayTransactionId?: string;
    notes?: string;
}

export interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  hostId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  status: BookingStatus;
  requestedAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  cancellationPolicyApplied?: CancellationPolicyName;
  customCancellationPolicyAppliedDetails?: string;
  refundAmount?: number;
  hasBeenReviewed?: boolean;
  disputeId?: string; // Link to a Dispute object
}

export interface HostInquiry {
  id: string;
  listingId: string;
  guestId: string;
  hostId: string;
  message: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  sentAt: Date;
  readAt?: Date;
}

export interface ReviewRatings {
    cleanliness: number;
    accuracy: number;
    checkIn: number;
    communication: number;
    location: number;
    value: number;
}

export interface Review {
    id: string;
    bookingId: string;
    listingId: string;
    guestId: string;
    hostId: string;
    ratings: ReviewRatings;
    publicComment: string;
    privateFeedback?: string;
    reviewDate: Date;
}

// --- Dispute Management ---
export type DisputeReason =
  | 'property_not_as_described'
  | 'cleanliness_issues'
  | 'host_cancelled_refund_issue'
  | 'safety_concern'
  | 'payment_issue' // e.g. incorrect charge
  | 'other';

export type DisputeStatus =
  | 'OPEN' // Newly raised by guest or host
  | 'AWAITING_HOST_RESPONSE' // Guest raised, host needs to respond
  | 'AWAITING_GUEST_RESPONSE' // Host responded, guest needs to respond/acknowledge
  | 'UNDER_ADMIN_REVIEW' // Escalated to platform admin
  | 'RESOLVED_REFUND_ISSUED'
  | 'RESOLVED_NO_REFUND'
  | 'RESOLVED_OTHER_AGREEMENT' // e.g. future credit
  | 'CLOSED_INVALID' // e.g. duplicate, out of scope
  | 'CLOSED_WITHDRAWN'; // Raised by mistake, withdrawn by raiser

export interface DisputeMessage { // For communication within a dispute
    id: string;
    disputeId: string;
    userId: string; // User who sent the message (guest, host, or admin)
    message: string;
    sentAt: Date;
    isInternalNote?: boolean; // For admin notes not visible to guest/host
}

export interface Dispute {
    id: string;
    bookingId: string;
    listingId: string;
    guestId: string;
    hostId: string;
    raisedByUserId: string; // Who initiated the dispute (guestId or hostId)
    reason: DisputeReason;
    explanation: string; // Initial explanation from the raiser
    desiredResolution?: string; // Initial desired resolution from the raiser
    status: DisputeStatus;
    raisedAt: Date;
    updatedAt: Date; // Last time any action was taken or message added
    resolvedAt?: Date;
    adminInvolvedUserId?: string; // ID of admin if one is assigned
    resolutionDetails?: string; // Final outcome summary
    messages?: DisputeMessage[]; // Thread of messages related to this dispute
}
