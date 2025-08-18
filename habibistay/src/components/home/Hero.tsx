'use client'

import { useState } from 'react'
import { Search, Calendar, Users, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  const [searchLocation, setSearchLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')

  return (
    <section className="relative bg-gradient-to-br from-habibistay-50 via-white to-habibistay-100 pt-12 pb-20">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-gradient">Habibistay</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exceptional properties and smart investment opportunities. 
            Experience luxury stays with proven returns of 17% annual ROI.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label className="label">Where</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label">Check in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label">Check out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="input pl-10 appearance-none"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button className="flex items-center space-x-2 px-8 py-3 bg-habibistay-blue text-white rounded-xl hover:bg-habibistay-600 transition-all transform hover:scale-105 shadow-lg">
                <Search className="w-5 h-5" />
                <span className="font-semibold">Search Properties</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-habibistay-blue">500+</div>
            <div className="text-gray-600 text-sm mt-1">Premium Properties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-habibistay-blue">17%</div>
            <div className="text-gray-600 text-sm mt-1">Average ROI</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-habibistay-blue">50K+</div>
            <div className="text-gray-600 text-sm mt-1">Happy Guests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-habibistay-blue">24/7</div>
            <div className="text-gray-600 text-sm mt-1">Support Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}