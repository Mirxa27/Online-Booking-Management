import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// System prompt for Sara AI
const SYSTEM_PROMPT = `You are Sara, a friendly and helpful AI assistant for Habibistay, a premium property rental and investment platform.

Your responsibilities:
1. Help guests find and book perfect accommodations
2. Provide information about properties, amenities, and locations
3. Assist with booking process and payment
4. Answer questions about check-in/check-out procedures
5. Offer local recommendations and travel tips
6. Explain investment opportunities (17% average annual ROI)
7. Support hosts with property management

Key information about Habibistay:
- Premium vacation rental platform
- Offers investment opportunities with 17% average ROI
- Fully managed properties
- Secure payment through MyFatoorah and PayPal
- 24/7 customer support
- Properties in prime tourist destinations

Always be friendly, professional, and helpful. If you don't know something, offer to connect the user with human support.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, sessionId } = body
    
    // Get user session if authenticated
    const session = await getServerSession(authOptions)
    let userId: string | null = null
    
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email! }
      })
      userId = user?.id || null
    }
    
    // Get admin settings for AI configuration
    const adminSettings = await prisma.adminSettings.findFirst()
    const aiModel = adminSettings?.aiModel || 'gpt-4'
    const temperature = adminSettings?.aiTemperature || 0.7
    const maxTokens = adminSettings?.aiMaxTokens || 1000
    
    // Build context with recent properties if needed
    let enhancedContext = context || ''
    
    if (message.toLowerCase().includes('property') || 
        message.toLowerCase().includes('stay') ||
        message.toLowerCase().includes('book')) {
      
      // Get featured properties
      const featuredProperties = await prisma.property.findMany({
        where: {
          featured: true,
          status: 'ACTIVE'
        },
        include: {
          images: {
            take: 1,
            orderBy: { order: 'asc' }
          }
        },
        take: 2
      })
      
      if (featuredProperties.length > 0) {
        enhancedContext += '\n\nFeatured Properties:\n'
        featuredProperties.forEach(prop => {
          enhancedContext += `- ${prop.title} in ${prop.city}, ${prop.country}: $${prop.pricePerNight}/night, ${prop.bedrooms} bedrooms, ${prop.maxGuests} guests max\n`
        })
      }
    }
    
    // Build messages array for OpenAI
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]
    
    if (enhancedContext) {
      messages.push({ role: 'system', content: `Context: ${enhancedContext}` })
    }
    
    // Get recent conversation history if sessionId provided
    if (sessionId) {
      const recentMessages = await prisma.message.findMany({
        where: {
          OR: [
            { metadata: { path: ['sessionId'], equals: sessionId } },
            { senderId: userId || '' }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
      
      // Add conversation history in chronological order
      recentMessages.reverse().forEach(msg => {
        messages.push({
          role: msg.role === 'USER' ? 'user' : 'assistant',
          content: msg.content
        })
      })
    }
    
    // Add current message
    messages.push({ role: 'user', content: message })
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: aiModel as any,
      messages,
      temperature,
      max_tokens: maxTokens,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })
    
    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.'
    
    // Save messages to database
    if (userId || sessionId) {
      // Save user message
      await prisma.message.create({
        data: {
          content: message,
          senderId: userId || 'anonymous',
          role: 'USER',
          metadata: { sessionId }
        }
      })
      
      // Save AI response
      await prisma.message.create({
        data: {
          content: aiResponse,
          senderId: 'sara-ai',
          role: 'ASSISTANT',
          metadata: { sessionId }
        }
      })
    }
    
    // Generate action buttons based on response content
    const buttons = generateActionButtons(aiResponse, message)
    
    // Check if we should show properties
    const shouldShowProperties = 
      message.toLowerCase().includes('show') ||
      message.toLowerCase().includes('property') ||
      message.toLowerCase().includes('available') ||
      message.toLowerCase().includes('book')
    
    let properties = []
    if (shouldShowProperties) {
      properties = await prisma.property.findMany({
        where: {
          status: 'ACTIVE',
          featured: true
        },
        include: {
          images: {
            take: 1,
            orderBy: { order: 'asc' }
          },
          reviews: true
        },
        take: 2
      })
      
      // Calculate average ratings
      properties = properties.map(prop => ({
        ...prop,
        averageRating: prop.reviews.length > 0
          ? prop.reviews.reduce((sum, r) => sum + r.rating, 0) / prop.reviews.length
          : 0
      }))
    }
    
    return NextResponse.json({
      success: true,
      message: aiResponse,
      buttons,
      properties,
      sessionId: sessionId || generateSessionId()
    })
    
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Fallback response if OpenAI fails
    return NextResponse.json({
      success: true,
      message: "I'm having trouble connecting right now. You can still browse our properties or contact support directly. How can I help you today?",
      buttons: [
        { label: 'Browse Properties', action: 'browse', variant: 'primary' },
        { label: 'Contact Support', action: 'support', variant: 'secondary' },
        { label: 'View Help', action: 'help', variant: 'secondary' }
      ],
      properties: [],
      sessionId: generateSessionId()
    })
  }
}

function generateActionButtons(response: string, userMessage: string): any[] {
  const buttons = []
  const responseL = response.toLowerCase()
  const messageL = userMessage.toLowerCase()
  
  // Booking related
  if (responseL.includes('book') || messageL.includes('book')) {
    buttons.push({ label: 'Start Booking', action: 'book', variant: 'primary' })
    buttons.push({ label: 'Check Availability', action: 'availability', variant: 'secondary' })
  }
  
  // Property browsing
  if (responseL.includes('property') || responseL.includes('properties')) {
    buttons.push({ label: 'View All Properties', action: 'browse', variant: 'primary' })
    buttons.push({ label: 'Search by Location', action: 'search', variant: 'secondary' })
  }
  
  // Investment related
  if (responseL.includes('invest') || responseL.includes('roi') || messageL.includes('invest')) {
    buttons.push({ label: 'Investment Info', action: 'investment', variant: 'primary' })
    buttons.push({ label: 'ROI Calculator', action: 'calculator', variant: 'secondary' })
  }
  
  // Payment related
  if (responseL.includes('pay') || responseL.includes('payment')) {
    buttons.push({ label: 'Make Payment', action: 'payment', variant: 'primary' })
    buttons.push({ label: 'Payment Help', action: 'payment-help', variant: 'secondary' })
  }
  
  // Support
  if (responseL.includes('help') || responseL.includes('support')) {
    buttons.push({ label: 'Contact Support', action: 'support', variant: 'primary' })
    buttons.push({ label: 'FAQs', action: 'faq', variant: 'secondary' })
  }
  
  // Default buttons if none matched
  if (buttons.length === 0) {
    buttons.push({ label: 'Browse Properties', action: 'browse', variant: 'primary' })
    buttons.push({ label: 'Get Help', action: 'help', variant: 'secondary' })
  }
  
  return buttons
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}