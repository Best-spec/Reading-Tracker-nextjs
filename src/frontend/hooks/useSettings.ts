import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { settingsService } from '@/service/settingsService'
import { UserProfile, ReadingPreferences, NotificationSettings, SettingsTab } from '@/types/settings'

export function useSettings() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({})
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

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const router = useRouter()

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }

        const userData = await settingsService.getProfile()
        if (userData) {
          setUser(userData)
          setProfileForm({
            displayName: userData.displayName || '',
            email: userData.email || '',
            bio: userData.bio || '',
            status: userData.status || 'ONLINE'
          })
        }

        setReadingPrefs(settingsService.getReadingPreferences())
        setNotifications(settingsService.getNotificationSettings())

      } catch (error) {
        console.error('Failed to load settings:', error)
        if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  const handleProfileUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSaving(true)
    try {
      const updated = await settingsService.updateProfile(profileForm)
      setUser(updated)
      showMessage('success', 'Profile updated successfully!')
    } catch (error) {
      showMessage('error', 'Failed to update profile.')
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
      showMessage('error', 'Passwords do not match')
      return
    }

    setSaving(true)
    try {
      await settingsService.updatePassword({ currentPassword, newPassword })
      showMessage('success', 'Password updated successfully!')
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      showMessage('error', 'Failed to update password.')
    } finally {
      setSaving(false)
    }
  }

  const handleReadingPrefsUpdate = async () => {
    setSaving(true)
    try {
      await settingsService.updateReadingPreferences(readingPrefs)
      showMessage('success', 'Reading preferences saved!')
    } catch (error) {
      showMessage('error', 'Failed to save preferences.')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setSaving(true)
    try {
      await settingsService.updateNotificationSettings(notifications)
      showMessage('success', 'Notification settings saved!')
    } catch (error) {
      showMessage('error', 'Failed to update settings.')
    } finally {
      setSaving(false)
    }
  }

  const toggleGenre = (genre: string) => {
    setReadingPrefs(prev => ({
      ...prev,
      preferredGenres: prev.preferredGenres.includes(genre)
        ? prev.preferredGenres.filter(g => g !== genre)
        : [...prev.preferredGenres, genre]
    }))
  }

  const toggleNotification = (id: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  const updateReadingField = (field: keyof ReadingPreferences, value: any) => {
    setReadingPrefs(prev => ({ ...prev, [field]: value }))
  }

  return {
    user,
    profileForm,
    readingPrefs,
    notifications,
    activeTab,
    setActiveTab,
    loading,
    saving,
    message,
    handleProfileUpdate,
    handlePasswordUpdate,
    handleReadingPrefsUpdate,
    handleNotificationUpdate,
    toggleGenre,
    toggleNotification,
    updateProfileField,
    updateReadingField
  }
}
