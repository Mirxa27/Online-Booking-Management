'use client'

import { useState } from 'react'
import { X, Calendar, Users, DollarSign, Home, Wifi, Car, Pool, Dumbbell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PropertyFiltersProps {
  filters: any
  onFilterChange: (filters: any) => void
  onClose: () => void
}

const propertyTypes = [
  'APARTMENT',
  'HOUSE',
  'VILLA',
  'CONDO',
  'TOWNHOUSE',
  'LOFT',
  'STUDIO',
  'ROOM'
]

const amenitiesList = [
  { value: 'WiFi', label: 'WiFi', icon: Wifi },
  { value: 'Parking', label: 'Parking', icon: Car },
  { value: 'Pool', label: 'Pool', icon: Pool },
  { value: 'Gym', label: 'Gym', icon: Dumbbell },
  { value: 'Kitchen', label: 'Kitchen' },
  { value: 'AC', label: 'Air Conditioning' },
  { value: 'Heating', label: 'Heating' },
  { value: 'Washer', label: 'Washer' },
  { value: 'Dryer', label: 'Dryer' },
  { value: 'TV', label: 'TV' },
  { value: 'Fireplace', label: 'Fireplace' },
  { value: 'Beach Access', label: 'Beach Access' },
  { value: 'Mountain View', label: 'Mountain View' },
  { value: 'City View', label: 'City View' },
  { value: 'Workspace', label: 'Workspace' },
  { value: 'Hot Tub', label: 'Hot Tub' },
  { value: 'BBQ', label: 'BBQ Grill' },
  { value: 'Elevator', label: 'Elevator' }
]

export default function PropertyFilters({ filters, onFilterChange, onClose }: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleApply = () => {
    onFilterChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      location: '',
      checkIn: '',
      checkOut: '',
      guests: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      amenities: [],
      bedrooms: '',
      sortBy: 'featured'
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const toggleAmenity = (amenity: string) => {
    const newAmenities = localFilters.amenities.includes(amenity)
      ? localFilters.amenities.filter((a: string) => a !== amenity)
      : [...localFilters.amenities, amenity]
    setLocalFilters({ ...localFilters, amenities: newAmenities })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Dates */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Dates
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Check-in</label>
                <input
                  type="date"
                  value={localFilters.checkIn}
                  onChange={(e) => setLocalFilters({ ...localFilters, checkIn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Check-out</label>
                <input
                  type="date"
                  value={localFilters.checkOut}
                  onChange={(e) => setLocalFilters({ ...localFilters, checkOut: e.target.value })}
                  min={localFilters.checkIn}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Guests and Bedrooms */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Rooms and Guests
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Guests</label>
                <input
                  type="number"
                  min="1"
                  value={localFilters.guests}
                  onChange={(e) => setLocalFilters({ ...localFilters, guests: e.target.value })}
                  placeholder="Any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  value={localFilters.bedrooms}
                  onChange={(e) => setLocalFilters({ ...localFilters, bedrooms: e.target.value })}
                  placeholder="Any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Price Range
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  min="0"
                  value={localFilters.minPrice}
                  onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
                  placeholder="$0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  min="0"
                  value={localFilters.maxPrice}
                  onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
                  placeholder="Any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Property Type
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setLocalFilters({ 
                    ...localFilters, 
                    propertyType: localFilters.propertyType === type ? '' : type 
                  })}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    localFilters.propertyType === type
                      ? 'border-habibistay-blue bg-habibistay-50 text-habibistay-blue'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
            <div className="space-y-2">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity.value}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.amenities.includes(amenity.value)}
                    onChange={() => toggleAmenity(amenity.value)}
                    className="w-4 h-4 text-habibistay-blue rounded focus:ring-habibistay-blue"
                  />
                  <span className="ml-3 flex items-center">
                    {amenity.icon && <amenity.icon className="w-4 h-4 mr-2 text-gray-500" />}
                    {amenity.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-gray-700 hover:text-gray-900 underline"
          >
            Clear all
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-habibistay-blue text-white rounded-lg hover:bg-habibistay-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}