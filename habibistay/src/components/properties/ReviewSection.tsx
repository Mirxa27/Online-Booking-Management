'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import { format } from 'date-fns'

interface ReviewSectionProps {
  propertyId: string
}

export default function ReviewSection({ propertyId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRatings, setAverageRatings] = useState<any>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchReviews()
  }, [propertyId, page])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?propertyId=${propertyId}&page=${page}`)
      const data = await response.json()
      
      if (data.success) {
        setReviews(data.reviews)
        setAverageRatings(data.averageRatings)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No reviews yet</p>
          <p className="text-sm text-gray-500 mt-1">Be the first to review this property!</p>
        </div>
      ) : (
        <>
          {/* Average Ratings */}
          {averageRatings && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    {averageRatings.overall.toFixed(1)}
                  </span>
                  <div className="flex ml-2">{renderStars(averageRatings.overall)}</div>
                </div>
                <p className="text-sm text-gray-600">Overall rating</p>
              </div>
              
              {['cleanliness', 'accuracy', 'communication', 'location', 'checkIn', 'value'].map((category) => (
                averageRatings[category] > 0 && (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 capitalize">{category}</span>
                      <span className="font-medium">{averageRatings[category].toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-habibistay-blue h-2 rounded-full"
                        style={{ width: `${(averageRatings[category] / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {review.guest.image ? (
                        <img
                          src={review.guest.image}
                          alt={review.guest.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {review.guest.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{review.guest.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(review.createdAt), 'MMMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                
                {review.booking && (
                  <p className="text-sm text-gray-500 mt-2">
                    Stayed {format(new Date(review.booking.checkIn), 'MMM d')} - {' '}
                    {format(new Date(review.booking.checkOut), 'MMM d, yyyy')}
                  </p>
                )}
                
                <button className="mt-3 text-sm text-gray-600 hover:text-gray-900 flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful
                </button>
              </div>
            ))}
          </div>

          {/* Load More */}
          {reviews.length >= 10 && (
            <button
              onClick={() => setPage(page + 1)}
              className="mt-6 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Show more reviews
            </button>
          )}
        </>
      )}
    </div>
  )
}