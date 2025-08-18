'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Home, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react'
import DashboardCard from '@/components/admin/DashboardCard'
import RevenueChart from '@/components/admin/RevenueChart'
import RecentBookings from '@/components/admin/RecentBookings'
import PropertyPerformance from '@/components/admin/PropertyPerformance'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalInvestors: 0,
    occupancyRate: 0,
    averageROI: 0
  })

  useEffect(() => {
    // Mock data - replace with API call
    setStats({
      totalProperties: 156,
      totalBookings: 1234,
      totalRevenue: 2456789,
      totalInvestors: 89,
      occupancyRate: 78,
      averageROI: 17.3
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <DashboardCard
          title="Total Properties"
          value={stats.totalProperties}
          icon={Home}
          trend="+12%"
          trendUp={true}
        />
        <DashboardCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          trend="+8%"
          trendUp={true}
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`}
          icon={DollarSign}
          trend="+15%"
          trendUp={true}
        />
        <DashboardCard
          title="Total Investors"
          value={stats.totalInvestors}
          icon={Users}
          trend="+5%"
          trendUp={true}
        />
        <DashboardCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={BarChart3}
          trend="+3%"
          trendUp={true}
        />
        <DashboardCard
          title="Average ROI"
          value={`${stats.averageROI}%`}
          icon={TrendingUp}
          trend="+0.5%"
          trendUp={true}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <PropertyPerformance />
      </div>

      {/* Recent Activity */}
      <RecentBookings />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-habibistay-50 text-habibistay-blue rounded-lg hover:bg-habibistay-100 transition-colors text-center">
            <Home className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Property</span>
          </button>
          <button className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-center">
            <FileText className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Generate Report</span>
          </button>
          <button className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-center">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Manage Investors</span>
          </button>
          <button className="p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-center">
            <Settings className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">AI Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}