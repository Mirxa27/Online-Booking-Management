'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, Mic, MicOff, Home, Calendar, CreditCard, User, HelpCircle, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PropertyCard from './PropertyCard'
import ChatMessage from './ChatMessage'
import QuickActions from './QuickActions'
import VoiceInput from './VoiceInput'
import { useChatbot } from '@/hooks/useChatbot'

interface SaraChatbotProps {
  isOpen: boolean
  onClose: () => void
}

export default function SaraChatbot({ isOpen, onClose }: SaraChatbotProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    messages,
    isTyping,
    featuredProperties,
    sendMessage,
    handleQuickAction,
    handlePropertyAction
  } = useChatbot()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText)
      setInputText('')
    }
  }

  const handleVoiceResult = (transcript: string) => {
    setInputText(transcript)
    sendMessage(transcript)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`fixed ${isMinimized ? 'bottom-4 right-4' : 'bottom-0 right-0 sm:bottom-4 sm:right-4'} 
                   ${isMinimized ? 'w-80' : 'w-full sm:w-[450px]'} 
                   ${isMinimized ? 'h-16' : 'h-full sm:h-[700px]'} 
                   max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden
                   border border-gray-200`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-habibistay-blue to-habibistay-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">👋</span>
            </div>
            <div>
              <h3 className="font-semibold">Sara - Your AI Assistant</h3>
              {!isMinimized && (
                <p className="text-xs text-white/80">Here to help you find your perfect stay</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              
              {/* Featured Properties */}
              {featuredProperties.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Featured Properties for You:</p>
                  {featuredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onAction={handlePropertyAction}
                    />
                  ))}
                </div>
              )}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="flex space-x-1">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                  <span className="text-sm">Sara is typing...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <QuickActions onAction={handleQuickAction} />

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <VoiceInput
                  isListening={isListening}
                  onToggle={() => setIsListening(!isListening)}
                  onResult={handleVoiceResult}
                />
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type or speak your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-habibistay-blue text-white rounded-full hover:bg-habibistay-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Use buttons above or voice input for easier interaction
              </p>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}