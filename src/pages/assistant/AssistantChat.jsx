// src/pages/ChatPage.jsx
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import {
  getOrCreateChat,
  getMessages,
  sendMessage,
} from "../../services/firebase/chatServices";
import { fetchAllPatients } from "../../services/firebase/AssistantpatientsServices";

const currentUserId = "user1"; // ✅ استبدليه بعدين بالـ auth

export default function ChatPage() {
  const [patients, setPatients] = useState([]); // ✅ بدل dummyChats
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      const data = await fetchAllPatients();
      setPatients(data);
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (chatId) {
      loadMessages(chatId);
    }
  }, [chatId]);

  const loadMessages = async (id) => {
    const msgs = await getMessages(id);
    setMessages(msgs);
  };

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    const chatId = await getOrCreateChat(currentUserId, chat.id); // 👈 استخدم patient.id
    setChatId(chatId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(chatId, currentUserId, newMessage);
    setNewMessage("");
    loadMessages(chatId);
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    return date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col bg-gray-100">
        <header className="bg-white p-4 shadow flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-700">Messages</h1>
          <FaWhatsapp className="text-green-500 text-2xl" />
        </header>

        <div className="flex flex-1">
          {/* Chat List */}
          <aside className="w-1/3 bg-white border-r overflow-y-auto">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleChatSelect(patient)}
              >
                <img
                  src={patient.avatar || "https://i.pravatar.cc/100"} // fallback
                  alt={patient.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{patient.name}</p>
                </div>
              </div>
            ))}
          </aside>

          {/* Chat Window */}
          <main className="flex flex-1 flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-white p-4 flex items-center border-b">
                  <img
                    src={selectedChat.avatar || "https://i.pravatar.cc/100"}
                    alt={selectedChat.name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg max-w-xs ${
                        msg.senderId === currentUserId
                          ? "bg-green-100 self-end"
                          : "bg-white"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white p-4 flex items-center border-t">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 border rounded-lg p-2 mr-2"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-green-500 text-white p-2 rounded-lg"
                  >
                    <FiArrowRight />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
