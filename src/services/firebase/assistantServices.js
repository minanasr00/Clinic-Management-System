import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";

export const fetchAllAssistants = async () => {
  const q = query(collection(db, "users"), where("role", "==", "assistant"));
  const snapshot = await getDocs(q);

  const assistants = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return assistants;
};