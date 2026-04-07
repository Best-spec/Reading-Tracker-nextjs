'use client'

import React from 'react'
import { FriendRequest } from '@/types/friend'
import { UserPlus } from 'lucide-react'

interface FriendRequestsListProps {
  requests: FriendRequest[]
  onAccept: (id: string) => void
  onDecline: (id: string) => void
}

export function FriendRequestsList({ requests, onAccept, onDecline }: FriendRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No friend requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map(request => (
        <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={request.from?.avatar || 'https://via.placeholder.com/40x40?text=U'}
              alt={request.from?.username || 'User'}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{request.from?.username || 'Unknown User'}</p>
              <p className="text-sm text-gray-500">{request.from?.email || ''}</p>
              <p className="text-xs text-gray-400">Requested {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'recently'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(request.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => onDecline(request.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
