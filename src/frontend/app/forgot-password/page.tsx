'use client'

import { useState } from 'react'
import { BookOpen, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call for sending reset email
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
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

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[400px]">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset password</h2>
          
          {!isSubmitted ? (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-sm w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                      placeholder="you@example.com"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Check your email</h3>
              <p className="text-sm text-gray-600">
                We've sent a password reset link to <br/><span className="font-semibold text-gray-900">{email}</span>
              </p>
              <div className="pt-4">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Didn't receive the email? Click to try again.
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
