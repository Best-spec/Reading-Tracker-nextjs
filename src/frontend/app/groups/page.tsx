'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Calendar, Trophy, BookOpen, Star, X, UserPlus, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Group {
  id: string
  name: string
  description: string
  memberCount: number
  isPublic: boolean
  createdAt: string
  adminId: string
  adminName: string
  currentBook?: string
  nextMeeting?: string
  memberProgress?: number
}

interface GroupMember {
  id: string
  username: string
  avatar?: string
  booksRead: number
  joinDate: string
  isAdmin: boolean
}

export default function GroupsPage() {
  const [myGroups, setMyGroups] = useState<Group[]>([])
  const [discoverGroups, setDiscoverGroups] = useState<Group[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }
        await loadGroupsData()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadGroupsData = async () => {
    try {
      // Mock my groups data
      const mockMyGroups: Group[] = [
        {
          id: '1',
          name: 'Fantasy Book Club',
          description: 'For lovers of fantasy and magical worlds',
          memberCount: 24,
          isPublic: true,
          createdAt: '2024-01-15',
          adminId: 'user1',
          adminName: 'Sarah',
          currentBook: 'The Name of the Wind',
          nextMeeting: '2024-02-01',
          memberProgress: 65
        },
        {
          id: '2',
          name: 'Sci-Fi Enthusiasts',
          description: 'Exploring the future through science fiction',
          memberCount: 18,
          isPublic: true,
          createdAt: '2024-01-20',
          adminId: 'user2',
          adminName: 'Mike',
          currentBook: 'Dune',
          nextMeeting: '2024-02-05',
          memberProgress: 42
        }
      ]

      // Mock discover groups data
      const mockDiscoverGroups: Group[] = [
        {
          id: '3',
          name: 'Classic Literature',
          description: 'Reading and discussing timeless classics',
          memberCount: 156,
          isPublic: true,
          createdAt: '2023-12-01',
          adminId: 'user3',
          adminName: 'Emma'
        },
        {
          id: '4',
          name: 'Mystery Thrillers',
          description: 'For those who love suspense and mystery',
          memberCount: 89,
          isPublic: true,
          createdAt: '2024-01-10',
          adminId: 'user4',
          adminName: 'John'
        },
        {
          id: '5',
          name: 'Young Adult Fiction',
          description: 'YA books for all ages',
          memberCount: 234,
          isPublic: true,
          createdAt: '2023-11-15',
          adminId: 'user5',
          adminName: 'Lisa'
        }
      ]

      setMyGroups(mockMyGroups)
      setDiscoverGroups(mockDiscoverGroups)
    } catch (error) {
      console.error('Failed to load groups data:', error)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Group name is required')
      return
    }

    try {
      // Mock API call - replace with actual API call
      const newGroup: Group = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        memberCount: 1,
        isPublic: true,
        createdAt: new Date().toISOString().split('T')[0],
        adminId: 'current-user',
        adminName: 'You'
      }

      setMyGroups(prev => [newGroup, ...prev])
      setShowCreateModal(false)
      setFormData({ name: '', description: '' })
    } catch (error) {
      setError('Failed to create group. Please try again.')
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    try {
      // Mock API call - replace with actual API call
      const group = discoverGroups.find(g => g.id === groupId)
      if (group) {
        setDiscoverGroups(prev => prev.filter(g => g.id !== groupId))
        setMyGroups(prev => [...prev, { ...group, memberCount: group.memberCount + 1 }])
      }
    } catch (error) {
      console.error('Failed to join group:', error)
    }
  }

  const handleLeaveGroup = async (groupId: string) => {
    if (confirm('Are you sure you want to leave this group?')) {
      try {
        // Mock API call - replace with actual API call
        const group = myGroups.find(g => g.id === groupId)
        if (group) {
          setMyGroups(prev => prev.filter(g => g.id !== groupId))
          setDiscoverGroups(prev => [...prev, { ...group, memberCount: group.memberCount - 1 }])
        }
      } catch (error) {
        console.error('Failed to leave group:', error)
      }
    }
  }

  const showGroupDetails = async (group: Group) => {
    setSelectedGroup(group)
    
    // Mock group members data
    const mockMembers: GroupMember[] = [
      {
        id: '1',
        username: group.adminName,
        avatar: 'https://via.placeholder.com/40x40?text=A',
        booksRead: 12,
        joinDate: group.createdAt,
        isAdmin: true
      },
      {
        id: '2',
        username: 'BookLover92',
        avatar: 'https://via.placeholder.com/40x40?text=B',
        booksRead: 8,
        joinDate: '2024-01-20',
        isAdmin: false
      },
      {
        id: '3',
        username: 'ReadingFan',
        avatar: 'https://via.placeholder.com/40x40?text=C',
        booksRead: 15,
        joinDate: '2024-01-25',
        isAdmin: false
      }
    ]
    
    setGroupMembers(mockMembers)
    setShowDetailsModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading groups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reading Groups</h2>
          <p className="text-gray-600 mt-1">Join groups and compete with friends</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Group
        </button>
      </div>

      {/* My Groups */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Groups</h3>
        {myGroups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't joined any groups yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map(group => (
              <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{group.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    {group.memberCount}
                  </div>
                </div>

                {group.currentBook && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Current Book:</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">{group.currentBook}</p>
                    {group.memberProgress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-blue-600 mb-1">
                          <span>Progress</span>
                          <span>{group.memberProgress}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${group.memberProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {group.nextMeeting && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Next meeting: {group.nextMeeting}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => showGroupDetails(group)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleLeaveGroup(group.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discover Groups */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Discover Groups</h3>
        {discoverGroups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No more groups to discover</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoverGroups.map(group => (
              <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{group.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    {group.memberCount}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Star className="w-4 h-4" />
                  <span>Created by {group.adminName}</span>
                </div>

                <button
                  onClick={() => handleJoinGroup(group.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Join Group
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Create New Group</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setError('')
                  setFormData({ name: '', description: '' })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Fantasy Book Club"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What is this group about?"
                />
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setError('')
                    setFormData({ name: '', description: '' })
                  }}
                  className="flex-1 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Details Modal */}
      {showDetailsModal && selectedGroup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{selectedGroup.name}</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false)
                    setSelectedGroup(null)
                    setGroupMembers([])
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">{selectedGroup.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedGroup.memberCount}</p>
                  <p className="text-sm text-gray-600">Members</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{selectedGroup.createdAt}</p>
                  <p className="text-sm text-gray-600">Created</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{selectedGroup.adminName}</p>
                  <p className="text-sm text-gray-600">Admin</p>
                </div>
              </div>

              {selectedGroup.currentBook && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Current Book</h4>
                  <p className="text-blue-700">{selectedGroup.currentBook}</p>
                  {selectedGroup.nextMeeting && (
                    <p className="text-sm text-blue-600 mt-1">Next meeting: {selectedGroup.nextMeeting}</p>
                  )}
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Members ({groupMembers.length})</h4>
                <div className="space-y-3">
                  {groupMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || 'https://via.placeholder.com/40x40?text=U'}
                          alt={member.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            {member.username}
                            {member.isAdmin && (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Admin</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">{member.booksRead} books read</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Joined {member.joinDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
