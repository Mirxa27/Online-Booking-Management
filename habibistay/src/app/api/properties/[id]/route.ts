import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get single property with full details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            _count: {
              select: {
                properties: true
              }
            }
          }
        },
        reviews: {
          include: {
            guest: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        availability: {
          where: {
            date: {
              gte: new Date()
            },
            available: false
          },
          select: {
            date: true
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      }
    })
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }
    
    // Calculate average ratings
    const ratings = property.reviews.map(r => r.rating)
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0
    
    // Get unavailable dates
    const unavailableDates = property.availability.map(a => a.date)
    
    return NextResponse.json({
      success: true,
      property: {
        ...property,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: property._count.reviews,
        bookingCount: property._count.bookings,
        unavailableDates
      }
    })
    
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// PUT - Update property (Host only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Check if user owns the property
    const property = await prisma.property.findUnique({
      where: { id: params.id }
    })
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }
    
    if (property.hostId !== user?.id && user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You can only edit your own properties' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Update property
    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        zipCode: body.zipCode,
        latitude: body.latitude,
        longitude: body.longitude,
        pricePerNight: body.pricePerNight,
        cleaningFee: body.cleaningFee,
        serviceFee: body.serviceFee,
        currency: body.currency,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        beds: body.beds,
        maxGuests: body.maxGuests,
        squareFeet: body.squareFeet,
        amenities: body.amenities,
        houseRules: body.houseRules,
        status: body.status,
        featured: body.featured
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
      property: updatedProperty,
      message: 'Property updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE - Delete property (Host only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Check if user owns the property
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          where: {
            status: 'CONFIRMED',
            checkOut: {
              gte: new Date()
            }
          }
        }
      }
    })
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }
    
    if (property.hostId !== user?.id && user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You can only delete your own properties' },
        { status: 403 }
      )
    }
    
    // Check for active bookings
    if (property.bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete property with active bookings' },
        { status: 400 }
      )
    }
    
    // Soft delete by setting status to ARCHIVED
    await prisma.property.update({
      where: { id: params.id },
      data: { status: 'ARCHIVED' }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}