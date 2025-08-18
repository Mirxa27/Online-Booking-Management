import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@habibistay.com' },
    update: {},
    create: {
      email: 'admin@habibistay.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })
  console.log('✅ Admin user created')

  // Create host users
  const hostPassword = await bcrypt.hash('host123', 12)
  const host1 = await prisma.user.upsert({
    where: { email: 'host1@habibistay.com' },
    update: {},
    create: {
      email: 'host1@habibistay.com',
      password: hostPassword,
      name: 'John Smith',
      role: 'HOST',
      phoneNumber: '+1234567890'
    }
  })

  const host2 = await prisma.user.upsert({
    where: { email: 'host2@habibistay.com' },
    update: {},
    create: {
      email: 'host2@habibistay.com',
      password: hostPassword,
      name: 'Sarah Johnson',
      role: 'HOST',
      phoneNumber: '+0987654321'
    }
  })
  console.log('✅ Host users created')

  // Create guest users
  const guestPassword = await bcrypt.hash('guest123', 12)
  const guest1 = await prisma.user.upsert({
    where: { email: 'guest1@habibistay.com' },
    update: {},
    create: {
      email: 'guest1@habibistay.com',
      password: guestPassword,
      name: 'Alice Brown',
      role: 'GUEST'
    }
  })

  const guest2 = await prisma.user.upsert({
    where: { email: 'guest2@habibistay.com' },
    update: {},
    create: {
      email: 'guest2@habibistay.com',
      password: guestPassword,
      name: 'Bob Wilson',
      role: 'GUEST'
    }
  })
  console.log('✅ Guest users created')

  // Create investor user
  const investorPassword = await bcrypt.hash('investor123', 12)
  const investor = await prisma.user.upsert({
    where: { email: 'investor@habibistay.com' },
    update: {},
    create: {
      email: 'investor@habibistay.com',
      password: investorPassword,
      name: 'Michael Chen',
      role: 'INVESTOR'
    }
  })
  console.log('✅ Investor user created')

  // Create properties
  const properties = [
    {
      title: 'Luxury Beachfront Villa',
      description: 'Experience paradise in this stunning 4-bedroom beachfront villa with panoramic ocean views. Features a private pool, direct beach access, and modern amenities throughout. Perfect for families or groups seeking a luxurious coastal retreat.',
      type: 'VILLA' as const,
      featured: true,
      status: 'ACTIVE' as const,
      address: '123 Ocean Drive',
      city: 'Miami Beach',
      state: 'Florida',
      country: 'USA',
      zipCode: '33139',
      latitude: 25.7617,
      longitude: -80.1918,
      pricePerNight: 450,
      cleaningFee: 150,
      serviceFee: 45,
      currency: 'USD',
      bedrooms: 4,
      bathrooms: 3,
      beds: 6,
      maxGuests: 8,
      squareFeet: 3500,
      amenities: ['Pool', 'Beach Access', 'WiFi', 'Kitchen', 'Parking', 'AC', 'Washer', 'Dryer', 'BBQ Grill', 'Ocean View'],
      houseRules: ['No smoking', 'No parties', 'Quiet hours 10 PM - 8 AM', 'Max 8 guests'],
      hostId: host1.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', caption: 'Villa exterior', order: 0 },
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', caption: 'Living room', order: 1 },
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', caption: 'Pool area', order: 2 }
        ]
      }
    },
    {
      title: 'Modern Downtown Apartment',
      description: 'Sleek and stylish 2-bedroom apartment in the heart of the city. Walking distance to restaurants, shopping, and entertainment. Features floor-to-ceiling windows with stunning city views and a fully equipped kitchen.',
      type: 'APARTMENT' as const,
      featured: true,
      status: 'ACTIVE' as const,
      address: '456 Fifth Avenue',
      city: 'New York',
      state: 'New York',
      country: 'USA',
      zipCode: '10018',
      latitude: 40.7484,
      longitude: -73.9857,
      pricePerNight: 180,
      cleaningFee: 50,
      serviceFee: 18,
      currency: 'USD',
      bedrooms: 2,
      bathrooms: 2,
      beds: 3,
      maxGuests: 4,
      squareFeet: 1200,
      amenities: ['WiFi', 'Kitchen', 'Gym', 'Concierge', 'City View', 'Workspace', 'AC', 'Elevator', 'Doorman'],
      houseRules: ['No smoking', 'No pets', 'Quiet hours after 11 PM'],
      hostId: host2.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', caption: 'Living area', order: 0 },
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', caption: 'Bedroom', order: 1 }
        ]
      }
    },
    {
      title: 'Cozy Mountain Cabin',
      description: 'Escape to this charming mountain cabin surrounded by nature. Features a stone fireplace, rustic decor, and breathtaking mountain views. Perfect for a romantic getaway or peaceful retreat.',
      type: 'HOUSE' as const,
      featured: false,
      status: 'ACTIVE' as const,
      address: '789 Pine Ridge Road',
      city: 'Aspen',
      state: 'Colorado',
      country: 'USA',
      zipCode: '81611',
      latitude: 39.1911,
      longitude: -106.8175,
      pricePerNight: 250,
      cleaningFee: 75,
      serviceFee: 25,
      currency: 'USD',
      bedrooms: 3,
      bathrooms: 2,
      beds: 4,
      maxGuests: 6,
      squareFeet: 1800,
      amenities: ['Fireplace', 'Mountain View', 'WiFi', 'Kitchen', 'Parking', 'Heating', 'Hot Tub', 'BBQ', 'Hiking Trails'],
      houseRules: ['No smoking indoors', 'Respect quiet hours', 'Clean up after using BBQ'],
      hostId: host1.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', caption: 'Cabin exterior', order: 0 },
          { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', caption: 'Cozy interior', order: 1 }
        ]
      }
    },
    {
      title: 'Seaside Penthouse Suite',
      description: 'Luxurious penthouse with 360-degree ocean and city views. Features a private rooftop terrace, gourmet kitchen, and spa-like bathrooms. The ultimate in coastal luxury living.',
      type: 'APARTMENT' as const,
      featured: true,
      status: 'ACTIVE' as const,
      address: '321 Coastal Highway',
      city: 'San Diego',
      state: 'California',
      country: 'USA',
      zipCode: '92101',
      latitude: 32.7157,
      longitude: -117.1611,
      pricePerNight: 550,
      cleaningFee: 200,
      serviceFee: 55,
      currency: 'USD',
      bedrooms: 3,
      bathrooms: 3,
      beds: 5,
      maxGuests: 6,
      squareFeet: 2800,
      amenities: ['Rooftop Terrace', 'Ocean View', 'WiFi', 'Gourmet Kitchen', 'Parking', 'AC', 'Spa Bath', 'Wine Cooler', 'Smart Home'],
      houseRules: ['No smoking', 'No parties', 'Respect neighbors', 'Register all guests'],
      hostId: host2.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', caption: 'Penthouse view', order: 0 },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', caption: 'Terrace', order: 1 }
        ]
      }
    },
    {
      title: 'Historic Downtown Loft',
      description: 'Converted warehouse loft in the arts district. Features exposed brick walls, high ceilings, and industrial chic design. Walking distance to galleries, cafes, and nightlife.',
      type: 'LOFT' as const,
      featured: false,
      status: 'ACTIVE' as const,
      address: '555 Art District Way',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      zipCode: '90013',
      latitude: 34.0522,
      longitude: -118.2437,
      pricePerNight: 200,
      cleaningFee: 60,
      serviceFee: 20,
      currency: 'USD',
      bedrooms: 1,
      bathrooms: 1,
      beds: 2,
      maxGuests: 3,
      squareFeet: 1000,
      amenities: ['WiFi', 'Kitchen', 'Workspace', 'AC', 'Art Gallery Access', 'Exposed Brick', 'High Ceilings'],
      houseRules: ['No smoking', 'Respect the art', 'Keep noise reasonable'],
      hostId: host1.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', caption: 'Loft interior', order: 0 }
        ]
      }
    }
  ]

  for (const propertyData of properties) {
    await prisma.property.create({
      data: propertyData
    })
  }
  console.log('✅ Properties created')

  // Create some bookings
  const propertiesForBooking = await prisma.property.findMany({ take: 3 })
  
  if (propertiesForBooking.length >= 3) {
    // Past booking (completed)
    await prisma.booking.create({
      data: {
        propertyId: propertiesForBooking[0].id,
        guestId: guest1.id,
        checkIn: new Date('2024-01-15'),
        checkOut: new Date('2024-01-20'),
        guests: 2,
        totalPrice: 2250,
        pricePerNight: 450,
        cleaningFee: 150,
        serviceFee: 45,
        currency: 'USD',
        status: 'COMPLETED',
        paymentMethod: 'PAYPAL',
        paymentId: 'PAY123456',
        paidAt: new Date('2024-01-10'),
        checkInCode: 'ABC123'
      }
    })

    // Current booking (confirmed)
    await prisma.booking.create({
      data: {
        propertyId: propertiesForBooking[1].id,
        guestId: guest2.id,
        checkIn: new Date('2024-02-20'),
        checkOut: new Date('2024-02-25'),
        guests: 3,
        totalPrice: 900,
        pricePerNight: 180,
        cleaningFee: 50,
        serviceFee: 18,
        currency: 'USD',
        status: 'CONFIRMED',
        paymentMethod: 'MYFATOORAH',
        paymentId: 'MF789012',
        paidAt: new Date('2024-02-15'),
        checkInCode: 'XYZ789'
      }
    })

    // Future booking (pending)
    await prisma.booking.create({
      data: {
        propertyId: propertiesForBooking[2].id,
        guestId: guest1.id,
        checkIn: new Date('2024-03-10'),
        checkOut: new Date('2024-03-15'),
        guests: 4,
        totalPrice: 1250,
        pricePerNight: 250,
        cleaningFee: 75,
        serviceFee: 25,
        currency: 'USD',
        status: 'PENDING',
        checkInCode: 'DEF456'
      }
    })
    console.log('✅ Sample bookings created')
  }

  // Create reviews for completed booking
  const completedBooking = await prisma.booking.findFirst({
    where: { status: 'COMPLETED' }
  })

  if (completedBooking) {
    await prisma.review.create({
      data: {
        bookingId: completedBooking.id,
        propertyId: completedBooking.propertyId,
        guestId: completedBooking.guestId,
        rating: 5,
        cleanliness: 5,
        accuracy: 5,
        checkIn: 4,
        communication: 5,
        location: 5,
        value: 5,
        comment: 'Amazing stay! The villa exceeded our expectations. Beautiful views, clean, and the host was very responsive. Would definitely book again!'
      }
    })
    console.log('✅ Sample review created')
  }

  // Create admin settings
  await prisma.adminSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      aiModel: 'gpt-4',
      aiTemperature: 0.7,
      aiMaxTokens: 1000,
      myFatoorahEnabled: true,
      paypalEnabled: true,
      platformFee: 0.15,
      maintenanceMode: false,
      bookingEnabled: true
    }
  })
  console.log('✅ Admin settings created')

  // Create investment for investor user
  const investmentProperty = propertiesForBooking[0]
  if (investmentProperty) {
    await prisma.investment.create({
      data: {
        investorId: investor.id,
        propertyId: investmentProperty.id,
        amount: 50000,
        percentage: 25,
        status: 'ACTIVE',
        returns: 8500,
        lastPayout: new Date('2024-01-31')
      }
    })
    console.log('✅ Sample investment created')
  }

  console.log('✨ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })