'use client'

import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

interface PropertyMapProps {
  properties: any[]
  center?: { lat: number; lng: number }
  zoom?: number
}

export default function PropertyMap({ properties, center, zoom = 12 }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real implementation, you would integrate with Google Maps or Mapbox
    // For now, we'll show a placeholder
  }, [properties, center])

  // Calculate center if not provided
  const mapCenter = center || {
    lat: properties[0]?.latitude || 40.7128,
    lng: properties[0]?.longitude || -74.0060
  }

  return (
    <div ref={mapRef} className="w-full h-full bg-gray-100 rounded-lg relative">
      {/* Placeholder Map */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Interactive map</p>
          <p className="text-sm text-gray-500 mt-1">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} in this area
          </p>
        </div>
      </div>
      
      {/* Property Markers (Placeholder) */}
      {properties.map((property, index) => (
        <div
          key={property.id}
          className="absolute"
          style={{
            top: `${20 + (index * 10)}%`,
            left: `${30 + (index * 15)}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="bg-habibistay-blue text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            ${property.pricePerNight}
          </div>
        </div>
      ))}
    </div>
  )
}