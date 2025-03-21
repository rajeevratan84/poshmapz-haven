
// Import the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration with your provided keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCGCSaiXC9dWmflruDmMr_q9uSmH_EBF64",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "poshmpas.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "poshmpas",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "poshmpas.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1016810612374",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1016810612374:web:b8838cd05d27ea3ddec4b7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-M1QEZB7VWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth provider to request email
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
