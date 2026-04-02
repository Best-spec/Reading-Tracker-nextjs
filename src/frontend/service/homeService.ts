import { api } from './api'
import { HomeData } from '@/types/home'

export const homeService = {
  async getHomeData(): Promise<HomeData> {
    try {
      // Parallel requests for better performance
      const [stats, books, activity, profile] = await Promise.allSettled([
        api.getStats(),
        api.getBooks(),
        api.getFriendActivity(), // Handle fallback in getActivity directly
        api.getProfile().catch(() => null)
      ])

      return {
        stats: stats.status === 'fulfilled' ? stats.value : {
          totalBooks: 0,
          totalHours: 0,
          totalPages: 0,
          currentStreak: 0,
          booksChange: '+0 this week'
        },
        books: books.status === 'fulfilled' ? books.value : [],
        friendActivity: activity.status === 'fulfilled' ? activity.value : this.getMockActivity(),
        profile: profile.status === 'fulfilled' ? profile.value : null
      }
    } catch (error) {
      console.error('HomeService error:', error)
      throw error
    }
  },

  getMockActivity(): any[] {
    return [
      {
        id: '1',
        userId: '2',
        username: 'Sarah',
        type: 'BOOK_FINISHED',
        description: 'finished reading "1984"',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        userId: '3',
        username: 'Mike',
        type: 'READING_SESSION',
        description: 'started reading "Dune"',
        timestamp: '5 hours ago'
      }
    ]
  }
}
