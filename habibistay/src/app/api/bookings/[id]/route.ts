import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get single booking details
export async function GET(
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
    
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        property: {
          include: {
            images: true,
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true
              }
            }
          }
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true
          }
        },
        review: true,
        messages: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Check authorization
    const isGuest = booking.guestId === user?.id
    const isHost = booking.property.hostId === user?.id
    const isAdmin = user?.role === 'ADMIN'
    
    if (!isGuest && !isHost && !isAdmin) {
      return NextResponse.json(
        { error: 'You are not authorized to view this booking' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      success: true,
      booking
    })
    
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PUT - Update booking status
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
    
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        property: true
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Check authorization
    const isGuest = booking.guestId === user?.id
    const isHost = booking.property.hostId === user?.id
    const isAdmin = user?.role === 'ADMIN'
    
    const body = await request.json()
    const { status, paymentId, paidAt } = body
    
    // Validate status transitions
    if (status === 'CONFIRMED' && (!isHost && !isAdmin)) {
      return NextResponse.json(
        { error: 'Only hosts can confirm bookings' },
        { status: 403 }
      )
    }
    
    if (status === 'CANCELLED') {
      if (!isGuest && !isHost && !isAdmin) {
        return NextResponse.json(
          { error: 'You cannot cancel this booking' },
          { status: 403 }
        )
      }
      
      // Free up availability if cancelling
      await prisma.availability.deleteMany({
        where: {
          propertyId: booking.propertyId,
          date: {
            gte: booking.checkIn,
            lt: booking.checkOut
          }
        }
      })
    }
    
    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status,
        paymentId: paymentId || booking.paymentId,
        paidAt: paidAt ? new Date(paidAt) : booking.paidAt
      },
      include: {
        property: {
          include: {
            images: {
              take: 1
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
    
    // TODO: Send status update email
    
    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: `Booking ${status.toLowerCase()} successfully`
    })
    
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// DELETE - Cancel booking
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
    
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        property: true
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Check authorization
    const isGuest = booking.guestId === user?.id
    const isHost = booking.property.hostId === user?.id
    const isAdmin = user?.role === 'ADMIN'
    
    if (!isGuest && !isHost && !isAdmin) {
      return NextResponse.json(
        { error: 'You cannot cancel this booking' },
        { status: 403 }
      )
    }
    
    // Check if booking can be cancelled
    if (booking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel completed booking' },
        { status: 400 }
      )
    }
    
    // Free up availability
    await prisma.availability.deleteMany({
      where: {
        propertyId: booking.propertyId,
        date: {
          gte: booking.checkIn,
          lt: booking.checkOut
        }
      }
    })
    
    // Update booking status
    await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' }
    })
    
    // TODO: Process refund if payment was made
    // TODO: Send cancellation email
    
    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    })
    
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}