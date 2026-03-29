"use client"
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export function RepoSelector({ onRepoSelected }: { onRepoSelected: (name: string) => void }) {
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRepo, setSelectedRepo] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchRepos = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.provider_token

      if (token) {
        try {
          const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=8', {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await response.json()
          setRepos(Array.isArray(data) ? data : [])
        } catch (err) {
          console.error("Error fetching repos:", err)
        }
      }
      setLoading(false)
    }
    fetchRepos()
  }, [supabase])

  const handleConfirmSelection = async () => {
    if (!selectedRepo) return
    setIsSaving(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('projects')
      .insert([
        { 
          user_id: user?.id, 
          repo_name: selectedRepo.name, 
          github_url: selectedRepo.html_url 
        }
      ])

    if (error) {
      alert("Error saving project: " + error.message)
    } else {
        
      alert(`Success! ${selectedRepo.name} is now a LingoPull project.`)

      onRepoSelected(selectedRepo.full_name)
      // You can redirect the user here later
    }
    setIsSaving(false)
  }

  if (loading) return <div className="animate-pulse text-gray-400 py-10 text-center">Scanning your GitHub repositories...</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {repos.map((repo) => (
          <button 
            key={repo.id}
            onClick={() => setSelectedRepo(repo)}
            className={`flex items-center justify-between p-4 border rounded-2xl transition-all text-left group ${
              selectedRepo?.id === repo.id 
              ? 'border-black bg-gray-50 ring-2 ring-black/5' 
              : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            <div>
              <p className={`font-bold ${selectedRepo?.id === repo.id ? 'text-black' : 'text-gray-700'}`}>
                {repo.name}
              </p>
              <p className="text-xs text-gray-400">{repo.language || 'Web Project'}</p>
            </div>
            {selectedRepo?.id === repo.id && (
              <span className="h-2 w-2 bg-black rounded-full animate-pulse"></span>
            )}
          </button>
        ))}
      </div>

      {selectedRepo && (
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-mono font-bold text-black">{selectedRepo.name}</span>
          </p>
          <button 
            onClick={handleConfirmSelection}
            disabled={isSaving}
            className="px-6 py-2.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Confirm & Scan'}
          </button>
        </div>
      )}
    </div>
  )
}