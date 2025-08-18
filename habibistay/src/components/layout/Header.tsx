'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, Globe, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-habibistay-blue to-habibistay-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Habibistay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-gray-700 hover:text-habibistay-blue transition-colors">
              Properties
            </Link>
            <Link href="/investment" className="text-gray-700 hover:text-habibistay-blue transition-colors">
              Investment
            </Link>
            <Link href="/host" className="text-gray-700 hover:text-habibistay-blue transition-colors">
              Become a Host
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-habibistay-blue transition-colors">
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Globe className="w-5 h-5 text-gray-700" />
            </button>
            
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/host"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                List your property
              </Link>
              <button
                onClick={() => router.push('/auth/signin')}
                className="flex items-center space-x-2 px-4 py-2 bg-habibistay-blue text-white rounded-lg hover:bg-habibistay-600 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container-main py-4 space-y-3">
            <Link
              href="/properties"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Properties
            </Link>
            <Link
              href="/investment"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Investment
            </Link>
            <Link
              href="/host"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Become a Host
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              About
            </Link>
            <hr className="my-3" />
            <Link
              href="/host"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              List your property
            </Link>
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-habibistay-blue text-white rounded-lg hover:bg-habibistay-600 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}