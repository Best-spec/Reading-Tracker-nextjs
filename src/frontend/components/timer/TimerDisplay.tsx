import React from 'react'
import { timerService } from '@/service/timerService'

interface TimerDisplayProps {
  elapsedTime: number
  isRunning: boolean
  isPaused: boolean
  selectedBook: string
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  elapsedTime,
  isRunning,
  isPaused,
  selectedBook,
}) => {
  const formattedTime = timerService.formatTime(elapsedTime)
  
  return (
    <div className={`relative w-80 h-80 rounded-full flex items-center justify-center transition-all duration-500 ${
      isRunning && !isPaused ? 'scale-105' : 'scale-100'
    }`}>
      {/* Outer Ring Animation */}
      <div className={`absolute inset-0 rounded-full border-[12px] border-gray-100 transition-all duration-500 ${
        isRunning && !isPaused ? 'border-blue-200 shadow-lg shadow-blue-50' : ''
      }`}></div>
      
      {/* Progress Ring (Visual Only) */}
      {isRunning && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="154"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-blue-500 transition-all duration-300"
            strokeDasharray={154 * 2 * Math.PI}
            strokeDashoffset={154 * 2 * Math.PI * (1 - (elapsedTime % (60 * 1000)) / (60 * 1000))}
          />
        </svg>
      )}

      <div className="text-center z-10">
        <div className="text-6xl font-black text-gray-900 tabular-nums tracking-tight">
          {formattedTime}
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
            !selectedBook ? 'bg-gray-100 text-gray-400' :
            !isRunning ? 'bg-blue-100 text-blue-600' :
            isPaused ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600 animate-pulse'
          }`}>
            {!selectedBook ? 'Ready' : !isRunning ? 'Standby' : isPaused ? 'Paused' : 'Recording'}
          </span>
        </div>
      </div>
    </div>
  )
}
