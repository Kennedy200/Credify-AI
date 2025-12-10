import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebase"

export default function NotificationsSettings() {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  const [isLoading, setIsLoading] = useState(true)

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    securityAlerts: true,
    productUpdates: false,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
  })

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadNotificationSettings()
    }
  }, [user])

  const loadNotificationSettings = async () => {
    if (!user?.uid) return
    setIsLoading(true)

    try {
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.notificationSettings) {
          setNotifications(data.notificationSettings)
        }
      }
    } catch (error) {
      console.error("Error loading notification settings:", error)
      showToastMessage("Failed to load notification settings", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationToggle = async (key) => {
    const newValue = !notifications[key]
    const previousValue = notifications[key]
    
    // Optimistically update UI
    setNotifications((prev) => ({ ...prev, [key]: newValue }))

    if (user?.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid)
        
        // Save the entire notifications object
        await updateDoc(userDocRef, {
          notificationSettings: { ...notifications, [key]: newValue },
          lastUpdated: new Date(),
        })

        const notificationNames = {
          emailNotifications: "Email Notifications",
          securityAlerts: "Security Alerts",
          productUpdates: "Product Updates",
          pushNotifications: "Push Notifications",
          smsNotifications: "SMS Notifications",
          weeklyReports: "Weekly Reports",
        }

        showToastMessage(`${notificationNames[key]} ${newValue ? "enabled" : "disabled"}`, "success")
      } catch (error) {
        console.error("Error saving notification settings:", error)
        // Revert the change if save failed
        setNotifications((prev) => ({ ...prev, [key]: previousValue }))
        showToastMessage("Failed to update notification settings", "error")
      }
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
        <p className="text-gray-400">Loading notification settings...</p>
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
          <h2 className="text-xl font-bold mb-2">Email Notifications</h2>
          <p className="text-sm text-gray-400 mb-4">Manage your email notification preferences</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-400">Receive notifications via email</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("emailNotifications")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  notifications.emailNotifications ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    notifications.emailNotifications ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h3 className="font-medium">Security Alerts</h3>
                <p className="text-sm text-gray-400">Important security notifications</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("securityAlerts")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  notifications.securityAlerts ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    notifications.securityAlerts ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h3 className="font-medium">Product Updates</h3>
                <p className="text-sm text-gray-400">News about new features and updates</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("productUpdates")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  notifications.productUpdates ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    notifications.productUpdates ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Push Notifications</h2>
          <p className="text-sm text-gray-400 mb-4">Control how you receive push notifications</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-400">Receive push notifications in browser</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("pushNotifications")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  notifications.pushNotifications ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    notifications.pushNotifications ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-gray-400">Receive notifications via SMS</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("smsNotifications")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  notifications.smsNotifications ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    notifications.smsNotifications ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Reports</h2>
          <p className="text-sm text-gray-400 mb-4">Manage your activity report preferences</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h3 className="font-medium">Weekly Reports</h3>
                <p className="text-sm text-gray-400">Receive weekly activity summaries</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("weeklyReports")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  notifications.weeklyReports ? "bg-[#10e956]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    notifications.weeklyReports ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}