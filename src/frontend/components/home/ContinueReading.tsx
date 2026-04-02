import { BookX } from 'lucide-react'
import Link from 'next/link'

import { Book } from '@/types/book'

interface ContinueReadingProps {
  books: Book[]
}

export function ContinueReading({ books }: ContinueReadingProps) {
  const readingBooks = books.filter(book => book.status === 'READING').slice(0, 3)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Continue Reading</h3>
      </div>
      <div className="p-6">
        {readingBooks.length === 0 ? (
          <div className="empty-state py-8 text-center">
            <BookX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No books in progress</p>
            <Link href="/books" className="inline-block mt-3 text-blue-600 hover:underline">
              Add your first book
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {readingBooks.map(book => (
              <div key={book.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img 
                  src={book.coverUrl || 'https://via.placeholder.com/60x90?text=No+Cover'} 
                  alt={book.title} 
                  className="w-14 h-20 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{book.title}</h4>
                  <p className="text-sm text-gray-500">{book.author}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{book.currentPage || 0} / {book.totalPages} pages</span>
                      <span>{Math.round(((book.currentPage || 0) / (book.totalPages || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.round(((book.currentPage || 0) / (book.totalPages || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
