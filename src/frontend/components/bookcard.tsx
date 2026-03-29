'use client'


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

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-4">{book.author}</p>
        
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            book.status === 'READING' ? 'bg-blue-100 text-blue-800' :
            book.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {book.status}
          </span>
          
          {book.status === 'READING' && book.currentPage && book.totalPages && (
            <div className="text-sm text-gray-500">
              {book.currentPage}/{book.totalPages} pages
            </div>
          )}
        </div>
      </div>
    </div>
  )
}