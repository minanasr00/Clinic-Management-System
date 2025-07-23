// import { useContext, useEffect, useState } from "react";
// import { FaWhatsapp } from "react-icons/fa";
// import { FiX, FiArrowRight } from "react-icons/fi";
// import { fetchAllAssistants } from "../../../services/firebase/assistantServices";
// import {
//   getOrCreateChat,
//   getMessages,
//   sendMessage,
// } from "../../../services/firebase/chatServices";
// import { AuthContext } from "../../../context/Authcontext";


// const PatientChat = () => {
//   const { user } = useContext(AuthContext)
//   const currentUserId = user?.uid; // استبدله بالـ auth بعدين
//   console.log(currentUserId);
  
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [chatId, setChatId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     const fetchAssistants = async () => {
//       const data = await fetchAllAssistants();
//       setUsers(data);
//     };
//     fetchAssistants();
//   }, []);

//   useEffect(() => {
//     if (!chatId) return;
//     const interval = setInterval(() => {
//       loadMessages(chatId);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [chatId]);

//   const loadMessages = async (id) => {
//     const msgs = await getMessages(id);
//     setMessages(msgs);
//   };

//   const handleAssistantSelect = async (user) => {
//     setSelectedUser(user);
//     setNewMessage("");
//     const chatId = await getOrCreateChat(currentUserId, user.id);
//     setChatId(chatId);
//     loadMessages(chatId);
//   };

//   const handleCloseChat = () => {
//     setSelectedUser(null);
//     setChatId(null);
//     setMessages([]);
//     setNewMessage("");
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     await sendMessage(chatId, currentUserId, newMessage);
//     setNewMessage("");
//     loadMessages(chatId);
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp?.toDate) return "";
//     const date = timestamp.toDate();
//     return date.toLocaleString("en-GB", {
//       hour: "2-digit",
//       minute: "2-digit",
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r bg-white">
//         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//           <FaWhatsapp className="text-green-500" /> Chat with Assistant
//         </h2>
//         <div className="flex flex-col gap-4">
//           {users.map((user) => (
//             <div
//               key={user.id}
//               className={`bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 flex items-center gap-4 ${
//                 selectedUser?.id === user.id ? "border-2 border-green-500" : ""
//               }`}
//               onClick={() => handleAssistantSelect(user)}
//             >
//               <img
//                 src={user.avatar || `https://i.pravatar.cc/100?u=${user.id}`}
//                 alt={user.name}
//                 className="w-12 h-12 rounded-full"
//               />
//               <div>
//                 <h3 className="font-semibold">{user.name}</h3>
//                 <p className="text-gray-500">Click to view</p>
//               </div>
//               <FiArrowRight className="ml-auto text-gray-400" />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex-1 p-0 flex items-stretch justify-center">
//         {selectedUser ? (
//           <div className="relative bg-white rounded shadow w-full max-w-md flex flex-col h-full">
//             <button
//               onClick={handleCloseChat}
//               className="absolute top-4 right-4 text-red-500 z-10"
//             >
//               <FiX size={24} />
//             </button>
//             <div className="flex flex-col items-center pt-8 pb-2">
//               <img
//                 src={selectedUser.avatar || `https://i.pravatar.cc/100?u=${selectedUser.id}`}
//                 alt={selectedUser.name}
//                 className="w-20 h-20 rounded-full mb-2"
//               />
//               <h3 className="text-xl font-bold mb-1">{selectedUser.name}</h3>
//             </div>
//             <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`p-2 rounded-lg max-w-xs ${
//                     msg.senderId === currentUserId
//                       ? "bg-green-100 self-end ml-auto"
//                       : "bg-gray-100"
//                   }`}
//                 >
//                   <p className="text-sm">{msg.text}</p>
//                   <p className="text-xs text-gray-500 mt-1">{formatTime(msg.createdAt)}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="flex items-center p-4 border-t bg-white sticky bottom-0">
//               <input
//                 type="text"
//                 placeholder="Type your message..."
//                 className="flex-1 border rounded-lg p-2 mr-2"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="bg-green-500 text-white p-2 rounded-lg"
//               >
//                 <FiArrowRight />
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-gray-400 text-lg flex items-center justify-center w-full">
//             اختر مساعد من القائمة لعرض التفاصيل
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PatientChat;
import { useContext, useEffect, useState } from "react";

import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiArrowRight } from "react-icons/fi";
import { fetchAllAssistants } from "../../../services/firebase/assistantServices";
import {
  getOrCreateChat,
  getMessages,
  sendMessage,
} from "../../../services/firebase/chatServices";
import { AuthContext } from "../../../context/Authcontext";

const PatientChat = () => {
  const { user } = useContext(AuthContext);
  const currentUserId = user?.uid || "";

  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const data = await fetchAllAssistants();
        setAssistants(data);
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    };
    fetchAssistants();
  }, []);

  useEffect(() => {
    if (!chatId) return;
    const interval = setInterval(() => {
      loadMessages(chatId);
    }, 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async (id) => {
    try {
      const msgs = await getMessages(id);
      setMessages(msgs);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleAssistantSelect = async (assistant) => {
    try {
      setSelectedAssistant(assistant);
      setNewMessage("");
      const chatId = await getOrCreateChat(currentUserId, assistant.id);
      setChatId(chatId);
      loadMessages(chatId);
    } catch (error) {
      console.error("Error selecting assistant:", error);
    }
  };

  const handleCloseChat = () => {
    setSelectedAssistant(null);
    setChatId(null);
    setMessages([]);
    setNewMessage("");
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;
    try {
      await sendMessage(chatId, currentUserId, newMessage);
      setNewMessage("");
      loadMessages(chatId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 bg-white border-r">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaWhatsapp className="text-green-500" /> Chat with Assistants
          </h2>
          <div className="flex flex-col gap-4">
            {assistants.map((assistant) => (
              <div
                key={assistant.id}
                className={`bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 flex items-center gap-4 ${
                  selectedAssistant?.id === assistant.id ? "border-2 border-green-500" : ""
                }`}
                onClick={() => handleAssistantSelect(assistant)}
              >
                <img
                  src={assistant.avatar || `https://i.pravatar.cc/100?u=${assistant.id}`}
                  alt={assistant.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{assistant.name}</h3>
                  <p className="text-gray-500 text-sm">Click to chat</p>
                </div>
                <FiArrowRight className="ml-auto text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex justify-center items-stretch bg-gray-100 p-4">
          {selectedAssistant ? (
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col">
              <button
                onClick={handleCloseChat}
                className="absolute top-4 right-4 text-red-500 z-10"
              >
                <FiX size={24} />
              </button>
              <div className="flex flex-col items-center pt-8 pb-4 border-b">
                <img
                  src={selectedAssistant.avatar || `https://i.pravatar.cc/100?u=${selectedAssistant.id}`}
                  alt={selectedAssistant.name}
                  className="w-20 h-20 rounded-full mb-2"
                />
                <h3 className="text-xl font-bold">{selectedAssistant.name}</h3>
              </div>
              <div 
                id="chat-container"
                className="flex-1 overflow-y-auto p-4 space-y-2"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-xs md:max-w-md ${
                      msg.senderId === currentUserId
                        ? "bg-green-100 self-end ml-auto"
                        : "bg-gray-100"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center p-4 border-t bg-white">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg p-3 mr-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg"
                >
                  <FiArrowRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 w-full">
              <FaWhatsapp className="text-5xl mb-4 text-green-500" />
              <h3 className="text-xl font-medium">Select an assistant</h3>
              <p className="text-center">Choose an assistant from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientChat;