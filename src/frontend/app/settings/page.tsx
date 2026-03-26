'use client'

import { useState, useEffect } from 'react'
import { User, Lock, BookOpen, Bell, Globe, Moon, Sun, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  username: string
  email: string
  bio: string
  displayName: string
  avatar?: string
}

interface ReadingPreferences {
  dailyGoal: number
  preferredGenres: string[]
  readingSpeed: 'slow' | 'medium' | 'fast'
  reminderTime: string
  autoTrack: boolean
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  friendActivity: boolean
  groupUpdates: boolean
  readingReminders: boolean
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile>({
    username: '',
    email: '',
    bio: '',
    displayName: ''
  })
  const [readingPrefs, setReadingPrefs] = useState<ReadingPreferences>({
    dailyGoal: 30,
    preferredGenres: [],
    readingSpeed: 'medium',
    reminderTime: '20:00',
    autoTrack: true
  })
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    friendActivity: true,
    groupUpdates: true,
    readingReminders: true
  })
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'reading' | 'notifications'>('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }

        // Load user data
        const userData = localStorage.getItem('readflow_profile')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser({
            username: parsedUser.username || '',
            email: parsedUser.email || '',
            bio: parsedUser.bio || '',
            displayName: parsedUser.displayName || parsedUser.username || ''
          })
        }

        // Load preferences (mock for now)
        setReadingPrefs({
          dailyGoal: 30,
          preferredGenres: ['Fantasy', 'Sci-Fi', 'Mystery'],
          readingSpeed: 'medium',
          reminderTime: '20:00',
          autoTrack: true
        })

        // Load notification settings (mock for now)
        setNotifications({
          emailNotifications: true,
          pushNotifications: true,
          friendActivity: true,
          groupUpdates: false,
          readingReminders: true
        })

        // Load theme preference
        const savedTheme = localStorage.getItem('theme')
        setDarkMode(savedTheme === 'dark')
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update localStorage
      const updatedUser = { ...user }
      localStorage.setItem('readflow_profile', JSON.stringify(updatedUser))
      
      showMessage('success', 'Profile updated successfully!')
    } catch (error) {
      showMessage('error', 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      showMessage('error', 'New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters')
      return
    }

    setSaving(true)

    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showMessage('success', 'Password updated successfully!')
      // Clear form
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      showMessage('error', 'Failed to update password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleReadingPrefsUpdate = async () => {
    setSaving(true)

    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showMessage('success', 'Reading preferences updated!')
    } catch (error) {
      showMessage('error', 'Failed to update preferences. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setSaving(true)

    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showMessage('success', 'Notification settings updated!')
    } catch (error) {
      showMessage('error', 'Failed to update settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const toggleTheme = () => {
    const newTheme = !darkMode
    setDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    // In a real app, you would apply the theme to the document
  }

  const genres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Thriller', 'Non-Fiction', 'Biography', 'History', 'Self-Help', 'Young Adult']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['profile', 'password', 'reading', 'notifications'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </h3>
          </div>
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                value={user.displayName}
                onChange={(e) => setUser(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={user.bio}
                onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Profile
            </button>
          </form>
        </div>
      )}

      {/* Password Settings */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Password Settings
            </h3>
          </div>
          <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* Reading Preferences */}
      {activeTab === 'reading' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Reading Preferences
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Reading Goal (minutes)</label>
                <input
                  type="number"
                  value={readingPrefs.dailyGoal}
                  onChange={(e) => setReadingPrefs(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) || 0 }))}
                  min="5"
                  max="480"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reading Speed</label>
                <select
                  value={readingPrefs.readingSpeed}
                  onChange={(e) => setReadingPrefs(prev => ({ ...prev, readingSpeed: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="slow">Slow</option>
                  <option value="medium">Medium</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Genres</label>
                <div className="grid grid-cols-2 gap-2">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={readingPrefs.preferredGenres.includes(genre)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReadingPrefs(prev => ({ ...prev, preferredGenres: [...prev.preferredGenres, genre] }))
                          } else {
                            setReadingPrefs(prev => ({ ...prev, preferredGenres: prev.preferredGenres.filter(g => g !== genre) }))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Reminder Time</label>
                <input
                  type="time"
                  value={readingPrefs.reminderTime}
                  onChange={(e) => setReadingPrefs(prev => ({ ...prev, reminderTime: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoTrack"
                  checked={readingPrefs.autoTrack}
                  onChange={(e) => setReadingPrefs(prev => ({ ...prev, autoTrack: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="autoTrack" className="text-sm text-gray-700">
                  Automatically track reading time
                </label>
              </div>
              <button
                onClick={handleReadingPrefsUpdate}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Preferences
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Appearance
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-500">Use dark theme across the application</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Browser push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.pushNotifications}
                onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Friend Activity</p>
                <p className="text-sm text-gray-500">When friends finish books</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.friendActivity}
                onChange={(e) => setNotifications(prev => ({ ...prev, friendActivity: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Group Updates</p>
                <p className="text-sm text-gray-500">Group discussions and meetings</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.groupUpdates}
                onChange={(e) => setNotifications(prev => ({ ...prev, groupUpdates: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Reading Reminders</p>
                <p className="text-sm text-gray-500">Daily reading reminders</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.readingReminders}
                onChange={(e) => setNotifications(prev => ({ ...prev, readingReminders: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>
            <button
              onClick={handleNotificationUpdate}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
