// services/firebase/patientServiceSingle.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

export const fetchPatientById = async (patientId) => {
  try {
    const docRef = doc(db, "users", patientId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Found patient:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
        console.warn("No patient found for ID:", patientId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};
