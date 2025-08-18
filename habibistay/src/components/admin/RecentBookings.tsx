'use client'

import { Calendar, MapPin, User, DollarSign } from 'lucide-react'

export default function RecentBookings() {
  const bookings = [
    {
      id: 'BK001',
      guest: 'John Doe',
      property: 'Luxury Beachfront Villa',
      checkIn: '2024-02-15',
      checkOut: '2024-02-20',
      amount: 2250,
      status: 'confirmed'
    },
    {
      id: 'BK002',
      guest: 'Sarah Smith',
      property: 'Modern Downtown Apartment',
      checkIn: '2024-02-18',
      checkOut: '2024-02-22',
      amount: 720,
      status: 'pending'
    },
    {
      id: 'BK003',
      guest: 'Mike Johnson',
      property: 'City Center Penthouse',
      checkIn: '2024-02-20',
      checkOut: '2024-02-25',
      amount: 3500,
      status: 'confirmed'
    },
    {
      id: 'BK004',
      guest: 'Emily Brown',
      property: 'Cozy Mountain Cabin',
      checkIn: '2024-02-22',
      checkOut: '2024-02-26',
      amount: 800,
      status: 'confirmed'
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
        <button className="text-sm text-habibistay-blue hover:text-habibistay-600 font-medium">
          View All →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Booking ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Guest</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Property</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Check-in</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Check-out</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">{booking.id}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{booking.guest}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{booking.property}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{booking.checkIn}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-700">{booking.checkOut}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="font-medium text-gray-900">{booking.amount}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}