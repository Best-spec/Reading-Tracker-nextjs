import React from 'react';
import { BookOpen, Clock, Flame, Award } from 'lucide-react';
import { ReadingStats } from '@/types/profile';

interface ProfileStatsProps {
  stats: ReadingStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
        <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
        <p className="text-sm text-gray-600">Books Read</p>
      </div>
      <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
        <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
        <p className="text-sm text-gray-600">Hours Read</p>
      </div>
      <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
        <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
        <p className="text-sm text-gray-600">Current Streak</p>
      </div>
      <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
        <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
        <p className="text-sm text-gray-600">Avg Rating</p>
      </div>
    </div>
  );
}
