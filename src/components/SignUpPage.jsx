"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../config/firebase"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function SignUpPage() {
  const navigate = useNavigate()
  const provider = new GoogleAuthProvider()

  const [formVisible, setFormVisible] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      toast.success("✅ Account created successfully")
      navigate("/dashboard")
    } catch (error) {
      toast.error("❌ Error creating account")
    }

    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      toast.success("✅ Signed up with Google")
      navigate("/dashboard")
    } catch (error) {
      toast.error("❌ Google sign-up failed")
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#3c3146] items-center justify-center relative">
        <div className="max-w-sm text-white text-center space-y-4 p-8">
          <h2 className="text-3xl font-bold">Join Credify</h2>
          <p className="text-sm text-gray-300">Secure, smart, and seamless credibility management at your fingertips.</p>
          <img src="/signup.png" alt="Credify illustration" className="rounded-xl shadow-lg" />
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="text-center">
            <img src="/src/assets/logo.jpg" alt="Credify Logo" className="mx-auto w-12 h-12 mb-3" />
            <h1 className="text-2xl font-bold text-gray-900">Sign up to Credify</h1>
            <p className="text-gray-500 text-sm">Manage your research smarter</p>
          </div>

          {/* Buttons */}
          {!formVisible && (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 
                  border border-gray-300 rounded-lg bg-white text-gray-700 
                  hover:bg-gray-50 transition disabled:opacity-50"
              >
                <span className="text-sm font-medium">Sign up with Google</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-400">OR</span>
                </div>
              </div>

              <button
                onClick={() => setFormVisible(true)}
                className="w-full bg-[#3c3146] text-white font-semibold py-3 px-6 rounded-lg 
                  hover:bg-[#2a222f] transition"
              >
                Sign up with Email
              </button>
            </>
          )}

          {/* Form */}
          {formVisible && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="off"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 
                  focus:outline-none focus:ring-2 focus:ring-[#3c3146] placeholder-gray-400"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 pr-12 
                    focus:outline-none focus:ring-2 focus:ring-[#3c3146] placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 pr-12 
                    focus:outline-none focus:ring-2 focus:ring-[#3c3146] placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3c3146] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#2a222f] transition disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Create my account"}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-[#3c3146] font-medium hover:underline">
              Log in
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
