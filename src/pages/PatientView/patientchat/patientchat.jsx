import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiArrowRight } from "react-icons/fi";
import { fetchAllAssistants } from "../../../services/firebase/assistantServices";

const PatientChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      const data = await fetchAllAssistants();
      setUsers(data);
    };

    fetchAssistants();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseChat = () => {
    setSelectedUser(null);
  };

  return (
    
      

      <div className="flex-1 flex flex-col p-4 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaWhatsapp className="text-green-500" /> Chat with Assistant
        </h2>

        {!selectedUser ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 flex items-center gap-4"
                onClick={() => handleUserClick(user)}
              >
                <img
                src={user.avatar || `https://i.pravatar.cc/100?u=${user.id}`}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />

                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-gray-500">Click to chat</p>
                </div>
                <FiArrowRight className="ml-auto text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative bg-white p-4 rounded shadow">
            <button
              onClick={handleCloseChat}
              className="absolute top-2 right-2 text-red-500"
            >
              <FiX size={20} />
            </button>
            <h3 className="text-lg font-bold mb-2">{selectedUser.name}</h3>
            <ChatBox
              receiverId={selectedUser.id}
              receiverName={selectedUser.name}
              receiverAvatar={selectedUser.avatar}
            />
          </div>
        )}
      </div>
   
  );
};

export default PatientChat;
