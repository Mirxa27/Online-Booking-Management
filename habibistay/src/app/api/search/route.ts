import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const query = searchParams.get('q')
    const location = searchParams.get('location')
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    const guests = searchParams.get('guests')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const propertyType = searchParams.get('type')
    const amenities = searchParams.get('amenities')?.split(',')
    const sortBy = searchParams.get('sortBy') || 'featured'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    
    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }
    
    // Text search
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { country: { contains: query, mode: 'insensitive' } }
      ]
    }
    
    // Location filter
    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
        { country: { contains: location, mode: 'insensitive' } },
        { address: { contains: location, mode: 'insensitive' } }
      ]
    }
    
    // Guest count
    if (guests) {
      where.maxGuests = { gte: parseInt(guests) }
    }
    
    // Price range
    if (minPrice || maxPrice) {
      where.pricePerNight = {}
      if (minPrice) where.pricePerNight.gte = parseFloat(minPrice)
      if (maxPrice) where.pricePerNight.lte = parseFloat(maxPrice)
    }
    
    // Bedrooms
    if (bedrooms) {
      where.bedrooms = { gte: parseInt(bedrooms) }
    }
    
    // Property type
    if (propertyType) {
      where.type = propertyType
    }
    
    // Amenities filter (properties must have all specified amenities)
    if (amenities && amenities.length > 0) {
      where.amenities = {
        hasEvery: amenities
      }
    }
    
    // Check availability for dates
    let availablePropertyIds: string[] | undefined
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      
      // Find properties that are NOT booked during these dates
      const bookedProperties = await prisma.booking.findMany({
        where: {
          status: { in: ['CONFIRMED', 'PENDING'] },
          OR: [
            {
              AND: [
                { checkIn: { lte: checkInDate } },
                { checkOut: { gt: checkInDate } }
              ]
            },
            {
              AND: [
                { checkIn: { lt: checkOutDate } },
                { checkOut: { gte: checkOutDate } }
              ]
            },
            {
              AND: [
                { checkIn: { gte: checkInDate } },
                { checkOut: { lte: checkOutDate } }
              ]
            }
          ]
        },
        select: { propertyId: true }
      })
      
      const bookedPropertyIds = bookedProperties.map(b => b.propertyId)
      
      // Get all active properties
      const allProperties = await prisma.property.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true }
      })
      
      availablePropertyIds = allProperties
        .map(p => p.id)
        .filter(id => !bookedPropertyIds.includes(id))
      
      where.id = { in: availablePropertyIds }
    }
    
    // Build orderBy
    let orderBy: any = {}
    switch (sortBy) {
      case 'price-asc':
        orderBy = { pricePerNight: 'asc' }
        break
      case 'price-desc':
        orderBy = { pricePerNight: 'desc' }
        break
      case 'rating':
        // Will sort by average rating after fetching
        orderBy = { createdAt: 'desc' }
        break
      case 'featured':
      default:
        orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }]
        break
    }
    
    // Get total count
    const total = await prisma.property.count({ where })
    
    // Get properties
    const properties = await prisma.property.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 3
        },
        host: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        reviews: {
          select: {
            rating: true,
            cleanliness: true,
            accuracy: true,
            checkIn: true,
            communication: true,
            location: true,
            value: true
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    })
    
    // Calculate average ratings and sort by rating if needed
    let propertiesWithRatings = properties.map(property => {
      const ratings = property.reviews
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0
      
      // Calculate category ratings
      const categoryRatings = ratings.length > 0 ? {
        cleanliness: ratings.reduce((sum, r) => sum + (r.cleanliness || 0), 0) / ratings.length,
        accuracy: ratings.reduce((sum, r) => sum + (r.accuracy || 0), 0) / ratings.length,
        checkIn: ratings.reduce((sum, r) => sum + (r.checkIn || 0), 0) / ratings.length,
        communication: ratings.reduce((sum, r) => sum + (r.communication || 0), 0) / ratings.length,
        location: ratings.reduce((sum, r) => sum + (r.location || 0), 0) / ratings.length,
        value: ratings.reduce((sum, r) => sum + (r.value || 0), 0) / ratings.length
      } : null
      
      return {
        ...property,
        averageRating: Math.round(avgRating * 10) / 10,
        categoryRatings,
        reviewCount: property._count.reviews,
        bookingCount: property._count.bookings,
        reviews: undefined, // Remove raw reviews from response
        _count: undefined
      }
    })
    
    // Sort by rating if requested
    if (sortBy === 'rating') {
      propertiesWithRatings.sort((a, b) => b.averageRating - a.averageRating)
    }
    
    // Get aggregations for filters
    const aggregations = await getSearchAggregations(where)
    
    return NextResponse.json({
      success: true,
      properties: propertiesWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      aggregations
    })
    
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    )
  }
}

async function getSearchAggregations(baseWhere: any) {
  const [
    priceRange,
    typeCounts,
    cityCounts,
    bedroomCounts
  ] = await Promise.all([
    // Price range
    prisma.property.aggregate({
      where: baseWhere,
      _min: { pricePerNight: true },
      _max: { pricePerNight: true },
      _avg: { pricePerNight: true }
    }),
    
    // Property types
    prisma.property.groupBy({
      by: ['type'],
      where: baseWhere,
      _count: true
    }),
    
    // Cities
    prisma.property.groupBy({
      by: ['city'],
      where: baseWhere,
      _count: true,
      take: 10,
      orderBy: { _count: { city: 'desc' } }
    }),
    
    // Bedrooms
    prisma.property.groupBy({
      by: ['bedrooms'],
      where: baseWhere,
      _count: true,
      orderBy: { bedrooms: 'asc' }
    })
  ])
  
  return {
    priceRange: {
      min: priceRange._min.pricePerNight || 0,
      max: priceRange._max.pricePerNight || 0,
      avg: Math.round(priceRange._avg.pricePerNight || 0)
    },
    propertyTypes: typeCounts.map(t => ({
      type: t.type,
      count: t._count
    })),
    cities: cityCounts.map(c => ({
      city: c.city,
      count: c._count
    })),
    bedrooms: bedroomCounts.map(b => ({
      bedrooms: b.bedrooms,
      count: b._count
    }))
  }
}