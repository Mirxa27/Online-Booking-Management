// components/SearchFilters.tsx
"use client"; // For client-side interactivity like date pickers, sliders

import React, { useState } from 'react';

// Placeholder for a DatePicker component (you'd use a library like react-datepicker)
const DatePicker: React.FC<{ selected: Date | null; onChange: (date: Date | null) => void; placeholderText?: string; className?: string }> = ({ selected, onChange, placeholderText, className }) => (
  <input
    type="date"
    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${className}`}
    value={selected ? selected.toISOString().split('T')[0] : ''}
    onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
    placeholder={placeholderText}
  />
);

// Placeholder for a Price Range Slider (you'd use a library like rc-slider or build a custom one)
const PriceRangeSlider: React.FC<{ value: [number, number]; onChange: (value: [number, number]) => void }> = ({ value, onChange }) => (
  <div className="mt-1">
    <input
      type="range"
      min="0"
      max="1000" // Example max price
      value={value[0]}
      onChange={(e) => onChange([parseInt(e.target.value, 10), value[1]])}
      className="w-full"
    />
    <input
      type="range"
      min="0"
      max="1000"
      value={value[1]}
      onChange={(e) => onChange([value[0], parseInt(e.target.value, 10)])}
      className="w-full mt-2"
    />
    <div className="flex justify-between text-sm text-gray-600">
      <span>${value[0]}</span>
      <span>${value[1]}</span>
    </div>
  </div>
);


const SearchFilters: React.FC = () => {
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 300]);
  const [roomType, setRoomType] = useState<string>('');

  const handleAmenityChange = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to apply filters and trigger search
    console.log({
      location,
      checkInDate,
      checkOutDate,
      amenities,
      priceRange,
      roomType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6 bg-gray-50 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-800">Filter Results</h3>

      {/* Location Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="location">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., 'New York', 'Paris'"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="check-in">
            Check-in Date
          </label>
          <DatePicker selected={checkInDate} onChange={setCheckInDate} placeholderText="Select date" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="check-out">
            Check-out Date
          </label>
          <DatePicker selected={checkOutDate} onChange={setCheckOutDate} placeholderText="Select date" />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Amenities</label>
        <div className="mt-2 space-y-2">
          {['WiFi', 'Pool', 'Parking', 'Gym', 'Pet Friendly'].map(amenity => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price Range</label>
        <PriceRangeSlider value={priceRange} onChange={setPriceRange} />
      </div>

      {/* Room Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="room-type">
          Room Type
        </label>
        <select
          id="room-type"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Any</option>
          <option value="entire_place">Entire Place</option>
          <option value="private_room">Private Room</option>
          <option value="shared_room">Shared Room</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Apply Filters
      </button>
    </form>
  );
};

export default SearchFilters;
