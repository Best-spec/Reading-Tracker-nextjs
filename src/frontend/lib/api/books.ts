import { request } from './base'

export const booksApi = {
  async getBooks() {
    return await request('/api/books/mybooks')
  },

  async createBook(bookData: any) {
    return await request('/api/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    })
  },

  async updateBook(bookId: string, bookData: any) {
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
