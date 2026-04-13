import React from 'react';
import Link from 'next/link';
import { Target, Trophy, BookOpen } from 'lucide-react';
import { Achievement, ReadingStats } from '@/types/profile';

interface ProfileSidebarProps {
  achievements: Achievement[];
  stats: ReadingStats;
}

export function ProfileSidebar({ achievements, stats }: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Reading Goals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Goals</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">2024 Goal</span>
            </div>
            <span className="text-sm font-medium text-gray-900">47 / 50 books</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-700">Pages Goal</span>
            </div>
            <span className="text-sm font-medium text-gray-900">15,678 / 20,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
