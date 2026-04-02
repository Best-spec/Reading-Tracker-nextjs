'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string; rememberMe: boolean }) => Promise<any>
  isLoading: boolean
  error: string | null
  success: string | null
}

export function LoginForm({ onSubmit, isLoading, error, success }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
    } catch (err) {
      // Error is handled by the hook
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
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[400px]">
      <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">Welcome Back</h2>
      <p className="text-sm text-gray-500 mb-2 text-center tracking-wide">Social Reading Tracker</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="text-xs w-full px-4 py-2.5 rounded-xl border border-gray-100 focus:border-indigo-500 focus:outline-none transition-all"
            autoComplete="username"
            required
            placeholder="example@email.com"
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
              className="text-xs w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-100 focus:border-indigo-500 focus:outline-none transition-all"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
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
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer group">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="group-hover:text-indigo-600 transition-colors">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg border border-green-100 animate-in fade-in slide-in-from-top-1 duration-200">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-indigo-400 disabled:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
          {isLoading && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
        </button>
      </form>

      <div className="relative my-6 text-center">
        <span className="bg-white px-3 text-xs text-gray-400 relative z-10 uppercase font-medium tracking-widest">Or continue with</span>
        <div className="absolute inset-y-1/2 w-full border-t border-gray-100"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="py-2.5 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>Google</span>
        </button>
        <button
          type="button"
          className="py-2.5 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>Facebook</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-bold">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  )
}
