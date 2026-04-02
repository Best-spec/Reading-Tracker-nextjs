import { userApi } from './api/user'
import { settingsApi } from './api/settings'
import { UserProfile, ReadingPreferences, NotificationSettings } from '@/types/settings'

const STORAGE_KEYS = {
  READING_PREFS: 'readflow_reading_prefs',
  NOTIFICATIONS: 'readflow_notification_settings',
  PROFILE: 'readflow_profile'
}

export const settingsService = {
  async getProfile(): Promise<UserProfile | null> {
    const userData = await userApi.getProfile()
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userData))
      window.dispatchEvent(new Event('storage'))
    }
    return userData
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const updated = await userApi.updateProfile(profileData)
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    return updated
  },

  async updatePassword(passwordData: { currentPassword: string; newPassword: string }) {
    // Current backend might not have this, mock if needed, but the api.ts has it.
    return await settingsApi.updatePassword(passwordData)
  },

  getReadingPreferences(): ReadingPreferences {
    const saved = localStorage.getItem(STORAGE_KEYS.READING_PREFS)
    if (saved) return JSON.parse(saved)
    return {
      dailyGoal: 30,
      preferredGenres: [],
      readingSpeed: 'medium',
      reminderTime: '20:00',
      autoTrack: true
    }
  },

  async updateReadingPreferences(prefs: ReadingPreferences): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.READING_PREFS, JSON.stringify(prefs))
    // Simulate API delay as in existing code
    await new Promise(resolve => setTimeout(resolve, 800))
  },

  getNotificationSettings(): NotificationSettings {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
    if (saved) return JSON.parse(saved)
    return {
      emailNotifications: true,
      pushNotifications: true,
      friendActivity: true,
      groupUpdates: true,
      readingReminders: true
    }
  },

  async updateNotificationSettings(settings: NotificationSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings))
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
  }
}
