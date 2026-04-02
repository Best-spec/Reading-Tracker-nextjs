'use client'

import React from 'react'
import { Target, Trophy } from 'lucide-react'
import { ChallengeFormData } from '@/hooks/useCreateChallenge'

interface ChallengeFormProps {
  challengeForm: ChallengeFormData
  loading: boolean
  updateChallengeForm: (data: Partial<ChallengeFormData>) => void
  handleCreateChallenge: (e: React.FormEvent) => void
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({
  challengeForm,
  loading,
  updateChallengeForm,
  handleCreateChallenge
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Create Reading Challenge
        </h3>
        <p className="text-sm text-gray-600 mt-1">Set a personal reading goal</p>
      </div>
      <form onSubmit={handleCreateChallenge} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Name *</label>
          <input
            type="text"
            value={challengeForm.name}
            onChange={(e) => updateChallengeForm({ name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 2024 Reading Challenge"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={challengeForm.description}
            onChange={(e) => updateChallengeForm({ description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your reading challenge..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Books</label>
            <input
              type="number"
              value={challengeForm.targetBooks}
              onChange={(e) => updateChallengeForm({ targetBooks: parseInt(e.target.value) || 0 })}
              min="1"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Number of books to read"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Pages</label>
            <input
              type="number"
              value={challengeForm.targetPages}
              onChange={(e) => updateChallengeForm({ targetPages: parseInt(e.target.value) || 0 })}
              min="1"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Number of pages to read"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
            <input
              type="date"
              value={challengeForm.startDate}
              onChange={(e) => updateChallengeForm({ startDate: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
            <input
              type="date"
              value={challengeForm.endDate}
              onChange={(e) => updateChallengeForm({ endDate: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={challengeForm.isPublic}
            onChange={(e) => updateChallengeForm({ isPublic: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-700">
            Make this challenge public (others can join)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Trophy className="w-4 h-4" />
          )}
          Create Challenge
        </button>
      </form>
    </div>
  )
}
