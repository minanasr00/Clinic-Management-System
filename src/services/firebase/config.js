import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-B-hzxk2s00QF1LkO08GPv78gkYgz8Xs",
  authDomain: "clinic-management-system-v3.firebaseapp.com",
  projectId: "clinic-management-system-v3",
  storageBucket: "clinic-management-system-v3.firebasestorage.app",
  messagingSenderId: "645759719463",
  appId: "1:645759719463:web:53b44acac7b519d2af1602",
  measurementId: "G-0WZ4SM07WR"
};

const app = initializeApp(firebaseConfig);  
export const auth = getAuth(app)
export const analytics = getAnalytics(app);
export const db = getFirestore(app);