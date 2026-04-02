import { X, BookOpen, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Book } from '@/types/book'

interface UpdateProgressModalProps {
  showModal: boolean
  book: Book | null
  onClose: () => void
  onSubmit: (currentPage: number, status: string) => Promise<void>
}

export default function UpdateProgressModal({
  showModal,
  book,
  onClose,
  onSubmit
}: UpdateProgressModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (book) {
      setCurrentPage(book.currentPage || 0)
    }
  }, [book])

  if (!showModal || !book) return null

  const totalPages = book.totalPages || 0
  const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const status = currentPage >= totalPages ? 'FINISHED' : 'READING'
      await onSubmit(currentPage, status)
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (pages: number) => {
    setCurrentPage(prev => Math.min(prev + pages, totalPages))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm transform transition-all">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Update Progress
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">{book.title}</p>
            <div className="text-3xl font-bold text-gray-900">
              {percentage}%
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Page
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Math.min(Math.max(0, parseInt(e.target.value) || 0), totalPages))}
                  className="w-full text-center text-lg font-semibold px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500 font-medium">/ {totalPages}</span>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {[1, 5, 10, 50].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickAdd(amount)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                >
                  +{amount}
                </button>
              ))}
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${percentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : percentage === 100 ? (
              <>
                <Check className="w-5 h-5" />
                Finish Book
              </>
            ) : (
              'Save Progress'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
