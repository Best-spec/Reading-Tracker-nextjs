import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { friendService } from '@/service/friendService'
import { Friend, FriendRequest } from '@/types/friend'

export function useFriends() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'online' | 'pending'>('friends')
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [hasMoreFriends, setHasMoreFriends] = useState(true)
  const limit = 20
  
  const showMessage = useCallback((text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }, [])

  const loadFriendsData = useCallback(async () => {
    try {
      const token = localStorage.getItem('readflow_token')
      if (!token) {
        router.push('/login')
        return
      }

      const [friendsData, requestsData, sentRequestsData] = await Promise.all([
        friendService.getFriends(1, limit),
        friendService.getFriendRequests(),
        friendService.getSentRequests()
      ])
      // Ensure uniqueness using a Map by ID
      const uniqueFriends = Array.from(new Map(friendsData.map((f: Friend) => [f.id, f])).values());
      const uniqueRequests = Array.from(new Map(requestsData.map((r: FriendRequest) => [r.id, r])).values());
      const uniqueSentRequests = Array.from(new Map(sentRequestsData.map((r: FriendRequest) => [r.id, r])).values());
      
      setFriends(uniqueFriends)
      setHasMoreFriends(uniqueFriends.length >= limit)
      
      setFriendRequests(uniqueRequests)
      setPendingRequests(uniqueSentRequests)
    } catch (error) {
      console.error('Failed to load friends/requests:', error)
      showMessage('โหลดข้อมูลเพื่อนล้มเหลว กรุณาลองใหม่อีกครั้ง', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMoreFriends = useCallback(async () => {
    if (!hasMoreFriends || loading) return;
    
    try {
      const nextPage = page + 1;
      const newFriends = await friendService.getFriends(nextPage, limit);
      
      if (newFriends.length > 0) {
        setFriends(prev => {
          // Avoid duplicates
          const currentMap = new Map(prev.map(f => [f.id, f]));
          newFriends.forEach(f => currentMap.set(f.id, f));
          return Array.from(currentMap.values());
        })
        setPage(nextPage)
      }
      
      if (newFriends.length < limit) {
        setHasMoreFriends(false)
      }
    } catch (error) {
      console.error('Failed to load more friends:', error)
      showMessage('โหลดรายชื่อเพิ่มเติมขัดข้อง', 'error')
    }
  }, [page, hasMoreFriends, loading, showMessage])

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
        showMessage('ไม่พบผู้ใช้ที่ค้นหา', 'error')
      }
      
      setSearchResults(uniqueResults)
    } catch (error) {
      console.error('Search error in handleSearch:', error)
      showMessage('เกิดข้อผิดพลาดในการค้นหา: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error')
    } finally {
      console.log('--- Search Flow Ended ---')
    }
  }, [])

  const addFriend = useCallback(async (userId: string) => {
    console.log('Sending friend request to:', userId)
    try {
      await friendService.sendFriendRequest(userId)
      
      // Immediately fetch and update pending requests to reflect the new state
      const updatedPending = await friendService.getSentRequests()
      setPendingRequests(updatedPending)
      
      showMessage('ส่งคำขอเป็นเพื่อนเรียบร้อยแล้ว!', 'success')
      setSearchResults(prev => prev.filter(u => u.id !== userId))
      return true
    } catch (error) {
      console.error('Add friend error:', error)
      showMessage('ไม่สามารถส่งคำขอได้: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error')
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
          status: request.from?.status || 'OFFLINE',
          isOnline: request.from?.status === 'ONLINE' || request.from?.status === 'READING'
        }
        setFriends(prev => [...prev, newFriend])
        setFriendRequests(prev => prev.filter(r => r.id !== requestId))
        showMessage('ยอมรับคำขอเป็นเพื่อนแล้ว', 'success')
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

  const cancelRequest = useCallback(async (requestId: string) => {
    try {
      await friendService.cancelFriendRequest(requestId)
      setPendingRequests(prev => prev.filter(r => r.id !== requestId))
      return true
    } catch (error) {
      console.error('Cancel request error:', error)
      return false
    }
  }, [])

  useEffect(() => {
    loadFriendsData()
  }, [loadFriendsData])

  return {
    friends,
    friendRequests,
    pendingRequests,
    searchResults,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    loading,
    handleSearch,
    loadMoreFriends,
    hasMoreFriends,
    addFriend,
    acceptRequest,
    declineRequest,
    removeFriend,
    cancelRequest,
    message,
    onlineFriends: friends.filter(f => f.isOnline)
  }
}
