// app/(account-pages)/reviews/components/LeaveReviewForm.tsx
"use client";

import React, { useState } from 'react';

// StarRating component (can be made more generic)
const StarRating: React.FC<{ count: number; value: number; onChange: (value: number) => void }> = ({ count, value, onChange }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          onClick={() => onChange(i + 1)}
          className={`w-6 h-6 cursor-pointer ${i < value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.387 2.457a1 1 0 00-.364 1.118l1.287 3.973c.3.921-.755 1.688-1.54 1.118l-3.387-2.457a1 1 0 00-1.175 0l-3.387 2.457c-.784.57-1.838-.197-1.539-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.28 9.403c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
};

export interface ReviewData {
  bookingId: string;
  ratings: {
    cleanliness: number;
    accuracy: number;
    checkIn: number;
    communication: number;
    location: number;
    value: number;
  };
  publicComment: string;
  privateFeedback?: string;
}

interface LeaveReviewFormProps {
  bookingId: string; // To associate the review with a booking
  listingName: string; // To display context to the user
  hostName?: string; // For private feedback context
  onSubmitReview: (reviewData: ReviewData) => void;
  onCancel?: () => void;
}

const ratingCategories = [
  { id: 'cleanliness', label: 'Cleanliness' },
  { id: 'accuracy', label: 'Accuracy (Description vs. Reality)' },
  { id: 'checkIn', label: 'Check-in Process' },
  { id: 'communication', label: 'Communication with Host' },
  { id: 'location', label: 'Location' },
  { id: 'value', label: 'Value for Money' },
] as const; // Use "as const" for stricter typing of category IDs

const LeaveReviewForm: React.FC<LeaveReviewFormProps> = ({
  bookingId,
  listingName,
  hostName,
  onSubmitReview,
  onCancel,
}) => {
  const [ratings, setRatings] = useState<ReviewData['ratings']>(() => {
    const initialRatings: any = {};
    ratingCategories.forEach(cat => initialRatings[cat.id] = 0);
    return initialRatings as ReviewData['ratings'];
  });
  const [publicComment, setPublicComment] = useState('');
  const [privateFeedback, setPrivateFeedback] = useState('');

  const handleRatingChange = (category: keyof ReviewData['ratings'], value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation: ensure all ratings are given and public comment exists
    if (Object.values(ratings).some(r => r === 0)) {
      alert('Please provide a rating for all categories.');
      return;
    }
    if (!publicComment.trim()) {
      alert('Please write a public review comment.');
      return;
    }
    onSubmitReview({ bookingId, ratings, publicComment, privateFeedback });
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Leave a Review for</h2>
      <p className="text-md text-indigo-600 mb-6">{listingName}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Ratings */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Ratings</h3>
          <div className="space-y-3">
            {ratingCategories.map(category => (
              <div key={category.id}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{category.label}</label>
                <StarRating count={5} value={ratings[category.id]} onChange={(value) => handleRatingChange(category.id, value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Public Review Comment */}
        <div>
          <label htmlFor="publicComment" className="block text-sm font-medium text-gray-700">
            Public Review
          </label>
          <p className="text-xs text-gray-500 mb-1">This will be visible to everyone on the listing page.</p>
          <textarea
            id="publicComment"
            rows={4}
            value={publicComment}
            onChange={(e) => setPublicComment(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Share your experience with other travelers..."
            required
          />
        </div>

        {/* Private Feedback to Host */}
        <div>
          <label htmlFor="privateFeedback" className="block text-sm font-medium text-gray-700">
            Private Feedback for {hostName || 'the Host'} (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-1">This will only be shared with your host.</p>
          <textarea
            id="privateFeedback"
            rows={3}
            value={privateFeedback}
            onChange={(e) => setPrivateFeedback(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any private suggestions or thanks for your host..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveReviewForm;
