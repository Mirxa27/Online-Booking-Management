'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  buttons?: Array<{
    label: string
    action: string
    variant?: 'primary' | 'secondary'
  }>
}

interface Property {
  id: string
  title: string
  description: string
  image: string
  price: number
  location: string
  rating: number
  bedrooms: number
  bathrooms: number
  maxGuests: number
  amenities: string[]
}

export function useChatbot() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])

  useEffect(() => {
    // Initial greeting from Sara
    const initialMessage: Message = {
      role: 'assistant',
      content: "Hello! I'm Sara, your personal travel assistant at Habibistay. 🏡\n\nI'm here to help you find the perfect accommodation for your stay. Whether you're looking for a cozy apartment, a luxury villa, or interested in property investment opportunities, I've got you covered!",
      timestamp: new Date(),
      buttons: [
        { label: 'Browse Properties', action: 'browse', variant: 'primary' },
        { label: 'Check Dates', action: 'dates', variant: 'secondary' },
        { label: 'Investment Info', action: 'investment', variant: 'secondary' },
        { label: 'Sign In', action: 'signin', variant: 'secondary' },
      ]
    }
    setMessages([initialMessage])

    // Load featured properties
    loadFeaturedProperties()
  }, [])

  const loadFeaturedProperties = async () => {
    // Mock data for now - will be replaced with API call
    const mockProperties: Property[] = [
      {
        id: '1',
        title: 'Luxury Beachfront Villa',
        description: 'Stunning 4-bedroom villa with panoramic ocean views, private pool, and direct beach access. Perfect for families or groups.',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        price: 450,
        location: 'Miami Beach, Florida',
        rating: 4.9,
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        amenities: ['Pool', 'Beach Access', 'WiFi', 'Kitchen', 'Parking', 'AC']
      },
      {
        id: '2',
        title: 'Modern Downtown Apartment',
        description: 'Sleek 2-bedroom apartment in the heart of the city. Walking distance to restaurants, shopping, and entertainment.',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        price: 180,
        location: 'New York City, NY',
        rating: 4.7,
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        amenities: ['WiFi', 'Kitchen', 'Gym', 'Concierge', 'City View', 'Workspace']
      }
    ]
    setFeaturedProperties(mockProperties)
  }

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Simulate API call to OpenAI
    setTimeout(() => {
      const response = generateResponse(text)
      setMessages(prev => [...prev, response])
      setIsTyping(false)
    }, 1500)
  }

  const generateResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()
    
    if (input.includes('book') || input.includes('reserve')) {
      return {
        role: 'assistant',
        content: "Great! I'll help you book a property. First, let me know:\n\n• Check-in and check-out dates\n• Number of guests\n• Preferred location\n• Your budget range\n\nOr you can select from our featured properties above!",
        timestamp: new Date(),
        buttons: [
          { label: 'Select Dates', action: 'calendar', variant: 'primary' },
          { label: 'View All Properties', action: 'browse', variant: 'secondary' }
        ]
      }
    }
    
    if (input.includes('invest') || input.includes('roi')) {
      return {
        role: 'assistant',
        content: "Excellent choice! Habibistay offers lucrative investment opportunities:\n\n💰 Average 17% Annual ROI\n🏡 Fully Managed Properties\n📊 Real-time Performance Dashboard\n🔒 Secure & Transparent\n\nOur portfolio includes properties in prime tourist destinations and emerging markets. Would you like to explore our investment options?",
        timestamp: new Date(),
        buttons: [
          { label: 'View Investment Properties', action: 'investment-properties', variant: 'primary' },
          { label: 'Schedule Consultation', action: 'consultation', variant: 'secondary' },
          { label: 'Download Brochure', action: 'brochure', variant: 'secondary' }
        ]
      }
    }
    
    if (input.includes('help') || input.includes('support')) {
      return {
        role: 'assistant',
        content: "I'm here to help! You can:\n\n• Search and book properties\n• Check availability and pricing\n• Manage your bookings\n• Learn about investment opportunities\n• Get local recommendations\n• Contact support\n\nWhat would you like assistance with?",
        timestamp: new Date(),
        buttons: [
          { label: 'Contact Support', action: 'support', variant: 'primary' },
          { label: 'FAQs', action: 'faq', variant: 'secondary' }
        ]
      }
    }
    
    // Default response
    return {
      role: 'assistant',
      content: "I understand you're interested in that. Let me help you find exactly what you're looking for. You can use the quick action buttons below or tell me more about your needs.",
      timestamp: new Date()
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'search':
        sendMessage('I want to search for properties')
        break
      case 'availability':
        sendMessage('Check availability for properties')
        break
      case 'locations':
        sendMessage('Show me properties by location')
        break
      case 'pricing':
        sendMessage('What are your pricing options?')
        break
      case 'account':
        router.push('/account')
        break
      case 'investment':
        sendMessage('Tell me about investment opportunities')
        break
      case 'list':
        router.push('/host/list-property')
        break
      case 'help':
        sendMessage('I need help')
        break
      default:
        break
    }
  }

  const handlePropertyAction = (action: string, propertyId: string) => {
    switch (action) {
      case 'view':
        router.push(`/property/${propertyId}`)
        break
      case 'book':
        router.push(`/booking/new?property=${propertyId}`)
        break
      default:
        break
    }
  }

  return {
    messages,
    isTyping,
    featuredProperties,
    sendMessage,
    handleQuickAction,
    handlePropertyAction
  }
}