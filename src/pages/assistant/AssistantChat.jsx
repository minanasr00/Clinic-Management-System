import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import { FiX, FiArrowRight } from "react-icons/fi";

const dummyChats = [
  {
    id: 1,
    name: "Merna Nabil",
    lastMessage: "How can I book an appointment?",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 2,
    name: "Ali Mostafa",
    lastMessage: "Thanks for your help!",
    avatar: "https://i.pravatar.cc/100?img=8",
  },
  {
    id: 3,
    name: "Sara Hossam",
    lastMessage: "Do I need to fast before lab?",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 4,
    name: "Sara Hossam",
    lastMessage: "Do I need to fast before lab?",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([
    { from: "user", text: "Hello!" },
    { from: "assistant", text: "Hi, how can I assist you today?" },
  ]);

  const handleSend = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { from: "assistant", text: input }]);
      setInput("");
    }
  };

  const filteredChats = dummyChats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <div className="min-h-screen bg-white pt-16 pl-64 pr-4 flex">
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Medicall</h1>
      </nav>
  {/* Sidebar ثابت */}
  <Sidebar />

  {/* قائمة المحادثات */}
  <div className={`transition-all duration-300 w-full md:w-1/2 p-4 overflow-y-auto mt-5 ml-2`}>
    <h2 className="text-2xl font-semibold text-gray-800 mb-5">Recent Chats</h2>
    <input
      type="text"
      placeholder=" Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
    />
    {filteredChats.map((chat) => (
      <div
        key={chat.id}
        onClick={() => setSelectedChat(chat)}
        className="flex items-center gap-4 mb-4 hover:bg-gray-50 p-3 rounded-lg cursor-pointer relative"
      >
        <div className="relative">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-sky-700 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{chat.name}</p>
          <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
        </div>
        <FaWhatsapp className="text-sky-700 text-lg" />
      </div>
    ))}
    {filteredChats.length === 0 && (
      <div className="text-gray-400 text-sm text-center mt-20">
        No chats found...
      </div>
    )}
  </div>

  {selectedChat && (
    <div className="hidden md:flex flex-col w-1/2 bg-[#f0f9ff] border-l border-gray-300 ">
      {/* Header */}
      <div className="bg-white text-gray-900 px-6 py-4 shadow flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={selectedChat.avatar}
            alt={selectedChat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className="text-lg font-semibold">{selectedChat.name}</h1>
        </div>
        <button
          onClick={() => setSelectedChat(null)}
          className="text-sky-700 p-2 rounded hover:text-sky-800"
          aria-label="Close chat"
        >
          <FiX className="text-2xl" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`w-fit px-4 py-2 rounded-2xl shadow-md text-sm leading-snug ${
              msg.from === "assistant"
                ? "ml-auto bg-blue-100 text-right rounded-br-sm"
                : "mr-auto bg-gray-100 text-left rounded-bl-sm"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white px-4 py-3 flex gap-2 border-t border-gray-200">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="text-sky-700 p-3 rounded hover:text-sky-800 cursor-pointer"
          aria-label="Send message"
        >
          <FiArrowRight className="text-xl" />
        </button>
      </div>
    </div>
  )}
</div>

  );
}


