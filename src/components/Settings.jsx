"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Bell, Home, FileSearch, History, Settings as SettingsIcon, Menu, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { auth } from "../config/firebase"
import { useAuth } from "../context/AuthContext"
import { signOut } from "firebase/auth"
import ProfileSettings from "./settings/ProfileSettings"
import NotificationsSettings from "./settings/NotificationsSettings"
import PrivacySettings from "./settings/PrivacySettings"
import SecuritySettings from "./settings/SecuritySettings"
import BillingSettings from "./settings/BillingSettings"

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user === undefined) return
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

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/")
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const sidebarItems = [
    { icon: Home, label: "Overview", path: "/dashboard" },
    { icon: FileSearch, label: "Analyze Content", path: "/analyze" },
    { icon: History, label: "History", path: "/history" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ]

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: SettingsIcon },
    { id: "security", label: "Security", icon: SettingsIcon },
    { id: "billing", label: "Billing", icon: SettingsIcon },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />
      case "notifications":
        return <NotificationsSettings />
      case "privacy":
        return <PrivacySettings />
      case "security":
        return <SecuritySettings />
      case "billing":
        return <BillingSettings />
      default:
        return <ProfileSettings />
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
            <div className="w-8 h-8 bg-[#10e956] rounded-full flex items-center justify-center">
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

        {/* Settings Content */}
        <main className="flex-1 px-4 lg:px-6 pt-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-[#10e956] text-black"
                        : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Render Active Tab Content */}
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  )
}