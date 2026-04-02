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

export interface BookHook {
  books: Book[]
  filteredBooks: Book[]
  loading: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeFilter: BookFilter
  setActiveFilter: (filter: BookFilter) => void
  addBook: (formData: BookFormData) => Promise<boolean>
  updateBook: (bookId: string, formData: BookFormData) => Promise<boolean>
  deleteBook: (bookId: string) => Promise<boolean>
  loadBooks: () => Promise<void>
}

export interface BookModalHook {
  showModal: boolean
  editingBook: Book | null
  formData: BookFormData
  openAddBookModal: () => void
  openEditBookModal: (book: Book) => void
  closeModal: () => void
  updateFormData: (data: Partial<BookFormData>) => void
}
