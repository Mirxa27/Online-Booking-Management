import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { addDays, differenceInDays } from 'date-fns'

const bookingSchema = z.object({
  propertyId: z.string(),
  checkIn: z.string().transform(str => new Date(str)),
  checkOut: z.string().transform(str => new Date(str)),
  guests: z.number().int().positive(),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(['MYFATOORAH', 'PAYPAL', 'STRIPE', 'CASH']).optional()
})

// GET - List bookings (for user or host)
export async function GET(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || 'guest'
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    let where: any = {}
    
    // Filter based on user role
    if (role === 'host' && (user.role === 'HOST' || user.role === 'ADMIN')) {
      // Get bookings for properties owned by host
      where.property = { hostId: user.id }
    } else if (user.role === 'ADMIN' && role === 'all') {
      // Admin can see all bookings
      where = {}
    } else {
      // Guest bookings
      where.guestId = user.id
    }
    
    if (status) {
      where.status = status
    }
    
    const total = await prisma.booking.count({ where })
    
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        property: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            },
            host: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        review: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })
    
    return NextResponse.json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const validatedData = bookingSchema.parse(body)
    
    // Get user if authenticated
    let userId: string | null = null
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email! }
      })
      userId = user?.id || null
    }
    
    // If not authenticated, create guest booking with provided details
    if (!userId && (!validatedData.guestEmail || !validatedData.guestName)) {
      return NextResponse.json(
        { error: 'Guest details required for unauthenticated booking' },
        { status: 400 }
      )
    }
    
    // Get property details
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
      include: {
        availability: {
          where: {
            date: {
              gte: validatedData.checkIn,
              lt: validatedData.checkOut
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
    
    // Check if property is available
    const bookingDays = differenceInDays(validatedData.checkOut, validatedData.checkIn)
    const unavailableDates = property.availability.filter(a => !a.available)
    
    if (unavailableDates.length > 0) {
      return NextResponse.json(
        { error: 'Property is not available for selected dates' },
        { status: 400 }
      )
    }
    
    // Check guest count
    if (validatedData.guests > property.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${property.maxGuests} guests allowed` },
        { status: 400 }
      )
    }
    
    // Calculate pricing
    const pricePerNight = property.pricePerNight
    const cleaningFee = property.cleaningFee || 0
    const serviceFee = property.serviceFee || (pricePerNight * bookingDays * 0.1) // 10% service fee
    const totalPrice = (pricePerNight * bookingDays) + cleaningFee + serviceFee
    
    // Generate check-in code
    const checkInCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    // Create guest user if not authenticated
    if (!userId && validatedData.guestEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.guestEmail }
      })
      
      if (existingUser) {
        userId = existingUser.id
      } else {
        const newUser = await prisma.user.create({
          data: {
            email: validatedData.guestEmail,
            name: validatedData.guestName!,
            role: 'GUEST',
            phoneNumber: validatedData.guestPhone
          }
        })
        userId = newUser.id
      }
    }
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        propertyId: validatedData.propertyId,
        guestId: userId!,
        checkIn: validatedData.checkIn,
        checkOut: validatedData.checkOut,
        guests: validatedData.guests,
        totalPrice,
        pricePerNight,
        cleaningFee,
        serviceFee,
        currency: property.currency,
        status: 'PENDING',
        guestName: validatedData.guestName,
        guestEmail: validatedData.guestEmail,
        guestPhone: validatedData.guestPhone,
        specialRequests: validatedData.specialRequests,
        checkInCode,
        paymentMethod: validatedData.paymentMethod
      },
      include: {
        property: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    // Mark dates as unavailable
    const datesToBlock = []
    let currentDate = new Date(validatedData.checkIn)
    while (currentDate < validatedData.checkOut) {
      datesToBlock.push({
        propertyId: validatedData.propertyId,
        date: new Date(currentDate),
        available: false
      })
      currentDate = addDays(currentDate, 1)
    }
    
    await prisma.availability.createMany({
      data: datesToBlock,
      skipDuplicates: true
    })
    
    // TODO: Send confirmation email
    
    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully',
      checkInCode
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}