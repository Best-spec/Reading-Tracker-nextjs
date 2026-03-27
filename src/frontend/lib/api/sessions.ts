import { request } from './base'

export const sessionsApi = {
  async getReadingSessions() {
    return await request('/api/sessions')
  },

  async createSession(sessionData: any) {
    return await request('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
  },

  async updateSession(sessionId: string, sessionData: any) {
    return await request(`/api/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    })
  }
}
