import { request } from './base'
import { UpdatePasswordData } from '@/types/settings'

export const settingsApi = {
  async getSettings() {
    return await request('/api/settings')
  },

  async updateSettings(settingsData: any) {
    return await request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    })
  },

  async updatePassword(passwordData: UpdatePasswordData) {
    return await request('/api/settings/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    })
  }
}
