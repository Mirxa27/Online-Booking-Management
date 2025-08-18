'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Home,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  FileText,
  MessageSquare,
  DollarSign,
  Bot
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/properties', label: 'Properties', icon: Home },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/admin/investors', label: 'Investors', icon: TrendingUp },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/payments', label: 'Payments', icon: DollarSign },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/reports', label: 'Reports', icon: FileText },
    { href: '/admin/ai-settings', label: 'AI Settings', icon: Bot },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-habibistay-50 text-habibistay-blue'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}