import React from 'react'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'

interface TimerControlsProps {
  isRunning: boolean
  isPaused: boolean
  selectedBook: string
  onStart: () => void
  onPause: () => void
  onStop: () => void
  onReset: () => void
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  selectedBook,
  onStart,
  onPause,
  onStop,
  onReset,
}) => {
  return (
    <div className="mt-12 flex items-center gap-4">
      {!isRunning ? (
        <button
          onClick={onStart}
          disabled={!selectedBook}
          className="group bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-6 h-6 fill-current" />
          Start Reading
        </button>
      ) : (
        <>
          <button
            onClick={onPause}
            className={`p-4 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
              isPaused ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
            }`}
          >
            {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={onStop}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-red-100 transition-all hover:scale-105 active:scale-95"
          >
            <Square className="w-5 h-5 fill-current" />
            Finish Session
          </button>

          <button
            onClick={onReset}
            className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all"
            title="Cancel & Reset"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  )
}
