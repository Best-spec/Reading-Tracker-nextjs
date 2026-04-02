import { request } from './base'

export const sessionsApi = {
  async getReadingSessions() {
    const res = await request('/api/reading-sessions/history')
    return res.data || []
  },

  async getActiveSession() {
    const res = await request('/api/reading-sessions/active')
    return res.data || null
  },

  async startSession(sessionData: { bookId: string, section?: string }) {
    const res = await request('/api/reading-sessions/start', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
    return res.data
  },

  async stopSession(sessionData: { sessionId: string, pagesRead: number }) {
    const res = await request('/api/reading-sessions/stop', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
    return res.data
  }
}
