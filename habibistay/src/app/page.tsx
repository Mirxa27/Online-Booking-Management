'use client'

import { useState, useEffect } from 'react'
import SaraChatbot from '@/components/chatbot/SaraChatbot'
import Header from '@/components/layout/Header'
import Hero from '@/components/home/Hero'
import InvestorHighlights from '@/components/home/InvestorHighlights'

export default function HomePage() {
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    // Show chat after a brief delay for better UX
    const timer = setTimeout(() => {
      setShowChat(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <Hero />
      <InvestorHighlights />
      
      {/* Sara Chatbot - Always visible */}
      <SaraChatbot isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  )
}