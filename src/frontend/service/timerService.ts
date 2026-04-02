import { Book, TimerSession } from '@/types/timer'

export const timerService = {
  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  },

  calculateTodayStats(sessions: TimerSession[], isRunning: boolean, startTime: Date | null, elapsedTime: number) {
    const today = new Date().toDateString()
    const todaySessions = sessions.filter(s => new Date(s.startTime).toDateString() === today)
    
    // Total time in milliseconds
    const todayMillis = todaySessions.reduce((acc, s) => acc + s.duration, 0)
    const activeMillis = (isRunning && startTime && new Date(startTime).toDateString() === today) 
      ? elapsedTime 
      : 0
    
    // Total pages
    const todayPages = todaySessions.reduce((acc, s) => acc + s.pagesRead, 0)
    
    return {
      totalTimeFormatted: this.formatTime(todayMillis + activeMillis),
      totalPages: todayPages
    }
  },

  calculateProgress(book: Book | undefined): number {
    if (!book || !book.totalPages) return 0
    return Math.min(100, ((book.currentPage || 0) / book.totalPages) * 100)
  },

  formatSessions(sessionsData: any[]): TimerSession[] {
    return (sessionsData || []).map((s: any) => {
      const ds = s.durationSeconds ?? s.duration_seconds
      const mr = s.minutesRead ?? s.minutes_read
      const start = new Date(s.startTime || s.createdAt || Date.now())
      const end = s.endTime ? new Date(s.endTime) : null
      
      let finalDuration = 0
      if (ds !== undefined && ds !== null) {
        finalDuration = ds * 1000
      } else if (end && start) {
        finalDuration = end.getTime() - start.getTime()
      } else if (mr !== undefined && mr !== null) {
        finalDuration = mr * 60 * 1000
      }

      return {
        id: s.id,
        bookId: s.bookId || s.book_id || s.readingLog?.bookId,
        startTime: start,
        endTime: end || undefined,
        duration: Math.max(0, finalDuration),
        pagesRead: s.pagesRead || s.pages_read || 0,
        section: s.section
      }
    })
  }
}
