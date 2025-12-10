"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Bell,
  Home,
  FileSearch,
  Settings,
  Menu,
  BarChart3,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { History as HistoryIcon } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth, db } from "../config/firebase"
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore"

// 🔹 NewsAPI details
const NEWS_API_KEY = "f4ea77dafdff42dab2380db2c7ad7532"
const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newsNotifications, setNewsNotifications] = useState([])
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  // Handle redirect only after auth finishes loading
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate("/")
      return
    }

    if (user.displayName) {
      setFirstName(user.displayName.split(" ")[0])
    } else if (user.email) {
      setFirstName(user.email.split("@")[0])
    }
  }, [user, authLoading, navigate])

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/")
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  // Fetch dashboard data from USER DOCUMENT (not history subcollection)
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading || !user) return
      setLoading(true)

      try {
        // 🔥 Read from main user document
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()

          // Get stats from user document
          const totalScans = userData.totalScans || 0
          const averageScore = userData.averageScore || 0
          const suspiciousCount = userData.suspiciousCount || 0
          const verifiedSources = userData.verifiedSources || 0

          // Get recent analysis from history subcollection
          const historyRef = collection(db, "users", user.uid, "history")
          const q = query(historyRef, orderBy("date", "desc"), limit(5))
          const snapshot = await getDocs(q)

          const recentAnalysis = []
          snapshot.forEach((doc) => {
            const data = doc.data()
            recentAnalysis.push({
              title: data.text?.substring(0, 100) + "..." || "Analysis",
              url: data.text || "#",
              date: data.date?.toDate().toLocaleString() || "Unknown date",
              score: data.score,
              status: data.verdict,
              statusType: data.verdict === "Credible" ? "verified" : "suspicious",
            })
          })

          setDashboardData({
            totalScans,
            averageScore,
            suspiciousCount,
            verifiedSources,
            recentAnalysis,
            notifications: [],
          })
        } else {
          // No user document yet
          setDashboardData({
            totalScans: 0,
            averageScore: 0,
            suspiciousCount: 0,
            verifiedSources: 0,
            recentAnalysis: [],
            notifications: [],
          })
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        setDashboardData({
          totalScans: 0,
          averageScore: 0,
          suspiciousCount: 0,
          verifiedSources: 0,
          recentAnalysis: [],
          notifications: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, authLoading])

  // 🔹 Fetch live news every 5 minutes
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(NEWS_URL)
        const data = await res.json()
        if (data.articles) {
          setNewsNotifications(
            data.articles.slice(0, 5).map((article) => ({
              title: article.title,
              description: article.source.name,
              time: new Date(article.publishedAt).toLocaleTimeString(),
              url: article.url,
            }))
          )
        }
      } catch (err) {
        console.error("Failed to fetch news:", err)
      }
    }

    fetchNews()
    const interval = setInterval(fetchNews, 5 * 60 * 1000) // refresh every 5 mins
    return () => clearInterval(interval)
  }, [])

  const sidebarItems = [
    { icon: Home, label: "Overview", path: "/dashboard" },
    { icon: FileSearch, label: "Analyze Content", path: "/analyze" },
    { icon: HistoryIcon, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  const isEmptyOverview =
    dashboardData &&
    dashboardData.totalScans === 0 &&
    dashboardData.averageScore === 0 &&
    dashboardData.suspiciousCount === 0 &&
    dashboardData.verifiedSources === 0 &&
    dashboardData.recentAnalysis.length === 0 &&
    dashboardData.notifications.length === 0

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
                const IconComponent = item.icon
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
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </motion.aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pt-[64px] lg:pt-0">
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
              </button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#10e956] rounded-full flex items-center justify-center font-bold text-black text-sm">
                  {firstName?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block font-medium capitalize">{firstName}</span>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-1 bg-gray-700 text-white text-sm rounded hover:bg-red-500 hover:text-white transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-6 pt-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
              <p className="text-gray-400">Here's what's happening with your content analysis</p>
            </div>

            {(authLoading || loading) ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-[#10e956] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : isEmptyOverview ? (
              <div className="text-center py-20">
                <h2 className="text-xl font-semibold">Whenever you're ready!</h2>
                <p className="text-gray-400 mt-2">
                  Start by analyzing your first document to see results here.
                </p>
              </div>
            ) : (
              <>
                {/* Overview Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[{
                    icon: Search, title: "Total Scans", value: dashboardData.totalScans ?? 0, change: "+12%",
                  }, {
                    icon: BarChart3, title: "Average Score", value: `${dashboardData.averageScore ?? 0}%`, change: "+5%",
                  }, {
                    icon: AlertTriangle, title: "Suspicious Content", value: dashboardData.suspiciousCount ?? 0, change: "+3%",
                  }, {
                    icon: CheckCircle, title: "Verified Sources", value: dashboardData.verifiedSources ?? 0, change: "+8%",
                  }].map((stat) => {
                    const Icon = stat.icon
                    return (
                      <div key={stat.title} className="bg-gray-800 p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                          <Icon className="w-6 h-6 text-[#10e956]" />
                          <span className="text-sm text-green-400">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.title}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Recent Analysis */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Recent Analysis</h2>
                  <div className="space-y-4">
                    {dashboardData.recentAnalysis.length > 0 ? (
                      dashboardData.recentAnalysis.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-lg font-medium text-white truncate">
                              {item.title ?? "Untitled"}
                            </p>
                            <p className="text-sm text-gray-400">{item.date ?? "Unknown date"}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 sm:mt-0">
                            <span className="text-sm font-semibold text-white">{item.score ?? "-"}%</span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                item.statusType === "verified" ? "bg-green-600" : "bg-red-600"
                              }`}
                            >
                              {item.status ?? "Unknown"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No recent analysis found.</p>
                    )}
                  </div>
                </div>

                {/* Live News */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Live News</h2>
                  <div className="space-y-3">
                    {newsNotifications.length > 0 ? (
                      newsNotifications.map((note, idx) => (
                        <a
                          key={idx}
                          href={note.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition"
                        >
                          <div className="flex justify-between items-center">
                            <div className="min-w-0 flex-1 mr-4">
                              <h3 className="font-medium truncate">{note.title}</h3>
                              <p className="text-sm text-gray-400">{note.description}</p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{note.time}</span>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-400">Fetching latest news...</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}