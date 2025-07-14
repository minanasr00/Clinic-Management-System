import { createContext, useEffect, useState } from 'react'
import { browserLocalPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { auth, db } from '../services/firebase/config';
import { doc, getDoc } from 'firebase/firestore';


export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
    useEffect(() => {
  const initializeAuth = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const docSnapshot = await getDoc(userRef);
          setRole(docSnapshot.exists() ? docSnapshot.data().role : null);
        } else {
          setRole(null);
        }
        setUser(user);
        setLoading(false);
      });
    } catch (error) {
      console.error("Auth initialization failed:", error);
      setLoading(false);
    }
  };

  const unsubscribe = initializeAuth();
  return () => { unsubscribe?.(); setLoading(true); };
}, []);
    return (

      <AuthContext.Provider value={{ user, role , loading , setLoading }} >
        {children}
    </AuthContext.Provider>
  )
}

