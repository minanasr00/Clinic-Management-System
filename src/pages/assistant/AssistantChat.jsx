// import { useState, useEffect, useContext } from "react";
// import { FaWhatsapp } from "react-icons/fa";
// import { FiX, FiArrowRight } from "react-icons/fi";
// import {
//   getOrCreateChat,
//   getMessages,
//   sendMessage,
// } from "../../services/firebase/chatServices";
// import { fetchAllPatients } from "../../services/firebase/AssistantpatientsServices";
// import { AuthContext } from './../../context/Authcontext';

// import Sidebar from "../../components/Sidebar";


// const AssistantChat = () => {
//   const { user } = useContext(AuthContext);
//   const currentUserId = user?.uid || "";

//   const [patients, setPatients] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [chatId, setChatId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const data = await fetchAllPatients();
//         setPatients(data);
//       } catch (error) {
//         console.error("Error fetching patients:", error);
//       }
//     };
//     fetchPatients();
//   }, []);

//   useEffect(() => {
//     if (!chatId) return;
//     const interval = setInterval(() => {
//       loadMessages(chatId);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [chatId]);

//   useEffect(() => {
//     const chatContainer = document.getElementById("chat-container");
//     if (chatContainer) {
//       chatContainer.scrollTop = chatContainer.scrollHeight;
//     }
//   }, [messages]);

//   const loadMessages = async (id) => {
//     try {
//       const msgs = await getMessages(id);
//       setMessages(msgs);
//     } catch (error) {
//       console.error("Error loading messages:", error);
//     }
//   };

//   const handlePatientSelect = async (patient) => {
//     try {
//       setSelectedPatient(patient);
//       setNewMessage("");
//       const chatId = await getOrCreateChat(currentUserId, patient.id);
//       setChatId(chatId);
//       loadMessages(chatId);
//     } catch (error) {
//       console.error("Error selecting patient:", error);
//     }
//   };

//   const handleCloseChat = () => {
//     setSelectedPatient(null);
//     setChatId(null);
//     setMessages([]);
//     setNewMessage("");
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !chatId) return;
//     try {
//       await sendMessage(chatId, currentUserId, newMessage);
//       setNewMessage("");
//       loadMessages(chatId);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp?.toDate) return "";
//     const date = timestamp.toDate();
//     return date.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar/>
//       <div className="flex flex-col md:flex-row flex-1">
//         <div className="w-full md:w-1/3 lg:w-1/4 p-4 bg-white border-r">
//           <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//             <FaWhatsapp className="text-green-500" /> Chat with Patients
//           </h2>
//           <div className="flex flex-col gap-4">
//             {patients.map((patient) => (
//               <div
//                 key={patient.id}
//                 className={`bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 flex items-center gap-4 ${
//                   selectedPatient?.id === patient.id ? "border-2 border-green-500" : ""
//                 }`}
//                 onClick={() => handlePatientSelect(patient)}
//               >
//                 <img
//                   src={patient.avatar || `https://i.pravatar.cc/100?u=${patient.id}`}
//                   alt={patient.name}
//                   className="w-12 h-12 rounded-full"
//                 />
//                 <div>
//                   <h3 className="font-semibold">{patient.name}</h3>
//                   <p className="text-gray-500 text-sm">Click to chat</p>
//                 </div>
//                 <FiArrowRight className="ml-auto text-gray-400" />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex-1 flex justify-center items-stretch bg-gray-100 p-4">
//           {selectedPatient ? (
//             <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col">
//               <button
//                 onClick={handleCloseChat}
//                 className="absolute top-4 right-4 text-red-500 z-10"
//               >
//                 <FiX size={24} />
//               </button>
//               <div className="flex flex-col items-center pt-8 pb-4 border-b">
//                 <img
//                   src={selectedPatient.avatar || `https://i.pravatar.cc/100?u=${selectedPatient.id}`}
//                   alt={selectedPatient.name}
//                   className="w-20 h-20 rounded-full mb-2"
//                 />
//                 <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
//               </div>
//               <div
//                 id="chat-container"
//                 className="flex-1 overflow-y-auto p-4 space-y-2"
//               >
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className={`p-3 rounded-lg max-w-xs md:max-w-md ${
//                       msg.senderId === currentUserId
//                         ? "bg-green-100 self-end ml-auto"
//                         : "bg-gray-100"
//                     }`}
//                   >
//                     <p className="text-sm">{msg.text}</p>
//                     <p className="text-xs text-gray-500 mt-1 text-right">
//                       {formatTime(msg.createdAt)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex items-center p-4 border-t bg-white">
//                 <input
//                   type="text"
//                   placeholder="Type your message..."
//                   className="flex-1 border rounded-lg p-3 mr-2"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg"
//                 >
//                   <FiArrowRight size={20} />
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center text-gray-500 w-full">
//               <FaWhatsapp className="text-5xl mb-4 text-green-500" />
//               <h3 className="text-xl font-medium">Select a patient</h3>
//               <p className="text-center">Choose a patient from the list to start chatting</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssistantChat;
import { useState, useEffect, useContext } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiArrowRight } from "react-icons/fi";
import {
  getOrCreateChat,
  getMessages,
  sendMessage,
} from "../../services/firebase/chatServices";
import { fetchAllPatients } from "../../services/firebase/AssistantpatientsServices";
import { AuthContext } from './../../context/Authcontext';
import Sidebar from "../../components/Sidebar";

const AssistantChat = () => {
  const { user } = useContext(AuthContext);
  const currentUserId = user?.uid || "";

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await fetchAllPatients();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
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

  const handlePatientSelect = async (patient) => {
    try {
      setSelectedPatient(patient);
      setNewMessage("");
      const chatId = await getOrCreateChat(currentUserId, patient.id);
      setChatId(chatId);
      loadMessages(chatId);
    } catch (error) {
      console.error("Error selecting patient:", error);
    }
  };

  const handleCloseChat = () => {
    setSelectedPatient(null);
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
      {/* Fixed sidebar with specified width */}
      <div className="fixed inset-y-0 left-0 z-10 w-64">
        <Sidebar />
      </div>
      
      {/* Main content with left margin matching sidebar width */}
      <div className="ml-64 flex-1 flex flex-col">
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Patient List */}
          <div className="w-full md:w-1/3 lg:w-1/4 p-4 bg-white border-r">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaWhatsapp className="text-green-500" /> Chat with Patients
            </h2>
            <div className="flex flex-col gap-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className={`bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 flex items-center gap-4 ${
                    selectedPatient?.id === patient.id ? "border-2 border-green-500" : ""
                  }`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <img
                    src={patient.avatar || `https://i.pravatar.cc/100?u=${patient.id}`}
                    alt={patient.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-gray-500 text-sm">Click to chat</p>
                  </div>
                  <FiArrowRight className="ml-auto text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex justify-center items-stretch bg-gray-100 p-4">
            {selectedPatient ? (
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col relative">
                <button
                  onClick={handleCloseChat}
                  className="absolute top-4 right-4 text-red-500 z-10"
                >
                  <FiX size={24} />
                </button>
                <div className="flex flex-col items-center pt-8 pb-4 border-b">
                  <img
                    src={selectedPatient.avatar || `https://i.pravatar.cc/100?u=${selectedPatient.id}`}
                    alt={selectedPatient.name}
                    className="w-20 h-20 rounded-full mb-2"
                  />
                  <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
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
                <h3 className="text-xl font-medium">Select a patient</h3>
                <p className="text-center">Choose a patient from the list to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;