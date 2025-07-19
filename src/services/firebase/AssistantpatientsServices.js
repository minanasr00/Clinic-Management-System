// src/services/firebase/AssistantpatientsServices.js
import { collection, getDocs, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "./config";

// عدد المرضى
export const getPatientsCount = async () => {
  const coll = collection(db, "users");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
};

// جلب كل المرضى
export const fetchAllPatients = async () => {
  const q = query(collection(db, "users"), where("role", "==", "patient"));
  const snapshot = await getDocs(q);

  const patients = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return patients;
};
