import { statsApi } from './api/stats'

import { StatsData, ChartData } from '@/types/stats'

export const statsService = {
  async getStatsData(): Promise<StatsData> {
    try {
      const realStats = await statsApi.getStats().catch(() => ({}))
      
      return {
        totalSessions: realStats.totalSessions || 0,
        totalHours: realStats.totalHours || 0,
        totalPages: realStats.totalPages || 0,
        averagePerDay: 0, // Backend algorithm pending
        currentStreak: realStats.currentStreak || 0,
        longestStreak: realStats.longestStreak || 0
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      throw error
    }
  },

  getTrendData(period: 'week' | 'month' | 'year'): ChartData {
    // Mock trend data logic extracted from page.tsx
    return {
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
  },

  getStatusData(): ChartData {
    return {
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
  },

  getDayData(): ChartData {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Hours',
        data: [2.5, 1.8, 2.1, 1.5, 1.9, 3.2, 2.8],
        backgroundColor: 'rgba(168, 85, 247, 0.8)'
      }]
    }
  }
}
