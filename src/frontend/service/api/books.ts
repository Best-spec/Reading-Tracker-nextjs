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
  }
}
