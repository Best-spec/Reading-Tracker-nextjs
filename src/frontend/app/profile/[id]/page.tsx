'use client'

import { useParams, useRouter } from 'next/navigation'
import { User, ArrowLeft } from 'lucide-react'
import { useFriendProfile } from '@/hooks/useFriendProfile'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { RecentBooks } from '@/components/profile/RecentBooks'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar'

export default function FriendProfilePage() {
  const params = useParams()
  const router = useRouter()
  const friendId = params.id as string
  
  const {
    user,
    stats,
    recentBooks,
    achievements,
    loading
  } = useFriendProfile(friendId)

  // Empty dummy functions because we don't allow editing someone else's profile
  const setDummy = () => {}
  const handleDummy = () => {}

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Profile not found</p>
          <button 
            onClick={() => router.push('/friends')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Friends
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <ProfileHeader
          user={user}
          isEditing={false}
          editForm={{}}
          setIsEditing={setDummy}
          setEditForm={setDummy}
          handleEditProfile={handleDummy}
          handleSaveProfile={handleDummy}
          isOwnProfile={false}
        />

        <ProfileStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <RecentBooks books={recentBooks} />
          <ProfileSidebar achievements={achievements} stats={stats} />
        </div>
      </div>
    </div>
  )
}
