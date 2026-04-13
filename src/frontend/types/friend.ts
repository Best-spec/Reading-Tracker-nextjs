import { User } from './user'

export interface Friend extends User {
  status: 'ONLINE' | 'OFFLINE' | 'READING' | 'DO_NOT_DISTURB' | 'AWAY'
  currentlyReading?: string
  isOnline: boolean
  booksRead?: number
  readingStreak?: number
}

export interface FriendRequest {
  id: string
  from: User
  to: User
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
}

export interface FriendActivity {
  id: string
  userId: string
  username: string
  avatar?: string
  type: 'READING_SESSION' | 'BOOK_FINISHED' | 'ACHIEVEMENT'
  description: string
  timestamp: string
  data?: any
}
