import { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
        })
        return unsubscribe
    },[])
    return (
      
      <AuthContext.Provider value={{ user }} >
            {children}
    </AuthContext.Provider>
  )
}

