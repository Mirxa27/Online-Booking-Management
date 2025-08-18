'use client'

import Image from 'next/image'
import { MapPin, Users, Bed, Bath, Star, Calendar } from 'lucide-react'

interface PropertyCardProps {
  property: {
    id: string
    title: string
    description: string
    image: string
    price: number
    location: string
    rating: number
    bedrooms: number
    bathrooms: number
    maxGuests: number
    amenities: string[]
  }
  onAction: (action: string, propertyId: string) => void
}

export default function PropertyCard({ property, onAction }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={property.image || '/placeholder-property.jpg'}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{property.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {property.location}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
        
        <div className="flex items-center space-x-4 text-gray-600 text-sm mb-3">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {property.maxGuests}
          </div>
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {property.bedrooms}
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.bathrooms}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-habibistay-blue">${property.price}</span>
            <span className="text-gray-600 text-sm"> /night</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onAction('view', property.id)}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => onAction('book', property.id)}
            className="flex-1 py-2 px-4 bg-habibistay-blue text-white rounded-lg hover:bg-habibistay-600 transition-colors text-sm font-medium flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}