'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square, RotateCcw, Clock, BookOpen, Target, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Book {
  id: string
  title: string
  author: string
  status?: string
  currentPage?: number
  totalPages?: number
}

interface TimerSession {
  id: string
  bookId: string
  startTime: Date
  endTime?: Date
  duration: number
  pagesRead: number
}

export default function TimerPage() {
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [books, setBooks] = useState<Book[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [sessions, setSessions] = useState<TimerSession[]>([])
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<Date | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }
        await loadBooks()
        await loadSessions()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current!.getTime())
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused])

  const loadBooks = async () => {
    try {
      // Mock books data - replace with API call
      const mockBooks: Book[] = [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          currentPage: 120,
          totalPages: 180
        },
        {
          id: '2',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          currentPage: 85,
          totalPages: 324
        },
        {
          id: '3',
          title: '1984',
          author: 'George Orwell',
          currentPage: 45,
          totalPages: 328
        }
      ]
      setBooks(mockBooks)
    } catch (error) {
      console.error('Failed to load books:', error)
    }
  }

  const loadSessions = async () => {
    try {
      // Mock sessions data - replace with API call
      const mockSessions: TimerSession[] = [
        {
          id: '1',
          bookId: '1',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 60 * 60 * 1000),
          duration: 60 * 60 * 1000,
          pagesRead: 15
        },
        {
          id: '2',
          bookId: '2',
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 23 * 60 * 60 * 1000),
          duration: 45 * 60 * 1000,
          pagesRead: 12
        }
      ]
      setSessions(mockSessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    if (!selectedBook) {
      alert('Please select a book first')
      return
    }

    setIsRunning(true)
    setIsPaused(false)
    startTimeRef.current = new Date()
  }

  const pauseTimer = () => {
    setIsPaused(!isPaused)
    if (!isPaused) {
      // Pausing
    } else {
      // Resuming
      startTimeRef.current = new Date(Date.now() - elapsedTime)
    }
  }

  const stopTimer = async () => {
    if (!isRunning) return

    setIsRunning(false)
    setIsPaused(false)

    const endTime = new Date()
    const duration = elapsedTime

    // Create new session
    const newSession: TimerSession = {
      id: Date.now().toString(),
      bookId: selectedBook,
      startTime: startTimeRef.current!,
      endTime,
      duration,
      pagesRead: 0 // Will be updated by user
    }

    setSessions(prev => [newSession, ...prev])
    setElapsedTime(0)
    startTimeRef.current = null

    // Ask for pages read
    const pagesRead = prompt('How many pages did you read?')
    if (pagesRead) {
      const session = { ...newSession, pagesRead: parseInt(pagesRead) || 0 }
      setSessions(prev => [session, ...prev.slice(1)])
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setElapsedTime(0)
    startTimeRef.current = null
  }

  const getProgressPercentage = () => {
    if (!selectedBook) return 0
    const book = books.find(b => b.id === selectedBook)
    if (!book || !book.totalPages) return 0
    return (book.currentPage || 0) / book.totalPages * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading timer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reading Timer</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* Book Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Book</label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a book to read...</option>
                  {books.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} - {book.author}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timer Display */}
              <div className="flex justify-center mb-8">
                <div 
                  className={`w-72 h-72 rounded-full bg-white border-8 border-gray-200 flex flex-col items-center justify-center relative ${
                    isRunning && !isPaused ? 'shadow-lg shadow-blue-500/25' : ''
                  }`}
                  style={{
                    background: isRunning 
                      ? `conic-gradient(#3b82f6 ${(elapsedTime / (60 * 60 * 1000)) * 360}deg, #e2e8f0 0deg)`
                      : '#e2e8f0'
                  }}
                >
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 tabular-nums">
                      {formatTime(elapsedTime)}
                    </div>
                    <div className="text-gray-500 text-sm mt-2">
                      {!selectedBook && 'Select a book to start'}
                      {selectedBook && !isRunning && 'Ready to start'}
                      {selectedBook && isRunning && !isPaused && 'Reading...'}
                      {selectedBook && isRunning && isPaused && 'Paused'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    disabled={!selectedBook}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Start Reading
                  </button>
                ) : (
                  <>
                    <button
                      onClick={pauseTimer}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={stopTimer}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <Square className="w-5 h-5" />
                      Stop
                    </button>
                    <button
                      onClick={resetTimer}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </button>
                  </>
                )}
              </div>

              {/* Current Book Progress */}
              {selectedBook && (() => {
                const book = books.find(b => b.id === selectedBook)
                return book ? (
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">{book.title}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{book.currentPage || 0} / {book.totalPages} pages</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : null
              })()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Time</p>
                    <p className="font-semibold text-gray-900">
                      {formatTime(sessions
                        .filter(s => new Date(s.startTime).toDateString() === new Date().toDateString())
                        .reduce((acc, s) => acc + s.duration, 0)
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pages Read</p>
                    <p className="font-semibold text-gray-900">
                      {sessions
                        .filter(s => new Date(s.startTime).toDateString() === new Date().toDateString())
                        .reduce((acc, s) => acc + s.pagesRead, 0)
                      } pages
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sessions</p>
                    <p className="font-semibold text-gray-900">
                      {sessions.filter(s => new Date(s.startTime).toDateString() === new Date().toDateString()).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No sessions yet</p>
                ) : (
                  sessions.slice(0, 5).map(session => {
                    const book = books.find(b => b.id === session.bookId)
                    return (
                      <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {book?.title || 'Unknown Book'}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTime(session.duration)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {new Date(session.startTime).toLocaleDateString()}
                          </span>
                          <span>{session.pagesRead} pages</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    // </div>
  )
}
