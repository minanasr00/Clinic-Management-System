// services/firebase/medicationsService.js
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "./config";

export const fetchMedicationsByPrescriptionIds = async (prescriptionIds) => {
  try {
    const results = [];
    for (const id of prescriptionIds) {
      const q = query(collection(db, "prescription_medications"), where("prescriptionId", "==", id));
      const snapshot = await getDocs(q);
      snapshot.docs.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
    }
    return results;
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
};

export const addPrescriptionMedication = async (prescriptionData) => {
  try {
    const docRef = await addDoc(collection(db, "prescription_medications"), {
      ...prescriptionData,
      created_at: new Date(),
    });
    console.log("Prescription medication added with ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding prescription medication:", error);
    throw error;
  }
};

export const updatePrescriptionMedication = async (medicationId, updatedData) => {
  try {
    const medicationRef = doc(db, "prescription_medications", medicationId);
    await updateDoc(medicationRef, updatedData);
    console.log("Prescription medication updated successfully");
  } catch (error) {
    console.error("Error updating prescription medication:", error);
    throw error;
  }
};

export const deletePrescriptionMedication = async (medicationId) => {
  try {
    await deleteDoc(doc(db, "prescription_medications", medicationId));
    console.log("Prescription medication deleted successfully");
  } catch (error) {
    console.error("Error deleting prescription medication:", error);
    throw error;
  }
};