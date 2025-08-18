import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  checkIn: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  comment: z.string().min(10)
})

// GET - Get reviews for a property
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID required' },
        { status: 400 }
      )
    }
    
    const total = await prisma.review.count({
      where: { propertyId }
    })
    
    const reviews = await prisma.review.findMany({
      where: { propertyId },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        booking: {
          select: {
            checkIn: true,
            checkOut: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })
    
    // Calculate rating distribution
    const allReviews = await prisma.review.findMany({
      where: { propertyId },
      select: {
        rating: true,
        cleanliness: true,
        accuracy: true,
        checkIn: true,
        communication: true,
        location: true,
        value: true
      }
    })
    
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: allReviews.filter(r => r.rating === rating).length
    }))
    
    const averageRatings = {
      overall: allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length || 0,
      cleanliness: allReviews.reduce((sum, r) => sum + (r.cleanliness || 0), 0) / allReviews.length || 0,
      accuracy: allReviews.reduce((sum, r) => sum + (r.accuracy || 0), 0) / allReviews.length || 0,
      checkIn: allReviews.reduce((sum, r) => sum + (r.checkIn || 0), 0) / allReviews.length || 0,
      communication: allReviews.reduce((sum, r) => sum + (r.communication || 0), 0) / allReviews.length || 0,
      location: allReviews.reduce((sum, r) => sum + (r.location || 0), 0) / allReviews.length || 0,
      value: allReviews.reduce((sum, r) => sum + (r.value || 0), 0) / allReviews.length || 0
    }
    
    return NextResponse.json({
      success: true,
      reviews,
      averageRatings,
      ratingDistribution,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST - Create a review
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
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    const validatedData = reviewSchema.parse(body)
    
    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: validatedData.bookingId },
      include: {
        review: true
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    if (booking.guestId !== user.id) {
      return NextResponse.json(
        { error: 'You can only review your own bookings' },
        { status: 403 }
      )
    }
    
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'You can only review completed bookings' },
        { status: 400 }
      )
    }
    
    if (booking.review) {
      return NextResponse.json(
        { error: 'You have already reviewed this booking' },
        { status: 400 }
      )
    }
    
    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId: validatedData.bookingId,
        propertyId: booking.propertyId,
        guestId: user.id,
        rating: validatedData.rating,
        cleanliness: validatedData.cleanliness,
        accuracy: validatedData.accuracy,
        checkIn: validatedData.checkIn,
        communication: validatedData.communication,
        location: validatedData.location,
        value: validatedData.value,
        comment: validatedData.comment
      },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully'
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}