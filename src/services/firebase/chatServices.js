import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  writeBatch
} from "firebase/firestore";

import { db } from "./config";

// 🔹 إنشاء أو استرجاع محادثة بين شخصين
export const getOrCreateChat = async (userAId, userBId) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("members", "array-contains", userAId));
  const snapshot = await getDocs(q);

  let chatDoc = null;
  snapshot.forEach((docSnap) => {
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

  const newChat = await addDoc(chatsRef, {
    members: [userAId, userBId],
    createdAt: serverTimestamp(),
    messages: [] // تأكد من وجود هذا الحقل لتجنب مشاكل null
  });

  return newChat.id;
};

// 🔹 إرسال رسالة
export const sendMessage = async (chatId, senderId, text, receiverId) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    const newMessage = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      text,
      createdAt: new Date(),
      read: false,
    };

    if (chatSnap.exists()) {
      const data = chatSnap.data();
      const updatedMessages = [...(data.messages || []), newMessage];
      await updateDoc(chatRef, { messages: updatedMessages });
    }

    await addDoc(
      collection(db, "chats", chatId, "messages"),
      {
        senderId,
        receiverId,
        text,
        createdAt: serverTimestamp(),
        read: false
      }
    );
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// 🔹 تحميل جميع الرسائل بترتيب زمني
export const getMessages = async (chatId) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 🔹 تعيين الرسائل كمقروءة (Firestore batch update)
export const markMessagesAsRead = async (chatId, currentUserId) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("receiverId", "==", currentUserId),
    where("read", "==", false)
  );
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);

  snapshot.forEach((docSnap) => {
    batch.update(docSnap.ref, { read: true });
  });

  await batch.commit();
};

// 🔹 الحصول على جميع الرسائل غير المقروءة لمستخدم معين
export const getAllUnreadMessagesForUser = async (userId) => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("members", "array-contains", userId));
    const chatSnapshots = await getDocs(q);

    const allUnreadMessages = [];

    for (const chatDoc of chatSnapshots.docs) {
      const chatId = chatDoc.id;
      const messagesRef = collection(db, "chats", chatId, "messages");
      const messagesQuery = query(
        messagesRef,
        where("receiverId", "==", userId),
        where("read", "==", false),
        orderBy("createdAt", "desc")
      );

      const messagesSnapshot = await getDocs(messagesQuery);

      messagesSnapshot.forEach((msgDoc) => {
        allUnreadMessages.push({
          ...msgDoc.data(),
          id: msgDoc.id,
          chatId,
        });
      });
    }

    return allUnreadMessages;
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    return [];
  }
};

