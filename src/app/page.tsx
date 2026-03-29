import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-6">
      {/* Hero Section */}
      <main className="max-w-3xl text-center space-y-8">
        <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-tight text-blue-600 bg-blue-50 rounded-full">
          Powered by AI & GitHub Actions
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
          Translate your Apps <br />
          <span className="text-gray-400">with a single PR.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
          LingoPull scans your repository, translates your JSON files using AI, 
          and opens a Pull Request automatically. Stop copy-pasting, start shipping.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
          >
            Get Started for Free
          </Link>
          <a 
            href="https://github.com" 
            target="_blank"
            className="w-full sm:w-auto px-8 py-4 bg-white text-black border border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            View on GitHub
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-8 text-sm text-gray-400">
        © 2026 LingoPull AI. Built for developers.
      </footer>
    </div>
  );
}