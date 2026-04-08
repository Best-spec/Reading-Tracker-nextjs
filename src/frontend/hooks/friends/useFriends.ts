import { useState, useCallback, useEffect } from 'react'
import { friendService } from '@/service/friendService'
import { Friend, FriendRequest } from '@/types/friend'

export function useFriends() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'online'>('friends')
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)

  const loadFriendsData = useCallback(async () => {
    try {
      const [friendsData, requestsData] = await Promise.all([
        friendService.getFriends(),
        friendService.getFriendRequests()
      ])
      // Ensure uniqueness using a Map by ID
      const uniqueFriends = Array.from(new Map(friendsData.map((f: Friend) => [f.id, f])).values());
      const uniqueRequests = Array.from(new Map(requestsData.map((r: FriendRequest) => [r.id, r])).values());
      
      setFriends(uniqueFriends)
      setFriendRequests(uniqueRequests)
    } catch (error) {
      console.error('Failed to load friends/requests:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    console.log('--- Search Flow Started ---')
    console.log('Search Query:', query)
    
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    try {
      console.log('Calling friendService.searchUsers...')
      const results = await friendService.searchUsers(query)
      console.log('Search Results received:', results)
      
      // Ensure uniqueness
      const uniqueResults = Array.from(new Map(results.map((f: Friend) => [f.id, f])).values());
      
      if (uniqueResults.length === 0) {
        alert('ไม่พบผู้ใช้ที่ค้นหา')
      }
      
      setSearchResults(uniqueResults)
    } catch (error) {
      console.error('Search error in handleSearch:', error)
      alert('เกิดข้อผิดพลาดในการค้นหา: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      console.log('--- Search Flow Ended ---')
    }
  }, [])

  const addFriend = useCallback(async (userId: string) => {
    console.log('Sending friend request to:', userId)
    try {
      await friendService.sendFriendRequest(userId)
      alert('ส่งคำขอเป็นเพื่อนเรียบร้อยแล้ว!')
      setSearchResults(prev => prev.filter(u => u.id !== userId))
      return true
    } catch (error) {
      console.error('Add friend error:', error)
      alert('ไม่สามารถส่งคำขอได้: ' + (error instanceof Error ? error.message : 'Unknown error'))
      return false
    }
  }, [])

  const acceptRequest = useCallback(async (requestId: string) => {
    try {
      await friendService.acceptFriendRequest(requestId)
      // Transition request to friend
      const request = friendRequests.find(r => r.id === requestId)
      if (request) {
        const newFriend: Friend = {
          ...(request.from as unknown as Friend),
          status: 'OFFLINE',
          isOnline: false
        }
        setFriends(prev => [...prev, newFriend])
        setFriendRequests(prev => prev.filter(r => r.id !== requestId))
      }
      return true
    } catch (error) {
      console.error('Accept request error:', error)
      return false
    }
  }, [friendRequests])

  const declineRequest = useCallback(async (requestId: string) => {
    try {
      await friendService.rejectFriendRequest(requestId)
      setFriendRequests(prev => prev.filter(r => r.id !== requestId))
      return true
    } catch (error) {
      console.error('Decline request error:', error)
      return false
    }
  }, [])

  const removeFriend = useCallback(async (friendId: string) => {
    try {
      await friendService.removeFriend(friendId)
      setFriends(prev => prev.filter(f => f.id !== friendId))
      return true
    } catch (error) {
      console.error('Remove friend error:', error)
      return false
    }
  }, [])

  useEffect(() => {
    loadFriendsData()
  }, [loadFriendsData])

  return {
    friends,
    friendRequests,
    searchResults,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    loading,
    handleSearch,
    addFriend,
    acceptRequest,
    declineRequest,
    removeFriend,
    onlineFriends: friends.filter(f => f.isOnline)
  }
}
