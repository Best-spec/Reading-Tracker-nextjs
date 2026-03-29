import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { booksApi } from '@/service/api'
import { Book, BookFilter, BookFormData } from '@/types/book'

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<BookFilter>('all')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }
        await loadBooks()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    filterBooks()
  }, [books, searchTerm, activeFilter])

  const loadBooks = async () => {
    try {
      setLoading(true)
      const booksData = await booksApi.getBooks()
      console.log('booksData', booksData)
      setBooks(
        booksData
      )
    } catch (error) {
      console.error('Failed to load books:', error)
      // Set empty array when API fails
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const filterBooks = () => {
    let filtered = books

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(book => book.status === activeFilter.toUpperCase())
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredBooks(filtered)
  }

  const addBook = async (formData: BookFormData) => {
    try {
      const newBook = await booksApi.createBook(formData)
      setBooks(prev => [newBook, ...prev])
      return true
    } catch (error) {
      console.error('Failed to add book:', error)
      return false
    }
  }

  const updateBook = async (bookId: string, formData: BookFormData) => {
    try {
      await booksApi.updateBook(bookId, formData)
      setBooks(prev => prev.map(book => 
        book.id === bookId 
          ? { 
              ...book, 
              title: formData.title,
              author: formData.author,
              totalPages: parseInt(formData.totalPages.toString()) || 0,
              currentPage: parseInt(formData.currentPage?.toString() || '0') || 0,
              status: formData.status,
              startDate: formData.status === 'READING' ? new Date().toISOString().split('T')[0] : book.startDate,
              finishDate: formData.status === 'FINISHED' ? new Date().toISOString().split('T')[0] : book.finishDate
            }
          : book
      ))
      return true
    } catch (error) {
      console.error('Failed to update book:', error)
      return false
    }
  }

  const deleteBook = async (bookId: string) => {
    try {
      await booksApi.deleteBook(bookId)
      setBooks(prev => prev.filter(book => book.id !== bookId))
      return true
    } catch (error) {
      console.error('Failed to delete book:', error)
      return false
    }
  }

  return {
    books,
    filteredBooks,
    loading,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    addBook,
    updateBook,
    deleteBook,
    loadBooks
  }
}
