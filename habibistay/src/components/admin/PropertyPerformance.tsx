'use client'

export default function PropertyPerformance() {
  const properties = [
    { name: 'Luxury Beachfront Villa', occupancy: 92, revenue: 45000, rating: 4.9 },
    { name: 'Modern Downtown Apartment', occupancy: 85, revenue: 32000, rating: 4.7 },
    { name: 'Cozy Mountain Cabin', occupancy: 78, revenue: 28000, rating: 4.8 },
    { name: 'City Center Penthouse', occupancy: 88, revenue: 52000, rating: 4.9 },
    { name: 'Suburban Family Home', occupancy: 75, revenue: 24000, rating: 4.6 },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Properties</h2>
      
      <div className="space-y-4">
        {properties.map((property, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{property.name}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600">
                  Occupancy: <span className="font-medium">{property.occupancy}%</span>
                </span>
                <span className="text-sm text-gray-600">
                  Rating: <span className="font-medium">⭐ {property.rating}</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-habibistay-blue">
                ${(property.revenue / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500">Revenue</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-habibistay-blue hover:bg-habibistay-50 rounded-lg transition-colors text-sm font-medium">
        View All Properties →
      </button>
    </div>
  )
}