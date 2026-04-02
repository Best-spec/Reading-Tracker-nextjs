import { request } from './base'
import { BookFormData } from '@/types/book'

export const booksApi = {
  async getBooks() {
    return await request('/api/books')
  },

  async createBook(bookData: BookFormData) {
    return await request('/api/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    })
  },

  async updateBook(bookId: string, bookData: BookFormData) {
    return await request(`/api/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    })
  },

  async deleteBook(bookId: string) {
    return await request(`/api/books/${bookId}`, {
      method: 'DELETE',
    })
  },

  async updateProgress(bookId: string, currentPage: number, status?: string) {
    return await request(`/api/books/${bookId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ currentPage, status }),
    })
  },

  async addBookSection(bookId: string, sectionData: { title: string; startPage: number; endPage: number; content?: string; notes?: string }) {
    return await request(`/api/books/${bookId}/sections`, {
      method: 'POST',
      body: JSON.stringify(sectionData),
    })
  }
}
