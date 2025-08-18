'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Heart, Users, Bed, Bath } from 'lucide-react'
import { useState } from 'react'

interface PropertyCardProps {
  property: any
  variant?: 'vertical' | 'horizontal'
}

export default function PropertyCard({ property, variant = 'vertical' }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)

  const imageUrl = property.images?.[0]?.url || '/placeholder-property.jpg'

  if (variant === 'horizontal') {
    return (
      <Link href={`/property/${property.id}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex">
          <div className="relative w-72 h-48">
            <Image
              src={imageError ? '/placeholder-property.jpg' : imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorite(!isFavorite)
              }}
              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </button>
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{property.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.city}, {property.country}
                </div>
              </div>
              {property.averageRating > 0 && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-medium">{property.averageRating}</span>
                </div>
              )}
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
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-habibistay-blue">
                  ${property.pricePerNight}
                </span>
                <span className="text-gray-600 text-sm"> /night</span>
              </div>
              {property.featured && (
                <span className="px-2 py-1 bg-habibistay-50 text-habibistay-blue text-xs font-medium rounded">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
        <div className="relative h-64">
          <Image
            src={imageError ? '/placeholder-property.jpg' : imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
          </button>
          {property.featured && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-habibistay-blue text-white text-xs font-medium rounded">
              Featured
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {property.city}, {property.country}
              </div>
            </div>
            {property.averageRating > 0 && (
              <div className="flex items-center ml-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="ml-1 text-sm font-medium">{property.averageRating}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-gray-600 text-sm mb-3">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {property.maxGuests} guests
            </div>
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {property.bedrooms} beds
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {property.bathrooms} baths
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-habibistay-blue">
                ${property.pricePerNight}
              </span>
              <span className="text-gray-600 text-sm"> /night</span>
            </div>
            {property.reviewCount > 0 && (
              <span className="text-xs text-gray-500">
                {property.reviewCount} {property.reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}