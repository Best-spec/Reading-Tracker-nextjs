'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/service/authService'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const login = useCallback(async (credentials: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await authService.login(credentials)
      setSuccess('เข้าสู่ระบบสำเร็จ!')
      
      // Redirect to home after delay
      setTimeout(() => {
        router.push('/home')
      }, 1000)
      
      return result
    } catch (err) {
      console.error('Error during login:', err)
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const checkAuthStatus = useCallback(async () => {
    try {
      const user = await authService.checkAuth()
      if (user) {
        router.push('/home')
      }
    } catch (error) {
      console.error('Initial auth check failed:', error)
    }
  }, [router])

  const logout = useCallback(() => {
    authService.logout()
    router.push('/login')
  }, [router])

  return {
    isLoading,
    error,
    success,
    login,
    logout,
    checkAuthStatus,
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getProfile()
  }
}
