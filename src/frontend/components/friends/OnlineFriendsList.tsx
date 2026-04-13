'use client'

import React from 'react'
import { Friend } from '@/types/friend'
import { Circle, MessageCircle } from 'lucide-react'

interface OnlineFriendsListProps {
  onlineFriends: Friend[]
}

export function OnlineFriendsList({ onlineFriends }: OnlineFriendsListProps) {
  if (onlineFriends.length === 0) {
    return (
      <div className="text-center py-12">
        <Circle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No friends online</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {onlineFriends.map(friend => (
        <div key={friend.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img
                src={friend.avatar || 'https://via.placeholder.com/40x40?text=U'}
                alt={friend.username}
                className="w-12 h-12 rounded-full"
              />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                friend.status === 'READING' ? 'bg-blue-500' : 
                friend.status === 'DO_NOT_DISTURB' ? 'bg-red-500' : 'bg-green-500'
              }`}></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">{friend.username}</p>
              <p className={`text-sm flex items-center gap-1 ${
                friend.status === 'READING' ? 'text-blue-600' : 
                friend.status === 'DO_NOT_DISTURB' ? 'text-red-600' : 'text-green-600'
              }`}>
                <Circle className="w-2 h-2 fill-current" />
                {friend.status === 'READING' ? 'Reading now' : 
                 friend.status === 'DO_NOT_DISTURB' ? 'Do Not Disturb' : 'Online now'}
              </p>
            </div>
          </div>
          
          <div className="space-y-1 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Reading Streak</span>
              <span className="font-medium">{0} days</span>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
            <MessageCircle className="w-3 h-3" />
            Start Chat
          </button>
        </div>
      ))}
    </div>
  )
}
