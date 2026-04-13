import { friendsApi } from './api/friends'
import { Friend, FriendRequest, FriendActivity } from '@/types/friend'

export const friendService = {
  async getFriends(page: number = 1, limit: number = 20): Promise<Friend[]> {
    console.log(`--- friendService.getFriends Flow Started (page: ${page}) ---`)
    try {
      const response = await friendsApi.getFriends(page, limit)
      const data = Array.isArray(response) ? response : (response?.data || response?.friends || [])
      
      // Fetch stats for each friend
      const friendsWithStats = await Promise.all(data.map(async (friend: Friend) => {
        try {
          const statsResponse = await friendsApi.getFriendStats(friend.id)
          const stats = statsResponse?.data || statsResponse
          return {
            ...friend,
            isOnline: friend.status !== 'OFFLINE',
            booksRead: stats.totalBooks || 0,
            readingStreak: stats.totalHours || 0 // Using totalHours as a placeholder for now
          }
        } catch (e) {
          return { ...friend, isOnline: friend.status !== 'OFFLINE', booksRead: 0, readingStreak: 0 }
        }
      }))

      console.log('Mapped Friends Data with Stats:', friendsWithStats)
      return friendsWithStats
    } catch (error) {
      console.error('Failed to fetch friends:', error)
      return []
    } finally {
      console.log('--- friendService.getFriends Flow Ended ---')
    }
  },

  async getFriendRequests(): Promise<FriendRequest[]> {
    try {
      const response = await friendsApi.getPendingRequests()
      return Array.isArray(response) ? response : (response?.data || [])
    } catch (error) {
      console.error('Failed to fetch friend requests:', error)
      return [
        {
          id: '4',
          from: { id: '4', username: 'JohnReader', email: 'john@example.com', displayName: 'John Reader' },
          to: { id: 'me', username: 'me', email: 'me@example.com', displayName: 'Me' },
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }
      ] as FriendRequest[]
    }
  },

  async getSentRequests(): Promise<FriendRequest[]> {
    try {
      const response = await friendsApi.getSentRequests()
      return Array.isArray(response) ? response : (response?.data || [])
    } catch (error) {
      console.error('Failed to fetch sent requests:', error)
      return []
    }
  },

  async searchUsers(query: string): Promise<Friend[]> {
    console.log('--- friendService.searchUsers ---')
    console.log('Query:', query)
    try {
      const response = await friendsApi.searchFriends(query)
      console.log('API Response:', response)
      const results = Array.isArray(response) ? response : (response?.data || response?.users || [])
      console.log('Transformed Results:', results)
      return results
    } catch (error) {
      console.error('API Error in searchUsers:', error)
      throw error
    }
  },

  async sendFriendRequest(followingId: string) {
    console.log('friendService.sendFriendRequest followingId:', followingId)
    return await friendsApi.sendFriendRequest(followingId)
  },

  async acceptFriendRequest(requestId: string) {
    if (!requestId) return;
    const followerId = requestId.includes('_') ? requestId.split('_')[0] : requestId
    return await friendsApi.acceptFriendRequest(followerId)
  },

  async rejectFriendRequest(requestId: string) {
    if (!requestId) return;
    const followerId = requestId.includes('_') ? requestId.split('_')[0] : requestId
    return await friendsApi.rejectFriendRequest(followerId)
  },

  async removeFriend(friendId: string) {
    return await friendsApi.removeFriend(friendId)
  },

  async cancelFriendRequest(requestId: string) {
    if (!requestId) return;
    const followingId = requestId.includes('_') ? requestId.split('_')[1] : requestId
    return await friendsApi.cancelFriendRequest(followingId)
  }
}
