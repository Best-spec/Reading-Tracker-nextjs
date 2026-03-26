'use client'

import { useState, useEffect } from 'react'
import { Plus, BookOpen, Target, Trophy, Calendar, Users, X, Check, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface BookFormData {
  title: string
  author: string
  isbn?: string
  totalPages: number
  genre: string
  description: string
  coverUrl?: string
}

interface ChallengeFormData {
  name: string
  description: string
  targetBooks: number
  targetPages: number
  startDate: string
  endDate: string
  isPublic: boolean
}

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<'book' | 'challenge' | 'group'>('book')
  const [bookForm, setBookForm] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    totalPages: 0,
    genre: '',
    description: '',
    coverUrl: ''
  })
  const [challengeForm, setChallengeForm] = useState<ChallengeFormData>({
    name: '',
    description: '',
    targetBooks: 0,
    targetPages: 0,
    startDate: '',
    endDate: '',
    isPublic: false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const searchBook = async () => {
    if (!bookForm.isbn && !bookForm.title) {
      showMessage('error', 'Please enter ISBN or title to search')
      return
    }

    setSearching(true)
    try {
      // Mock API call - replace with actual book search API
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
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
      
      // Redirect to books page after a short delay
      setTimeout(() => router.push('/books'), 1500)
    } catch (error) {
      showMessage('error', 'Failed to add book. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showMessage('success', 'Reading challenge created successfully!')
      setChallengeForm({
        name: '',
        description: '',
        targetBooks: 0,
        targetPages: 0,
        startDate: '',
        endDate: '',
        isPublic: false
      })
    } catch (error) {
      showMessage('error', 'Failed to create challenge. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Sci-Fi', 'Fantasy',
    'Biography', 'History', 'Self-Help', 'Young Adult', 'Classic', 'Poetry', 'Drama'
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Something New</h2>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {(['book', 'challenge', 'group'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {tab === 'book' && <BookOpen className="w-4 h-4" />}
            {tab === 'challenge' && <Target className="w-4 h-4" />}
            {tab === 'group' && <Users className="w-4 h-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Book Tab */}
      {activeTab === 'book' && (
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
                  onChange={(e) => setBookForm(prev => ({ 
                    ...prev, 
                    isbn: e.target.value.includes('978') || e.target.value.includes('979') ? e.target.value : '',
                    title: !e.target.value.includes('978') && !e.target.value.includes('979') ? e.target.value : prev.title
                  }))}
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
                  onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                <input
                  type="text"
                  value={bookForm.author}
                  onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))}
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
                  onChange={(e) => setBookForm(prev => ({ ...prev, isbn: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="978-0-123456-78-9"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Pages *</label>
                <input
                  type="number"
                  value={bookForm.totalPages}
                  onChange={(e) => setBookForm(prev => ({ ...prev, totalPages: parseInt(e.target.value) || 0 }))}
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
                onChange={(e) => setBookForm(prev => ({ ...prev, genre: e.target.value }))}
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
                onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))}
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
                onChange={(e) => setBookForm(prev => ({ ...prev, coverUrl: e.target.value }))}
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
      )}

      {/* Create Challenge Tab */}
      {activeTab === 'challenge' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Create Reading Challenge
            </h3>
            <p className="text-sm text-gray-600 mt-1">Set a personal reading goal</p>
          </div>
          <form onSubmit={handleCreateChallenge} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Name *</label>
              <input
                type="text"
                value={challengeForm.name}
                onChange={(e) => setChallengeForm(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2024 Reading Challenge"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={challengeForm.description}
                onChange={(e) => setChallengeForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your reading challenge..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Books</label>
                <input
                  type="number"
                  value={challengeForm.targetBooks}
                  onChange={(e) => setChallengeForm(prev => ({ ...prev, targetBooks: parseInt(e.target.value) || 0 }))}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Number of books to read"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Pages</label>
                <input
                  type="number"
                  value={challengeForm.targetPages}
                  onChange={(e) => setChallengeForm(prev => ({ ...prev, targetPages: parseInt(e.target.value) || 0 }))}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Number of pages to read"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={challengeForm.startDate}
                  onChange={(e) => setChallengeForm(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={challengeForm.endDate}
                  onChange={(e) => setChallengeForm(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={challengeForm.isPublic}
                onChange={(e) => setChallengeForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make this challenge public (others can join)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trophy className="w-4 h-4" />
              )}
              Create Challenge
            </button>
          </form>
        </div>
      )}

      {/* Create Group Tab */}
      {activeTab === 'group' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Create Reading Group
            </h3>
            <p className="text-sm text-gray-600 mt-1">Start a book club with friends</p>
          </div>
          <div className="p-6 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Group creation is available on the Groups page</p>
            <Link
              href="/groups"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go to Groups
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
