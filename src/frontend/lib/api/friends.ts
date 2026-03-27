import { request } from './base'

export const friendsApi = {
  async getFriends() {
    return await request('/api/friends')
  },

  async searchFriends(query: string) {
    return await request(`/api/friends/search?q=${encodeURIComponent(query)}`)
  },

  async sendFriendRequest(friendId: string) {
    return await request('/api/friends/request', {
      method: 'POST',
      body: JSON.stringify({ friendId }),
    })
  },

  async acceptFriendRequest(requestId: string) {
    return await request(`/api/friends/requests/${requestId}/accept`, {
      method: 'POST',
    })
  },

  async rejectFriendRequest(requestId: string) {
    return await request(`/api/friends/requests/${requestId}/reject`, {
      method: 'POST',
    })
  }
}
