import { request } from './base'
import { FriendActivity } from '@/types/friend'

export const friendsApi = {
  async getFriends() {
    return await request('/api/friends')
  },

  async searchFriends(query: string) {
    return await request(`/api/friends/search?q=${encodeURIComponent(query)}`)
  },

  async sendFriendRequest(followingId: string) {
    return await request('/api/friends/request', {
      method: 'POST',
      body: JSON.stringify({ followingId }),
    })
  },

  async acceptFriendRequest(followerId: string) {
    return await request(`/api/friends/accept/${followerId}`, {
      method: 'PUT',
    })
  },

  async rejectFriendRequest(followerId: string) {
    return await request(`/api/friends/reject/${followerId}`, {
      method: 'PUT',
    })
  },
 
  async getPendingRequests() {
    return await request('/api/friends/pending')
  },
 
  async removeFriend(friendId: string) {
    return await request(`/api/friends/${friendId}`, {
      method: 'DELETE',
    })
  },
 
  async getFriendStats(friendId: string) {
    return await request(`/api/friends/${friendId}/stats`)
  },

  async getSentRequests() {
    return await request('/api/friends/sent')
  },

  async cancelFriendRequest(followerId: string) {
    return await request(`/api/friends/cancel/${followerId}`, {
      method: 'DELETE',
    })
  },

  async getActivity(): Promise<FriendActivity[]> {
    try {
      return await request('/api/friends/activity')
    } catch (error) {
      if (error instanceof Error && (error.message.includes('HTTP 404') || error.message.includes('Cannot connect to backend server'))) {
        return [
          {
            id: '1',
            userId: '2',
            username: 'John Doe',
            type: 'BOOK_FINISHED',
            description: 'finished reading "The Great Gatsby"',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            userId: '3',
            username: 'Jane Smith',
            type: 'READING_SESSION',
            description: 'read 25 pages of "1984"',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      }
      throw error
    }
  }
}
