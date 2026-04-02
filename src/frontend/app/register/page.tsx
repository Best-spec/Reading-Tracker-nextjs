'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { RegisterHeader } from '@/components/auth/RegisterHeader'

export default function RegisterPage() {
  const { checkAuthStatus } = useAuth()

  // Check authentication on page load
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterHeader />
        <RegisterForm />
      </div>
    </div>
  )
}
