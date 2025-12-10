import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext"
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
        <Toaster position="top-center" toastOptions={{
        style: {
          background: '#111827',
          color: '#10e956',
          border: '1px solid #10e956',
        },
      }} />
    </AuthProvider>
  </StrictMode>,
)
