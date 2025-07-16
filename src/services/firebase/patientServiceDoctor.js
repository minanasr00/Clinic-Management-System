// services/firebase/patientServiceDoctor.js
import { db } from "./config";
import { collection, getDocs } from "firebase/firestore";

export const fetchPatientsWithRole = async (role = "patient") => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const patients = snapshot.docs
      .map((doc) => doc.data())
      .filter((user) => user.role?.toLowerCase() === role.toLowerCase());
    return patients;
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return [];
  }
};

