import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Eye, Shield } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebase"

export default function PrivacySettings() {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  const [isLoading, setIsLoading] = useState(true)

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    dataCollection: true,
    analyticsTracking: true,
    thirdPartySharing: false,
  })

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadPrivacySettings()
    }
  }, [user])

  const loadPrivacySettings = async () => {
    if (!user?.uid) return
    setIsLoading(true)

    try {
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.privacySettings) {
          setPrivacySettings(data.privacySettings)
        }
      }
    } catch (error) {
      console.error("Error loading privacy settings:", error)
      showToastMessage("Failed to load privacy settings", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async (key) => {
    const newValue = !privacySettings[key]
    const previousValue = privacySettings[key]
    
    // Optimistically update UI
    setPrivacySettings((prev) => ({ ...prev, [key]: newValue }))

    if (user?.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid)
        
        await updateDoc(userDocRef, {
          privacySettings: { ...privacySettings, [key]: newValue },
          lastUpdated: new Date(),
        })
        
        showToastMessage("Privacy settings updated", "success")
      } catch (error) {
        console.error("Error saving privacy settings:", error)
        // Revert the change if save failed
        setPrivacySettings((prev) => ({ ...prev, [key]: previousValue }))
        showToastMessage("Failed to update privacy settings", "error")
      }
    }
  }

  const handleVisibilityChange = async (value) => {
    const previousValue = privacySettings.profileVisibility
    
    // Optimistically update UI
    setPrivacySettings((prev) => ({ ...prev, profileVisibility: value }))

    if (user?.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid)
        
        await updateDoc(userDocRef, {
          privacySettings: { ...privacySettings, profileVisibility: value },
          lastUpdated: new Date(),
        })
        
        showToastMessage("Profile visibility updated", "success")
      } catch (error) {
        console.error("Error saving privacy settings:", error)
        // Revert the change if save failed
        setPrivacySettings((prev) => ({ ...prev, profileVisibility: previousValue }))
        showToastMessage("Failed to update profile visibility", "error")
      }
    }
  }

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleDownloadData = async () => {
    if (!user?.uid) return

    try {
      showToastMessage("Preparing your data for download...", "success")

      // Fetch all user data from Firestore
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        showToastMessage("No data found", "error")
        return
      }

      const userData = userDoc.data()

      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: #1a1d29;
              color: #ffffff;
              padding: 40px;
              line-height: 1.6;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: #252936;
              border-radius: 12px;
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #10e956;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #10e956;
              margin-bottom: 10px;
            }
            .export-date {
              color: #9ca3af;
              font-size: 14px;
            }
            .section {
              background: #2d3142;
              border-radius: 8px;
              padding: 24px;
              margin-bottom: 20px;
              border-left: 4px solid #10e956;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #10e956;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .section-icon {
              width: 24px;
              height: 24px;
            }
            .field {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #3d4153;
            }
            .field:last-child {
              border-bottom: none;
            }
            .field-label {
              color: #9ca3af;
              font-weight: 500;
            }
            .field-value {
              color: #ffffff;
              font-weight: 600;
              text-align: right;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }
            .stat-card {
              background: #1a1d29;
              border-radius: 8px;
              padding: 16px;
              text-align: center;
            }
            .stat-value {
              font-size: 32px;
              font-weight: bold;
              color: #10e956;
              margin-bottom: 4px;
            }
            .stat-label {
              color: #9ca3af;
              font-size: 14px;
            }
            .toggle-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid #3d4153;
            }
            .toggle-item:last-child {
              border-bottom: none;
            }
            .toggle-status {
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
            }
            .toggle-on {
              background: rgba(16, 233, 86, 0.2);
              color: #10e956;
            }
            .toggle-off {
              background: rgba(156, 163, 175, 0.2);
              color: #9ca3af;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #3d4153;
              color: #9ca3af;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ Credify AI</div>
              <h2 style="margin-bottom: 8px;">Your Personal Data Export</h2>
              <div class="export-date">Exported on ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at ${new Date().toLocaleTimeString('en-US')}</div>
            </div>

            <!-- Profile Section -->
            <div class="section">
              <div class="section-title">
                <span>👤</span> Personal Information
              </div>
              <div class="field">
                <span class="field-label">First Name</span>
                <span class="field-value">${userData.firstName || 'Not set'}</span>
              </div>
              <div class="field">
                <span class="field-label">Last Name</span>
                <span class="field-value">${userData.lastName || 'Not set'}</span>
              </div>
              <div class="field">
                <span class="field-label">Email</span>
                <span class="field-value">${userData.email || user.email || 'Not set'}</span>
              </div>
              <div class="field">
                <span class="field-label">Phone</span>
                <span class="field-value">${userData.phone || 'Not set'}</span>
              </div>
              <div class="field">
                <span class="field-label">Company</span>
                <span class="field-value">${userData.company || 'Not set'}</span>
              </div>
              <div class="field">
                <span class="field-label">Job Title</span>
                <span class="field-value">${userData.jobTitle || 'Not set'}</span>
              </div>
              <div class="field">
                <span class="field-label">Bio</span>
                <span class="field-value">${userData.bio || 'Not set'}</span>
              </div>
            </div>

            <!-- Account Stats Section -->
            <div class="section">
              <div class="section-title">
                <span>📊</span> Account Statistics
              </div>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">${userData.averageScore || 0}</div>
                  <div class="stat-label">Average Score</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${userData.totalScans || 0}</div>
                  <div class="stat-label">Total Scans</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${userData.suspiciousCount || 0}</div>
                  <div class="stat-label">Suspicious Count</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${userData.verifiedSources || 0}</div>
                  <div class="stat-label">Verified Sources</div>
                </div>
              </div>
            </div>

            <!-- Notification Settings -->
            <div class="section">
              <div class="section-title">
                <span>🔔</span> Notification Settings
              </div>
              <div class="toggle-item">
                <span class="field-label">Email Notifications</span>
                <span class="toggle-status ${userData.notificationSettings?.emailNotifications ? 'toggle-on' : 'toggle-off'}">
                  ${userData.notificationSettings?.emailNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div class="toggle-item">
                <span class="field-label">Security Alerts</span>
                <span class="toggle-status ${userData.notificationSettings?.securityAlerts ? 'toggle-on' : 'toggle-off'}">
                  ${userData.notificationSettings?.securityAlerts ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div class="toggle-item">
                <span class="field-label">Product Updates</span>
                <span class="toggle-status ${userData.notificationSettings?.productUpdates ? 'toggle-on' : 'toggle-off'}">
                  ${userData.notificationSettings?.productUpdates ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div class="toggle-item">
                <span class="field-label">Push Notifications</span>
                <span class="toggle-status ${userData.notificationSettings?.pushNotifications ? 'toggle-on' : 'toggle-off'}">
                  ${userData.notificationSettings?.pushNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div class="toggle-item">
                <span class="field-label">SMS Notifications</span>
                <span class="toggle-status ${userData.notificationSettings?.smsNotifications ? 'toggle-on' : 'toggle-off'}">
                  ${userData.notificationSettings?.smsNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div class="toggle-item">
                <span class="field-label">Weekly Reports</span>
                <span class="toggle-status ${userData.notificationSettings?.weeklyReports ? 'toggle-on' : 'toggle-off'}">
                  ${userData.notificationSettings?.weeklyReports ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <!-- Privacy Settings -->
            <div class="section">
              <div class="section-title">
                <span>🔒</span> Privacy Settings
              </div>
              <div class="field">
                <span class="field-label">Profile Visibility</span>
                <span class="field-value" style="text-transform: capitalize;">${userData.privacySettings?.profileVisibility || 'Public'}</span>
              </div>
              <div class="toggle-item">
                <span class="field-label">Show Email Address</span>
                <span class="toggle-status ${userData.privacySettings?.showEmail ? 'toggle-on' : 'toggle-off'}">
                  ${userData.privacySettings?.showEmail ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div class="toggle-item">
                <span class="field-label">Show Phone Number</span>
                <span class="toggle-status ${userData.privacySettings?.showPhone ? 'toggle-on' : 'toggle-off'}">
                  ${userData.privacySettings?.showPhone ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div class="toggle-item">
                <span class="field-label">Data Collection</span>
                <span class="toggle-status ${userData.privacySettings?.dataCollection ? 'toggle-on' : 'toggle-off'}">
                  ${userData.privacySettings?.dataCollection ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div class="toggle-item">
                <span class="field-label">Analytics Tracking</span>
                <span class="toggle-status ${userData.privacySettings?.analyticsTracking ? 'toggle-on' : 'toggle-off'}">
                  ${userData.privacySettings?.analyticsTracking ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div class="toggle-item">
                <span class="field-label">Third-Party Sharing</span>
                <span class="toggle-status ${userData.privacySettings?.thirdPartySharing ? 'toggle-on' : 'toggle-off'}">
                  ${userData.privacySettings?.thirdPartySharing ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <!-- Account Info -->
            <div class="section">
              <div class="section-title">
                <span>ℹ️</span> Account Information
              </div>
              <div class="field">
                <span class="field-label">User ID</span>
                <span class="field-value" style="font-size: 12px;">${user.uid}</span>
              </div>
              <div class="field">
                <span class="field-label">Last Updated</span>
                <span class="field-value">${userData.lastUpdated ? new Date(userData.lastUpdated.seconds * 1000).toLocaleString() : 'N/A'}</span>
              </div>
            </div>

            <div class="footer">
              <p>This document contains your personal data from Credify AI.</p>
              <p>© ${new Date().getFullYear()} Credify AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `

      // Create a new window and print as PDF
      const printWindow = window.open('', '_blank')
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // Wait for content to load then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          showToastMessage("Print dialog opened! Save as PDF to download.", "success")
        }, 250)
      }

    } catch (error) {
      console.error("Error downloading data:", error)
      showToastMessage("Failed to download data", "error")
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">Loading privacy settings...</p>
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
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Profile Privacy
          </h2>
          <p className="text-sm text-gray-400 mb-4">Control who can see your profile information</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Profile Visibility</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={privacySettings.profileVisibility === "public"}
                  onChange={() => handleVisibilityChange("public")}
                  className="w-4 h-4 text-[#10e956] focus:ring-[#10e956]"
                />
                <div>
                  <p className="font-medium">Public</p>
                  <p className="text-xs text-gray-400">Anyone can see your profile</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="friends"
                  checked={privacySettings.profileVisibility === "friends"}
                  onChange={() => handleVisibilityChange("friends")}
                  className="w-4 h-4 text-[#10e956] focus:ring-[#10e956]"
                />
                <div>
                  <p className="font-medium">Friends Only</p>
                  <p className="text-xs text-gray-400">Only your connections can see your profile</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={privacySettings.profileVisibility === "private"}
                  onChange={() => handleVisibilityChange("private")}
                  className="w-4 h-4 text-[#10e956] focus:ring-[#10e956]"
                />
                <div>
                  <p className="font-medium">Private</p>
                  <p className="text-xs text-gray-400">Only you can see your profile</p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium">Show Email Address</h3>
                  <p className="text-sm text-gray-400">Make your email visible on your profile</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("showEmail")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  privacySettings.showEmail ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    privacySettings.showEmail ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium">Show Phone Number</h3>
                  <p className="text-sm text-gray-400">Make your phone number visible on your profile</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("showPhone")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  privacySettings.showPhone ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    privacySettings.showPhone ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Data & Analytics</h2>
          <p className="text-sm text-gray-400 mb-4">Manage how we collect and use your data</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h3 className="font-medium">Data Collection</h3>
                <p className="text-sm text-gray-400">Allow us to collect usage data to improve your experience</p>
              </div>
              <button
                onClick={() => handleToggle("dataCollection")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  privacySettings.dataCollection ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    privacySettings.dataCollection ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h3 className="font-medium">Analytics Tracking</h3>
                <p className="text-sm text-gray-400">Help us understand how you use our platform</p>
              </div>
              <button
                onClick={() => handleToggle("analyticsTracking")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  privacySettings.analyticsTracking ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    privacySettings.analyticsTracking ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h3 className="font-medium">Third-Party Data Sharing</h3>
                <p className="text-sm text-gray-400">Share your data with trusted partners</p>
              </div>
              <button
                onClick={() => handleToggle("thirdPartySharing")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  privacySettings.thirdPartySharing ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    privacySettings.thirdPartySharing ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <h3 className="font-medium mb-2">Data Protection</h3>
          <p className="text-sm text-gray-400 mb-3">
            We take your privacy seriously. Your data is encrypted and stored securely. You can request to download or delete your data at any time.
          </p>
          <button 
            onClick={handleDownloadData}
            className="px-4 py-2 bg-[#10e956] text-black rounded-lg text-sm font-medium hover:bg-[#0ef052] transition-colors"
          >
            Download My Data
          </button>
        </div>
      </div>
    </>
  )
}