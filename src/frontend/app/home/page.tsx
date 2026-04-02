'use client'

import { useHome } from '@/hooks/home/useHome'
import { StatsGrid } from '@/components/home/StatsGrid'
import { ContinueReading } from '@/components/home/ContinueReading'
import { QuickActions } from '@/components/home/QuickActions'
import { FriendsActivity } from '@/components/home/FriendsActivity'
import { Achievements } from '@/components/home/Achievements'

export default function HomePage() {
  const { stats, books, friendActivity, user, loading } = useHome()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.username || 'Reader'}!
        </h2>
        <p className="text-gray-600 mt-1">Here's your reading progress today</p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Reading */}
        <div className="lg:col-span-2">
          <ContinueReading books={books} />

          {/* Weekly Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden group">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Weekly Reading Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="h-48 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 group-hover:border-blue-200 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Activity visualization coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          <QuickActions />
          <FriendsActivity activities={friendActivity} />
          <Achievements />
        </div>
      </div>
    </div>
  )
}
