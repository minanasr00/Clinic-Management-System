// src/services/firebase/appointmentsServices.js
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./config";
import { onSnapshot } from "firebase/firestore";
// ✅ Real-time listener for upcoming appointments
export const listenToUpcomingAppointments = (callback) => {
  const q = query(
    collection(db, "appointments"),
    where("status", "in", ["pending", "scheduled", "delayed"])
  );

  return onSnapshot(q, (snapshot) => {
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(appointments);
  });
};

export const getUpcomingAppointmentsCount = async () => {
  const q = query(
    collection(db, "appointments"),
    where("status", "in", ["scheduled", "pending", "delayed"])
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};

// ✅ عدد المرضى المكتملين
export const getCompletedPatientsCount = async () => {
  const q = query(collection(db, "appointments"), 
    where("status", "==", "completed")
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const getUpcomingAppointments = async () => {
  const q = query(
    collection(db, "appointments"),
    where("status", "in", ["scheduled", "pending", "delayed"]),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getCompletedAppointments = async () => {
  const q = query(
    collection(db, "appointments"),
    where("status", "==", "completed"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getAllAppointmentsForTable = async () => {
  const q = query(collection(db, "appointments"), 
);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const fetchUpcomingAppointments = async () => {
  const q = query(
    collection(db, "appointments"),
    where("status", "==", "scheduled"),
    orderBy("start_time", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addAppointmentToFirestore = async (data) => {
  const docRef = await addDoc(collection(db, "appointments"), {
    ...data,
    createdAt: new Date(),
  });
  return docRef.id;
};

export const deleteAppointmentFromFirestore = async (id) => {
  await deleteDoc(doc(db, "appointments", id));
};

export const updateAppointmentInFirestore = async (id, updatedData) => {
  await updateDoc(doc(db, "appointments", id), updatedData);
};

