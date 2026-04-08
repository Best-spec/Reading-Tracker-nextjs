'use client'

import React from 'react'
import { Friend } from '@/types/friend'
import { UserX, MessageCircle, Users } from 'lucide-react'

interface FriendsListProps {
  friends: Friend[]
  onRemove: (id: string) => void
}

export function FriendsList({ friends, onRemove }: FriendsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500'
      case 'READING': return 'bg-blue-500'
      case 'AWAY': return 'bg-yellow-500'
      case 'OFFLINE': default: return 'bg-gray-400'
    }
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">No friends yet</p>
        <p className="text-sm text-gray-400">Search for friends above to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {friends.map(friend => (
        <div key={friend.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={friend.avatar || 'https://via.placeholder.com/40x40?text=U'}
                  alt={friend.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}></div>
              </div>
              <div>
                <p className="font-medium text-gray-900">{friend.username}</p>
                <p className="text-sm text-gray-500">
                  {friend.isOnline ? (friend.status === 'READING' ? 'Reading now' : 'Online') : 'Offline'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to remove this friend?')) onRemove(friend.id)
              }}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <UserX className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Books read</span>
              <span className="font-medium">{friend.booksRead || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hours read</span>
              <span className="font-medium">{friend.readingStreak || 0} hrs</span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
              <MessageCircle className="w-3 h-3" />
              Message
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
