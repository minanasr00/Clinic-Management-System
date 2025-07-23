// services/firebase/appointmentsServiceSinglePatient.js
import { db } from "./config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchAppointmentsByPatientId = async (patientId) => {
  try {
    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, where("patient_id", "==", patientId));
    const snapshot = await getDocs(q);

    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return appointments;
  } catch (error) {
    console.error("Error fetching appointments for patient:", error);
    return [];
  }
};
