// services/firebase/appointmentsServiceDoctor.js
import { db } from "./config";
import { collection, getDocs } from "firebase/firestore";

export const fetchAppointments = async () => {
  try {
    const snapshot = await getDocs(collection(db, "appointments"));
    const appointments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};
