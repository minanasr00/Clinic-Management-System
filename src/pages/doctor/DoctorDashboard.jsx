import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserInjured,
  FaUserNurse,
  FaFilePrescription,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router";
import { fetchPatientsWithRole } from "../../services/firebase/patientServiceDoctor";
import { fetchAppointments } from "../../services/firebase/appointmentsServiceDoctor";
import { handleSignOut } from "../../services/firebase/auth";
import AdminSideNav from "./AdminSideNav";

const DoctorDashboard = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [showPatientSlider, setShowPatientSlider] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const getPatients = async () => {
      const data = await fetchPatientsWithRole();
      setPatients(data);
    };
    getPatients();
  }, []);

  useEffect(() => {
    const getAssistants = async () => {
      const data = await fetchPatientsWithRole("assistant");
      setAssistants(data);
    };
    getAssistants();
  }, []);

  useEffect(() => {
    const getAppointments = async () => {
      const data = await fetchAppointments();
      setAppointments(data);
    };
    getAppointments();
  }, []);


  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar
      <div
        className={`z-50 md:block ${sidebarOpen ? "block fixed bg-white w-64 h-full" : "hidden"}`}
      >
        <AdminSideNav />
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar for mobile */}
        <div className="md:hidden flex justify-between items-center p-4 bg-white shadow">
          <button onClick={() => setSidebarOpen(true)} className="text-xl text-gray-700">
            <FaBars />
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>

        <main className="flex-1 bg-[#f7fafc] p-4 md:p-8 w-full max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-6">Dashboard</h1>

          {/* Upcoming Appointments */}
          <section className="mb-10">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-2xl border border-gray-200 rounded-lg text-sm">
                <thead className="bg-[#f7fafc] text-left text-gray-700">
                  <tr>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt, i) => (
                    <tr key={appt.id || i} className="border-t capitalize">
                      <td className="p-3">{appt.patientName || "N/A"}</td>
                      <td className="p-3">
                        {appt.start_time?.toDate
                          ? appt.start_time.toDate().toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        {appt.start_time?.toDate
                          ? appt.start_time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : "N/A"}
                      </td>
                      <td className="p-3">{appt.reason_for_visit || "General"}</td>
                      <td
                        className={`p-3 font-semibold ${appt.status?.toLowerCase() === "completed"
                            ? "text-green-600"
                            : appt.status?.toLowerCase() === "cancelled"
                              ? "text-red-600"
                              : appt.status?.toLowerCase() === "delayed"
                                ? "text-yellow-600"
                                : "text-gray-800"
                          }`}
                      >
                        {appt.status || "Pending"}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-10">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                className="bg-[#299eed] text-white px-4 py-2 text-sm md:text-base rounded hover:bg-blue-700"
                onClick={() => setShowPatientSlider(!showPatientSlider)}
              >
                View Patient History
              </button>
            </div>

            {showPatientSlider && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-sm px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <div className="overflow-x-auto flex space-x-4 mt-3 pb-2">
                  {filteredPatients.map((patient, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate("/Doctor/PatientState")}
                      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform min-w-[60px]"
                    >
                      <img
                        src={patient.imgurl || "https://via.placeholder.com/48"}
                        alt={patient.name}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
                      />
                      <span className="text-xs mt-1 capitalize text-center px-1 break-words">
                        {patient.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Manage Assistants */}
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Manage Assistants</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-2xl border border-gray-200 rounded-lg text-sm mb-4">
                <thead className="bg-[#f7fafc] text-left text-gray-700">
                  <tr>
                    <th className="p-3">Assistant Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assistants.map((assistant, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-3 capitalize">{assistant.name || "Unnamed"}</td>
                      <td className="p-3">{assistant.email || "No email"}</td>
                      <td className="p-3 text-green-600">Active</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="bg-[#299eed] text-white px-4 py-2 text-sm md:text-base rounded hover:bg-blue-700">
              Add Assistant
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;



{/* <aside
        className={`fixed md:relative z-20 w-64 bg-[#f7fafc] text-black p-4 h-full transition-transform transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between md:justify-start md:space-x-3 mb-8">
          <div className="flex items-center space-x-3">
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
          <button
            className="md:hidden text-xl text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="space-y-4">
          <SidebarItem
            icon={<FaTachometerAlt />}
            label="Dashboard"
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            onClick={() => {
              if (location.pathname !== "/doctor/DoctorDashboard") {
                navigate("/doctor/DoctorDashboard");
              }
            }}
          />
          <SidebarItem
            icon={<FaCalendarAlt />}
            label="Appointments"
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            onClick={() => {
              if (location.pathname !== "/AppointmentsPage") {
                navigate("/AppointmentsPage");
              }
            }}
          />

          {/* Patients Section */}
//     <div className="space-y-2">
//       <SidebarItem
//         icon={<FaUserInjured />}
//         label="Patients"
//         activeItem={activeItem}
//         setActiveItem={setActiveItem}
//         onClick={() => {}}
//       />

//       {activeItem === "Patients" && (
//         <>
//           <div className="mt-2">
//             <input
//               type="text"
//               placeholder="Search patients..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>

//           <div className="overflow-x-auto flex space-x-4 mt-3 pb-2">
//             {filteredPatients.map((patient, idx) => (
//               <div
//                 key={idx}
//                 onClick={() => navigate("/doctor/PatientState")}
//                 className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
//               >
//                 <img
//                   src={patient.img}
//                   alt={patient.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <span className="text-xs mt-1">{patient.name}</span>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>

//     <SidebarItem
//       icon={<FaUserNurse />}
//       label="Assistants"
//       activeItem={activeItem}
//       setActiveItem={setActiveItem}
//       onClick={() => {
//         if (location.pathname !== "/AddAssistantPage") {
//           navigate("/AddAssistantPage");
//         }
//       }}
//     />
//     <SidebarItem
//       icon={<FaFilePrescription />}
//       label="Prescriptions"
//       activeItem={activeItem}
//       setActiveItem={setActiveItem}
//       onClick={() => {
//         if (location.pathname !== "/") {
//           navigate("/");
//         }
//       }}
//     />
//     <button
//       onClick={() => {
//         handleSignOut();
//         navigate("/");
//       }}
//       className="bg-red-700 w-full text-white font-medium px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
//     >
//       Sign Out
//     </button>
//   </nav>
// </aside> */}