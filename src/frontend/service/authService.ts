'use client'

import { authApi } from './api/auth'
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'

const TOKEN_KEY = 'readflow_token'
const USER_KEY = 'readflow_profile'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const result = await authApi.login(credentials)

    if (result.token) {
      localStorage.setItem(TOKEN_KEY, result.token)
    }

    if (result.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(result.user))
    }

    return result
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const result = await authApi.register(userData)

    if (result.token) {
      localStorage.setItem(TOKEN_KEY, result.token)
    }

    if (result.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(result.user))
    }

    return result
  },

  async logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  async checkAuth() {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      return null
    }

    try {
      await authApi.checkAuth()
      const user = localStorage.getItem(USER_KEY)
      return user ? JSON.parse(user) : null
    } catch (error) {
      // In development mode, if we have user data, treat it as valid
      if (error instanceof Error && (error.message.includes('Cannot connect to backend server') || error.message.includes('HTTP 404'))) {
        const userData = localStorage.getItem(USER_KEY)
        if (userData) {
          return JSON.parse(userData)
        }
      }
      
      this.logout()
      throw error
    }
  },

  isAuthenticated() {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(TOKEN_KEY)
  },

  getProfile() {
    if (typeof window === 'undefined') return null
    const profile = localStorage.getItem(USER_KEY)
    return profile ? JSON.parse(profile) : null
  }
}
