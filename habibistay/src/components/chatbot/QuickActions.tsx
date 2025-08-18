'use client'

import { Search, Calendar, MapPin, DollarSign, User, HelpCircle, Home, TrendingUp } from 'lucide-react'

interface QuickActionsProps {
  onAction: (action: string) => void
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { icon: Search, label: 'Search Properties', action: 'search' },
    { icon: Calendar, label: 'Check Availability', action: 'availability' },
    { icon: MapPin, label: 'Browse Locations', action: 'locations' },
    { icon: DollarSign, label: 'View Pricing', action: 'pricing' },
    { icon: User, label: 'My Account', action: 'account' },
    { icon: TrendingUp, label: 'Investment Info', action: 'investment' },
    { icon: Home, label: 'List Property', action: 'list' },
    { icon: HelpCircle, label: 'Get Help', action: 'help' },
  ]

  return (
    <div className="p-3 bg-gray-50 border-t border-gray-200">
      <p className="text-xs text-gray-600 mb-2 font-medium">Quick Actions</p>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={index}
              onClick={() => onAction(item.action)}
              className="flex flex-col items-center justify-center p-2 bg-white rounded-lg hover:bg-habibistay-50 hover:border-habibistay-blue border border-gray-200 transition-all group"
            >
              <Icon className="w-5 h-5 text-gray-600 group-hover:text-habibistay-blue mb-1" />
              <span className="text-xs text-gray-600 group-hover:text-habibistay-blue text-center">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}