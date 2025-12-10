"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

export default function Header() {
  const [showCookies, setShowCookies] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonMessage, setComingSoonMessage] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    const cookiesHandled = localStorage.getItem("cookies-handled")
    if (!cookiesHandled) {
      const timer = setTimeout(() => {
        setShowCookies(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".dropdown-container")) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdown])

  const handleCookiesAccept = () => {
    setShowCookies(false)
    localStorage.setItem("cookies-handled", "true")
    localStorage.setItem("cookies-accepted", "true")
  }

  const handleCookiesDecline = () => {
    setShowCookies(false)
    localStorage.setItem("cookies-handled", "true")
    localStorage.setItem("cookies-accepted", "false")
  }

  const showComingSoonPopup = (feature) => {
    setComingSoonMessage(`${feature} is coming soon!`)
    setShowComingSoon(true)
    setTimeout(() => {
      setShowComingSoon(false)
    }, 3000)
  }

  const handleWebAppClick = () => {
    window.location.href = "/"
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  return (
    <>
      {/* Coming Soon Popup */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            className="fixed top-4 right-4 z-50 bg-[#10e956] text-slate-900 px-6 py-3 rounded-lg shadow-lg border border-[#10e956]"
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-medium">{comingSoonMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-32 h-32 bg-[#10e956]/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-48 h-48 bg-[#10e956]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#10e956]/15 rounded-full blur-2xl"></div>
        </div>

        <div className="absolute inset-0 bg-slate-900/10" />

        {/* Header */}
        <header className="relative z-10">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <img src="/logo-image.png" alt="Credify AI" className="h-8 w-auto" />
                <span className="text-xl font-bold text-white tracking-tight">Credify AI</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {/* Platform Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => toggleDropdown("platform")}
                    className="flex items-center text-white hover:text-[#10e956] font-medium transition-colors"
                  >
                    Platform
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform ${openDropdown === "platform" ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdown === "platform" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700 py-2 z-50"
                      >
                        <button
                          onClick={handleWebAppClick}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-[#10e956]/20 hover:text-[#10e956] transition-colors"
                        >
                          Web App
                        </button>
                        <button
                          onClick={() => showComingSoonPopup("Browser Extension")}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-[#10e956]/20 hover:text-[#10e956] transition-colors"
                        >
                          Browser Extension
                        </button>
                        <button
                          onClick={() => showComingSoonPopup("API")}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-[#10e956]/20 hover:text-[#10e956] transition-colors"
                        >
                          API
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Solutions Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => toggleDropdown("solutions")}
                    className="flex items-center text-white hover:text-[#10e956] font-medium transition-colors"
                  >
                    Solutions
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform ${openDropdown === "solutions" ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdown === "solutions" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700 py-2 z-50"
                      >
                        <div className="px-4 py-2 text-white hover:bg-[#10e956]/20 hover:text-[#10e956] cursor-pointer transition-colors">
                          For Journalists
                        </div>
                        <div className="px-4 py-2 text-white hover:bg-[#10e956]/20 hover:text-[#10e956] cursor-pointer transition-colors">
                          For Researchers
                        </div>
                        <div className="px-4 py-2 text-white hover:bg-[#10e956]/20 hover:text-[#10e956] cursor-pointer transition-colors">
                          For Businesses
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Resources Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => toggleDropdown("resources")}
                    className="flex items-center text-white hover:text-[#10e956] font-medium transition-colors"
                  >
                    Resources
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform ${openDropdown === "resources" ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdown === "resources" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700 py-2 z-50"
                      >
                        <button
                          onClick={() => showComingSoonPopup("Documentation")}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-[#10e956]/20 hover:text-[#10e956] transition-colors"
                        >
                          Documentation
                        </button>
                        <button
                          onClick={() => showComingSoonPopup("Blog")}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-[#10e956]/20 hover:text-[#10e956] transition-colors"
                        >
                          Blog
                        </button>
                        <button
                          onClick={() => showComingSoonPopup("Help Center")}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-[#10e956]/20 hover:text-[#10e956] transition-colors"
                        >
                          Help Center
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a href="#" className="text-white hover:text-[#10e956] font-medium transition-colors">
                  Enterprise
                </a>
                <a href="#" className="text-white hover:text-[#10e956] font-medium transition-colors">
                  Pricing
                </a>
              </div>

              {/* Auth Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-[#10e956] font-medium transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#10e956] text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-[#0dd14a] transition-colors shadow-lg hover:shadow-xl hover:shadow-[#10e956]/20"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button onClick={toggleMobileMenu} className="text-white hover:text-[#10e956]">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-slate-800/95 backdrop-blur-sm border-t border-slate-700"
              >
                <div className="px-4 py-6 space-y-4">
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === "platform-mobile" ? null : "platform-mobile")}
                      className="flex items-center justify-between w-full text-left text-white font-medium"
                    >
                      Platform
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openDropdown === "platform-mobile" ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === "platform-mobile" && (
                      <div className="mt-2 pl-4 space-y-2">
                        <button onClick={handleWebAppClick} className="block text-white/80 hover:text-[#10e956]">
                          Web App
                        </button>
                        <button
                          onClick={() => showComingSoonPopup("Browser Extension")}
                          className="block text-white/80 hover:text-[#10e956]"
                        >
                          Browser Extension
                        </button>
                        <button
                          onClick={() => showComingSoonPopup("API")}
                          className="block text-white/80 hover:text-[#10e956]"
                        >
                          API
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === "solutions-mobile" ? null : "solutions-mobile")}
                      className="flex items-center justify-between w-full text-left text-white font-medium"
                    >
                      Solutions
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openDropdown === "solutions-mobile" ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === "solutions-mobile" && (
                      <div className="mt-2 pl-4 space-y-2">
                        <div className="text-white/80 hover:text-[#10e956]">For Journalists</div>
                        <div className="text-white/80 hover:text-[#10e956]">For Researchers</div>
                        <div className="text-white/80 hover:text-[#10e956]">For Businesses</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === "resources-mobile" ? null : "resources-mobile")}
                      className="flex items-center justify-between w-full text-left text-white font-medium"
                    >
                      Resources
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openDropdown === "resources-mobile" ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === "resources-mobile" && (
                      <div className="mt-2 pl-4 space-y-2">
                        <button
                          onClick={() => showComingSoonPopup("Documentation")}
                          className="block text-white/80 hover:text-[#10e956]"
                        >
                          Documentation
                        </button>
                        <button
                          onClick={() => showComingSoonPopup("Blog")}
                          className="block text-white/80 hover:text-[#10e956]"
                        >
                          Blog
                        </button>
                        <button
                          onClick={() => showComingSoonPopup("Help Center")}
                          className="block text-white/80 hover:text-[#10e956]"
                        >
                          Help Center
                        </button>
                      </div>
                    )}
                  </div>

                  <a href="#" className="block text-white hover:text-[#10e956] font-medium">
                    Enterprise
                  </a>
                  <a href="#" className="block text-white hover:text-[#10e956] font-medium">
                    Pricing
                  </a>

                  <div className="pt-4 border-t border-slate-700 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-left text-white hover:text-[#10e956] font-medium transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full bg-[#10e956] text-slate-900 px-4 py-2 rounded-lg font-medium text-center hover:bg-[#0dd14a]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center bg-[#10e956]/20 backdrop-blur-sm text-[#10e956] px-3 py-1 rounded-full text-sm font-medium mb-6 border border-[#10e956]/30">
                <span className="w-2 h-2 bg-[#10e956] rounded-full mr-2"></span>
                AI-Powered Fact Checking
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
                Verify Truth in Seconds
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Analyze online content instantly with our AI-powered credibility scoring. Get fact-checking insights and
                misinformation alerts to make informed decisions.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/signup"
                  className="bg-[#10e956] text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-[#0dd14a] transition-colors flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-[#10e956]/20"
                >
                  Start Analyzing
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-slate-400">Content Analyzed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">99.2%</div>
                  <div className="text-sm text-slate-400">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1000+</div>
                  <div className="text-sm text-slate-400">Happy Users</div>
                </div>
              </div>
            </div>

            {/* Right Video Preview - Dashboard Header */}
<div className="relative flex justify-center items-center">
  <motion.div
    className="w-full max-w-[600px] aspect-square bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-slate-700"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <video
      src="/Credify AI.mp4"
      className="w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
    />
  </motion.div>
</div>

          </div>
        </main>

        {/* Cookies Consent Bar */}
        {showCookies && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-300">
                  We use cookies to enhance your experience and analyze our traffic.
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCookiesDecline}
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleCookiesAccept}
                  className="bg-[#10e956] hover:bg-[#0dd14a] text-slate-900 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
