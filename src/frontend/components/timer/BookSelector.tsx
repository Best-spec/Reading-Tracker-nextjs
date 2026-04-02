import React from 'react'
import { Book } from '@/types/timer'

interface BookSelectorProps {
  selectedBook: string
  setSelectedBook: (id: string) => void
  section: string
  setSection: (val: string) => void
  books: Book[]
  isRunning: boolean
}

export const BookSelector: React.FC<BookSelectorProps> = ({
  selectedBook,
  setSelectedBook,
  section,
  setSection,
  books,
  isRunning,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Select Book</label>
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          disabled={isRunning}
          className="w-full px-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
        >
          <option value="">Choose a book...</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Section / Chapter (Optional)</label>
        <input
          type="text"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          disabled={isRunning}
          placeholder="E.g. Chapter 5, Part 1..."
          className="w-full px-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
        />
      </div>
    </div>
  )
}
