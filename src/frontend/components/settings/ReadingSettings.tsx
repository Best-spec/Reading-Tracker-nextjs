import { BookOpen, Save } from 'lucide-react'
import { ReadingPreferences, ReadingSettingsProps } from '@/types/settings'

export const ReadingSettings = ({
  readingPrefs,
  onUpdateField,
  onToggleGenre,
  onSave,
  saving
}: ReadingSettingsProps) => {
  const genres = [
    'Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Thriller', 
    'Non-Fiction', 'Biography', 'History', 'Self-Help', 'Young Adult'
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Reading Preferences
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Goal (minutes)</label>
          <input
            type="number"
            value={readingPrefs.dailyGoal}
            onChange={(e) => onUpdateField('dailyGoal', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Genres</label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {genres.map(genre => (
              <label key={genre} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={readingPrefs.preferredGenres.includes(genre)}
                  onChange={() => onToggleGenre(genre)}
                  className="rounded border-gray-300"
                /> {genre}
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Preferences
        </button>
      </div>
    </div>
  )
}
