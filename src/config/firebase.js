// src/config/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBzgQZF-1-sUD4ftnueuz0GX4a04tRYQLM",
  authDomain: "credify-ai.firebaseapp.com",
  projectId: "credify-ai",
  storageBucket: "credify-ai.appspot.com",
  messagingSenderId: "538708301448",
  appId: "1:538708301448:web:94ba252d086320a36b313d",
  measurementId: "G-89RHBWD390"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
const db = getFirestore(app)

export { auth }
export { googleProvider }
export { db }
