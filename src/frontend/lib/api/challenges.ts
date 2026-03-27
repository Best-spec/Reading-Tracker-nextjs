import { request } from './base'

export const challengesApi = {
  async getChallenges() {
    return await request('/api/challenges')
  },

  async createChallenge(challengeData: any) {
    return await request('/api/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData),
    })
  },

  async updateChallengeProgress(challengeId: string, progress: any) {
    return await request(`/api/challenges/${challengeId}/progress`, {
      method: 'POST',
      body: JSON.stringify(progress),
    })
  }
}
