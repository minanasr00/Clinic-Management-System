import { db } from './config'
import { collection, getDocs } from "firebase/firestore";

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