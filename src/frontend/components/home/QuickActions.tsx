import { PlayCircle, PlusCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Link 
          href="/timer" 
          className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <PlayCircle className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-700">Start Reading Timer</span>
        </Link>
        <Link 
          href="/books" 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <PlusCircle className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Add New Book</span>
        </Link>
        <Link 
          href="/friends" 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <UserPlus className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Find Friends</span>
        </Link>
      </div>
    </div>
  )
}
