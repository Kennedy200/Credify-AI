"use client"

import { motion } from "framer-motion"
import {
  Home,
  FileSearch,
  FileText,
  Settings,
  CheckCircle,
} from "lucide-react"
import { History as HistoryIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const navigate = useNavigate()

  const sidebarItems = [
    { icon: Home, label: "Overview", path: "/dashboard" },
    { icon: FileSearch, label: "Analyze Content", path: "/analyze" },
    { icon: HistoryIcon, label: "History", path: "/history" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <motion.aside
      className={`fixed lg:static top-0 inset-y-0 left-0 z-40 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      initial={false}
    >
      <div className="flex flex-col h-full pt-16 lg:pt-0">
        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-gray-900" />
          </div>
          <span className="text-xl font-bold text-white">Credify AI</span>
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
                      toggleSidebar(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      window.location.pathname === item.path
                        ? "bg-gray-700 text-white border border-gray-600"
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
  )
}
