'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, BookOpen, Flame } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ReadingDay {
  date: string
  minutes: number
  pages: number
  books: number
  sessions: number
}

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  heatLevel: number
  data?: ReadingDay
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [yearData, setYearData] = useState<ReadingDay[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }
        await loadCalendarData()
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
    generateCalendarDays()
  }, [currentDate, yearData])

  const loadCalendarData = async () => {
    try {
      // Mock year data - replace with API call
      const mockYearData: ReadingDay[] = []
      const currentYear = new Date().getFullYear()
      
      for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 31; day++) {
          const date = new Date(currentYear, month, day)
          if (date.getMonth() === month) { // Valid date
            const random = Math.random()
            if (random > 0.3) { // 70% chance of reading activity
              mockYearData.push({
                date: `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                minutes: Math.floor(Math.random() * 120) + 15,
                pages: Math.floor(Math.random() * 30) + 5,
                books: random > 0.8 ? 2 : 1,
                sessions: Math.floor(Math.random() * 3) + 1
              })
            }
          }
        }
      }
      
      setYearData(mockYearData)
    } catch (error) {
      console.error('Failed to load calendar data:', error)
    }
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days: CalendarDay[] = []
    const today = new Date()
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      const dayData = yearData.find(d => d.date === dateString)
      
      let heatLevel = 0
      if (dayData) {
        const minutes = dayData.minutes
        if (minutes >= 120) heatLevel = 4
        else if (minutes >= 60) heatLevel = 3
        else if (minutes >= 30) heatLevel = 2
        else if (minutes >= 15) heatLevel = 1
      }
      
      days.push({
        date: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        heatLevel,
        data: dayData
      })
    }
    
    setCalendarDays(days)
  }

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
    setSelectedDay(null)
  }

  const getHeatColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100'
      case 1: return 'bg-blue-100'
      case 2: return 'bg-blue-300'
      case 3: return 'bg-blue-500'
      case 4: return 'bg-blue-700'
      default: return 'bg-gray-100'
    }
  }

  const getHeatTextColor = (level: number) => {
    return level >= 3 ? 'text-white' : 'text-gray-700'
  }

  const getMonthStats = () => {
    const monthString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    const monthData = yearData.filter(d => d.date.startsWith(monthString))
    
    const totalMinutes = monthData.reduce((acc, day) => acc + day.minutes, 0)
    const totalPages = monthData.reduce((acc, day) => acc + day.pages, 0)
    const totalBooks = monthData.reduce((acc, day) => acc + day.books, 0)
    const activeDays = monthData.length
    
    return { totalMinutes, totalPages, totalBooks, activeDays }
  }

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    )
  }

  const monthStats = getMonthStats()
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reading Calendar</h2>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-semibold text-gray-900">{monthYear}</h3>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-gray-100"></div>
            <div className="w-4 h-4 rounded bg-blue-100"></div>
            <div className="w-4 h-4 rounded bg-blue-300"></div>
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <div className="w-4 h-4 rounded bg-blue-700"></div>
          </div>
          <span>More</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day.isCurrentMonth && setSelectedDay(day)}
                    disabled={!day.isCurrentMonth}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                      transition-all duration-200 relative
                      ${!day.isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                      ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                      ${getHeatColor(day.heatLevel)}
                      ${getHeatTextColor(day.heatLevel)}
                      ${selectedDay?.date === day.date && day.isCurrentMonth ? 'ring-2 ring-offset-2 ring-blue-600' : ''}
                    `}
                  >
                    {day.date}
                    {day.data && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full opacity-60"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Day Details */}
            {selectedDay && selectedDay.data && (
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedDay.date} {currentDate.toLocaleDateString('en-US', { month: 'long' })} Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{formatMinutes(selectedDay.data.minutes)}</p>
                    <p className="text-sm text-gray-600">Reading Time</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{selectedDay.data.pages}</p>
                    <p className="text-sm text-gray-600">Pages Read</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{selectedDay.data.books}</p>
                    <p className="text-sm text-gray-600">Books</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{selectedDay.data.sessions}</p>
                    <p className="text-sm text-gray-600">Sessions</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Month Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Month Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Days</span>
                  <span className="font-semibold text-gray-900">{monthStats.activeDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Time</span>
                  <span className="font-semibold text-gray-900">{formatMinutes(monthStats.totalMinutes)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pages Read</span>
                  <span className="font-semibold text-gray-900">{monthStats.totalPages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Books Finished</span>
                  <span className="font-semibold text-gray-900">{monthStats.totalBooks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Average</span>
                  <span className="font-semibold text-gray-900">
                    {monthStats.activeDays > 0 ? formatMinutes(Math.round(monthStats.totalMinutes / monthStats.activeDays)) : '0m'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reading Streak */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Streak</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">7</p>
                <p className="text-sm text-gray-600">Current streak</p>
              </div>
            </div>

            {/* Year Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Year Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Days</span>
                  <span className="font-semibold text-gray-900">{yearData.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="font-semibold text-gray-900">
                    {formatMinutes(Math.round(yearData.reduce((acc, day) => acc + day.minutes, 0)))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pages</span>
                  <span className="font-semibold text-gray-900">
                    {yearData.reduce((acc, day) => acc + day.pages, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
