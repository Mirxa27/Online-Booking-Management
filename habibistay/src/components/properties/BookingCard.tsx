'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, Star, Info } from 'lucide-react'
import { differenceInDays } from 'date-fns'

interface BookingCardProps {
  property: any
}

export default function BookingCard({ property }: BookingCardProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [isBooking, setIsBooking] = useState(false)

  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0
  const subtotal = nights * property.pricePerNight
  const cleaningFee = property.cleaningFee || 0
  const serviceFee = property.serviceFee || Math.round(subtotal * 0.1)
  const total = subtotal + cleaningFee + serviceFee

  const handleBooking = async () => {
    if (!checkIn || !checkOut || guests < 1) {
      alert('Please select dates and number of guests')
      return
    }

    setIsBooking(true)

    // Store booking details in session storage
    sessionStorage.setItem('bookingDetails', JSON.stringify({
      propertyId: property.id,
      checkIn,
      checkOut,
      guests,
      nights,
      total,
      pricePerNight: property.pricePerNight,
      cleaningFee,
      serviceFee
    }))

    // Redirect to booking page
    router.push(`/booking/new?property=${property.id}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-gray-900">${property.pricePerNight}</span>
          <span className="text-gray-600"> /night</span>
        </div>
        {property.averageRating > 0 && (
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="ml-1 font-medium">{property.averageRating}</span>
            <span className="ml-1 text-gray-500 text-sm">({property.reviewCount})</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-3 border-r border-gray-300">
            <label className="block text-xs font-medium text-gray-700 mb-1">CHECK-IN</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full text-sm focus:outline-none"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">CHECK-OUT</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="w-full text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Guests Selection */}
        <div className="border border-gray-300 rounded-lg p-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">GUESTS</label>
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full text-sm focus:outline-none"
          >
            {[...Array(property.maxGuests)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={isBooking || !checkIn || !checkOut}
          className="w-full py-3 bg-habibistay-blue text-white font-medium rounded-lg hover:bg-habibistay-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBooking ? 'Processing...' : 'Reserve'}
        </button>

        {/* Pricing Breakdown */}
        {nights > 0 && (
          <>
            <p className="text-center text-sm text-gray-500">You won't be charged yet</p>
            
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  ${property.pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
                <span>${subtotal}</span>
              </div>
              {cleaningFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center">
                  Service fee
                  <Info className="w-3 h-3 ml-1" />
                </span>
                <span>${serviceFee}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Availability Notice */}
      {property.unavailableDates && property.unavailableDates.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> Some dates may not be available. 
            {property.unavailableDates.length} dates are already booked.
          </p>
        </div>
      )}

      {/* Rare Find Badge */}
      {property.bookingCount > 10 && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-700 text-sm font-medium rounded-full">
            <span className="mr-1">🔥</span>
            Rare find - booked {property.bookingCount} times
          </span>
        </div>
      )}
    </div>
  )
}