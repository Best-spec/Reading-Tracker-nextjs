'use client'

import { useEffect } from 'react'
import { BookOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const { isLoading, error, success, login, checkAuthStatus } = useAuth()

  // Check authentication on page load
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row items-center justify-center gap-20 w-full max-w-5xl">
        
        {/* Brand Section */}
        <div className="hidden md:flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-6 shadow-xl backdrop-blur-sm border border-white/20">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">ReadFlow</h1>
          <p className="text-indigo-100 mt-3 text-lg font-medium">Elevate Your Reading Experience</p>
          <div className="mt-8 flex gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-full border border-white/10 text-white text-xs font-semibold backdrop-blur-md">
              Track Reading
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-full border border-white/10 text-white text-xs font-semibold backdrop-blur-md">
              Connect Friends
            </div>
          </div>
        </div>

        {/* Login Form Component */}
        <LoginForm 
          onSubmit={login} 
          isLoading={isLoading} 
          error={error} 
          success={success} 
        />
      </div>
    </div>
  )
}
