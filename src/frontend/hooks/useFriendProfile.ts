import { useState, useEffect, useCallback } from 'react';
import { UserProfile, ReadingStats, Achievement } from '@/types/profile';
import { request } from '@/service/api/base';

// Mocks for achievements until we have backend for it, mirroring user's own profile hook
// const MOCK_ACHIEVEMENTS: Achievement[] = [
//   { id: '1', name: 'Bookworm', description: 'Read 10 books', icon: '📚', unlockedAt: '2024-03-01' },
//   { id: '2', name: 'Fast Reader', description: 'Read 100 pages in one session', icon: '⚡', unlockedAt: '2024-03-15' },
// ];

export function useFriendProfile(friendId: string) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendProfile = useCallback(async () => {
    if (!friendId) return;

    try {
      setLoading(true);
      const res = await request(`/api/friends/${friendId}/profile`);

      if (res && res.data) {
        setUser({
          ...res.data,
          joinDate: res.data.createdAt || new Date().toISOString()
        });
        setStats({
          totalBooks: res.data.stats?.totalBooks || 0,
          totalPages: res.data.stats?.totalPagesRead || 0,
          totalHours: res.data.stats?.totalHours || 0,
          currentStreak: 0,
          longestStreak: 0,
          favoriteGenre: 'Fiction', // Mock/Placeholder
          averageRating: 0 // Mock/Placeholder
        });
        setRecentBooks(res.data.stats?.recentBooks || []);
        // Set mock achievements for friend
        // setAchievements(MOCK_ACHIEVEMENTS);
      }
    } catch (error) {
      console.error('Failed to fetch friend profile:', error);
    } finally {
      setLoading(false);
    }
  }, [friendId]);

  useEffect(() => {
    fetchFriendProfile();
  }, [fetchFriendProfile]);

  return {
    user,
    stats,
    recentBooks,
    achievements,
    loading
  };
}
