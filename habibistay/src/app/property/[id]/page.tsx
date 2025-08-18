'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPin, Users, Bed, Bath, Home, Star, Heart, Share2, 
  Wifi, Car, Pool, Dumbbell, Coffee, Tv, Wind, Fire,
  Calendar, Shield, Award, MessageCircle, ChevronLeft, ChevronRight, Grid
} from 'lucide-react'
import Header from '@/components/layout/Header'
import BookingCard from '@/components/properties/BookingCard'
import ReviewSection from '@/components/properties/ReviewSection'
import HostInfo from '@/components/properties/HostInfo'
import PropertyMap from '@/components/properties/PropertyMap'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ImageGallery from '@/components/properties/ImageGallery'

const amenityIcons: { [key: string]: any } = {
  'WiFi': Wifi,
  'Parking': Car,
  'Pool': Pool,
  'Gym': Dumbbell,
  'Kitchen': Coffee,
  'TV': Tv,
  'AC': Wind,
  'Heating': Fire,
  'Fireplace': Fire
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setProperty(data.property)
      } else {
        router.push('/404')
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      router.push('/404')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!property) {
    return null
  }

  const displayedAmenities = showAllAmenities 
    ? property.amenities 
    : property.amenities.slice(0, 8)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Image Gallery */}
      <div className="relative h-[60vh] bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <>
            <Image
              src={property.images[currentImageIndex]?.url || '/placeholder-property.jpg'}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === 0 ? property.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === property.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {property.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* View All Photos Button */}
            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Grid className="w-4 h-4" />
              <span>Show all photos</span>
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-24 h-24 text-gray-400" />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
          </button>
          <button className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{property.averageRating || 'New'}</span>
                  {property.reviewCount > 0 && (
                    <span className="ml-1">({property.reviewCount} reviews)</span>
                  )}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.city}, {property.country}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-500 mr-2" />
                  <span>{property.maxGuests} guests</span>
                </div>
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-gray-500 mr-2" />
                  <span>{property.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-gray-500 mr-2" />
                  <span>{property.bathrooms} bathrooms</span>
                </div>
                {property.squareFeet && (
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-gray-500 mr-2" />
                    <span>{property.squareFeet} sq ft</span>
                  </div>
                )}
              </div>
            </div>

            {/* Host Info */}
            <HostInfo host={property.host} />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this place</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {displayedAmenities.map((amenity: string, index: number) => {
                  const Icon = amenityIcons[amenity] || Coffee
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  )
                })}
              </div>
              {property.amenities.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-4 text-habibistay-blue hover:underline"
                >
                  {showAllAmenities ? 'Show less' : `Show all ${property.amenities.length} amenities`}
                </button>
              )}
            </div>

            {/* House Rules */}
            {property.houseRules && property.houseRules.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">House rules</h2>
                <ul className="space-y-2">
                  {property.houseRules.map((rule: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Where you'll be</h2>
              <p className="text-gray-600 mb-4">
                {property.address}, {property.city}, {property.state && `${property.state},`} {property.country}
              </p>
              <div className="h-96 rounded-lg overflow-hidden">
                <PropertyMap properties={[property]} center={{ lat: property.latitude, lng: property.longitude }} />
              </div>
            </div>

            {/* Reviews */}
            <ReviewSection propertyId={property.id} />
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingCard property={property} />
              
              {/* Report Listing */}
              <div className="mt-4 text-center">
                <button className="text-gray-500 hover:text-gray-700 text-sm underline">
                  Report this listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGallery
          images={property.images}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  )
}