import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export async function addAssistantUser  ( {name, email, password, phoneNumber} ) {
  try {
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // 2. Add user data to Firestore (excluding password)
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      phoneNumber,
      role: "assistant",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  
    return { success: true };
  } catch (error) {
    console.error("Error adding assistant user:", error);
    return { success: false, error };
  }
};
