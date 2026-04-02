'use client'

import { CheckCircle, AlertCircle } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import { SettingsTabs } from '@/components/settings/SettingsTabs'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { PasswordSettings } from '@/components/settings/PasswordSettings'
import { ReadingSettings } from '@/components/settings/ReadingSettings'
import { NotificationSettings } from '@/components/settings/NotificationSettings'

export default function SettingsPage() {
  const {
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
  } = useSettings()

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

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <ProfileSettings
            user={user}
            profileForm={profileForm}
            onUpdateField={updateProfileField}
            onSave={handleProfileUpdate}
            saving={saving}
          />
        )}

        {activeTab === 'password' && (
          <PasswordSettings
            onSave={handlePasswordUpdate}
            saving={saving}
          />
        )}

        {activeTab === 'reading' && (
          <ReadingSettings
            readingPrefs={readingPrefs}
            onUpdateField={updateReadingField}
            onToggleGenre={toggleGenre}
            onSave={handleReadingPrefsUpdate}
            saving={saving}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettings
            notifications={notifications}
            onToggle={toggleNotification}
            onSave={handleNotificationUpdate}
            saving={saving}
          />
        )}
      </div>
    </div>
  )
}
