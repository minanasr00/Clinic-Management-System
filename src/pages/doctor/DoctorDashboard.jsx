import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserInjured,
  FaUserNurse,
  FaFilePrescription,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { fetchPatientsWithRole } from "../../services/firebase/patientServiceDoctor";
import { fetchAppointments } from "../../services/firebase/appointmentsServiceDoctor";
import AdminSideNav from "./AdminSideNav";

const DoctorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [showPatientSlider, setShowPatientSlider] = useState(false);
  const navigate = useNavigate();


  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const getPatients = async () => {
      const data = await fetchPatientsWithRole();
      console.log("Fetched Patients:", data);
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
      console.log("Fetched Appointments:", data);

      // Get today's date in Y-M-D
      const today = new Date();
      const todayStr = today.toLocaleDateString();

      // Filter appointments to only those with today's date
      const todaysAppointments = data.filter((appt) => {
        const startTime = appt.start_time?.toDate?.();
        if (!startTime) return false;

        const dateStr = startTime.toLocaleDateString();
        return dateStr === todayStr;
      });

      // Sort them by time (earliest first)
      const sortedAppointments = todaysAppointments.sort((a, b) => {
        const timeA = a.start_time?.toDate?.().getTime() || 0;
        const timeB = b.start_time?.toDate?.().getTime() || 0;
        return timeA - timeB;
      });

      setAppointments(sortedAppointments);
    };

    getAppointments();
  }, []);



  return (
    <div className="flex md:flex-row h-screen p-4 md:p-8">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
            <div
            className="fixed inset-0 bg-black opacity-40 z-40"
            onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg overflow-y-auto">
            <AdminSideNav />
            </div>
        </>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar for mobile */}
        <div className="md:hidden flex justify-between items-center p-4 bg-white shadow fixed top-0 left-0 right-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="text-xl text-gray-700">
            <FaBars />
          </button>
          <h1 className="text-xl font-bold text-[#299eed]">Dashboard</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>

        <main className="flex-1 bg-[#f7fafc]  w-full max-w-screen mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 pl-3">Dashboard</h1>

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
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">
                        No appointments found for today.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt, i) => (
                      <tr key={appt.id || i} className="border-t capitalize">
                        <td className="p-3">{appt.patientName || "N/A"}</td>
                        <td className="p-3">
                          {appt.start_time?.toDate
                            ? appt.start_time.toDate().toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-3">
                          {appt.start_time?.toDate
                            ? appt.start_time.toDate().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
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
                    ))
                  )}
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
                      onClick={() => navigate(`/Doctor/PatientState/${patient.id}`)}
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
              <table className="min-w-full bg-white shadow-md border border-gray-200 rounded-lg text-sm mb-4">
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
            <button
              onClick={() => navigate("/Doctor/AddAssistant")}
              className="bg-[#299eed] text-white px-4 py-2 text-sm md:text-base rounded hover:bg-blue-700"
            >
              Add Assistant
            </button>

          </section>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;