import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaClipboardList,
  FaComments,
  FaUsers
} from "react-icons/fa";

const Sidebar = () => {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/appointments", label: "Appointments", icon: <FaCalendarCheck /> },
    { to: "/measurements", label: "Measurements Form", icon: <FaClipboardList /> },
    { to: "/chat", label: "Chat", icon: <FaComments /> },
    { to: "/Patientslist", label: "Patients List", icon: <FaUsers /> },
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white w-60 fixed top-0 left-0 flex flex-col shadow-xl">
      <h1 className="text-2xl font-bold px-6 py-5 border-b border-blue-700">Clinic Panel</h1>
      <nav className="flex flex-col p-4 gap-2 text-sm font-medium">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-5 px-4 py-2 rounded-md transition mb-3 ${
                isActive ? "bg-white text-blue-900 font-semibold" : "hover:bg-blue-700"
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

