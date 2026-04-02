'use client'

import React from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { BookFormData } from '@/hooks/useCreateBook'

interface BookFormProps {
  bookForm: BookFormData
  loading: boolean
  searching: boolean
  searchResults: any[]
  updateBookForm: (data: Partial<BookFormData>) => void
  searchBook: () => void
  selectSearchResult: (result: any) => void
  handleCreateBook: (e: React.FormEvent) => void
}

const genres = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Sci-Fi', 'Fantasy',
  'Biography', 'History', 'Self-Help', 'Young Adult', 'Classic', 'Poetry', 'Drama'
]

export const BookForm: React.FC<BookFormProps> = ({
  bookForm,
  loading,
  searching,
  searchResults,
  updateBookForm,
  searchBook,
  selectSearchResult,
  handleCreateBook
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Add New Book
        </h3>
        <p className="text-sm text-gray-600 mt-1">Add a book to your reading library</p>
      </div>
      <form onSubmit={handleCreateBook} className="p-6 space-y-4">
        {/* Search Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">Search for book information</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter ISBN or title..."
              value={bookForm.isbn || bookForm.title}
              onChange={(e) => {
                const val = e.target.value
                const isIsbn = val.includes('978') || val.includes('979')
                updateBookForm({
                  isbn: isIsbn ? val : '',
                  title: !isIsbn ? val : bookForm.title
                })
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={searchBook}
              disabled={searching}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 transition-colors"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Search Results:</p>
              {searchResults.map((result, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <img
                    src={result.coverUrl || 'https://via.placeholder.com/40x60?text=No+Cover'}
                    alt={result.title}
                    className="w-10 h-15 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{result.title}</p>
                    <p className="text-sm text-gray-600">{result.author}</p>
                    <p className="text-xs text-gray-500">{result.totalPages} pages</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectSearchResult(result)}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
                  >
                    Use This
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={bookForm.title}
              onChange={(e) => updateBookForm({ title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
            <input
              type="text"
              value={bookForm.author}
              onChange={(e) => updateBookForm({ author: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
            <input
              type="text"
              value={bookForm.isbn}
              onChange={(e) => updateBookForm({ isbn: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="978-0-123456-78-9"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Pages *</label>
            <input
              type="number"
              value={bookForm.totalPages}
              onChange={(e) => updateBookForm({ totalPages: parseInt(e.target.value) || 0 })}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
          <select
            value={bookForm.genre}
            onChange={(e) => updateBookForm({ genre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a genre</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={bookForm.description}
            onChange={(e) => updateBookForm({ description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the book..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover URL</label>
          <input
            type="url"
            value={bookForm.coverUrl}
            onChange={(e) => updateBookForm({ coverUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/cover.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Book
        </button>
      </form>
    </div>
  )
}
