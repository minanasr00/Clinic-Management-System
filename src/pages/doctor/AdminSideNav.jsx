import { useNavigate, useLocation } from "react-router";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserInjured,
  FaUserNurse,
  FaFilePrescription,
} from "react-icons/fa";
import { handleSignOut } from "../../services/firebase/auth";
import { fetchPatientsWithRole } from "../../services/firebase/patientServiceDoctor";
import { useEffect, useState } from "react";
import doctorimg from "/arak-dental-logo.jpeg";
import AppointmentsPage from './Appointments';

export default function AdminSideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPatientSlider, setShowPatientSlider] = useState(false);

  const routes = {
    Dashboard: "/Doctor/Dashboard",
    Appointments: "/Doctor/AppointmentsPage",
    Patients: "/Doctor/PatientState",
    Assistants: "/Doctor/AddAssistant",
    Prescriptions: "/",
  };


  const activeRoute = Object.keys(routes).find(key => routes[key] === location.pathname);

  useEffect(() => {
  const getPatients = async () => {
    const data = await fetchPatientsWithRole();
    setPatients(data);
  };
  getPatients();
}, []);



  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 bg-[#f7fafc] text-black p-4 h-screen overflow-y-auto border-r border-gray-300  shadow-xl">
      {/* Doctor Info */}
      <div className="flex items-center space-x-3 mb-8">
        <img
          src={doctorimg}
          alt="Doctor"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-sm">Dr. Muhamad Mahmoud</h2>
          <p className="text-sm text-[#83a3b9]-300">Arak Dental Clinic</p>
        </div>
      </div>

      {/* Sidebar Nav */}
      <nav className="space-y-4">
        <SidebarItem
          icon={<FaTachometerAlt />}
          label="Dashboard"
          route={routes.Dashboard}
          currentPath={location.pathname}
          onClick={() => navigate(routes.Dashboard)}
          isActive={activeRoute === routes.Dashboard}
        />
        <SidebarItem
          icon={<FaCalendarAlt />}
          label="Appointments"
          route={routes.Appointments}
          currentPath={location.pathname}
          onClick={() => navigate(routes.Appointments)}
        />

        {/* Patients with search + slider */}
        <SidebarItem
          icon={<FaUserInjured />}
          label="Patients"
          route={routes.Patients}
          currentPath={location.pathname}
          onClick={() => setShowPatientSlider((prev) => !prev)}
        />
        {showPatientSlider && (
          <div className="mt-2 ml-6">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="overflow-x-auto flex space-x-4 mt-3 pb-2">
              {filteredPatients.map((patient, idx) => (
                <div
                  key={patient.id || idx}
                  onClick={() => navigate(`/doctor/PatientState/${patient.id}`)}
                  className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform min-w-[60px]"
                >
                  <img
                    src={patient.imgurl || "https://via.placeholder.com/48"}
                    alt={patient.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="text-xs mt-1 text-center px-1 break-words capitalize">
                    {patient.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <SidebarItem
          icon={<FaUserNurse />}
          label="Add New Assistant"
          route={routes.Assistants}
          currentPath={location.pathname}
          onClick={() => navigate(routes.Assistants)}
        />
        <button
          onClick={() => {
            handleSignOut();
            navigate("/");
          }}
          className="bg-red-700 w-full text-white font-medium px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
        >
          Sign Out
        </button>
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, label, route, currentPath, onClick }) {
  const isActive = currentPath === route;

  return (
    <div
      onClick={() => {
        if (currentPath !== route) onClick();
      }}
      className={`flex items-center space-x-3 cursor-pointer px-3 py-2 rounded transition-all duration-200
        ${isActive ? "bg-white text-[#299eed] font-semibold shadow" : "hover:bg-[#e0e7ec] text-black"}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
