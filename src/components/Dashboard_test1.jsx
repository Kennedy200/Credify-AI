// Dashboard.jsx

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../config/firebase"
import { signOut } from "firebase/auth"
import toast from "react-hot-toast"
import { Menu, X } from "lucide-react"
import { fetchCredibilityResult } from "../utils/ai.js"

export default function Dashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Add to your Dashboard component state
    const [article, setArticle] = useState("")
    const [loading, setLoading] = useState(false)

  useEffect(() => {
    const displayName = localStorage.getItem("userDisplayName") || "User"
    const cleanName = displayName.split(/[@.\s]/)[0]
    const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
    setUserName(capitalized)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("userDisplayName")
      toast.success("✅ Logged out successfully")
      navigate("/")
    } catch (error) {
      toast.error("❌ Error logging out")
      console.error(error)
    }
  }
  
const handleRunAI = async () => {
  if (!article.trim()) {
    toast.error("Please paste an article first.")
    return
  }

  setLoading(true)
  const result = await fetchCredibilityResult(article)
  setLoading(false)

  // Save the result to sessionStorage and navigate
  sessionStorage.setItem("aiResult", result)
  navigate("/result")

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button
            className="text-white lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <h1 className="text-xl lg:text-2xl font-bold text-green-400">Credify AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm sm:text-base">
            Welcome back, {userName} 👋
          </span>
          <button
            onClick={handleLogout}
            className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition-all text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:relative z-30 top-[72px] left-0 lg:top-0 h-full lg:h-auto bg-gray-800 border-r border-gray-700 w-64 p-4 transition-transform duration-300 ease-in-out transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">AI Tools</h2>
          <ul className="space-y-3 text-base font-medium">
            <li className="hover:text-green-400 cursor-pointer">Credibility Analyzer</li>
            <li className="hover:text-green-400 cursor-pointer">Article Summarizer</li>
            <li className="hover:text-green-400 cursor-pointer">Insight Generator</li>
            <li className="hover:text-green-400 cursor-pointer">Simplify Language</li>
            <li className="hover:text-green-400 cursor-pointer">Headline Suggestions</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <label className="block text-lg font-medium mb-2">
              Paste article or URL:
            </label>
                            <textarea
  value={article}
  onChange={(e) => setArticle(e.target.value)}
  rows={16}
  maxLength={100000}
  placeholder="Paste your article or URL here..."
  className="w-full p-4 bg-gray-900 border border-green-400 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
/>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <button
  onClick={handleRunAI}
  disabled={loading}
  className="bg-green-500 text-black font-semibold px-6 py-2 rounded hover:bg-green-600 transition-all"
>
  {loading ? "Analyzing..." : "Run AI"}
</button>

              <button
                onClick={() => setInput("")}
                className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition-all"
              >
                Clear
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
    }
}
// CODE FOR PRACTICING 