import React, { useState } from "react";
import { FaTachometerAlt, FaCalendarAlt, FaUserInjured, FaUserNurse, FaFilePrescription } from "react-icons/fa";
import { useNavigate } from "react-router";
import { handleSignOut } from "../../services/firebase/auth";

const DoctorDashboard = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-[#f7fafc] text-black p-4">
        <div className="flex items-center space-x-3 mb-8">
          <img
            src="https://media.istockphoto.com/id/92347250/photo/portrait-of-a-doctor.jpg?s=612x612&w=0&k=20&c=yKBhDy7ch065QV8mE4ocec8n9uec9VmBDmT137ZjHFo="
            alt="Doctor"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">Dr. John Doe</h2>
            <p className="text-sm text-[#83a3b9]-300">Cardiologist</p>
          </div>
        </div>

        <nav className="space-y-4">
          <SidebarItem icon={<FaTachometerAlt />} label="Dashboard" activeItem={activeItem} setActiveItem={setActiveItem} onClick={()=>{navigate("/DoctorDashboard")}}  />
          <SidebarItem icon={<FaCalendarAlt />} label="Appointments" activeItem={activeItem} setActiveItem={setActiveItem} onClick={()=>{navigate("/AppointmentsPage")}} />
          <SidebarItem icon={<FaUserInjured />} label="Patients" activeItem={activeItem} setActiveItem={setActiveItem} onClick={()=>{navigate("/PatientState")}} />
          <SidebarItem icon={<FaUserNurse />} label="Assistants" activeItem={activeItem} setActiveItem={setActiveItem} onClick={()=>{navigate("/AddAssistantPage")}} />
          <SidebarItem icon={<FaFilePrescription />} label="Prescriptions" activeItem={activeItem} setActiveItem={setActiveItem} onClick={() => { navigate("/") }} />
          <button onClick={() => {
                handleSignOut()
                navigate("/")
              }} className='bg-red-700 w-full text-white font-medium px-4 py-2 rounded-lg hover:bg-red-800 transition-colors'>
                      sign Out
                    </button>
        </nav>
      </aside>

      <main className="flex-1 bg-[#f7fafc] p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <table className="w-full bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-[#f7fafc] text-left text-sm text-gray-700">
              <tr>
                <th className="p-3">Patient Name</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">John Smith</td>
                <td className="p-3">2025-07-10</td>
                <td className="p-3">10:00 AM</td>
                <td className="p-3">Emergency</td>
                <td className="p-3 text-green-600">Confirmed</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">John Smith</td>
                <td className="p-3">2025-07-11</td>
                <td className="p-3">11:00 AM</td>
                <td className="p-3">Check-up</td>
                <td className="p-3 text-green-600">Confirmed</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">John Smith</td>
                <td className="p-3">2025-07-12</td>
                <td className="p-3">12:00 PM</td>
                <td className="p-3">Follow-up</td>
                <td className="p-3 text-green-600">Confirmed</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">John Smith</td>
                <td className="p-3">2025-07-13</td>
                <td className="p-3">10:30 AM</td>
                <td className="p-3">consultation</td>
                <td className="p-3 text-green-600">Confirmed</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <button className="bg-[#299eed] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
              View Patient History
            </button>
            <button className="bg-[#e8edf2] text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer">
              Add Prescription
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Manage Assistant</h2>
          <table className="w-full bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden mb-4">
            <thead className="bg-[#f7fafc] text-left text-sm text-gray-700">
              <tr>
                <th className="p-3">Assistant Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">Alice Johnson</td>
                <td className="p-3">alice@example.com</td>
                <td className="p-3 text-green-600">Active</td>
              </tr>
              <tr>
                <td className="p-3">James Franco</td>
                <td className="p-3">James@example.com</td>
                <td className="p-3 text-red-600">Inactive</td>
              </tr>
            </tbody>
          </table>
          <button className="bg-[#299eed] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
            Add Assistant
          </button>
        </section>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, activeItem, setActiveItem }) => {
  const isActive = activeItem === label;

  return (
    <div
      onClick={() => setActiveItem(label)}
      className={`flex items-center space-x-3 cursor-pointer px-3 py-2 rounded transition-all duration-200
        ${isActive ? "bg-white text-[#299eed] font-semibold shadow" : "hover:bg-[#e0e7ec] text-black"}`}>
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default DoctorDashboard;
