export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED'
  participants: number
  goal: {
    type: 'PAGES' | 'BOOKS' | 'MINUTES'
    target: number
    current: number
  }
}
