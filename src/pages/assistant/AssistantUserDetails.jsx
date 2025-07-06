import React, { useState, useEffect } from "react";
import { FaUser, FaTimes } from "react-icons/fa";
import Img from "../../assets/1.jpg";

const mockUsers = [
  { id: 1, name: "Mohamed Ali", email: "mohamed@example.com" },
  { id: 2, name: "Sara Ahmed", email: "sara@example.com" },
  { id: 3, name: "Youssef Nabil", email: "youssef@example.com" },
];

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [note, setNote] = useState("");
  const [viewType, setViewType] = useState(""); // "details" or "note"


  // Load note from localStorage when user selected
  useEffect(() => {
    if (selectedUser) {
      const storedNotes = JSON.parse(localStorage.getItem("patientNotes") || "{}");
      setNote(storedNotes[selectedUser.id] || "");
    }
  }, [selectedUser]);

  // const handleSelectUser = (user) => {
  //   setSelectedUser(user);
  // };

  // const handleClose = () => {
  //   setSelectedUser(null);
  //   setNote("");
  // };

  const handleAddNote = (e) => {
    e.preventDefault();
    const storedNotes = JSON.parse(localStorage.getItem("patientNotes") || "{}");
    storedNotes[selectedUser.id] = note;
    localStorage.setItem("patientNotes", JSON.stringify(storedNotes));
    alert(`Note saved for ${selectedUser.name}`);
  };

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f1f6fc] p-8">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">List of Patients</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="ml-110 mb-6 w-full max-w-md border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       {/* Users List */}
<ul className="space-y-4">
  {filteredUsers.map((user) => (
    <li
      key={user.id}
      className="bg-white p-5 rounded-lg shadow border border-gray-200 hover:bg-blue-50 transition"
    >
      <div className="flex items-center gap-4">
        <div className="bg-blue-400 text-white rounded-full w-10 h-10 flex items-center justify-center shadow">
          <FaUser />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end gap-3">
  <button
    onClick={() => {
      setSelectedUser(user);
      setViewType("details");
    }}
    className="text-sm px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
  >
    View Details
  </button>
  <button
    onClick={() => {
      setSelectedUser(user);
      setViewType("note");
    }}
    className="text-sm px-4 py-2 rounded bg-blue-900 text-white hover:bg-blue-950 transition"
  >
    Add Note
  </button>
</div>

    </li>
  ))}
</ul>

        {/* User Details Card */}
       <div className="relative transition-all duration-500 ease-in-out min-h-[350px]">
  {/* صورة ثابتة تظهر فقط بدون اختيار مريض */}
  <div
    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
      selectedUser
        ? "opacity-0 translate-x-10 pointer-events-none"
        : "opacity-100 translate-x-0"
    }`}
  >
    <img
  src={Img}
  alt="Patient"
  className="w-full h-full object-cover rounded shadow"
/>

  </div>

  {/* كارت التفاصيل أو الملاحظات مع انزلاق وتلاشي */}
  <div
    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
      selectedUser
        ? "opacity-100 translate-x-0"
        : "opacity-0 -translate-x-10 pointer-events-none"
    }`}
  >
    {selectedUser && (
      <div className="bg-white p-6 rounded-lg shadow space-y-4 relative border border-gray-200">
        <button
          onClick={() => setSelectedUser(null)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          ✖
        </button>

        <h3 className="text-xl font-semibold text-blue-400">
          {selectedUser.name}'s {viewType === "note" ? "Note" : "Details"}
        </h3>

        <p>
          <span className="font-semibold">Email:</span> {selectedUser.email}
        </p>

        {viewType === "details" ? (
          <>
            <p><span className="font-semibold">Status:</span> Stable</p>
            <p><span className="font-semibold">Last Visit:</span> 10 June 2025</p>
            <p><span className="font-semibold">Diagnosis:</span> Mild fever, dehydration</p>
            <p><span className="font-semibold">Medication:</span> Paracetamol 500mg, ORS</p>
          </>
        ) : (
          <form onSubmit={handleAddNote} className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Add Note</span>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Write a note..."
              />
            </label>

            <button
              type="submit"
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-950"
            >
              Save Note
            </button>
          </form>
        )}
      </div>
    )}
  </div>
</div>



        
      </div>
    </div>
  );
};

export default UsersPage;
