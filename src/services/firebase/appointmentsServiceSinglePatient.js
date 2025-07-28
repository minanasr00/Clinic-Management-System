// // services/firebase/appointmentsServiceSinglePatient.js
// import { db } from "./config";
// import { collection, getDocs, query, where } from "firebase/firestore";

// export const fetchAppointmentsByPatientId = async (patientId) => {
//   try {
//     const appointmentsRef = collection(db, "appointments");
//     const q = query(appointmentsRef, where("patient_id", "==", patientId));
//     const snapshot = await getDocs(q);

//     const appointments = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return appointments;
//   } catch (error) {
//     console.error("Error fetching appointments for patient:", error);
//     return [];
//   }
// };

// services/firebase/appointmentsServiceSinglePatient.js
import { db } from "./config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchAppointmentsByPatientId = async (patientId) => {
  try {
    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, where("patient_id", "==", patientId));
    const snapshot = await getDocs(q);

    const now = new Date();

    const appointments = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((appt) => {
        const startTime = appt.start_time?.toDate?.();
        return startTime && startTime < now;
      })
      .sort((a, b) => {
        const timeA = a.start_time?.toDate?.().getTime() || 0;
        const timeB = b.start_time?.toDate?.().getTime() || 0;
        return timeB - timeA;
      });

    return appointments;
  } catch (error) {
    console.error("Error fetching appointments for patient:", error);
    return [];
  }
};
