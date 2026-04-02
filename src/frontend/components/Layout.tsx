'use client'

import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Library, 
  Clock, 
  BarChart2, 
  Calendar, 
  Users, 
  UsersRound, 
  User, 
  Settings,
  Menu,
  X,
  LogOut,
  Search,
  Bell,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { api } from '@/service/api'

interface MenuItem {
  icon: any
  label: string
  href: string
  id: string
}

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState(3)
  const pathname = usePathname()
  const router = useRouter()

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/home', id: 'dashboard' },
    { icon: Library, label: 'My Books', href: '/books', id: 'books' },
    { icon: Clock, label: 'Reading Timer', href: '/timer', id: 'timer' },
    { icon: BarChart2, label: 'Statistics', href: '/stats', id: 'stats' },
    { icon: Calendar, label: 'Calendar', href: '/calendar', id: 'calendar' },
    { icon: Users, label: 'Friends', href: '/friends', id: 'friends' },
    { icon: UsersRound, label: 'Groups', href: '/groups', id: 'groups' },
    { icon: User, label: 'Profile', href: '/profile', id: 'profile' },
    { icon: Settings, label: 'Settings', href: '/settings', id: 'settings' }
  ]

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (token) {
          const profileData = await api.getProfile()
          setUser(profileData)
        }
      } catch (error) {
        console.error('Failed to load user profile in sidebar', error)
      }
    }
    fetchUser()
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('readflow_token')
    localStorage.removeItem('readflow_profile')
    router.push('/login')
  }

  // Don't show layout on auth pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'}
        bg-white border-r border-gray-200 flex flex-col fixed h-screen z-40 transition-all duration-300
      `}>
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">ReadFlow</h1>
                <p className="text-xs text-gray-500">Social Reading Tracker</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${!sidebarOpen ? 'justify-center' : ''}
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Section */}
        {sidebarOpen && user && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user.displayName || user.username || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user.email || 'user@example.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books, friends..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* User Menu (Desktop) */}
              <div className="hidden md:flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">{user?.displayName || user?.username || 'User'}</p>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${user?.status === 'OFFLINE' ? 'bg-gray-400' : user?.status === 'DO_NOT_DISTURB' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <p className="text-xs text-gray-500">{user?.status === 'OFFLINE' ? 'Offline' : user?.status === 'DO_NOT_DISTURB' ? 'Do Not Disturb' : 'Online'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
