export interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  status: 'READING' | 'FINISHED' | 'PLAN'
  currentPage?: number
  totalPages?: number
  startDate?: string
  finishDate?: string
  rating?: number
  genre?: string
}

export type BookStatus = Book['status']
export type BookFilter = 'all' | 'reading' | 'finished' | 'plan'

export interface BookFormData {
  title: string
  author: string
  totalPages: number
  currentPage?: number
  status: Book['status']
}
