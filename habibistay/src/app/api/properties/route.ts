import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const propertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  type: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'CONDO', 'TOWNHOUSE', 'LOFT', 'STUDIO', 'ROOM']),
  address: z.string(),
  city: z.string(),
  state: z.string().optional(),
  country: z.string(),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  pricePerNight: z.number().positive(),
  cleaningFee: z.number().optional(),
  serviceFee: z.number().optional(),
  currency: z.string().default('USD'),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  beds: z.number().int().positive(),
  maxGuests: z.number().int().positive(),
  squareFeet: z.number().int().optional(),
  amenities: z.array(z.string()),
  houseRules: z.array(z.string()).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    caption: z.string().optional()
  })).optional()
})

// GET - List properties with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filters
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const type = searchParams.get('type')
    const guests = searchParams.get('guests')
    const featured = searchParams.get('featured')
    const hostId = searchParams.get('hostId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    
    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }
    
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (type) where.type = type
    if (hostId) where.hostId = hostId
    if (featured === 'true') where.featured = true
    if (guests) where.maxGuests = { gte: parseInt(guests) }
    if (minPrice || maxPrice) {
      where.pricePerNight = {}
      if (minPrice) where.pricePerNight.gte = parseFloat(minPrice)
      if (maxPrice) where.pricePerNight.lte = parseFloat(maxPrice)
    }
    
    // Get total count
    const total = await prisma.property.count({ where })
    
    // Get properties
    const properties = await prisma.property.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1
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
            rating: true
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
    
    // Calculate average ratings
    const propertiesWithRatings = properties.map(property => {
      const avgRating = property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
        : 0
      
      return {
        ...property,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: property._count.reviews,
        bookingCount: property._count.bookings
      }
    })
    
    return NextResponse.json({
      success: true,
      properties: propertiesWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST - Create new property (Host only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })
    
    if (!user || (user.role !== 'HOST' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Only hosts can create properties' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = propertySchema.parse(body)
    
    // Create property with images
    const property = await prisma.property.create({
      data: {
        ...validatedData,
        hostId: user.id,
        amenities: validatedData.amenities,
        houseRules: validatedData.houseRules || [],
        images: {
          create: validatedData.images?.map((img, index) => ({
            url: img.url,
            caption: img.caption,
            order: index
          })) || []
        }
      },
      include: {
        images: true,
        host: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      property,
      message: 'Property created successfully'
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}