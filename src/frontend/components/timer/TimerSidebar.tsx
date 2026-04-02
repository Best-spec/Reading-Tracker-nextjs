import React from 'react'
import { TrendingUp, Clock, Target, BookOpen } from 'lucide-react'
import { Book, TimerSession } from '@/types/timer'
import { timerService } from '@/service/timerService'

interface TimerSidebarProps {
  sessions: TimerSession[]
  books: Book[]
  todayStats: {
    totalTimeFormatted: string
    totalPages: number
  }
}

export const TimerSidebar: React.FC<TimerSidebarProps> = ({
  sessions,
  books,
  todayStats,
}) => {
  return (
    <div className="space-y-6">
      {/* Today Summary Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Today's Activity
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Time</p>
              <p className="text-xl font-black text-gray-900 tabular-nums">
                {todayStats.totalTimeFormatted}
              </p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pages</p>
              <p className="text-xl font-black text-gray-900">
                {todayStats.totalPages}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">History</h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Recent</span>
        </div>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No sessions recorded yet</p>
            </div>
          ) : (
            sessions.slice(0, 5).map(session => {
              const book = books.find(b => b.id === session.bookId)
              return (
                <div key={session.id} className="group p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md hover:border-gray-100 border border-transparent transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 text-sm truncate pr-2">
                      {book?.title || 'Unknown Book'}
                    </h4>
                    <span className="text-xs font-bold text-blue-500 shrink-0">
                      {timerService.formatTime(session.duration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                         {session.pagesRead} PGS
                       </span>
                       {session.section && (
                         <span className="text-[10px] text-gray-400 font-medium truncate max-w-[80px]">
                           • {session.section}
                         </span>
                       )}
                     </div>
                     <span className="text-[10px] font-bold text-gray-400">
                       {new Date(session.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                     </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
