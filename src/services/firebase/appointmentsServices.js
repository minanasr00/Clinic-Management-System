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

// ✅ عدد المواعيد القادمة (scheduled / pending / delayed)
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

// ✅ دالة جديدة لحل الخطأ - جلب المواعيد القادمة (scheduled / pending / delayed)
export const getUpcomingAppointments = async () => {
  const q = query(
    collection(db, "appointments"),
    where("status", "in", ["scheduled", "pending", "delayed"]),
    // orderBy("start_time", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ✅ جلب المواعيد المكتملة
export const getCompletedAppointments = async () => {
  const q = query(
    collection(db, "appointments"),
    where("status", "==", "completed"),
    // orderBy("start_time", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ✅ جلب كل المواعيد
export const getAllAppointmentsForTable = async () => {
  const q = query(collection(db, "appointments"), 
  // orderBy("start_time", "asc")
);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ✅ جلب المواعيد القادمة فقط (scheduled فقط)
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

// ✅ إضافة ميعاد
export const addAppointmentToFirestore = async (data) => {
  const docRef = await addDoc(collection(db, "appointments"), {
    ...data,
    createdAt: new Date(),
  });
  return docRef.id;
};

// ✅ حذف ميعاد
export const deleteAppointmentFromFirestore = async (id) => {
  await deleteDoc(doc(db, "appointments", id));
};

// ✅ تعديل ميعاد
export const updateAppointmentInFirestore = async (id, updatedData) => {
  await updateDoc(doc(db, "appointments", id), updatedData);
};

