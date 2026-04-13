'use client'

import React from 'react'
import { FriendRequest } from '@/types/friend'
import { UserMinus } from 'lucide-react'

interface PendingRequestsListProps {
  requests: FriendRequest[]
  onCancel: (id: string) => void
}

export function PendingRequestsList({ requests, onCancel }: PendingRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <UserMinus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No pending friend requests sent</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map(request => (
        <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={request.to?.avatar || 'https://via.placeholder.com/40x40?text=U'}
              alt={request.to?.username || 'User'}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{request.to?.username || 'Unknown User'}</p>
              <p className="text-sm text-gray-500">{request.to?.email || ''}</p>
              <p className="text-xs text-gray-400">Sent {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'recently'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onCancel(request.id)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel Request
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
