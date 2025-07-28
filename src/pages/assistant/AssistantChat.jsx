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
  markMessagesAsRead, // تأكد من إنشاء هذه الدالة في chatServices.js
} from "../../services/firebase/chatServices";
import { fetchAllPatients } from "../../services/firebase/AssistantpatientsServices";
import { AuthContext } from './../../context/Authcontext';
import Sidebar from "../../components/Sidebar";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../services/firebase/config";

const AssistantChat = () => {
  const { user } = useContext(AuthContext);
  const currentUserId = user?.uid || "";
const [isMobile, setIsMobile] = useState(false);
const [showPatientList, setShowPatientList] = useState(true);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 👇 أنقل هذه الدالة خارج useEffect
  const fetchPatientsWithLastMessage = async () => {
    try {
      const data = await fetchAllPatients();

      const patientsWithMessages = await Promise.all(
        data.map(async (patient) => {
          const chatId = await getOrCreateChat(currentUserId, patient.id);
          const messages = await getMessages(chatId);
          const lastMessage = messages[messages.length - 1];
          const unreadCount = messages.filter(
            (msg) => msg.senderId === patient.id && !msg.read
          ).length;

          return {
            ...patient,
            lastMessage,
            unreadCount,
          };
        })
      );

      const sortedPatients = patientsWithMessages.sort(
        (a, b) => b.unreadCount - a.unreadCount
      );
      

      setPatients(sortedPatients);
    } catch (error) {
      console.error("Error fetching patients/messages:", error);
    }
  };
useEffect(() => {
  const checkMobile = () => {
    const isNowMobile = window.innerWidth <= 768;
    setIsMobile(isNowMobile);
  };

  checkMobile(); // عند التحميل الأول
  window.addEventListener("resize", checkMobile);

  return () => window.removeEventListener("resize", checkMobile);
}, []);



  // 🔁 تحديث مباشر بالرسايل الجديدة
  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = onSnapshot(doc(db, "chats", chatId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessages(data.messages || []);
        fetchPatientsWithLastMessage();
      }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    fetchPatientsWithLastMessage();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    await loadMessages(chatId);
    await markMessagesAsRead(chatId, currentUserId);
    await fetchPatientsWithLastMessage();

    // 👇 ضروري لموبايل عشان يخفي القائمة ويعرض الشات
    if (isMobile) {
      setShowPatientList(false);
    }
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
      await sendMessage(chatId, currentUserId, newMessage, selectedPatient.id);

      setNewMessage("");
      
      await fetchPatientsWithLastMessage(); // ← تحديث القائمة بعد إرسال
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

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
  <div className={`min-h-screen bg-white pt-16 ${isMobile ? '' : 'pl-64'} pr-4`}>

    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-6 border-b border-gray-200">
      <h1 className="text-xl ml-7 font-bold text-gray-800">Arak Dental Clinic</h1>
    </nav>

    <Sidebar />

    <div className="ml-0 flex-1 flex flex-col md:flex-row">
      {/* ✅ قائمة المرضى */}
      {(!isMobile || (isMobile && showPatientList)) && (
        <div className="w-full md:w-1/3 lg:w-1/2 p-4 bg-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            Chat with Patients
          </h2>
          <input
            type="text"
            placeholder="Search by name..."
            className="mb-4 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex flex-col gap-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className={`transition-all duration-200 rounded-lg p-3 flex items-center gap-3 shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 ${
                  selectedPatient?.id === patient.id
                    ? "border-sky-500 bg-sky-50"
                    : ""
                }`}
                onClick={() => handlePatientSelect(patient)}
              >
                <img
                  src={
                    patient.avatar ||
                    `https://i.pravatar.cc/100?u=${patient.id}`
                  }
                  alt={patient.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 flex items-center justify-between">
                    {patient.name}
                    {patient.id !== selectedPatient?.id &&
                      patient.unreadCount > 0 && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                      )}
                  </h4>
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {patient.lastMessage?.text || "Click to chat"}
                  </p>
                </div>
                <FiArrowRight className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* زر العودة للموبايل */}
      {isMobile && !showPatientList && (
        <button
          onClick={() => setShowPatientList(true)}
          className="text-sky-600 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md w-fit ml-4 mb-2 mt-2"
        >
          ← Back to Patients
        </button>
      )}

      {/* ✅ الشات */}
      {(!isMobile || (isMobile && !showPatientList)) && (
        <div className="flex-1 flex justify-center items-stretch bg-gray-100 p-4">
          {selectedPatient ? (
            <div className="w-full h-144 max-w-2xl bg-white rounded-lg shadow-lg flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-4 px-6 py-4 shadow-sm bg-white rounded-t-lg">
                <img
                  src={
                    selectedPatient.avatar ||
                    `https://i.pravatar.cc/100?u=${selectedPatient.id}`
                  }
                  alt={selectedPatient.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedPatient.name}
                  </h3>
                  <p className="text-sm text-gray-500">Active now</p>
                </div>
                <button
                  onClick={handleCloseChat}
                  className="ml-auto text-gray-400 hover:text-red-500"
                  title="Close chat"
                >
                  <FiX size={22} />
                </button>
              </div>

              {/* الرسائل */}
              <div
                id="chat-container"
                className="flex-1 overflow-y-auto p-4 space-y-2"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-xs md:max-w-md text-sm shadow-sm transition-all duration-300 ${
                      msg.senderId === currentUserId
                        ? "bg-sky-100 self-end ml-auto border border-sky-200 w-fit"
                        : "bg-gray-100 self-start border border-gray-200 w-fit"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                ))}
              </div>

              {/* إدخال الرسالة */}
              <div className="flex items-center p-4 bg-white gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendMessage()
                  }
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-sky-600 hover:bg-sky-700 text-white rounded-full p-3"
                >
                  <FiArrowRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col mt-50 items-center justify-start text-gray-500 w-full gap-2">
              <FaWhatsapp className="text-6xl text-sky-700 mb-2" />
              <h3 className="text-2xl font-semibold">Start a conversation</h3>
              <p className="text-center text-sm text-gray-400 max-w-xs">
                Select a patient from the left to begin chatting. All your
                conversations are saved.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
}
export default AssistantChat;

