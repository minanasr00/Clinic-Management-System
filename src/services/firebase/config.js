import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA3B4GXpMcmdfAJpT7CPKG0mD5niLjmlN0",
  authDomain: "movie-app-be3fb.firebaseapp.com",
  projectId: "movie-app-be3fb",
  storageBucket: "movie-app-be3fb.firebasestorage.app",
  messagingSenderId: "601761343630",
  appId: "1:601761343630:web:e6b94d211203581e3201df",
  measurementId: "G-ZCLC18RFSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  
export const auth = getAuth(app)
export const analytics = getAnalytics(app);