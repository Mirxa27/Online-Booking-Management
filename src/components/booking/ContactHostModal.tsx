// components/booking/ContactHostModal.tsx
"use client";

import React, { useState } from 'react';

// Placeholder for a DatePicker component
const DatePicker: React.FC<{
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText?: string;
    className?: string;
    min?: string;
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

interface ContactHostModalProps {
  hostName: string;
  listingName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitMessage: (messageData: MessageData) => void;
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  initialGuests?: number;
}

export interface MessageData {
  message: string;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  guests?: number;
}

const ContactHostModal: React.FC<ContactHostModalProps> = ({
  hostName,
  listingName,
  isOpen,
  onClose,
  onSubmitMessage,
  initialCheckIn = null,
  initialCheckOut = null,
  initialGuests = 1,
}) => {
  const [message, setMessage] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(initialCheckOut);
  const [guests, setGuests] = useState<number>(initialGuests);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter a message.');
      return;
    }
    onSubmitMessage({ message, checkInDate, checkOutDate, guests });
    setMessage(''); // Clear message after submit
    // onClose(); // Optionally close modal on submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Contact {hostName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times; {/* Close icon */}
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-1">Regarding your interest in: <strong>{listingName}</strong></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Your Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={`Ask ${hostName} any questions you have about their place or availability...`}
              required
            />
          </div>

          <p className="text-sm font-medium text-gray-700">Your trip (optional):</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-checkin" className="block text-xs text-gray-600">Check-in</label>
              <DatePicker selected={checkInDate} onChange={setCheckInDate} min={today} />
            </div>
            <div>
              <label htmlFor="contact-checkout" className="block text-xs text-gray-600">Check-out</label>
              <DatePicker selected={checkOutDate} onChange={setCheckOutDate} min={checkInDate ? checkInDate.toISOString().split('T')[0] : today} />
            </div>
          </div>
          <div>
            <label htmlFor="contact-guests" className="block text-xs text-gray-600">Guests</label>
            <input
              type="number"
              id="contact-guests"
              value={guests}
              min="1"
              onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value,10)))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactHostModal;
