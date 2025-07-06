import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa'; 

const AssistantChat = () => {
  const [messages, setMessages] = useState([
    { from: 'user', text: 'Hello!' },
    { from: 'assistant', text: 'Hi, how can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { from: 'assistant', text: input }]);
      setInput('');
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar - WhatsApp-style */}
      <div className="w-1/2 bg-white  shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Chats</h2>

        {/* Chat Preview */}
        <div className="flex items-center gap-4 mb-4 hover:bg-gray-50 p-3 rounded-lg cursor-pointer relative">
          {/* Avatar */}
          <div className="relative">
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="Assistant"
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* Online Dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
          </div>

          {/* Chat Info */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Merna Nabil</p>
            <p className="text-xs text-gray-500 truncate">How can I book an appointmemts?</p>
          </div>

          {/* WhatsApp icon */}
          <FaWhatsapp className="text-blue-500 text-lg" />
        </div>
        <div className="flex items-center gap-4 mb-4 hover:bg-gray-50 p-3 rounded-lg cursor-pointer relative">
          {/* Avatar */}
          <div className="relative">
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="Assistant"
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* Online Dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
          </div>

          {/* Chat Info */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Walaa Ahmed</p>
            <p className="text-xs text-gray-500 truncate">How can I book an appointmemts?</p>
          </div>

          {/* WhatsApp icon */}
          <FaWhatsapp className="text-blue-500 text-lg" />
        </div>
        <div className="flex items-center gap-4 mb-4 hover:bg-gray-50 p-3 rounded-lg cursor-pointer relative">
          {/* Avatar */}
          <div className="relative">
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="Assistant"
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* Online Dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
          </div>

          {/* Chat Info */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Merna Nabil</p>
            <p className="text-xs text-gray-500 truncate">How can I book an appointmemts?</p>
          </div>

          {/* WhatsApp icon */}
          <FaWhatsapp className="text-blue-500 text-lg" />
        </div>

        <div className="text-gray-400 text-sm text-center mt-10">
          More chats coming soon...
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col bg-[#f0f9ff]">
        {/* Header */}
        <div className="bg-blue-900 text-white px-6 py-4 shadow">
          <h1 className="text-xl font-bold">Assistant Chat</h1>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
  key={index}
  className={`w-fit px-4 py-2 rounded-2xl shadow-md text-sm leading-snug ${
    msg.from === 'assistant'
      ? 'ml-auto bg-blue-100 text-right rounded-br-sm'
      : 'mr-auto bg-gray-100 text-left rounded-bl-sm'
  }`}
>
  {msg.text}
</div>

          ))}
        </div>

        {/* Input Box */}
        <div className="bg-white px-4 py-3  flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSend}
            className="bg-blue-900 text-white px-5 py-2 rounded hover:bg-blue-950"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;

