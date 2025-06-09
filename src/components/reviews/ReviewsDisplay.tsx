// components/reviews/ReviewsDisplay.tsx
"use client";

import React, { useMemo } from 'react';

// Individual Star component for more granular display if needed
const StarIcon: React.FC<{ filled: boolean; halfFilled?: boolean; className?: string }> = ({ filled, halfFilled, className = "w-5 h-5" }) => (
  <svg className={`${className} ${filled || halfFilled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    {halfFilled ? (
      <>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.074 3.322a1 1 0 00.95.69h3.488c.969 0 1.371 1.24.588 1.81l-2.823 2.051a1 1 0 00-.364 1.118l1.074 3.322c.3.921-.755 1.688-1.54 1.118L10 13.498V2.45z" />
        <path d="M10 2.45v11.048l-3.386 2.456c-.784.57-1.838-.197-1.54-1.118l1.074-3.322a1 1 0 00-.363-1.118L2.28 9.403c-.784-.57-.38-1.81.588-1.81h3.488a1 1 0 00.95-.69L8.38 2.927c.15-.46.425-.772.669-.921z" fill="currentColor" className="text-gray-300" />
      </>
    ) : (
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.387 2.457a1 1 0 00-.364 1.118l1.287 3.973c.3.921-.755 1.688-1.54 1.118l-3.387-2.457a1 1 0 00-1.175 0l-3.387 2.457c-.784.57-1.838-.197-1.539-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.28 9.403c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.049 2.927z" />
    )}
  </svg>
);


// Star display for average ratings (supports half stars)
const AverageStarRating: React.FC<{ rating: number; totalStars?: number; starSize?: string }> = ({ rating, totalStars = 5, starSize = "w-5 h-5" }) => {
  const stars = [];
  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      stars.push(<StarIcon key={i} filled={true} className={starSize} />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<StarIcon key={i} filled={false} halfFilled={true} className={starSize} />);
    } else {
      stars.push(<StarIcon key={i} filled={false} className={starSize} />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};


export interface Review {
  id: string;
  guestName: string; // Or "Anonymous"
  guestAvatarUrl?: string; // Optional
  date: string; // ISO date string
  ratings: { // Individual category ratings
    cleanliness: number;
    accuracy: number;
    checkIn: number;
    communication: number;
    location: number;
    value: number;
  };
  publicComment: string;
  // No private feedback displayed publicly
}

interface ReviewsDisplayProps {
  listingId: string;
  reviews: Review[];
}

const ratingCategories = [
  { id: 'cleanliness', label: 'Cleanliness' },
  { id: 'accuracy', label: 'Accuracy' },
  { id: 'checkIn', label: 'Check-in' },
  { id: 'communication', label: 'Communication' },
  { id: 'location', label: 'Location' },
  { id: 'value', label: 'Value' },
] as const;


const ReviewsDisplay: React.FC<ReviewsDisplayProps> = ({ listingId, reviews }) => {
  const overallAverage = useMemo(() => {
    if (reviews.length === 0) return 0;
    const totalSum = reviews.reduce((sum, review) => {
      const categorySum = Object.values(review.ratings).reduce((s, r) => s + r, 0);
      return sum + categorySum / Object.keys(review.ratings).length; // Average for this review
    }, 0);
    return parseFloat((totalSum / reviews.length).toFixed(1));
  }, [reviews]);

  const categoryAverages = useMemo(() => {
    if (reviews.length === 0) return null;
    const sums: Record<keyof Review['ratings'], number> = { cleanliness: 0, accuracy: 0, checkIn: 0, communication: 0, location: 0, value: 0 };
    const counts: Record<keyof Review['ratings'], number> = { cleanliness: 0, accuracy: 0, checkIn: 0, communication: 0, location: 0, value: 0 };

    reviews.forEach(review => {
      for (const key_ in review.ratings) {
        const key = key_ as keyof Review['ratings']; // Type assertion
        sums[key] += review.ratings[key];
        counts[key]++;
      }
    });

    const averages: any = {};
    ratingCategories.forEach(cat => {
      averages[cat.id] = counts[cat.id] > 0 ? parseFloat((sums[cat.id] / counts[cat.id]).toFixed(1)) : 0;
    });
    return averages as Record<keyof Review['ratings'], number>;
  }, [reviews]);

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600 text-lg">No reviews yet for this property.</p>
        <p className="text-sm text-gray-500">Be the first to leave a review after your stay!</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <StarIcon filled={true} className="w-6 h-6 mr-2 text-yellow-400" />
        {overallAverage} &middot; {reviews.length} review{reviews.length === 1 ? '' : 's'}
      </h3>

      {/* Category Averages */}
      {categoryAverages && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
          {ratingCategories.map(category => (
            <div key={category.id} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{category.label}</span>
              <div className="flex items-center">
                <AverageStarRating rating={categoryAverages[category.id]} starSize="w-4 h-4" />
                <span className="ml-2 text-sm text-gray-600">{categoryAverages[category.id].toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Individual Reviews List */}
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="pb-6 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center mb-2">
              {review.guestAvatarUrl ? (
                <img src={review.guestAvatarUrl} alt={review.guestName} className="w-10 h-10 rounded-full mr-3" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-semibold mr-3 text-sm">
                  {review.guestName.substring(0,1)}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">{review.guestName}</p>
                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            {/* Optionally display per-review average or specific category stars */}
            {/* <AverageStarRating rating={Object.values(review.ratings).reduce((s,r)=>s+r,0)/Object.keys(review.ratings).length} starSize="w-4 h-4 mb-1" /> */}
            <p className="text-gray-700 leading-relaxed">{review.publicComment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


// Example Usage
export const ExampleReviewsUsage: React.FC = () => {
  const mockReviewsData: Review[] = [
    {
      id: 'r1', guestName: 'Alice Wonderland', date: new Date(Date.now() - 10 * 24*60*60*1000).toISOString(),
      ratings: { cleanliness: 5, accuracy: 5, checkIn: 4, communication: 5, location: 4, value: 5 },
      publicComment: "Absolutely loved this place! It was sparkling clean and the host was amazing. The location was perfect for exploring downtown. Would definitely recommend and stay again!",
      guestAvatarUrl: 'https://via.placeholder.com/40?text=AW'
    },
    {
      id: 'r2', guestName: 'Bob The Builder', date: new Date(Date.now() - 25 * 24*60*60*1000).toISOString(),
      ratings: { cleanliness: 4, accuracy: 4, checkIn: 5, communication: 4, location: 5, value: 4 },
      publicComment: "Great location and good value for money. The check-in process was super smooth. Place was mostly as described, just a little smaller than expected but fine for two people.",
    },
     {
      id: 'r3', guestName: 'Charlie Brown', date: new Date(Date.now() - 40 * 24*60*60*1000).toISOString(),
      ratings: { cleanliness: 3, accuracy: 4, checkIn: 3, communication: 3, location: 4, value: 3 },
      publicComment: "It was an okay stay. Communication with host could have been better and cleanliness was not up to par in the bathroom. Location is good though.",
      guestAvatarUrl: 'https://via.placeholder.com/40?text=CB'
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-5">
      <ReviewsDisplay listingId="L123" reviews={mockReviewsData} />
      <hr className="my-8" />
      <h3 className="text-center text-lg font-semibold mb-4">No Reviews Example:</h3>
      <ReviewsDisplay listingId="L456" reviews={[]} />
    </div>
  );
};

export default ReviewsDisplay;
