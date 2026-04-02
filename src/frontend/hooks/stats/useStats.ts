import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { statsService } from '@/service/statsService'
import { StatsData, ChartData } from '@/types/stats'
import { authApi } from '@/service/api/auth'

export const useStats = () => {
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

  const loadStatsData = useCallback(async () => {
    try {
      const statsData = await statsService.getStatsData()
      setStats(statsData)
      setTrendData(statsService.getTrendData(period))
      setStatusData(statsService.getStatusData())
      setDayData(statsService.getDayData())
    } catch (error) {
      console.error('Failed to load stats data:', error)
    }
  }, [period])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }
        // Additional auth check via API
        await authApi.checkAuth()
        await loadStatsData()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, loadStatsData])

  useEffect(() => {
    if (!loading) {
      loadStatsData()
    }
  }, [period, loading, loadStatsData])

  return {
    period,
    setPeriod,
    stats,
    trendData,
    statusData,
    dayData,
    loading
  }
}
