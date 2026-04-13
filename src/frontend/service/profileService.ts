import { api } from '@/service/api';
import { UserProfile, ReadingStats, RecentBook, Achievement } from '@/types/profile';

export const profileService = {
  fetchProfile: async (): Promise<UserProfile> => {
    const profileData = await api.getProfile();
    return {
      ...profileData,
      displayName: profileData.displayName || profileData.username,
      bio: profileData.bio || 'Passionate reader exploring new worlds through books.',
      avatar: profileData.avatar || `https://via.placeholder.com/150x150?text=${profileData.username?.charAt(0).toUpperCase() || 'U'}`,
    };
  },

  fetchStats: async (): Promise<ReadingStats> => {
    const statsData = await api.getStats();
    return statsData as any as ReadingStats;
  },

  fetchRecentBooks: async (): Promise<RecentBook[]> => {
    try {
      const booksData = await api.getBooks();
      return booksData.slice(0, 3).map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        status: book.status,
        rating: book.rating,
        finishedDate: book.finishedDate,
        pagesRead: book.pagesRead || 0,
        totalPages: book.totalPages
      }));
    } catch (error) {
      console.error('Failed to load books in service:', error);
      return [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          coverUrl: 'https://via.placeholder.com/60x90?text=GG',
          status: 'FINISHED',
          rating: 5,
          finishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          pagesRead: 180,
          totalPages: 180
        },
        {
          id: '2',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          coverUrl: 'https://via.placeholder.com/60x90?text=TKAM',
          status: 'READING',
          pagesRead: 85,
          totalPages: 324
        }
      ];
    }
  },

  fetchAchievements: async (): Promise<Achievement[]> => {
    try {
      return await api.getAchievements();
    } catch (error) {
      console.error('Failed to load achievements in service:', error);
      return [
        {
          id: '1',
          title: 'First Book',
          description: 'Completed your first book',
          icon: '📚',
          earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: 'Milestone'
        },
        {
          id: '2',
          title: 'Week Warrior',
          description: 'Read for 7 consecutive days',
          icon: '🔥',
          earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: 'Streak'
        }
      ];
    }
  },

  updateProfile: async (editForm: Partial<UserProfile>): Promise<any> => {
    return await api.updateProfile(editForm);
  }
};
