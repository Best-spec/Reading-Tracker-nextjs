'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/service/api'

export interface BookFormData {
  title: string
  author: string
  isbn?: string
  totalPages: number
  genre: string
  description: string
  coverUrl?: string
}

export function useCreateBook(showMessage: (type: 'success' | 'error', text: string) => void) {
  const [bookForm, setBookForm] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    totalPages: 0,
    genre: '',
    description: '',
    coverUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const router = useRouter()

  const searchBook = async () => {
    if (!bookForm.isbn && !bookForm.title) {
      showMessage('error', 'Please enter ISBN or title to search')
      return
    }

    setSearching(true)
    try {
      // Mock API call - replace with actual book search API if available
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResults = [
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          isbn: '9780743273565',
          totalPages: 180,
          genre: 'Classic Fiction',
          coverUrl: 'https://via.placeholder.com/100x150?text=GG',
          description: 'A classic American novel set in the Jazz Age.'
        }
      ]
      
      setSearchResults(mockResults)
    } catch (error) {
      showMessage('error', 'Failed to search for books')
    } finally {
      setSearching(false)
    }
  }

  const selectSearchResult = (result: any) => {
    setBookForm({
      title: result.title,
      author: result.author,
      isbn: result.isbn,
      totalPages: result.totalPages,
      genre: result.genre,
      description: result.description,
      coverUrl: result.coverUrl
    })
    setSearchResults([])
  }

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.createBook(bookForm)
      
      showMessage('success', 'Book added successfully!')
      setBookForm({
        title: '',
        author: '',
        isbn: '',
        totalPages: 0,
        genre: '',
        description: '',
        coverUrl: ''
      })
      
      setTimeout(() => router.push('/books'), 1500)
    } catch (error) {
      showMessage('error', 'Failed to add book. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateBookForm = (data: Partial<BookFormData>) => {
    setBookForm(prev => ({ ...prev, ...data }))
  }

  return {
    bookForm,
    loading,
    searchResults,
    searching,
    searchBook,
    selectSearchResult,
    handleCreateBook,
    updateBookForm
  }
}
