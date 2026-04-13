import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { profileService } from '@/service/profileService';
import { UserProfile, ReadingStats, RecentBook, Achievement, ProfileHook } from '@/types/profile';

export function useProfile(): ProfileHook {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token');
        if (!token) {
          router.push('/login');
          return;
        }

        await loadProfileData();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadProfileData = async () => {
    try {
      const token = localStorage.getItem('readflow_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const profileData = await profileService.fetchProfile();
      setUser(profileData);

      const statsData = await profileService.fetchStats();
      setStats(statsData);

      const booksData = await profileService.fetchRecentBooks();
      setRecentBooks(booksData);

      const achievementsData = await profileService.fetchAchievements();
      setAchievements(achievementsData);

    } catch (error) {
      console.error('Failed to load profile data:', error);
      router.push('/login');
    }
  };

  const handleEditProfile = () => {
    if (user) {
      setEditForm({
        displayName: user.displayName,
        bio: user.bio,
        location: user.location,
        website: user.website,
        isPublic: user.isPublic,
        status: user.status || 'ONLINE'
      });
    }
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedData = await profileService.updateProfile(editForm);
      if (user) {
        const newUserState = { ...user, ...updatedData };
        setUser(newUserState);
        // Dispatch event to inform other parts of the app (like Layout) that the profile has updated
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: newUserState }));
      }
      setIsEditing(false);
      setEditForm({});
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert("Failed to update profile");
    }
  };

  return {
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
  };
}
