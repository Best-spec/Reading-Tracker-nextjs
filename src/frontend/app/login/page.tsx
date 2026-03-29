'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/service/api'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          // No token, stay on login page
          return
        }

        // Verify token with API
        await api.checkAuth()
        // Token is valid, redirect to home
        router.push('/home')
      } catch (error) {
        console.error('Auth check failed:', error)
        // Check if it's a 404 or connection error (development mode)
        if (error instanceof Error && (error.message.includes('Cannot connect to backend server') || error.message.includes('HTTP 404'))) {
          // In development mode, if we have user data, redirect to home
          const userData = localStorage.getItem('readflow_profile')
          if (userData) {
            router.push('/home')
            return
          }
        }
        // Invalid token or other error, clear it and stay on login page
        localStorage.removeItem('readflow_token')
        localStorage.removeItem('readflow_profile')
      }
    }
    
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await api.login({
        email: formData.email,
        password: formData.password
      })

      console.log('Login result:', result)
      setSuccess('เข้าสู่ระบบสำเร็จ!')
      
      // Store user data if returned
      if (result.user) {
        localStorage.setItem('readflow_profile', JSON.stringify(result.user))
      }
      
      // Store token if returned
      if (result.token) {
        localStorage.setItem('readflow_token', result.token)
      }
      
      // Redirect to home after delay
      setTimeout(() => {
        router.push('/home')
      }, 1000)
      
    } catch (err) {
      console.error('Error during login:', err)
      
      // For development: allow login with any credentials when backend is not available
      if (err instanceof Error && err.message.includes('Cannot connect to backend server')) {
        // Create mock user data for development
        const mockUser = {
          id: '1',
          username: formData.email.split('@')[0],
          email: formData.email,
          displayName: formData.email.split('@')[0],
          bio: 'Development user',
          joinDate: new Date().toISOString().split('T')[0]
        }
        
        const mockToken = 'dev-token-' + Date.now()
        
        // Store mock data
        localStorage.setItem('readflow_profile', JSON.stringify(mockUser))
        localStorage.setItem('readflow_token', mockToken)
        
        setSuccess('เข้าสู่ระบบสำเร็จ! (Development Mode)')
        
        // Redirect to home after delay
        setTimeout(() => {
          router.push('/home')
        }, 1000)
      } else {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row items-center justify-center gap-20 w-full max-w-5xl">
        
        {/* Brand Section */}
        <div className="hidden md:flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-6 shadow-xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">ReadFlow</h1>
          <p className="text-white/80 mt-2 text-lg">Social Reading Tracker</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[400px]">
          <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-2 text-center tracking-wide">Social Reading Tracker</p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="text-xs w-full px-4 py-2 rounded-xl border border-gray-100 focus:border-indigo-500 focus:outline-none"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="text-xs w-full px-4 py-2 pr-10 rounded-xl border border-gray-100 focus:border-indigo-500 focus:outline-none"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                Remember me
              </label>
              <Link href="#" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
            </button>
          </form>

          <div className="relative my-2 text-center">
            <span className="bg-white px-2 text-sm text-gray-400 relative z-10 uppercase">Or</span>
            <div className="absolute inset-y-1/2 w-full border-t border-gray-50"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="py-2 border border-gray-100 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Google
            </button>
            <button
              type="button"
              className="py-2 border border-gray-100 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Facebook
            </button>
          </div>

          <div className="mt-2 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="#" className="text-sm text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
