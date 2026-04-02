import { User } from './user'

export type UserProfile = User

export interface ReadingPreferences {
  dailyGoal: number
  preferredGenres: string[]
  readingSpeed: 'slow' | 'medium' | 'fast'
  reminderTime: string
  autoTrack: boolean
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  friendActivity: boolean
  groupUpdates: boolean
  readingReminders: boolean
}

export type SettingsTab = 'profile' | 'password' | 'reading' | 'notifications'

export interface PasswordSettingsProps {
  onSave: (e: React.FormEvent) => void
  saving: boolean
}

export interface UpdatePasswordData {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export interface SettingsMessage {
  type: 'success' | 'error'
  text: string
}

export interface ProfileSettingsProps {
  user: UserProfile | null
  profileForm: Partial<UserProfile>
  onUpdateField: (field: keyof UserProfile, value: any) => void
  onSave: (e?: any) => void
  saving: boolean
}

export interface ReadingSettingsProps {
  readingPrefs: ReadingPreferences
  onUpdateField: (field: keyof ReadingPreferences, value: any) => void
  onToggleGenre: (genre: string) => void
  onSave: () => void
  saving: boolean
}

export interface NotificationSettingsProps {
  notifications: NotificationSettings
  onToggle: (id: keyof NotificationSettings) => void
  onSave: () => void
  saving: boolean
}
