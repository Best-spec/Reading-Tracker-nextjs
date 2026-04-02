import { Plus, BookOpen, Edit, Trash2 } from 'lucide-react'
import { Book } from '@/types/book'

interface BookGridProps {
  books: Book[]
  onEditBook: (book: Book) => void
  onDeleteBook: (bookId: string) => void
  onAddBook: () => void
  onUpdateProgress: (book: Book) => void
}

export default function BookGrid({
  books,
  onEditBook,
  onDeleteBook,
  onAddBook,
  onUpdateProgress
}: BookGridProps) {
  const getStatusIcon = (status: Book['status']) => {
    switch (status) {
      case 'READING':
        return <BookOpen className="w-4 h-4 text-blue-600" />
      case 'FINISHED':
        return <div className="w-4 h-4 text-green-600">✓</div>
      case 'PLAN':
        return <div className="w-4 h-4 text-gray-600">📅</div>
    }
  }

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'READING':
        return 'bg-blue-100 text-blue-800'
      case 'FINISHED':
        return 'bg-green-100 text-green-800'
      case 'PLAN':
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No books found</p>
          <button
            onClick={onAddBook}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add your first book
          </button>
        </div>
      ) : (
        books.map(book => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-w-3 aspect-h-4 bg-gray-100">
              <img
                src={book.coverUrl || 'https://via.placeholder.com/120x180?text=No+Cover'}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{book.title}</h3>
                <div className="flex items-center gap-1">
                  {getStatusIcon(book.status)}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-1">{book.author}</p>
              
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(book.status)}`}>
                {getStatusIcon(book.status)}
                {/* <span>{book.status.slice(1).toLowerCase()}</span> */}
              </div>

              {book.status === 'READING' && book.totalPages && (
                <div className="mb-3">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>Progress: {book.currentPage || 0} / {book.totalPages}</span>
                    <button 
                      onClick={() => onUpdateProgress(book)}
                      className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" /> Update
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.round(((book.currentPage || 0) / book.totalPages) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => onEditBook(book)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteBook(book.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
