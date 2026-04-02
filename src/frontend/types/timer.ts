export { type Book } from './book'

export interface TimerSession {
  id: string
  bookId: string
  startTime: Date
  endTime?: Date
  duration: number
  pagesRead: number
  section?: string
}

export interface StartSessionParams {
  bookId: string
  section?: string
}

export interface StopSessionParams {
  sessionId: string
  pagesRead: number
}

export interface TodayStats {
  sessions: number
  totalTime: number
  totalPages: number
}
