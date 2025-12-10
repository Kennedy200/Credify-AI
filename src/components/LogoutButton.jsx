// src/components/LogoutButton.jsx

import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("✅ Logged out")
      navigate("/")
    } catch (err) {
      toast.error("Error logging out")
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-4 px-4 py-2 bg-[#10e956] hover:bg-[#0dd149] text-black font-semibold rounded-lg transition duration-200"
    >
      Logout
    </button>
  )
}
