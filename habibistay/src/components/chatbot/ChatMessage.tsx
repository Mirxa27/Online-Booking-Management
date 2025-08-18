'use client'

import { motion } from 'framer-motion'

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp?: Date
    buttons?: Array<{
      label: string
      action: string
      variant?: 'primary' | 'secondary'
    }>
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-animation`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-8 h-8 bg-habibistay-blue rounded-full flex items-center justify-center">
              <span className="text-white text-sm">S</span>
            </div>
            <span className="text-xs text-gray-500">Sara</span>
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser
              ? 'bg-habibistay-blue text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {message.buttons && message.buttons.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.buttons.map((button, index) => (
              <button
                key={index}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  button.variant === 'primary'
                    ? 'bg-habibistay-blue text-white hover:bg-habibistay-600'
                    : 'bg-white border border-habibistay-blue text-habibistay-blue hover:bg-gray-50'
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
        
        {message.timestamp && (
          <p className="text-xs text-gray-400 mt-1 ml-2">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}
      </div>
    </motion.div>
  )
}