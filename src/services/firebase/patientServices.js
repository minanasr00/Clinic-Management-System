import { db } from './config'
import { addDoc, collection, getDocs } from "firebase/firestore";

export async function getScheduledAppointments() {
    try {
        const appointmentsRef = collection(db, 'appointments');
        const snapshot = await getDocs(appointmentsRef);
        const appointments = snapshot.docs.map(doc => {
            const date = new Date(doc.data().start_time.seconds * 1000);
            return date;
        });
        return appointments;
    } catch (error) {
        console.error("Error fetching scheduled appointments:", error);
        throw error;
        
    }   
}

// export async function addAppointment(data , PaymentStatus , patientName ) {
//     try {
//         const dateString = `${data.appointmentDate} ${convertTo24Hour(data.appointmentTime)}`;
//         function convertTo24Hour(time12h) {
//         const [time, period] = time12h.split(' ');
//         let [hours, minutes] = time.split(':');
        
//         if (period === 'PM' && hours !== '12') {
//             hours = parseInt(hours, 10) + 12;
//         }
//         if (period === 'AM' && hours === '12') {
//             hours = '00';
//         }
        
//         return `${hours}:${minutes}`;
//     }   
//         const appointmentDateTime = new Date(dateString);
//         const docData = {
//             assistant: null,
            
//             visitType: data.visitType,
//             reason_for_visit: data.reasonForVisit,
//             start_time: appointmentDateTime,
//             doctor_id: data.doctorId,
//             patient_id: data.patientId,
//             status: data.status,
//             payment_method: data.paymentMethod,
//             bookedBy: data.bookedBy,
//             createdAt: new Date(),
//             payment_amount: data.paymentAmount,
//             payment_status: PaymentStatus,
//             patient_name: patientName,
//         }

//         const appointmentsRef = collection(db, 'appointments');
//         await addDoc(appointmentsRef, docData);
//         console.log("Appointment added successfully");
//     } catch (error) {
//         console.error("Error adding appointment:", error);
//         throw error;
//     }
    
// }
export async function addAppointment(data, paymentStatus, patientName) {
  try {
    const dateString = `${data.appointmentDate} ${convertTo24Hour(data.appointmentTime)}`;
    
    function convertTo24Hour(time12h) {
      const [time, period] = time12h.split(' ');
      let [hours, minutes] = time.split(':');
      
      if (period === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
      }
      if (period === 'AM' && hours === '12') {
        hours = '00';
      }
      
      return `${hours}:${minutes}`;
    }   
    
    const appointmentDateTime = new Date(dateString);
    const docData = {
      assistant: null,
      visitType: data.visitType,
      reason_for_visit: data.reasonForVisit,
      start_time: appointmentDateTime,
      doctor_id: data.doctorId,
      patient_id: data.patientId,
      status: data.status,
      payment_method: data.paymentMethod,
      bookedBy: data.bookedBy,
      createdAt: new Date(),
      payment_amount: data.paymentAmount,
      payment_status: paymentStatus,
      patient_name: patientName,
    }

    const appointmentsRef = collection(db, 'appointments');
    const docRef = await addDoc(appointmentsRef, docData);
    console.log("Appointment added successfully with ID:", docRef.id);
    
    return docRef.id; // Return the document ID
  } catch (error) {
    console.error("Error adding appointment:", error);
    throw error;
  }
}
export async function getPatientAppointments(patientId) {
    try {
        const appointmentsRef = collection(db, 'appointments');
        const snapshot = await getDocs(appointmentsRef);
        const appointments = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(appointment => appointment.patient_id === patientId);

        return appointments.sort((a, b) => {
            const dateA = a.start_time instanceof Date ? a.start_time : new Date(a.start_time.seconds * 1000);
            const dateB = b.start_time instanceof Date ? b.start_time : new Date(b.start_time.seconds * 1000);
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error fetching patient appointments:", error);
        throw error;
    }
}

export async function getPatientDiagnoses(patientId) {
    try {
        const diagnosesRef = collection(db, 'prescriptions');
        const snapshot = await getDocs(diagnosesRef);
        const diagnoses = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(diagnosis => diagnosis.patient_id === patientId);
        return diagnoses;
    } catch (error) {
        console.error("Error fetching patient diagnoses:", error);
        throw error;
    }
}

export async function getTreatmentHistory(diagnoseId) {
    try {
        const treatmentRef = collection(db, 'prescription_medications');
        const snapshot = await getDocs(treatmentRef);
        const treatments = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(treatment => treatment.prescriptionId === diagnoseId);
        return treatments;
    } catch (error) {
        console.error("Error fetching treatment history:", error);
        throw error;
    }
}
