// src/services/firebase/chatServices.js
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";

// إنشاء أو جلب شات بين اتنين
export const getOrCreateChat = async (assistantId, patientId) => {
  const q = query(
    collection(db, "chats"),
    where("users", "in", [
      [assistantId, patientId],
      [patientId, assistantId],
    ])
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  } else {
    const docRef = await addDoc(collection(db, "chats"), {
      users: [assistantId, patientId],
      lastMessage: "",
    });
    return docRef.id;
  }
};

// إرسال رسالة
export const sendMessage = async (chatId, senderId, text) => {
  const message = {
    text,
    senderId,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "chats", chatId, "messages"), message);

  // تحديث آخر رسالة
  const chatRef = doc(db, "chats", chatId);
  await setDoc(chatRef, { lastMessage: text }, { merge: true });
};

// جلب الرسائل مرتبة زمنيًا
export const getMessages = async (chatId) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
