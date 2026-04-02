'use client'

import { useStats } from '@/hooks/stats/useStats'
import { StatsCards } from '@/components/stats/StatsCards'
import { StatsCharts } from '@/components/stats/StatsCharts'

export default function StatsPage() {
  const {
    period,
    setPeriod,
    stats,
    trendData,
    statusData,
    dayData,
    loading
  } = useStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reading Statistics</h2>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {(['week', 'month', 'year'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts and Habits */}
      <StatsCharts 
        trendData={trendData} 
        statusData={statusData} 
        dayData={dayData} 
        stats={stats}
      />
    </div>
  )
}
