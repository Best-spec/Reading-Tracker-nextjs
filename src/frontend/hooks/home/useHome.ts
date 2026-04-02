'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/service/api'
import { homeService } from '@/service/homeService'
import { Book } from '@/types/book'
import { FriendActivity } from '@/types/friend'
import { UserProfile } from '@/types/user'
import { HomeStats } from '@/types/home'

export function useHome() {
  const [stats, setStats] = useState<HomeStats>({
    totalBooks: 0,
    totalHours: 0,
    totalPages: 0,
    currentStreak: 0,
    booksChange: '+0 this week'
  })
  const [books, setBooks] = useState<Book[]>([])
  const [friendActivity, setFriendActivity] = useState<FriendActivity[]>([])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadData = useCallback(async () => {
    try {
      const data = await homeService.getHomeData()
      setStats(data.stats as any)
      setBooks(data.books)
      setFriendActivity(data.friendActivity)
      
      // If profile is returned, update it. Otherwise fallback to localStorage
      if (data.profile) {
        setUser(data.profile)
      } else {
        const storedProfile = localStorage.getItem('readflow_profile')
        if (storedProfile) {
          setUser(JSON.parse(storedProfile))
        }
      }
    } catch (error) {
      // Errors handled via service/api defaults
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('readflow_token')
        if (!token) {
          router.push('/login')
          return
        }

        // Verify token
        await api.checkAuth()
        
        // Load data if auth is valid
        await loadData()
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('readflow_token')
        localStorage.removeItem('readflow_profile')
        router.push('/login')
      }
    }

    init()
  }, [router, loadData])

  return {
    stats,
    books,
    friendActivity,
    user,
    loading,
    refresh: loadData
  }
}
