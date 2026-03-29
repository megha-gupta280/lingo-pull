"use client"
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { RepoSelector } from '@/components/RepoSelector'
import { FileScanner } from '@/components/FileScanner'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeRepo, setActiveRepo] = useState<string | null>(null) // Stores the repo to scan
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }

      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header / Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={user?.user_metadata?.avatar_url} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border border-gray-200"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user?.user_metadata?.full_name || 'Developer'}
              </h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>

        {/* Step 1: Repository Selection */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">1. Select Project</h2>
            <p className="text-gray-500">Choose a repository from your GitHub account.</p>
          </div>
          
          {/* We pass a function to RepoSelector to capture the repo name when saved */}
          <RepoSelector onRepoSelected={(fullName) => setActiveRepo(fullName)} />
        </div>

        {/* Step 2: File Scanning (Only shows after Step 1 is done) */}
        {activeRepo && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
             <FileScanner repoFullName={activeRepo} />
          </div>
        )}

      </div>
    </div>
  )
}