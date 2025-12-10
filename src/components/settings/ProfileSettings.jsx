import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebase"

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  const [isLoading, setIsLoading] = useState(true)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    bio: "",
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    bio: "",
  })

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  const loadUserProfile = async () => {
    if (!user?.uid) return
    setIsLoading(true)
    
    try {
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          company: data.company || "",
          jobTitle: data.jobTitle || "",
          bio: data.bio || "",
        })
      } else {
        // If user document doesn't have profile data yet, initialize with email
        setProfileData(prev => ({
          ...prev,
          email: user.email || ""
        }))
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      showToastMessage("Failed to load profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    if (!phone) return true
    const phoneRegex = /^[\d\s\-+()]{10,}$/
    return phoneRegex.test(phone)
  }

  const validateField = (field, value) => {
    let error = ""

    switch (field) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required"
        } else if (value.trim().length < 2) {
          error = "First name must be at least 2 characters"
        } else if (value.trim().length > 50) {
          error = "First name must be less than 50 characters"
        }
        break

      case "lastName":
        if (!value.trim()) {
          error = "Last name is required"
        } else if (value.trim().length < 2) {
          error = "Last name must be at least 2 characters"
        } else if (value.trim().length > 50) {
          error = "Last name must be less than 50 characters"
        }
        break

      case "email":
        if (!value.trim()) {
          error = "Email is required"
        } else if (!validateEmail(value)) {
          error = "Please enter a valid email address"
        }
        break

      case "phone":
        if (value && !validatePhone(value)) {
          error = "Please enter a valid phone number"
        }
        break

      case "company":
        if (value.trim().length > 100) {
          error = "Company name must be less than 100 characters"
        }
        break

      case "jobTitle":
        if (value.trim().length > 100) {
          error = "Job title must be less than 100 characters"
        }
        break

      case "bio":
        if (value.trim().length > 500) {
          error = "Bio must be less than 500 characters"
        }
        break

      default:
        break
    }

    return error
  }

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleBlur = (field) => {
    const error = validateField(field, profileData[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const validateAllFields = () => {
    const newErrors = {}
    let isValid = true

    // Only validate fields that exist in profileData
    const fieldsToValidate = ["firstName", "lastName", "email", "phone", "company", "jobTitle", "bio"]
    
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, profileData[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSaveProfile = async () => {
    if (!user?.uid) return

    if (!validateAllFields()) {
      showToastMessage("Please fix all errors before saving", "error")
      return
    }

    try {
      const userDocRef = doc(db, "users", user.uid)
      
      // Update user document with profile data
      await updateDoc(userDocRef, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        company: profileData.company,
        jobTitle: profileData.jobTitle,
        bio: profileData.bio,
        lastUpdated: new Date(),
      })

      setIsEditing(false)
      showToastMessage("Profile updated successfully!", "success")
    } catch (error) {
      console.error("Error saving profile:", error)
      showToastMessage("Failed to save profile. Please try again.", "error")
    }
  }

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    )
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toastType === "success" ? "bg-[#10e956] text-black" : "bg-red-500 text-white"
          }`}
        >
          {toastType === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{toastMessage}</span>
        </motion.div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => handleProfileChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.firstName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => handleProfileChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.lastName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              disabled={!isEditing}
              placeholder="+1 (555) 123-4567"
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              value={profileData.company}
              onChange={(e) => handleProfileChange("company", e.target.value)}
              onBlur={() => handleBlur("company")}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.company
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
              }`}
            />
            {errors.company && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.company}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Job Title</label>
            <input
              type="text"
              value={profileData.jobTitle}
              onChange={(e) => handleProfileChange("jobTitle", e.target.value)}
              onBlur={() => handleBlur("jobTitle")}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.jobTitle
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
              }`}
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.jobTitle}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Bio
            <span className="text-gray-400 text-xs ml-2">
              ({profileData.bio.length}/500 characters)
            </span>
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleProfileChange("bio", e.target.value)}
            onBlur={() => handleBlur("bio")}
            disabled={!isEditing}
            placeholder="Tell us about yourself..."
            rows={4}
            className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.bio
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
            }`}
          />
          {errors.bio && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.bio}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false)
                loadUserProfile()
                setErrors({})
              }}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </button>
          )}
          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-[#10e956] text-black rounded-lg font-medium hover:bg-[#0ef052] transition-all duration-200"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-[#10e956] text-black rounded-lg font-medium hover:bg-[#0ef052] transition-all duration-200"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </>
  )
}