import { Review, ReviewRatings } from './types';

const reviews: Review[] = [];

export const reviewDb = {
  async addReview(reviewData: Omit<Review, 'id' | 'reviewDate'>): Promise<Review> {
    const newReview: Review = {
      id: `R${Date.now()}${Math.random().toString(16).slice(2)}`,
      reviewDate: new Date(),
      ...reviewData,
    };
    reviews.push(newReview);
    console.log(`Review ${newReview.id} added for listing ${newReview.listingId} by guest ${newReview.guestId}.`);
    return newReview;
  },

  async getReviewsByListingId(listingId: string): Promise<Review[]> {
    return reviews.filter(r => r.listingId === listingId).sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
  },

  async getReviewByBookingId(bookingId: string): Promise<Review | undefined> {
    return reviews.find(r => r.bookingId === bookingId);
  },

  async calculateAverageRatings(listingId: string): Promise<{ averageRatings: ReviewRatings & { overall: number }, totalReviews: number } | null> {
    const listingReviews = await this.getReviewsByListingId(listingId);
    if (listingReviews.length === 0) {
      return null;
    }

    const initialSums: ReviewRatings = { cleanliness: 0, accuracy: 0, checkIn: 0, communication: 0, location: 0, value: 0 };
    const ratingSums = listingReviews.reduce((sums, review) => {
      (Object.keys(review.ratings) as Array<keyof ReviewRatings>).forEach(key => {
        sums[key] += review.ratings[key];
      });
      return sums;
    }, initialSums);

    const totalReviews = listingReviews.length;
    const averageRatings: any = {};
    let overallSum = 0;
    (Object.keys(ratingSums) as Array<keyof ReviewRatings>).forEach(key => {
      const avg = parseFloat((ratingSums[key] / totalReviews).toFixed(1));
      averageRatings[key] = avg;
      overallSum += avg;
    });

    averageRatings.overall = parseFloat((overallSum / Object.keys(averageRatings).length).toFixed(1));

    return { averageRatings: averageRatings as ReviewRatings & { overall: number }, totalReviews };
  },

  getAllReviews(): Review[] { // For inspection or admin
    return [...reviews];
  }
};

// Initialize with some dummy reviews for testing
(async () => {
  if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && reviews.length === 0) {
    // Assume booking 'B_completed_trip_for_user_0' (actual ID from bookingStore) for listing 'L1', guest '0', host 'U1'
    // This requires coordination or knowledge of IDs from other stores.
    // For now, using placeholder IDs.
    reviewDb.addReview({
      bookingId: 'B_completed_L1', // Example booking ID
      listingId: 'L1',
      guestId: '0',
      hostId: 'U1',
      ratings: { cleanliness: 5, accuracy: 4, checkIn: 5, communication: 5, location: 4, value: 4 },
      publicComment: "Wonderful stay! The place was clean and the host was very communicative. Great location.",
      privateFeedback: "Maybe add a few more kitchen utensils, but overall fantastic!"
    });
    reviewDb.addReview({
      bookingId: 'B_another_completed_L1',
      listingId: 'L1',
      guestId: '1', // Another user
      hostId: 'U1',
      ratings: { cleanliness: 4, accuracy: 5, checkIn: 4, communication: 4, location: 5, value: 4 },
      publicComment: "Loved the location and the accuracy of the listing photos. Check-in was smooth."
    });
     reviewDb.addReview({ // For a different listing
      bookingId: 'B_completed_L2',
      listingId: 'L2',
      guestId: '0',
      hostId: 'U2',
      ratings: { cleanliness: 3, accuracy: 3, checkIn: 4, communication: 4, location: 5, value: 3 },
      publicComment: "Decent place for the price. Location is unbeatable, but could be a bit cleaner."
    });
    console.log('Mock review store initialized with dummy data.');
  }
})();
