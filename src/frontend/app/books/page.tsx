'use client'

import { Plus } from 'lucide-react'
import { useBooks } from '@/hooks/useBooks'
import { useBookModal } from '@/hooks/useBookModal'
import BookModal from '@/components/books/BookModal'
import BookFilters from '@/components/books/BookFilters'
import BookGrid from '@/components/books/BookGrid'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function BooksPage() {
  const {
    books,
    filteredBooks,
    loading,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    addBook,
    updateBook,
    deleteBook
  } = useBooks()

  const {
    showModal,
    editingBook,
    formData,
    openAddBookModal,
    openEditBookModal,
    closeModal,
    updateFormData
  } = useBookModal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let success = false
      if (editingBook) {
        success = await updateBook(editingBook.id, formData)
      } else {
        success = await addBook(formData)
      }
      
      if (success) {
        closeModal()
      } else {
        alert('Failed to save book. Please try again.')
      }
    } catch (error) {
      console.error('Failed to save book:', error)
      alert('Failed to save book. Please try again.')
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return
    
    const success = await deleteBook(bookId)
    if (!success) {
      alert('Failed to delete book. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading books..." />
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
      <BookFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Books Grid */}
      <BookGrid
        books={filteredBooks}
        onEditBook={openEditBookModal}
        onDeleteBook={handleDeleteBook}
        onAddBook={openAddBookModal}
      />

      {/* Add/Edit Book Modal */}
      <BookModal
        showModal={showModal}
        editingBook={editingBook}
        formData={formData}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onFormDataChange={updateFormData}
      />
    </div>
  )
}
