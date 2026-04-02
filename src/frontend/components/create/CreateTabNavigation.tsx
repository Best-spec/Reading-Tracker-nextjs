'use client'

import React from 'react'
import { BookOpen, Target, Users } from 'lucide-react'

type TabType = 'book' | 'challenge' | 'group'

interface CreateTabNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export const CreateTabNavigation: React.FC<CreateTabNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="flex gap-2 mb-8 border-b border-gray-200">
      {(['book', 'challenge', 'group'] as const).map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === tab
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          {tab === 'book' && <BookOpen className="w-4 h-4" />}
          {tab === 'challenge' && <Target className="w-4 h-4" />}
          {tab === 'group' && <Users className="w-4 h-4" />}
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
}
