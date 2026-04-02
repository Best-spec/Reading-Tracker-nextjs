'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/service/authService'
import { RegisterFormData } from '@/types/auth'

export const useRegister = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    terms: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await authService.register({
        email: formData.email,
        username: formData.username,
        password: formData.password
      })

      console.log('Registration result:', result)
      setSuccess('สมัครสมาชิกสำเร็จ!')
      
      // Redirect to home after delay (since authService handles storing token/profile)
      setTimeout(() => {
        router.push('/home')
      }, 1000)
      
    } catch (err: any) {
      console.error('Error during registration:', err)
      
      // Development mode fallback handled in authApi, 
      // but we need to handle the specific error message logic here if needed
      if (err.message?.includes('Cannot connect to backend server')) {
        setSuccess('สมัครสมาชิกสำเร็จ! (Development Mode)')
        setTimeout(() => {
          router.push('/home')
        }, 1000)
      } else {
        setError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    isLoading,
    error,
    success,
    showPassword,
    handleInputChange,
    togglePasswordVisibility,
    handleSubmit
  }
}
