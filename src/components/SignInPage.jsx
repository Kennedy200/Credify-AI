"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../config/firebase"
import toast from "react-hot-toast"
import { useNavigate, Link } from "react-router-dom"
import { getFriendlyFirebaseError } from "../utils/firebaseErrorParser"

export default function SignInPage() {
  const navigate = useNavigate()
  const provider = new GoogleAuthProvider()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      console.log("Signed in user:", userCredential.user)
      toast.success("✅ Signed in successfully")
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
      const message = getFriendlyFirebaseError(error.code)
      toast.error(`❌ ${message}`)
    }

    setIsLoading(false)
  }

  const handleSocialLogin = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, provider)
      console.log("Google sign-in user:", result.user)
      toast.success("✅ Signed in with Google")
      navigate("/dashboard")
    } catch (error) {
      console.error("Google sign-in error:", error)
      const message = getFriendlyFirebaseError(error.code)
      toast.error(`❌ ${message}`)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side (Form) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-10 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo-image.png" alt="Credify Logo" className="w-8 h-8 rounded-full border border-gray-300" />
          <span className="text-xl font-bold text-gray-900">Credify</span>
        </div>

        {/* Header */}
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Log in or Sign up</h1>
          <p className="text-gray-500 mb-6">Get better data with Credify’s AI-powered verification system.</p>

          {/* Continue with Google */}
          <motion.button
            onClick={handleSocialLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 pr-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 disabled:bg-gray-400"
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                "Continue with Email"
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-gray-900 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side (Image) */}
      <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center p-10">
        <img src="/src/assets/login-illustration.png" alt="Credify Illustration" className="max-w-md w-full h-auto" />
      </div>
    </div>
  )
}
