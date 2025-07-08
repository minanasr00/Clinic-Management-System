// Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Users2,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { FiMessageCircle } from "react-icons/fi"; 

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
  { to: "/appointments", label: "Appointments", icon: <CalendarDays size={20} /> },
  { to: "/patients", label: "Patients", icon: <Users2 size={20} /> },
  {
    to: "/messages",
    label: "Messages",
    icon: <FiMessageCircle size={20} strokeWidth={2} />,
  },
  { to: "/billing", label: "Billing", icon: <CreditCard size={20} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
];

const Sidebar = () => {
  return (
    
    <aside className="h-screen w-64 bg-white border-r border-gray-200
 px-4 py-8 text-black fixed top-0 left-0 mt-15">
  
      {/* Profile Section */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100?img=47"
            alt="Sarah Miller"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-base">Sarah Miller</p>
            <p className="text-sm text-gray-400">Assistant</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-black transition">
          <LogOut size={16} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 text-[15px] font-medium">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-2 py-2 rounded-xl transition-all ${
                isActive
                  ? "bg-[#f1f5f9] text-black font-semibold"
                  : "text-gray-800 hover:bg-blue-100"
              }`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;




