import { request } from './base'

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

  async updatePassword(passwordData: { currentPassword: string; newPassword: string }) {
    return await request('/api/settings/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    })
  }
}
