import { Book } from './book'
import { FriendActivity } from './friend'
import { UserProfile } from './user'

export interface HomeStats {
  totalBooks: number
  totalHours: number
  totalPages: number
  currentStreak: number
  booksChange?: string
}

export interface HomeData {
  stats: HomeStats
  books: Book[]
  friendActivity: FriendActivity[]
  profile: UserProfile | null
}
