'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function RevenueChart() {
  const [timeframe, setTimeframe] = useState('month')

  const data = [
    { name: 'Jan', revenue: 45000, bookings: 120 },
    { name: 'Feb', revenue: 52000, bookings: 145 },
    { name: 'Mar', revenue: 48000, bookings: 132 },
    { name: 'Apr', revenue: 61000, bookings: 168 },
    { name: 'May', revenue: 55000, bookings: 151 },
    { name: 'Jun', revenue: 67000, bookings: 184 },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-habibistay-blue"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#2957c3" name="Revenue ($)" />
          <Bar dataKey="bookings" fill="#6c92d4" name="Bookings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}