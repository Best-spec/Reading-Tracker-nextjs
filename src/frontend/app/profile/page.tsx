'use client'

import { useState, useEffect } from 'react'
import { User, BookOpen, Clock, Flame, Trophy, Calendar, Award, Target, Edit2, Camera, Mail, MapPin, Link as LinkIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/service/api'

interface UserProfile {
  id: string
  username: string
  email: string
  displayName: string
  bio: string
  avatar?: string
  location?: string
  website?: string
  joinDate: string
  isPublic: boolean
  status?: string
}

interface ReadingStats {
  totalBooks: number
  totalPages: number
  totalHours: number
  currentStreak: number
  longestStreak: number
  favoriteGenre: string
  averageRating: number
}

interface RecentBook {
  id: string
  title: string
  author: string
  coverUrl?: string
  status: 'FINISHED' | 'READING' | 'TO_READ'
  rating?: number
  finishedDate?: string
  pagesRead: number
  totalPages: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: string
  category: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<ReadingStats | null>(null)
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }

        await loadProfileData()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadProfileData = async () => {
    try {
      const token = localStorage.getItem('readflow_token')
      
      if (!token) {
        router.push('/login')
        return
      }

      // Try to get real profile data from API
      const profileData = await api.getProfile()
      const statsData = await api.getStats()
      
      setUser({
        ...profileData,
        displayName: profileData.displayName || profileData.username,
        bio: profileData.bio || 'Passionate reader exploring new worlds through books.',
        avatar: profileData.avatar || `https://via.placeholder.com/150x150?text=${profileData.username?.charAt(0).toUpperCase() || 'U'}`,
      })
      setStats(statsData)

      // Load recent books and achievements (these would also come from API)
      try {
        const booksData = await api.getBooks()
        const recentBooksData = booksData.slice(0, 3).map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          status: book.status,
          rating: book.rating,
          finishedDate: book.finishedDate,
          pagesRead: book.pagesRead || 0,
          totalPages: book.totalPages
        }))
        setRecentBooks(recentBooksData)
      } catch (error) {
        console.error('Failed to load books:', error)
        // Use mock data as fallback
        const mockRecentBooks: RecentBook[] = [
          {
            id: '1',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            coverUrl: 'https://via.placeholder.com/60x90?text=GG',
            status: 'FINISHED',
            rating: 5,
            finishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            pagesRead: 180,
            totalPages: 180
          },
          {
            id: '2',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            coverUrl: 'https://via.placeholder.com/60x90?text=TKAM',
            status: 'READING',
            pagesRead: 85,
            totalPages: 324
          }
        ]
        setRecentBooks(mockRecentBooks)
      }

      try {
        const achievementsData = await api.getAchievements()
        setAchievements(achievementsData)
      } catch (error) {
        console.error('Failed to load achievements:', error)
        // Use mock data as fallback
        const mockAchievements: Achievement[] = [
          {
            id: '1',
            title: 'First Book',
            description: 'Completed your first book',
            icon: '📚',
            earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: 'Milestone'
          },
          {
            id: '2',
            title: 'Week Warrior',
            description: 'Read for 7 consecutive days',
            icon: '🔥',
            earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: 'Streak'
          }
        ]
        setAchievements(mockAchievements)
      }

    } catch (error) {
      console.error('Failed to load profile data:', error)
      router.push('/login')
    }
  }

  const handleEditProfile = () => {
    if (user) {
      setEditForm({
        displayName: user.displayName,
        bio: user.bio,
        location: user.location,
        website: user.website,
        isPublic: user.isPublic,
        status: user.status || 'ONLINE'
      })
    }
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    try {
      // Update profile via API
      const updatedData = await api.updateProfile(editForm)
      
      if (user) {
        // Update the user state with returned data combining with old user just in case
        setUser({ ...user, ...updatedData })
      }
      
      setIsEditing(false)
      setEditForm({})
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert("Failed to update profile")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINISHED': return 'bg-green-100 text-green-700'
      case 'READING': return 'bg-blue-100 text-blue-700'
      case 'TO_READ': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !stats) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={user.avatar || 'https://via.placeholder.com/150x150?text=U'}
                alt={user.displayName}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.displayName}</h1>
            <p className="text-gray-500">@{user.username}</p>
            <span className={`mt-2 px-3 py-1 text-xs font-medium rounded-full ${user.status === 'OFFLINE' ? 'bg-gray-100 text-gray-600' : user.status === 'DO_NOT_DISTURB' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {user.status === 'OFFLINE' ? 'Offline' : user.status === 'DO_NOT_DISTURB' ? 'Do Not Disturb' : 'Online'}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(user.joinDate)}</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editForm.displayName || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editForm.bio || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editForm.location || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={editForm.website || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editForm.status || 'ONLINE'}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ONLINE">Online</option>
                      <option value="DO_NOT_DISTURB">Do Not Disturb</option>
                      <option value="OFFLINE">Offline</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditForm({})
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <LinkIcon className="w-4 h-4" />
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {user.website}
                        </a>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
          <p className="text-sm text-gray-600">Books Read</p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
          <p className="text-sm text-gray-600">Hours Read</p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
          <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
          <p className="text-sm text-gray-600">Current Streak</p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
          <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
          <p className="text-sm text-gray-600">Avg Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Books */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Books</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBooks.map(book => (
                  <div key={book.id} className="flex items-center gap-4">
                    <img
                      src={book.coverUrl || 'https://via.placeholder.com/60x90?text=No+Cover'}
                      alt={book.title}
                      className="w-12 h-18 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{book.title}</h4>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(book.status || '')}`}>
                          {(book.status || 'PLAN').replace('_', ' ')}
                        </span>
                        {book.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600">{book.rating}</span>
                          </div>
                        )}
                        {book.finishedDate && (
                          <span className="text-xs text-gray-500">
                            Finished {formatDate(book.finishedDate)}
                          </span>
                        )}
                      </div>
                      {book.status === 'READING' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${(book.pagesRead / book.totalPages) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {book.pagesRead} / {book.totalPages} pages
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/books"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Books →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reading Goals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Goals</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">2024 Goal</span>
                </div>
                <span className="text-sm font-medium text-gray-900">47 / 50 books</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-700">Pages Goal</span>
                </div>
                <span className="text-sm font-medium text-gray-900">15,678 / 20,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {achievements.map(achievement => (
                <div key={achievement.id} className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/achievements"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All Achievements →
              </Link>
            </div>
          </div>

          {/* Favorite Genre */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Genre</h3>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.favoriteGenre}</p>
              <p className="text-sm text-gray-500">Most read genre</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
