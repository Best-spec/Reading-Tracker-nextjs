import { Library, Clock, BookOpen, Flame, TrendingUp } from 'lucide-react'

import { HomeStats } from '@/types/home'

interface StatsGridProps {
  stats: HomeStats
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Books */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Books</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Library className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span>{stats.booksChange}</span>
        </p>
      </div>

      {/* Reading Hours */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Reading Hours</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalHours}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">This week</p>
      </div>

      {/* Pages Read */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pages Read</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPages}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Total pages</p>
      </div>

      {/* Current Streak */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-gray-900">{stats.currentStreak}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <p className="text-sm text-orange-600 mt-2 font-medium">Keep it up!</p>
      </div>
    </div>
  )
}
