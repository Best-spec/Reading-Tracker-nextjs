'use client'

import { BookOpen } from 'lucide-react'

export function RegisterHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
        <BookOpen className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-white">ReadFlow</h1>
      <p className="text-white/80 mt-2">Join our reading community</p>
    </div>
  )
}
