"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Bell, Home, FileSearch, History, FileText, Settings, Menu, CheckCircle } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { db, auth } from "../config/firebase"
import { doc, collection, addDoc, serverTimestamp, getDoc, setDoc } from "firebase/firestore"
import { useAuth } from "../context/AuthContext"
import { signOut } from "firebase/auth"

export default function AnalyzeContent() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [firstName, setFirstName] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Redirect or set firstName when user is loaded
  useEffect(() => {
    if (user === undefined) return // still loading auth
    if (!user) {
      navigate("/")
    } else {
      if (user.displayName) {
        setFirstName(user.displayName.split(" ")[0])
      } else if (user.email) {
        setFirstName(user.email.split("@")[0])
      }
    }
  }, [user, navigate])

  // Prefill text if coming from "Re-analyze"
  useEffect(() => {
    if (location.state?.text) {
      setText(location.state.text)
    }
  }, [location.state])

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/")
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const sidebarItems = [
    { icon: Home, label: "Overview", path: "/dashboard" },
    { icon: FileSearch, label: "Analyze Content", path: "/analyze" },
    { icon: History, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  const MAX_INPUT_CHARS = 4000

  // Utility: Clean markdown formatting
  const cleanText = (analysisText) => {
    return analysisText
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold (**text**)
      .replace(/\[\d+\]/g, "") // Remove citations like [1]
      .trim()
  }

  // --- Verdict Logic Override ---
  const getFinalVerdict = (score) => {
    if (typeof score !== "number" || isNaN(score)) return "Error"
    return score >= 90 ? "Credible" : "Not Credible"
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return setError("Please enter some content.")
    if (!user?.uid) return setError("You must be logged in to analyze content.")

    try {
      setLoading(true)
      setError("")

      let safeText = text
      if (text.length > MAX_INPUT_CHARS) {
        safeText = text.slice(0, MAX_INPUT_CHARS) + "\n\n[Truncated for analysis...]"
      }

      // --- Gemini API call ---
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" +
          import.meta.env.VITE_GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `
Analyze the following content for credibility.
Return ONLY a single, valid JSON object in this exact format:
{
  "summary": "2–3 sentence summary of the content.",
  "analysis": "Step-by-step detailed reasoning with clear numbering (1., 2., 3., etc.) and line breaks for readability.",
  "score": number (0–100),
  "verdict": "Credible" or "Not Credible",
  "category": "Politics | Health | Technology | Entertainment | Finance | Science | Other"
}

⚠️ Important: In the "analysis" field, always format the reasoning as a neatly spaced, numbered list. Example:
"1. Source: ...
2. Content Type: ...
3. Tone and Bias: ...
4. Fact-Checking: ...
5. Overall: ..."

Content to analyze:
${safeText}
              `,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 900,
              temperature: 0.2,
            },
          }),
        }
      )

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("The AI service is currently busy. Please try again in a few moments.")
        }
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const aiResult = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""

      let parsed
      try {
        const jsonMatch = aiResult.match(/{[\s\S]*}/)
        if (!jsonMatch) throw new Error("No JSON object found in AI result")
        parsed = JSON.parse(jsonMatch[0])
      } catch (e) {
        console.error("Failed to parse AI response:", e, aiResult)
        parsed = {
          summary: "AI did not return a proper summary.",
          analysis: aiResult || "The AI response was empty.",
          score: 0,
          verdict: "Error",
          category: "Uncategorized",
        }
      }

      // --- Apply Final Verdict Rule ---
      const finalScore = parsed.score ?? 0
      const computedVerdict = getFinalVerdict(finalScore)

      // --- Save in Firestore for history ---
      const historyRef = collection(doc(db, "users", user.uid), "history")
      await addDoc(historyRef, {
        text: safeText,
        summary: cleanText(parsed.summary || "No summary generated."),
        analysis: cleanText(parsed.analysis || "No analysis generated."),
        score: finalScore,
        verdict: computedVerdict,
        category: parsed.category || "Uncategorized",
        date: serverTimestamp(),
      })

      // --- Update user counters in main document ---
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const currentTotalScans = userData.totalScans || 0
        const currentSuspicious = userData.suspiciousCount || 0
        const currentVerified = userData.verifiedSources || 0
        const currentAverageScore = userData.averageScore || 0

        // ADD THIS DEBUG LOG
  console.log("📊 BEFORE UPDATE:", {
    currentTotalScans,
    currentSuspicious,
    currentVerified,
    currentAverageScore,
    finalScore,
    computedVerdict
  })

        // Calculate new average score
        const totalScore = currentAverageScore * currentTotalScans
        const newTotalScans = currentTotalScans + 1
        const newTotalScore = totalScore + finalScore
        const newAverageScore = Math.round(newTotalScore / newTotalScans)

        // Prepare updates based on verdict
        const updates = {
          totalScans: newTotalScans,
          averageScore: newAverageScore,
          suspiciousCount: computedVerdict === "Credible" ? currentSuspicious : currentSuspicious + 1,
          verifiedSources: computedVerdict === "Credible" ? currentVerified + 1 : currentVerified,
          lastUpdated: serverTimestamp(),
        }

        // Use setDoc with merge to create fields if they don't exist
        await setDoc(userDocRef, updates, { merge: true })
      } else {
        // If user document doesn't exist, create it with initial values
        await setDoc(userDocRef, {
          totalScans: 1,
          averageScore: finalScore,
          suspiciousCount: computedVerdict === "Credible" ? 0 : 1,
          verifiedSources: computedVerdict === "Credible" ? 1 : 0,
          lastUpdated: serverTimestamp(),
        })
      }

      // --- Navigate to result page with state ---
      navigate("/result", {
        state: {
          text: safeText,
          summary: cleanText(parsed.summary || "No summary generated."),
          analysis: cleanText(parsed.analysis || "No analysis generated."),
          score: finalScore,
          verdict: computedVerdict,
          category: parsed.category || "Uncategorized",
        },
      })
    } catch (err) {
      console.error("Error analyzing content:", err)
      setError(`Failed to analyze: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading user...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 fixed top-0 left-0 right-0 z-50">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-white">Credify AI</span>
        <div className="w-8 h-8 bg-[#10e956] rounded-full flex items-center justify-center font-bold text-black text-sm">
          {firstName?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static top-0 inset-y-0 left-0 z-40 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        initial={false}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src="/logo-image.png"
                alt="Credify AI Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
            </div>
            <span className="text-xl font-bold">Credify AI</span>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const IconComp = item.icon
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        navigate(item.path)
                        setIsSidebarOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        window.location.pathname === item.path
                          ? "bg-[#10e956]/20 text-[#10e956] border border-[#10e956]/30"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </motion.aside>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={toggleSidebar} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pt-[64px] lg:pt-0">
        {/* Desktop Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-4 hidden lg:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20 w-64 lg:w-80"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-700">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#10e956] rounded-full flex items-center justify-center font-bold text-black text-sm">
                  {firstName?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block font-medium capitalize">{firstName}</span>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-1 bg-gray-700 text-white text-sm rounded hover:bg-red-500 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 lg:px-6 pt-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Analyze Content</h1>
              <p className="text-gray-400">Paste a link or text to analyze its credibility</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a URL or write your content here (max 100,000 characters)..."
                maxLength={100000}
                className="w-full h-[400px] lg:h-[500px] p-4 rounded bg-gray-700 border border-gray-600 text-sm focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20 resize-none"
              />
              {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">{text.length.toLocaleString()} / 100,000 characters</span>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="px-8 py-3 rounded-lg bg-[#12ff5a] text-black font-semibold hover:bg-[#0ef052] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#12ff5a]/25"
                >
                  {loading ? "Analyzing..." : "Analyze Content"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}