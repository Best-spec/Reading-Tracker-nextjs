import { Filter, Search } from 'lucide-react'
import { BookFilter } from '@/types/book'

interface BookFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  activeFilter: BookFilter
  onFilterChange: (filter: BookFilter) => void
}

export default function BookFilters({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange
}: BookFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700 font-medium">Filter:</span>
        </div>
        <div className="flex gap-2">
          {(['all', 'reading', 'finished', 'plan'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
