import { db } from "../../services/firebase/config.js";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

export const getOrCreateChat = async (userAId, userBId) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("members", "array-contains", userAId));
  const snapshot = await getDocs(q);
  let chatDoc = null;
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (
      data.members.length === 2 &&
      data.members.includes(userAId) &&
      data.members.includes(userBId)
    ) {
      chatDoc = docSnap;
    }
  });
  if (chatDoc) return chatDoc.id;
  const newChat = await addDoc(chatsRef, { members: [userAId, userBId] });
  return newChat.id;
};

export const sendMessage = async (chatId, senderId, text) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  await addDoc(messagesRef, {
    senderId,
    text,
    createdAt: serverTimestamp()
  });
};

export const getMessages = async (chatId) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};