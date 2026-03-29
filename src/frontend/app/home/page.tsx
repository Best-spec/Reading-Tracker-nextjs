'use client'

import { useState, useEffect } from 'react'
import { Library, Clock, BookOpen, Flame, TrendingUp, BookX, PlayCircle, PlusCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/service/api'

interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  status: string
  currentPage?: number
  totalPages?: number
}

interface Stats {
  totalBooks: number
  totalHours: number
  totalPages: number
  currentStreak: number
  booksChange?: string
}

interface FriendActivity {
  id: string
  username: string
  action: string
  bookTitle?: string
  timestamp: string
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalHours: 0,
    totalPages: 0,
    currentStreak: 0
  })
  const [books, setBooks] = useState<Book[]>([])
  const [friendActivity, setFriendActivity] = useState<FriendActivity[]>([])
  const [user, setUser] = useState<any>(null)
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

        // Verify token with API
        await api.checkAuth()
        
        // Token is valid, get user data
        const userData = localStorage.getItem('readflow_profile')
        if (userData) {
          setUser(JSON.parse(userData))
        }

        // Load dashboard data
        await loadDashboardData()
      } catch (error) {
        console.error('Auth check failed:', error)
        // Check if it's a 404 or connection error (development mode)
        if (error instanceof Error && (error.message.includes('Cannot connect to backend server') || error.message.includes('HTTP 404'))) {
          // In development mode, allow access if we have user data
          const userData = localStorage.getItem('readflow_profile')
          if (userData) {
            setUser(JSON.parse(userData))
            await loadDashboardData()
            setLoading(false)
            return
          }
        }
        
        // Invalid token or other error, clear it and redirect to login
        localStorage.removeItem('readflow_token')
        localStorage.removeItem('readflow_profile')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadDashboardData = async () => {
    try {
      // Load stats (mock for now)
      const mockStats: Stats = {
        totalBooks: 12,
        totalHours: 24.5,
        totalPages: 3456,
        currentStreak: 7,
        booksChange: '+2 this week'
      }
      setStats(mockStats)

      // Load books (mock for now)
      const mockBooks: Book[] = [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          coverUrl: 'https://via.placeholder.com/60x90?text=GG',
          status: 'READING',
          currentPage: 120,
          totalPages: 180
        },
        {
          id: '2',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          coverUrl: 'https://via.placeholder.com/60x90?text=TKAM',
          status: 'READING',
          currentPage: 85,
          totalPages: 324
        }
      ]
      setBooks(mockBooks)

      // Load friend activity (mock for now)
      const mockActivity: FriendActivity[] = [
        {
          id: '1',
          username: 'Sarah',
          action: 'finished reading',
          bookTitle: '1984',
          timestamp: '2 hours ago'
        },
        {
          id: '2',
          username: 'Mike',
          action: 'started reading',
          bookTitle: 'Dune',
          timestamp: '5 hours ago'
        }
      ]
      setFriendActivity(mockActivity)

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const readingBooks = books.filter(book => book.status === 'READING').slice(0, 3)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.username || 'Reader'}!
        </h2>
        <p className="text-gray-600 mt-1">Here's your reading progress today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Books */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Books</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Library className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{stats.booksChange}</span>
          </p>
        </div>

        {/* Reading Hours */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Reading Hours</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalHours}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This week</p>
        </div>

        {/* Pages Read */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pages Read</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPages}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total pages</p>
        </div>

        {/* Current Streak */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-gray-900">{stats.currentStreak}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2 font-medium">Keep it up!</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Reading */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Continue Reading</h3>
            </div>
            <div className="p-6">
              {readingBooks.length === 0 ? (
                <div className="empty-state py-8 text-center">
                  <BookX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No books in progress</p>
                  <Link href="/books" className="inline-block mt-3 text-blue-600 hover:underline">
                    Add your first book
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {readingBooks.map(book => (
                    <div key={book.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <img 
                        src={book.coverUrl || 'https://via.placeholder.com/60x90?text=No+Cover'} 
                        alt={book.title} 
                        className="w-14 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{book.title}</h4>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{book.currentPage || 0} / {book.totalPages} pages</span>
                            <span>{Math.round(((book.currentPage || 0) / (book.totalPages || 1)) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.round(((book.currentPage || 0) / (book.totalPages || 1)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weekly Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Reading Activity</h3>
            </div>
            <div className="p-6">
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chart will be implemented here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/timer" 
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <PlayCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Start Reading Timer</span>
              </Link>
              <Link 
                href="/books" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PlusCircle className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Add New Book</span>
              </Link>
              <Link 
                href="/friends" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Find Friends</span>
              </Link>
            </div>
          </div>

          {/* Recent Friends Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Friends Activity</h3>
            <div className="space-y-4">
              {friendActivity.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity</p>
              ) : (
                friendActivity.map(activity => (
                  <div key={activity.id} className="text-sm">
                    <p className="text-gray-900">
                      <span className="font-medium">{activity.username}</span>{' '}
                      {activity.action}{' '}
                      {activity.bookTitle && (
                        <span className="font-medium">"{activity.bookTitle}"</span>
                      )}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-500 text-sm">No achievements yet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
