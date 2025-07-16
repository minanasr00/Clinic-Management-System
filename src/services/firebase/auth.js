import { auth , db } from './config'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


export async function signIn( email , password){
    return signInWithEmailAndPassword(auth , email , password )
}

export async function signUp(email, password, data) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      createdAt: new Date(),
      updatedAt: new Date(),
      email: data.email,
      name: data.name,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
      role: "patient"
    });
    await updateProfile(user, {
      displayName: data.name,
    });
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;  
  }
}

const googleProvider = new GoogleAuthProvider();

export async function signinWithGoogle() {
    return await signInWithPopup(auth, googleProvider)
}

export const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

