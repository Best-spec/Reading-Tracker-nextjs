'use client'

import React from 'react'

interface FriendTabsProps {
  activeTab: 'friends' | 'requests' | 'online' | 'pending'
  setActiveTab: (tab: 'friends' | 'requests' | 'online' | 'pending') => void
  requestCount: number
  onlineCount: number
  pendingCount?: number
}

export function FriendTabs({ activeTab, setActiveTab, requestCount, onlineCount, pendingCount = 0 }: FriendTabsProps) {
  const tabs: Array<{ id: 'friends' | 'requests' | 'online' | 'pending'; label: string; count?: number; color?: string }> = [
    { id: 'friends', label: 'Friends' },
    { id: 'requests', label: 'Requests', count: requestCount, color: 'bg-red-500' },
    { id: 'pending', label: 'Pending', count: pendingCount, color: 'bg-yellow-500' },
    { id: 'online', label: 'Online', count: onlineCount, color: 'bg-green-500' },
  ]

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-2 rounded-xl font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span className={`ml-1 ${tab.color} text-white text-xs px-2 py-0.5 rounded-full`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
