import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/service/api'
import { timerService } from '@/service/timerService'
import { Book, TimerSession } from '@/types/timer'

export function useTimer() {
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [section, setSection] = useState<string>('')
  const [books, setBooks] = useState<Book[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [sessions, setSessions] = useState<TimerSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStopModal, setShowStopModal] = useState(false)
  const [pagesReadInput, setPagesReadInput] = useState<number>(0)
  const [savingSession, setSavingSession] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<Date | null>(null)
  const router = useRouter()

  const loadBooks = async () => {
    try {
      const booksData = await api.getBooks()
      setBooks(booksData || [])
    } catch (error) {
      console.error('Failed to load books:', error)
    }
  }

  const loadSessions = async () => {
    try {
      const activeData = await api.getActiveSession()
      if (activeData) {
        const activeBase = activeData.data || activeData
        setActiveSessionId(activeBase.id)
        setSelectedBook(activeBase.bookId || activeBase.book_id || activeBase.readingLog?.bookId)
        setSection(activeBase.section || '')
        const start = activeBase.startTime || activeBase.start_time || activeBase.createdAt
        startTimeRef.current = new Date(start)
        setIsRunning(true)
        setIsPaused(false)
        setElapsedTime(Date.now() - startTimeRef.current.getTime())
      }

      const sessionsData = await api.getReadingSessions()
      const formatted = timerService.formatSessions(sessionsData)
      setSessions(formatted)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const startTimer = async () => {
    if (!selectedBook) return

    try {
      const sessionResponse = await api.startSession({ 
        bookId: selectedBook,
        section: section
      })
      const sessionData = sessionResponse?.data || sessionResponse
      setActiveSessionId(sessionData?.id || null)
      setIsRunning(true)
      setIsPaused(false)
      startTimeRef.current = new Date()
      setElapsedTime(0)
    } catch (error) {
      console.error('Failed to start session:', error)
      alert("Failed to start session on server")
    }
  }

  const pauseTimer = () => {
    setIsPaused(!isPaused)
    if (isPaused) {
      // Resuming
      startTimeRef.current = new Date(Date.now() - elapsedTime)
    }
  }

  const handleStopClick = () => {
    setIsPaused(true)
    setShowStopModal(true)
  }

  const resetTimerState = () => {
    setIsRunning(false)
    setIsPaused(false)
    setElapsedTime(0)
    startTimeRef.current = null
    setActiveSessionId(null)
    setPagesReadInput(0)
    setSection('')
  }

  const confirmStopTimer = async () => {
    if (!isRunning || !activeSessionId) return

    setSavingSession(true)
    try {
      await api.stopSession({
        sessionId: activeSessionId,
        pagesRead: pagesReadInput
      })
      
      resetTimerState()
      setShowStopModal(false)
      await loadBooks() 
      await loadSessions()
    } catch (error) {
      console.error('Failed to stop session:', error)
      alert("Failed to save session. Please try again.")
    } finally {
      setSavingSession(false)
    }
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('readflow_token')
      if (!token) {
        router.push('/login')
        return
      }
      await Promise.all([loadBooks(), loadSessions()])
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [router])

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Date.now() - startTimeRef.current.getTime())
        }
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

  const todayStats = timerService.calculateTodayStats(sessions, isRunning, startTimeRef.current, elapsedTime)
  const currentBook = books.find(b => b.id === selectedBook)
  const progressPercentage = timerService.calculateProgress(currentBook)

  return {
    // State
    selectedBook,
    setSelectedBook,
    section,
    setSection,
    books,
    isRunning,
    isPaused,
    elapsedTime,
    sessions,
    activeSessionId,
    loading,
    showStopModal,
    setShowStopModal,
    pagesReadInput,
    setPagesReadInput,
    savingSession,
    
    // Derived
    todayStats,
    currentBook,
    progressPercentage,
    formattedElapsedTime: timerService.formatTime(elapsedTime),
    
    // Actions
    startTimer,
    pauseTimer,
    handleStopClick,
    confirmStopTimer,
    resetTimerState,
    setIsPaused
  }
}
