'use client'

import { BookOpen } from 'lucide-react'
import { useTimer } from '@/hooks/useTimer'
import { BookSelector } from '@/components/timer/BookSelector'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { TimerSidebar } from '@/components/timer/TimerSidebar'
import { StopSessionModal } from '@/components/timer/StopSessionModal'

export default function TimerPage() {
  const {
    selectedBook,
    setSelectedBook,
    section,
    setSection,
    books,
    isRunning,
    isPaused,
    elapsedTime,
    sessions,
    loading,
    showStopModal,
    setShowStopModal,
    pagesReadInput,
    setPagesReadInput,
    savingSession,
    todayStats,
    currentBook,
    progressPercentage,
    startTimer,
    pauseTimer,
    handleStopClick,
    confirmStopTimer,
    resetTimerState,
    setIsPaused
  } = useTimer()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium tracking-wide">Initializing Timer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Reading Timer</h2>
        <p className="text-gray-500 mt-1">Focus on your reading and track your progress automatically</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

            <div className="relative z-10">
              <BookSelector
                selectedBook={selectedBook}
                setSelectedBook={setSelectedBook}
                section={section}
                setSection={setSection}
                books={books}
                isRunning={isRunning}
              />

              <div className="flex flex-col items-center justify-center py-12">
                <TimerDisplay
                  elapsedTime={elapsedTime}
                  isRunning={isRunning}
                  isPaused={isPaused}
                  selectedBook={selectedBook}
                />

                <TimerControls
                  isRunning={isRunning}
                  isPaused={isPaused}
                  selectedBook={selectedBook}
                  onStart={startTimer}
                  onPause={pauseTimer}
                  onStop={handleStopClick}
                  onReset={resetTimerState}
                />
              </div>

              {/* Selected Book Info Card */}
              {currentBook && (
                <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-24 bg-blue-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-blue-200">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold text-gray-900">{currentBook.title}</h4>
                    <p className="text-gray-500 text-sm">{currentBook.author}</p>

                    <div className="mt-4 space-y-2 max-w-sm mx-auto md:mx-0">
                      <div className="flex justify-between items-end text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <span>Progress</span>
                        <span className="text-blue-600">{currentBook.currentPage || 0} / {currentBook.totalPages} Pages</span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all duration-1000 ease-out"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <TimerSidebar
          sessions={sessions}
          books={books}
          todayStats={todayStats}
        />
      </div>

      {/* Stop Session Modal Overlay */}
      {showStopModal && (
        <StopSessionModal
          elapsedTime={elapsedTime}
          pagesReadInput={pagesReadInput}
          setPagesReadInput={setPagesReadInput}
          onConfirm={confirmStopTimer}
          onCancel={() => { setShowStopModal(false); setIsPaused(false); }}
          savingSession={savingSession}
        />
      )}
    </div>
  )
}
