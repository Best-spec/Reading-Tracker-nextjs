import React from 'react'
import { TrendingUp, PieChart, BarChart3, Flame, Calendar } from 'lucide-react'
import { ChartData, StatsData } from '@/service/statsService'

interface StatsChartsProps {
  trendData: ChartData | null
  statusData: ChartData | null
  dayData: ChartData | null
  stats: StatsData
}

export const StatsCharts: React.FC<StatsChartsProps> = ({ trendData, statusData, dayData, stats }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Chart implementation needed</p>
              <p className="text-xs text-gray-400 mt-1">
                {trendData?.labels.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Books by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Books by Status</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Pie chart implementation needed</p>
              <div className="mt-3 space-y-1">
                {statusData?.labels.map((label, i) => (
                  <div key={label} className="flex items-center justify-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: statusData.datasets[0].backgroundColor?.[i] }}
                    ></div>
                    <span>{label}: {statusData.datasets[0].data[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reading Hours by Day */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading by Day of Week</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Bar chart implementation needed</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {dayData?.labels.map((label, i) => (
                  <div key={label} className="text-center">
                    <div className="text-xs text-gray-500">{label}</div>
                    <div 
                      className="w-8 bg-purple-500 rounded-t mt-1" 
                      style={{ height: `${(dayData.datasets[0].data[i] / 3.5) * 40}px` }}
                    ></div>
                    <div className="text-xs">{dayData.datasets[0].data[i]}h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reading Streak */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Streak</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Current Streak</p>
                  <p className="text-sm text-gray-500">Consecutive reading days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">{stats.currentStreak}</p>
                <p className="text-sm text-gray-500">days</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Longest Streak</p>
                  <p className="text-sm text-gray-500">Best consecutive days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{stats.longestStreak}</p>
                <p className="text-sm text-gray-500">days</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <p className="font-medium text-gray-900">Reading Habit</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Most active day</span>
                  <span className="font-medium text-gray-900">Saturday</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average session</span>
                  <span className="font-medium text-gray-900">45 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best time</span>
                  <span className="font-medium text-gray-900">8:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Monthly Goal</span>
              <span className="text-sm text-gray-500">18 / 20 hours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Books Goal</span>
              <span className="text-sm text-gray-500">2 / 3 books</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Pages Goal</span>
              <span className="text-sm text-gray-500">450 / 500 pages</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
