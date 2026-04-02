'use client'

import { useState, useEffect } from 'react'
import { Users, X, Check, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCreateBook } from '@/hooks/useCreateBook'
import { useCreateChallenge } from '@/hooks/useCreateChallenge'
import { BookForm } from '@/components/create/BookForm'
import { ChallengeForm } from '@/components/create/ChallengeForm'
import { CreateTabNavigation } from '@/components/create/CreateTabNavigation'

type TabType = 'book' | 'challenge' | 'group'

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<TabType>('book')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('readflow_token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const {
    bookForm,
    loading: bookLoading,
    searchResults,
    searching,
    searchBook,
    selectSearchResult,
    handleCreateBook,
    updateBookForm
  } = useCreateBook(showMessage)

  const {
    challengeForm,
    loading: challengeLoading,
    handleCreateChallenge,
    updateChallengeForm
  } = useCreateChallenge(showMessage)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Something New</h2>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <CreateTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Forms based on active tab */}
      {activeTab === 'book' && (
        <BookForm
          bookForm={bookForm}
          loading={bookLoading}
          searching={searching}
          searchResults={searchResults}
          updateBookForm={updateBookForm}
          searchBook={searchBook}
          selectSearchResult={selectSearchResult}
          handleCreateBook={handleCreateBook}
        />
      )}

      {activeTab === 'challenge' && (
        <ChallengeForm
          challengeForm={challengeForm}
          loading={challengeLoading}
          updateChallengeForm={updateChallengeForm}
          handleCreateChallenge={handleCreateChallenge}
        />
      )}

      {activeTab === 'group' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Group creation is available on the Groups page</p>
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go to Groups
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
