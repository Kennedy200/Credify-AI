import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Lock, Key, Shield, Smartphone, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db, auth } from "../../config/firebase"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut } from "firebase/auth"

export default function SecuritySettings() {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  const [isLoading, setIsLoading] = useState(true)

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showSignOutModal, setShowSignOutModal] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadSecuritySettings()
    }
  }, [user])

  const loadSecuritySettings = async () => {
    if (!user?.uid) return
    setIsLoading(true)

    try {
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.securitySettings) {
          setTwoFactorEnabled(data.securitySettings.twoFactorEnabled || false)
          setSessionTimeout(data.securitySettings.sessionTimeout || "30")
        }
      }
    } catch (error) {
      console.error("Error loading security settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validatePasswordFields = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
    let isValid = true

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required"
      isValid = false
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required"
      isValid = false
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
      isValid = false
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match"
      isValid = false
    }

    setPasswordErrors(errors)
    return isValid
  }

  const handleChangePassword = async () => {
    if (!validatePasswordFields()) {
      return
    }

    setIsChangingPassword(true)

    try {
      // Get the current user from auth
      const currentUser = auth.currentUser
      
      if (!currentUser || !currentUser.email) {
        showToastMessage("No user is currently signed in", "error")
        setIsChangingPassword(false)
        return
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      )

      await reauthenticateWithCredential(currentUser, credential)

      // Update password
      await updatePassword(currentUser, passwordData.newPassword)

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      showToastMessage("Password updated successfully!", "success")
    } catch (error) {
      console.error("Error changing password:", error)
      
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential" || error.code === "auth/invalid-login-credentials") {
        setPasswordErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect"
        }))
        showToastMessage("Current password is incorrect", "error")
      } else if (error.code === "auth/weak-password") {
        showToastMessage("Password is too weak", "error")
      } else if (error.code === "auth/requires-recent-login") {
        showToastMessage("Please log out and log back in before changing password", "error")
      } else {
        showToastMessage("Failed to change password. Please try again.", "error")
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleToggle2FA = async () => {
    const newValue = !twoFactorEnabled
    setTwoFactorEnabled(newValue)

    if (user?.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid)
        await updateDoc(userDocRef, {
          securitySettings: {
            twoFactorEnabled: newValue,
            sessionTimeout: sessionTimeout,
          },
          lastUpdated: new Date(),
        })

        showToastMessage(
          `Two-factor authentication ${newValue ? "enabled" : "disabled"}`,
          "success"
        )
      } catch (error) {
        console.error("Error updating 2FA:", error)
        setTwoFactorEnabled(!newValue)
        showToastMessage("Failed to update 2FA settings", "error")
      }
    }
  }

  const handleSessionTimeoutChange = async (value) => {
    setSessionTimeout(value)

    if (user?.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid)
        await updateDoc(userDocRef, {
          securitySettings: {
            twoFactorEnabled: twoFactorEnabled,
            sessionTimeout: value,
          },
          lastUpdated: new Date(),
        })

        showToastMessage("Session timeout updated", "success")
      } catch (error) {
        console.error("Error updating session timeout:", error)
        showToastMessage("Failed to update session timeout", "error")
      }
    }
  }

  const handleSignOutAllSessions = async () => {
    setShowSignOutModal(false)
    
    try {
      // Sign out from Firebase Auth (this will sign out all sessions)
      await signOut(auth)
      showToastMessage("Signed out from all sessions successfully", "success")
      
      // User will be redirected by auth state listener
    } catch (error) {
      console.error("Error signing out:", error)
      showToastMessage("Failed to sign out from all sessions", "error")
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
        <p className="text-gray-400">Loading security settings...</p>
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

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Sign Out From All Devices?</h3>
                <p className="text-sm text-gray-400">
                  This will sign you out from all devices including this one. You'll need to log in again to continue using Credify AI.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOutAllSessions}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Sign Out All Sessions
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        {/* Change Password Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </h2>
          <p className="text-sm text-gray-400 mb-4">Update your password to keep your account secure</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  className={`w-full px-4 py-2 pr-10 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                    passwordErrors.currentPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  className={`w-full px-4 py-2 pr-10 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                    passwordErrors.newPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordErrors.newPassword}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters long</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  className={`w-full px-4 py-2 pr-10 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                    passwordErrors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-[#10e956] focus:ring-[#10e956]/20"
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="px-6 py-2 bg-[#10e956] text-black rounded-lg font-medium hover:bg-[#0ef052] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-gray-400 mb-4">Add an extra layer of security to your account</p>
          
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-gray-400">Secure your account with 2FA</p>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  twoFactorEnabled ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    twoFactorEnabled ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
            
            {twoFactorEnabled && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-sm text-gray-300 mb-3">
                  Use an authenticator app to generate verification codes
                </p>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500 transition-colors">
                  Configure Authenticator
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Session Management */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Key className="w-5 h-5" />
            Session Management
          </h2>
          <p className="text-sm text-gray-400 mb-4">Control your active sessions and timeout settings</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-3">Auto Logout After Inactivity</label>
              <select
                value={sessionTimeout}
                onChange={(e) => handleSessionTimeoutChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="font-medium mb-2">Active Sessions</h3>
              <p className="text-sm text-gray-400 mb-3">Manage devices that are currently logged into your account</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-600">
                  <div>
                    <p className="font-medium text-sm">Current Device</p>
                    <p className="text-xs text-gray-400">Lagos, Nigeria • Last active now</p>
                  </div>
                  <span className="text-xs text-[#10e956] px-2 py-1 bg-[#10e956]/20 rounded">Active</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowSignOutModal(true)}
                className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
              >
                Sign Out All Other Sessions
              </button>
            </div>
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#10e956]" />
            Security Recommendations
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#10e956] mt-0.5 flex-shrink-0" />
              <span>Use a strong, unique password for your account</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#10e956] mt-0.5 flex-shrink-0" />
              <span>Enable two-factor authentication for added security</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#10e956] mt-0.5 flex-shrink-0" />
              <span>Review your active sessions regularly</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#10e956] mt-0.5 flex-shrink-0" />
              <span>Never share your password with anyone</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}