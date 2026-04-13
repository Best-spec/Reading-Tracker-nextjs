'use client'

import React from 'react'
import { useFriends } from '@/hooks/friends/useFriends'
import { FriendsSearch } from '@/components/friends/FriendsSearch'
import { FriendTabs } from '@/components/friends/FriendTabs'
import { FriendsList } from '@/components/friends/FriendsList'
import { FriendRequestsList } from '@/components/friends/FriendRequestsList'
import { PendingRequestsList } from '@/components/friends/PendingRequestsList'
import { OnlineFriendsList } from '@/components/friends/OnlineFriendsList'

export default function FriendsPage() {
  const {
    friends,
    friendRequests,
    pendingRequests,
    searchResults,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    loading,
    handleSearch,
    addFriend,
    acceptRequest,
    declineRequest,
    removeFriend,
    cancelRequest,
    onlineFriends
  } = useFriends()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading friends...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Friends</h2>

      <FriendsSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        searchResults={searchResults}
        addFriend={addFriend}
      />

      <FriendTabs
        activeTab={activeTab as any}
        setActiveTab={setActiveTab as any}
        requestCount={friendRequests.length}
        pendingCount={pendingRequests.length}
        onlineCount={onlineFriends.length}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'friends' && (
          <FriendsList friends={friends} onRemove={removeFriend} />
        )}

        {activeTab === 'requests' && (
          <FriendRequestsList
            requests={friendRequests}
            onAccept={acceptRequest}
            onDecline={declineRequest}
          />
        )}

        {activeTab === 'pending' && (
          <PendingRequestsList
            requests={pendingRequests}
            onCancel={cancelRequest}
          />
        )}

        {activeTab === 'online' && (
          <OnlineFriendsList onlineFriends={onlineFriends} />
        )}
      </div>
    </div>
  )
}
