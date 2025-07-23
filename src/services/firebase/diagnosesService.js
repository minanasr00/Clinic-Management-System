// services/firebase/diagnosesService.js
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "./config";

// ✅ 1. Fetch diagnoses by patient_id
export const fetchDiagnosesByPatientId = async (patientId) => {
  try {
    const q = query(collection(db, "prescriptions"), where("patient_id", "==", patientId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching diagnoses:", error);
    return [];
  }
};

// ✅ 2. Add a new diagnosis to the prescriptions collection
export const addDiagnosis = async (payload) => {
  try {
    const docRef = await addDoc(collection(db, "prescriptions"), payload);
    return docRef;
  } catch (error) {
    console.error("Error adding diagnosis:", error);
    throw error;
  }
};
