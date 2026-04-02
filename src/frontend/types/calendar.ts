export interface CalendarEntry {
  date: string
  booksRead: string[]
  minutesRead: number
  pagesRead: number
  notes?: string
}

export interface CalendarMonthData {
  year: number
  month: number
  entries: CalendarEntry[]
}

export interface UpdateCalendarEntryData {
  minutesRead?: number
  pagesRead?: number
  notes?: string
}
