import { useEffect, useState } from "react";
import {
  sendMessage,
  listenForMessages,
  getOrCreateChatId,
} from "../../../services/firebase/chatServices";
import { auth } from "../../../services/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function PatientChat() {
  const [currentUserId, setCurrentUserId] = useState("");
const assistantId = "ASSISTANT_ID";
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        const id = await getOrCreateChatId(user.uid, assistantId);
        setChatId(id);
        listenForMessages(id, setMessages);
      }
    });

    return () => unsubscribe();
  }, [assistantId]);

  const handleSend = async () => {
    if (newMessage.trim() === "" || !chatId) return;
    await sendMessage(chatId, newMessage, currentUserId);
    setNewMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg shadow text-white ${
                msg.senderId === currentUserId
                  ? "bg-blue-500 rounded-br-none"
                  : "bg-gray-400 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              {msg.createdAt?.seconds && (
                <p className="text-[10px] text-white text-right mt-1">
                  {new Date(msg.createdAt.seconds * 1000).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-lg outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
