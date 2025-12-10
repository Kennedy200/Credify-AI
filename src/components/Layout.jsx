"use client"

import { useState } from "react"
import Sidebar from "./sidebar/Sidebar"

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={setIsSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 pt-[64px] lg:pt-0">
        {children}
      </div>
    </div>
  )
}
