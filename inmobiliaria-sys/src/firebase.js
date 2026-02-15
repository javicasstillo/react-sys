import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyClcBJW5__SaqeYk72iCbUm586pFFy7XfM",
  authDomain: "inmobiliaria-sys.firebaseapp.com",
  projectId: "inmobiliaria-sys",
  storageBucket: "inmobiliaria-sys.firebasestorage.app",
  messagingSenderId: "366933827800",
  appId: "1:366933827800:web:cbaa1fa80a72775d5ef7ad",
  measurementId: "G-T3RXM8TDX0"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
