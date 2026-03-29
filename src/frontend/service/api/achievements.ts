import { request } from './base'

export const achievementsApi = {
  async getAchievements() {
    return await request('/api/achievements')
  },

  async unlockAchievement(achievementId: string) {
    return await request(`/api/achievements/${achievementId}/unlock`, {
      method: 'POST',
    })
  }
}
