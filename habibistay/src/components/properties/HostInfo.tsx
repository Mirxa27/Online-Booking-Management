'use client'

import { Shield, Star, MessageCircle, Award, Home } from 'lucide-react'
import { format } from 'date-fns'

interface HostInfoProps {
  host: any
}

export default function HostInfo({ host }: HostInfoProps) {
  return (
    <div className="border-t border-b border-gray-200 py-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {host.image ? (
              <img
                src={host.image}
                alt={host.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-medium text-gray-600">
                {host.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Hosted by {host.name}
            </h3>
            <p className="text-sm text-gray-600">
              Joined {format(new Date(host.createdAt), 'MMMM yyyy')}
            </p>
            
            <div className="flex items-center space-x-4 mt-3">
              {host._count?.properties > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Home className="w-4 h-4 mr-1" />
                  {host._count.properties} {host._count.properties === 1 ? 'property' : 'properties'}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-1" />
                Identity verified
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Award className="w-4 h-4 mr-1" />
                Superhost
              </div>
            </div>
          </div>
        </div>
        
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Host
        </button>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Response rate</p>
          <p className="text-sm text-gray-600">100%</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Response time</p>
          <p className="text-sm text-gray-600">Within an hour</p>
        </div>
      </div>
    </div>
  )
}