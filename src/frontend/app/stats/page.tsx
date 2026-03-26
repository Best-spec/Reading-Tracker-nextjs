'use client'

import { useState, useEffect } from 'react'
import { Flame, TrendingUp, Clock, BookOpen, BarChart3, PieChart, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface StatsData {
  totalSessions: number
  totalHours: number
  totalPages: number
  averagePerDay: number
  currentStreak: number
  longestStreak: number
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
  }[]
}

export default function StatsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [stats, setStats] = useState<StatsData>({
    totalSessions: 0,
    totalHours: 0,
    totalPages: 0,
    averagePerDay: 0,
    currentStreak: 0,
    longestStreak: 0
  })
  const [trendData, setTrendData] = useState<ChartData | null>(null)
  const [statusData, setStatusData] = useState<ChartData | null>(null)
  const [dayData, setDayData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }
        await loadStatsData()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (!loading) {
      loadStatsData()
    }
  }, [period])

  const loadStatsData = async () => {
    try {
      // Mock stats data
      const mockStats: StatsData = {
        totalSessions: period === 'week' ? 14 : period === 'month' ? 58 : 245,
        totalHours: period === 'week' ? 12.5 : period === 'month' ? 48.2 : 189.7,
        totalPages: period === 'week' ? 234 : period === 'month' ? 892 : 3567,
        averagePerDay: period === 'week' ? 1.8 : period === 'month' ? 1.6 : 1.4,
        currentStreak: 7,
        longestStreak: 23
      }
      setStats(mockStats)

      // Mock trend data
      const mockTrendData: ChartData = {
        labels: period === 'week' 
          ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          : period === 'month'
          ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Reading Hours',
          data: period === 'week' 
            ? [2.1, 1.5, 2.8, 1.2, 1.9, 2.5, 0.5]
            : period === 'month'
            ? [12.1, 14.5, 10.8, 10.8]
            : [15.2, 18.1, 16.7, 14.3, 15.8, 17.2, 16.1, 14.9, 15.5, 16.8, 15.2, 14.7],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      }
      setTrendData(mockTrendData)

      // Mock status data
      const mockStatusData: ChartData = {
        labels: ['Reading', 'Finished', 'To Read'],
        datasets: [{
          label: 'Books',
          data: [3, 12, 8],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(156, 163, 175, 0.8)'
          ]
        }]
      }
      setStatusData(mockStatusData)

      // Mock day data
      const mockDayData: ChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Hours',
          data: [2.5, 1.8, 2.1, 1.5, 1.9, 3.2, 2.8],
          backgroundColor: 'rgba(168, 85, 247, 0.8)'
        }]
      }
      setDayData(mockDayData)

    } catch (error) {
      console.error('Failed to load stats data:', error)
    }
  }

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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reading Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Trend</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Chart implementation needed</p>
                <p className="text-xs text-gray-400 mt-1">
                  {trendData?.labels.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Books by Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Books by Status</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Pie chart implementation needed</p>
                <div className="mt-3 space-y-1">
                  {statusData?.labels.map((label, i) => (
                    <div key={label} className="flex items-center justify-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: statusData.datasets[0].backgroundColor?.[i] }}
                      ></div>
                      <span>{label}: {statusData.datasets[0].data[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reading Hours by Day */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading by Day of Week</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Bar chart implementation needed</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {dayData?.labels.map((label, i) => (
                    <div key={label} className="text-center">
                      <div className="text-xs text-gray-500">{label}</div>
                      <div 
                        className="w-8 bg-purple-500 rounded-t mt-1" 
                        style={{ height: `${(dayData.datasets[0].data[i] / 3.5) * 40}px` }}
                      ></div>
                      <div className="text-xs">{dayData.datasets[0].data[i]}h</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reading Streak */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Streak</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Current Streak</p>
                    <p className="text-sm text-gray-500">Consecutive reading days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{stats.currentStreak}</p>
                  <p className="text-sm text-gray-500">days</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Longest Streak</p>
                    <p className="text-sm text-gray-500">Best consecutive days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{stats.longestStreak}</p>
                  <p className="text-sm text-gray-500">days</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <p className="font-medium text-gray-900">Reading Habit</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Most active day</span>
                    <span className="font-medium text-gray-900">Saturday</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average session</span>
                    <span className="font-medium text-gray-900">45 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Best time</span>
                    <span className="font-medium text-gray-900">8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Monthly Goal</span>
                <span className="text-sm text-gray-500">18 / 20 hours</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Books Goal</span>
                <span className="text-sm text-gray-500">2 / 3 books</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Pages Goal</span>
                <span className="text-sm text-gray-500">450 / 500 pages</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    // </div>
  )
}
