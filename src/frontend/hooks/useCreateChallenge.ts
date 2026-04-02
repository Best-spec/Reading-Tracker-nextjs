'use client'

import { useState } from 'react'
import { api } from '@/service/api'

export interface ChallengeFormData {
  name: string
  description: string
  targetBooks: number
  targetPages: number
  startDate: string
  endDate: string
  isPublic: boolean
}

export function useCreateChallenge(showMessage: (type: 'success' | 'error', text: string) => void) {
  const [challengeForm, setChallengeForm] = useState<ChallengeFormData>({
    name: '',
    description: '',
    targetBooks: 0,
    targetPages: 0,
    startDate: '',
    endDate: '',
    isPublic: false
  })
  const [loading, setLoading] = useState(false)

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.createChallenge(challengeForm)
      
      showMessage('success', 'Reading challenge created successfully!')
      setChallengeForm({
        name: '',
        description: '',
        targetBooks: 0,
        targetPages: 0,
        startDate: '',
        endDate: '',
        isPublic: false
      })
    } catch (error) {
      showMessage('error', 'Failed to create challenge. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateChallengeForm = (data: Partial<ChallengeFormData>) => {
    setChallengeForm(prev => ({ ...prev, ...data }))
  }

  return {
    challengeForm,
    loading,
    handleCreateChallenge,
    updateChallengeForm
  }
}
