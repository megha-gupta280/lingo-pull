"use client"
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export function FileScanner({ repoFullName }: { repoFullName: string }) {
  const [files, setFiles] = useState<any[]>([])
  const [scanning, setScanning] = useState(false)
  const [hasScanned, setHasScanned] = useState(false) // New state to track if a scan was attempted

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

const scanRepo = async () => {
  setScanning(true);
  setHasScanned(false);
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.provider_token;

  try {
    // We use ?recursive=1 to look inside ALL folders
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/git/trees/main?recursive=1`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();

    if (data.tree) {
      const jsonFiles = data.tree.filter((file: any) => 
        file.path.endsWith('.json') && 
        !file.path.includes('package') && 
        !file.path.includes('tsconfig') &&
        !file.path.includes('node_modules')
      );
      setFiles(jsonFiles);
    }
  } catch (err) {
    console.error("Scan failed", err);
  }
  setScanning(false);
  setHasScanned(true);
};

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-gray-800">2. Locate Translation Files</h3>
          <p className="text-xs text-gray-500">Scanning: {repoFullName}</p>
        </div>
        <button 
          onClick={scanRepo}
          disabled={scanning}
          className="px-5 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all"
        >
          {scanning ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>

      {/* Case 1: Files found */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map(file => (
            <li key={file.path} className="flex items-center gap-2 text-sm text-gray-600 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
              <span className="text-blue-500 font-bold">JSON</span>
              <span className="font-medium text-gray-800">{file.path}</span>
              <button className="ml-auto text-xs bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800">
                Select
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Case 2: Scan finished but NO files found */}
      {hasScanned && files.length === 0 && !scanning && (
        <div className="text-center py-8 px-4 bg-white rounded-2xl border border-dashed border-gray-200">
          <span className="text-3xl">🔍</span>
          <h4 className="mt-2 font-semibold text-gray-900">No translation files found</h4>
          <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
            We couldn't find any .json files in the root folder. Make sure your translation files are not in a sub-folder.
          </p>
        </div>
      )}

      {/* Case 3: Initial State (Before scanning) */}
      {!hasScanned && !scanning && (
        <p className="text-sm text-gray-400 italic text-center py-4">
          Click scan to look for translation keys in this repository.
        </p>
      )}
    </div>
  )
}