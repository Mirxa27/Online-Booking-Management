// components/booking/BookingBox.tsx
"use client";

import React, { useState, useEffect } from 'react';

// Placeholder for a DatePicker component (you'd use a library like react-datepicker)
const DatePicker: React.FC<{
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText?: string;
    className?: string;
    min?: string; // YYYY-MM-DD
}> = ({ selected, onChange, placeholderText, className, min }) => (
  <input
    type="date"
    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${className}`}
    value={selected ? selected.toISOString().split('T')[0] : ''}
    onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
    placeholder={placeholderText}
    min={min}
  />
);

interface BookingBoxProps {
  pricePerNight: number;
  cleaningFee?: number;
  serviceFee?: number;
  isInstantBookable?: boolean;
  maxGuests: number;
  onBookRequest: (details: BookingDetails) => void;
  onInstantBook: (details: BookingDetails) => void;
}

export interface BookingDetails {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guests: number;
  totalPrice: number;
}

const BookingBox: React.FC<BookingBoxProps> = ({
  pricePerNight,
  cleaningFee = 0,
  serviceFee = 0,
  isInstantBookable = false,
  maxGuests,
  onBookRequest,
  onInstantBook,
}) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumberOfNights(diffDays);
    } else {
      setNumberOfNights(0);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const basePrice = pricePerNight * numberOfNights;
    setTotalPrice(basePrice + cleaningFee + serviceFee);
  }, [numberOfNights, pricePerNight, cleaningFee, serviceFee]);

  const handleBooking = (isInstant: boolean) => {
    if (!checkInDate || !checkOutDate || guests <= 0) {
      alert('Please select check-in/out dates and number of guests.');
      return;
    }
    if (numberOfNights <= 0) {
        alert('Check-out date must be after check-in date.');
        return;
    }

    const bookingDetails: BookingDetails = { checkInDate, checkOutDate, guests, totalPrice };
    if (isInstant) {
      onInstantBook(bookingDetails);
    } else {
      onBookRequest(bookingDetails);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="sticky top-6 p-6 border border-gray-300 rounded-xl shadow-lg bg-white space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        <span className="font-bold">${pricePerNight}</span> <span className="text-base font-normal text-gray-600">/ night</span>
      </h2>

      {/* Date Pickers */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">Check-in</label>
          <DatePicker selected={checkInDate} onChange={setCheckInDate} min={today} />
        </div>
        <div>
          <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">Check-out</label>
          <DatePicker selected={checkOutDate} onChange={setCheckOutDate} min={checkInDate ? checkInDate.toISOString().split('T')[0] : today} />
        </div>
      </div>

      {/* Guests Input */}
      <div>
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Guests</label>
        <input
          type="number"
          id="guests"
          value={guests}
          min="1"
          max={maxGuests}
          onChange={(e) => setGuests(Math.max(1, Math.min(maxGuests, parseInt(e.target.value,10))))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      {/* Pricing Details */}
      {numberOfNights > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <div className="flex justify-between text-gray-700">
            <span>${pricePerNight} x {numberOfNights} nights</span>
            <span>${(pricePerNight * numberOfNights).toFixed(2)}</span>
          </div>
          {cleaningFee > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Cleaning fee</span>
              <span>${cleaningFee.toFixed(2)}</span>
            </div>
          )}
          {serviceFee > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Service fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-800 font-bold text-lg pt-2 border-t border-gray-300">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Booking Buttons */}
      <div className="space-y-3 pt-2">
        {isInstantBookable ? (
          <button
            onClick={() => handleBooking(true)}
            disabled={numberOfNights <= 0}
            className="w-full py-3 px-4 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-gray-300"
          >
            Instant Book
          </button>
        ) : (
          <button
            onClick={() => handleBooking(false)}
            disabled={numberOfNights <= 0}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300"
          >
            Request to Book
          </button>
        )}
        {!isInstantBookable && ( // Show "Request to Book" as secondary if Instant Book is primary
             <p className="text-xs text-gray-500 text-center">You won't be charged yet.</p>
        )}
      </div>
    </div>
  );
};

export default BookingBox;
