'use client'

import { useState, useEffect } from 'react'
import { Search, UserPlus, UserX, MessageCircle, Users, Circle, Clock, BookOpen, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Friend {
  id: string
  username: string
  email: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  lastSeen?: string
  stats: {
    totalBooks: number
    totalHours: number
    currentStreak: number
  }
  isOnline: boolean
}

interface FriendRequest {
  id: string
  username: string
  email: string
  avatar?: string
  sentAt: string
}

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'online'>('friends')
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }
        await loadFriendsData()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadFriendsData = async () => {
    try {
      // Mock friends data - replace with API call
      const mockFriends: Friend[] = [
        {
          id: '1',
          username: 'SarahReader',
          email: 'sarah@example.com',
          avatar: 'https://via.placeholder.com/40x40?text=S',
          status: 'online' as const,
          stats: {
            totalBooks: 24,
            totalHours: 156,
            currentStreak: 12
          },
          isOnline: true
        },
        {
          id: '2',
          username: 'MikeBooks',
          email: 'mike@example.com',
          avatar: 'https://via.placeholder.com/40x40?text=M',
          status: 'offline' as const,
          lastSeen: '2 hours ago',
          stats: {
            totalBooks: 18,
            totalHours: 98,
            currentStreak: 5
          },
          isOnline: false
        },
        {
          id: '3',
          username: 'EmmaLit',
          email: 'emma@example.com',
          avatar: 'https://via.placeholder.com/40x40?text=E',
          status: 'away' as const,
          stats: {
            totalBooks: 31,
            totalHours: 203,
            currentStreak: 8
          },
          isOnline: true
        }
      ]

      // Mock friend requests
      const mockRequests: FriendRequest[] = [
        {
          id: '4',
          username: 'JohnReader',
          email: 'john@example.com',
          avatar: 'https://via.placeholder.com/40x40?text=J',
          sentAt: '2 days ago'
        },
        {
          id: '5',
          username: 'LisaBooks',
          email: 'lisa@example.com',
          avatar: 'https://via.placeholder.com/40x40?text=L',
          sentAt: '1 week ago'
        }
      ]

      setFriends(mockFriends)
      setFriendRequests(mockRequests)
    } catch (error) {
      console.error('Failed to load friends data:', error)
    }
  }

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      // Mock search results - replace with API call
      const mockResults: Friend[] = [
        {
          id: '6',
          username: 'AlexReader',
          email: 'alex@example.com',
          avatar: 'https://via.placeholder.com/40x40?text=A',
          status: 'online' as const,
          stats: {
            totalBooks: 15,
            totalHours: 67,
            currentStreak: 3
          },
          isOnline: true
        }
      ].filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )

      setSearchResults(mockResults)
    } catch (error) {
      console.error('Failed to search users:', error)
    }
  }

  const sendFriendRequest = async (userId: string) => {
    try {
      // Mock API call - replace with actual API call
      setSearchResults(prev => prev.filter(user => user.id !== userId))
      alert('Friend request sent!')
    } catch (error) {
      console.error('Failed to send friend request:', error)
    }
  }

  const acceptFriendRequest = async (requestId: string) => {
    try {
      // Mock API call - replace with actual API call
      const request = friendRequests.find(r => r.id === requestId)
      if (request) {
        const newFriend: Friend = {
          id: request.id,
          username: request.username,
          email: request.email,
          avatar: request.avatar,
          status: 'offline' as const,
          stats: {
            totalBooks: 0,
            totalHours: 0,
            currentStreak: 0
          },
          isOnline: false
        }
        setFriends(prev => [...prev, newFriend])
        setFriendRequests(prev => prev.filter(r => r.id !== requestId))
      }
    } catch (error) {
      console.error('Failed to accept friend request:', error)
    }
  }

  const declineFriendRequest = async (requestId: string) => {
    try {
      // Mock API call - replace with actual API call
      setFriendRequests(prev => prev.filter(r => r.id !== requestId))
    } catch (error) {
      console.error('Failed to decline friend request:', error)
    }
  }

  const removeFriend = async (friendId: string) => {
    if (confirm('Are you sure you want to remove this friend?')) {
      try {
        // Mock API call - replace with actual API call
        setFriends(prev => prev.filter(f => f.id !== friendId))
      } catch (error) {
        console.error('Failed to remove friend:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const onlineFriends = friends.filter(friend => friend.isOnline)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading friends...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Friends</h2>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for friends by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={searchUsers}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              Search
            </button>
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Search Results</h4>
              <div className="space-y-2">
                {searchResults.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || 'https://via.placeholder.com/40x40?text=U'}
                        alt={user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['friends', 'requests', 'online'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-medium transition-colors relative ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'requests' && friendRequests.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {friendRequests.length}
                </span>
              )}
              {tab === 'online' && (
                <span className="ml-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {onlineFriends.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div>
              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No friends yet</p>
                  <p className="text-sm text-gray-400">Search for friends above to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map(friend => (
                    <div key={friend.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={friend.avatar || 'https://via.placeholder.com/40x40?text=U'}
                              alt={friend.username}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{friend.username}</p>
                            <p className="text-sm text-gray-500">
                              {friend.isOnline ? 'Online' : friend.lastSeen || 'Offline'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFriend(friend.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Books</span>
                          <span className="font-medium">{friend.stats.totalBooks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hours</span>
                          <span className="font-medium">{friend.stats.totalHours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Streak</span>
                          <span className="font-medium">{friend.stats.currentStreak} days</span>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          Message
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div>
              {friendRequests.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No friend requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {friendRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={request.avatar || 'https://via.placeholder.com/40x40?text=U'}
                          alt={request.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{request.username}</p>
                          <p className="text-sm text-gray-500">{request.email}</p>
                          <p className="text-xs text-gray-400">Requested {request.sentAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptFriendRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineFriendRequest(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Online Tab */}
          {activeTab === 'online' && (
            <div>
              {onlineFriends.length === 0 ? (
                <div className="text-center py-12">
                  <Circle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No friends online</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {onlineFriends.map(friend => (
                    <div key={friend.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <img
                            src={friend.avatar || 'https://via.placeholder.com/40x40?text=U'}
                            alt={friend.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{friend.username}</p>
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <Circle className="w-2 h-2 fill-current" />
                            Online now
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current streak</span>
                          <span className="font-medium">{friend.stats.currentStreak} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Books read</span>
                          <span className="font-medium">{friend.stats.totalBooks}</span>
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Start Chat
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  )
}
