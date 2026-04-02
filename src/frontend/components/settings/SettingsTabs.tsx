import { SettingsTab } from '@/types/settings'

interface SettingsTabsProps {
  activeTab: SettingsTab
  setActiveTab: (tab: SettingsTab) => void
}

export const SettingsTabs = ({ activeTab, setActiveTab }: SettingsTabsProps) => {
  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'password', label: 'Password' },
    { id: 'reading', label: 'Reading' },
    { id: 'notifications', label: 'Notifications' },
  ]

  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === tab.id
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
