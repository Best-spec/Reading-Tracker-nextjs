'use client'

import React from 'react'
import { X, Check } from 'lucide-react'
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
    loadMoreFriends,
    hasMoreFriends,
    addFriend,
    acceptRequest,
    declineRequest,
    removeFriend,
    cancelRequest,
    message,
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

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

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
          <div className="space-y-6">
            <FriendsList friends={friends} onRemove={removeFriend} />
            {hasMoreFriends && friends.length > 0 && (
              <div className="flex justify-center pt-4 border-t border-gray-100">
                <button 
                  onClick={loadMoreFriends}
                  className="px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200"
                >
                  Load More Friends
                </button>
              </div>
            )}
          </div>
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
