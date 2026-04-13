import React from 'react'
import { StatsData } from '@/types/stats'

interface StatsCardsProps {
  stats: StatsData
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Total Sessions</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalSessions}</p>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Total Hours</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalHours}</p>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Pages Read</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPages}</p>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Average/Day</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.averagePerDay}h</p>
      </div>
    </div>
  )
}
