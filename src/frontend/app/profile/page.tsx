'use client'

import { User } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { RecentBooks } from '@/components/profile/RecentBooks'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar'

export default function ProfilePage() {
  const {
    user,
    stats,
    recentBooks,
    achievements,
    loading,
    isEditing,
    editForm,
    setIsEditing,
    setEditForm,
    handleEditProfile,
    handleSaveProfile
  } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !stats) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ProfileHeader
        user={user}
        isEditing={isEditing}
        editForm={editForm}
        setIsEditing={setIsEditing}
        setEditForm={setEditForm}
        handleEditProfile={handleEditProfile}
        handleSaveProfile={handleSaveProfile}
      />

      <ProfileStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentBooks books={recentBooks} />
        <ProfileSidebar achievements={achievements} stats={stats} />
      </div>
    </div>
  )
}
