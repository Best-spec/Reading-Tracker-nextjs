import { Bell, Save } from 'lucide-react'
import { NotificationSettings as NotificationSettingsType, NotificationSettingsProps } from '@/types/settings'

export const NotificationSettings = ({
  notifications,
  onToggle,
  onSave,
  saving
}: NotificationSettingsProps) => {
  const settings = [
    { id: 'emailNotifications' as const, label: 'Email Notifications' },
    { id: 'pushNotifications' as const, label: 'Push Notifications' },
    { id: 'readingReminders' as const, label: 'Daily Reading Reminders' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notification Settings
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {settings.map((n) => (
          <div key={n.id} className="flex items-center justify-between py-2">
            <span className="text-gray-700 font-medium">{n.label}</span>
            <button
              onClick={() => onToggle(n.id)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications[n.id] ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications[n.id] ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        ))}
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mt-4"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Notifications
        </button>
      </div>
    </div>
  )
}
