import React from 'react'
import { X, Clock, BookOpen, CheckCircle } from 'lucide-react'
import { timerService } from '@/service/timerService'

interface StopSessionModalProps {
  elapsedTime: number
  pagesReadInput: number
  setPagesReadInput: (val: number) => void
  onConfirm: () => void
  onCancel: () => void
  savingSession: boolean
}

export const StopSessionModal: React.FC<StopSessionModalProps> = ({
  elapsedTime,
  pagesReadInput,
  setPagesReadInput,
  onConfirm,
  onCancel,
  savingSession,
}) => {
  const formattedTime = timerService.formatTime(elapsedTime)
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Finish Session</h3>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={savingSession}
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
             <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Time Read</p>
            <p className="text-xl font-black text-blue-700">{formattedTime}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <label className="text-sm font-black text-gray-700 ml-1">How many pages did you read?</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={pagesReadInput}
              onChange={(e) => setPagesReadInput(parseInt(e.target.value) || 0)}
              className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl text-center text-3xl font-black focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              autoFocus
            />
            <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
          </div>
          
          {/* Quick Adjustment Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10, 20].map(val => (
              <button
                key={val}
                onClick={() => setPagesReadInput(Math.max(0, pagesReadInput + val))}
                className="py-2.5 bg-gray-50 hover:bg-blue-100/50 text-gray-600 hover:text-blue-600 rounded-xl text-xs font-black transition-all border border-transparent hover:border-blue-100"
              >
                +{val}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={savingSession}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-gray-300"
          >
            {savingSession ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                Save & Finish
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
            disabled={savingSession}
          >
            Keep Reading
          </button>
        </div>
      </div>
    </div>
  )
}
