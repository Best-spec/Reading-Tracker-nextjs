import { useState } from 'react'
import { Book, BookFormData } from '@/types/book'

export function useBookModal() {
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    totalPages: 0,
    currentPage: 0,
    status: 'PLAN'
  })

  const openAddBookModal = () => {
    setEditingBook(null)
    setFormData({
      title: '',
      author: '',
      totalPages: 0,
      currentPage: 0,
      status: 'PLAN'
    })
    setShowModal(true)
  }

  const openEditBookModal = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      totalPages: book.totalPages || 0,
      currentPage: book.currentPage || 0,
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
      totalPages: 0,
      currentPage: 0,
      status: 'PLAN'
    })
  }

  const updateFormData = (data: Partial<BookFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  return {
    showModal,
    editingBook,
    formData,
    openAddBookModal,
    openEditBookModal,
    closeModal,
    updateFormData
  }
}
