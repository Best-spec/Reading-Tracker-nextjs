import { request } from './base'

export const userApi = {
  async getProfile() {
    return await request('/api/user/profile')
  },

  async updateProfile(profileData: any) {
    return await request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }
}
