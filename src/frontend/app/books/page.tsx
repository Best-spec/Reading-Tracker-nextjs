'use client'

import { useState, useEffect } from 'react'
import { Plus, Filter, Search, X, BookOpen, Clock, Check, Calendar, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

interface Book {
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
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'reading' | 'finished' | 'plan'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    currentPage: '',
    status: 'PLAN' as Book['status']
  })
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
      const booksData = await api.getBooks()
      setBooks(booksData)
    } catch (error) {
      console.error('Failed to load books:', error)
      // Use mock data as fallback
      const mockBooks = [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          coverUrl: 'https://via.placeholder.com/60x90?text=GG',
          status: 'READING' as const,
          currentPage: 120,
          totalPages: 180,
          rating: 5,
          genre: 'Classic Fiction'
        },
        {
          id: '2',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          coverUrl: 'https://via.placeholder.com/60x90?text=TKAM',
          status: 'FINISHED' as const,
          currentPage: 324,
          totalPages: 324,
          rating: 4,
          genre: 'Classic Fiction'
        },
        {
          id: '3',
          title: '1984',
          author: 'George Orwell',
          coverUrl: 'https://via.placeholder.com/60x90?text=1984',
          status: 'PLAN' as const,
          currentPage: 0,
          totalPages: 328,
          genre: 'Dystopian'
        }
      ]
      setBooks(mockBooks)
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

  const openAddBookModal = () => {
    setEditingBook(null)
    setFormData({
      title: '',
      author: '',
      totalPages: '',
      currentPage: '',
      status: 'PLAN'
    })
    setShowModal(true)
  }

  const openEditBookModal = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      totalPages: book.totalPages?.toString() || '',
      currentPage: book.currentPage?.toString() || '',
      status: book.status
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBook(null)
    setFormData({
      title: '',
      author: '',
      totalPages: '',
      currentPage: '',
      status: 'PLAN'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        totalPages: parseInt(formData.totalPages) || 0,
        currentPage: parseInt(formData.currentPage) || 0,
        status: formData.status
      }

      if (editingBook) {
        // Update existing book
        await handleEditBook()
      } else {
        // Add new book
        await handleAddBook()
      }

      closeModal()
    } catch (error) {
      console.error('Failed to save book:', error)
    }
  }

  const handleAddBook = async () => {
    try {
      // Try to create book via API
      const newBook = await api.createBook(formData)
      setBooks(prev => [newBook, ...prev])
      setShowModal(false)
      setFormData({
        title: '',
        author: '',
        totalPages: '',
        currentPage: '',
        status: 'PLAN'
      })
    } catch (error) {
      console.error('Failed to add book:', error)
      // Fallback: add to local state
      const newBook: Book = {
        id: Date.now().toString(),
        title: formData.title,
        author: formData.author,
        totalPages: parseInt(formData.totalPages) || 0,
        currentPage: parseInt(formData.currentPage) || 0,
        status: formData.status,
        startDate: formData.status === 'READING' ? new Date().toISOString().split('T')[0] : undefined,
        finishDate: formData.status === 'FINISHED' ? new Date().toISOString().split('T')[0] : undefined
      }
      setBooks(prev => [newBook, ...prev])
      setShowModal(false)
      setFormData({
        title: '',
        author: '',
        totalPages: '',
        currentPage: '',
        status: 'PLAN'
      })
    }
  }

  const handleEditBook = async () => {
    if (!editingBook) return

    try {
      // Try to update book via API
      await api.updateBook(editingBook.id, formData)
      setBooks(prev => prev.map(book => 
        book.id === editingBook.id 
          ? { 
              ...book, 
              title: formData.title,
              author: formData.author,
              totalPages: parseInt(formData.totalPages) || 0,
              currentPage: parseInt(formData.currentPage) || 0,
              status: formData.status,
              startDate: formData.status === 'READING' ? new Date().toISOString().split('T')[0] : book.startDate,
              finishDate: formData.status === 'FINISHED' ? new Date().toISOString().split('T')[0] : book.finishDate
            }
          : book
      ))
      setShowModal(false)
      setEditingBook(null)
      setFormData({
        title: '',
        author: '',
        totalPages: '',
        currentPage: '',
        status: 'PLAN'
      })
    } catch (error) {
      console.error('Failed to update book:', error)
      // Fallback: update local state
      setBooks(prev => prev.map(book => 
        book.id === editingBook.id 
          ? { 
              ...book, 
              title: formData.title,
              author: formData.author,
              totalPages: parseInt(formData.totalPages) || 0,
              currentPage: parseInt(formData.currentPage) || 0,
              status: formData.status,
              startDate: formData.status === 'READING' ? new Date().toISOString().split('T')[0] : book.startDate,
              finishDate: formData.status === 'FINISHED' ? new Date().toISOString().split('T')[0] : book.finishDate
            }
          : book
      ))
      setShowModal(false)
      setEditingBook(null)
      setFormData({
        title: '',
        author: '',
        totalPages: '',
        currentPage: '',
        status: 'PLAN'
      })
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    try {
      // Try to delete book via API
      await api.deleteBook(bookId)
      setBooks(prev => prev.filter(book => book.id !== bookId))
    } catch (error) {
      console.error('Failed to delete book:', error)
      // Fallback: remove from local state
      setBooks(prev => prev.filter(book => book.id !== bookId))
    }
  }

  const getStatusIcon = (status: Book['status']) => {
    switch (status) {
      case 'READING':
        return <BookOpen className="w-4 h-4 text-blue-600" />
      case 'FINISHED':
        return <Check className="w-4 h-4 text-green-600" />
      case 'PLAN':
        return <Calendar className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'READING':
        return 'bg-blue-100 text-blue-800'
      case 'FINISHED':
        return 'bg-green-100 text-green-800'
      case 'PLAN':
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
            <p className="text-gray-600 mt-1">Manage your reading library</p>
          </div>
          <button 
            onClick={openAddBookModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Book</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 font-medium">Filter:</span>
            </div>
            <div className="flex gap-2">
              {(['all', 'reading', 'finished', 'plan'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No books found</p>
              <button
                onClick={openAddBookModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add your first book
              </button>
            </div>
          ) : (
            filteredBooks.map(book => (
              <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-3 aspect-h-4 bg-gray-100">
                  <img
                    src={book.coverUrl || 'https://via.placeholder.com/120x180?text=No+Cover'}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{book.title}</h3>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(book.status)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-1">{book.author}</p>
                  
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(book.status)}`}>
                    {getStatusIcon(book.status)}
                    <span>{book.status.charAt(0) + book.status.slice(1).toLowerCase()}</span>
                  </div>

                  {book.status === 'READING' && book.totalPages && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{book.currentPage || 0} / {book.totalPages}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.round(((book.currentPage || 0) / book.totalPages) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {book.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 ${i < book.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditBookModal(book)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Book Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Pages</label>
                  <input
                    type="number"
                    value={formData.totalPages}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalPages: e.target.value }))}
                    min="1"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Page</label>
                  <input
                    type="number"
                    value={formData.currentPage}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPage: e.target.value }))}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Book['status'] }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PLAN">To Read</option>
                    <option value="READING">Reading</option>
                    <option value="FINISHED">Finished</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  )
}
