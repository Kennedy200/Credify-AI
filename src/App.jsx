"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Dashboard from "./components/Dashboard"

import Header from "./components/Header"
import AboutSection from "./components/AboutSection"
import HowItWorks from "./components/HowItWorks"
import CredibilityShowcase from "./components/CredibilityShowcase"
import TrustedBy from "./components/TrustedBy"
import CallToAction from "./components/CallToAction"
import ContactSection from "./components/ContactSection"
import Footer from "./components/Footer"
import SignUpModal from "./components/SignUpPage"
import SignInModal from "./components/SignInPage"
import Result from "./components/Result"
import { AuthProvider } from "./context/AuthContext"
import AnalyzeContent from "./components/AnalyzeContent"
import HistoryPage from "./components/History"
import AnalysisDetail from "./components/AnalysisDetail"
import Settings from "./components/Settings"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 1500,
            style: {
              background: "#1f2937",
              color: "#10e956",
              fontWeight: "500",
              border: "1px solid #10e956",
            },
            success: {
              iconTheme: {
                primary: "#10e956",
                secondary: "#111",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "#111",
              },
            },
          }}
        />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <AboutSection />
                <HowItWorks />
                <CredibilityShowcase />
                <TrustedBy />
                <CallToAction />
                <ContactSection />
                <Footer />
              </>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<AnalyzeContent />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
          <Route path="/settings" element={<Settings />} />

          {/* ✅ Auth Pages */}
          <Route path="/login" element={<SignInModal />} />
          <Route path="/signup" element={<SignUpModal />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
