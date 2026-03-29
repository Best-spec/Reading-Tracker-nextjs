import { request } from './base'

export const statsApi = {
  async getStats() {
    return await request('/api/stats')
  },

  async getReadingStats(period: string = 'month') {
    return await request(`/api/stats/reading?period=${period}`)
  }
}
