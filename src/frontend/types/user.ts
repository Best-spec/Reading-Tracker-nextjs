export interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatar?: string
  bio?: string
  status?: string
}

export interface UserProfile extends User {
  joinedAt?: string
  location?: string
  website?: string
  stats?: {
    booksRead: number
    readingStreak: number
    totalPages: number
  }
}
