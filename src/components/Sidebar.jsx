import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Users2,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { FiMessageCircle } from "react-icons/fi";
import { handleSignOut } from "../services/firebase/auth";
import { useContext, useState } from "react";
import { AuthContext } from "../context/Authcontext";

const links = [
  { to: "/assistant/dashboard", label: "Dashboard", icon: <Home size={20} /> },
  { to: "/assistant/appointments", label: "Appointments", icon: <CalendarDays size={20} /> },
  { to: "/assistant/patients", label: "Patients", icon: <Users2 size={20} /> },
  { to: "/assistant/messages", label: "Messages", icon: <FiMessageCircle size={20} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = (
    <div className="w-64 bg-white h-full shadow-lg border-r border-gray-200 px-4 py-6">
      {/* Profile */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold">
            {user?.displayName?.charAt(0)?.toUpperCase()}
            {user?.displayName?.charAt(1)?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-base">{user?.displayName || "Unknown"}</p>
            <p className="text-sm text-gray-400">Assistant</p>
          </div>
        </div>
        <button onClick={() => {
          handleSignOut();
          navigate("/");
        }} className="text-gray-500 hover:text-black transition">
          <LogOut size={16} />
        </button>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 text-[15px] font-medium">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-2 py-2 rounded-xl transition-all ${
                isActive ? "bg-[#f1f5f9] text-black font-semibold" : "text-gray-800 hover:bg-blue-100"
              }`
            }
            onClick={() => setIsOpen(false)} // Auto close on mobile
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
  <>
    {/* ✅ Toggle Sidebar Button for mobile */}
    <button
      className="lg:hidden fixed top-3 left-0 z-50 bg-white p-2 rounded-md shadow"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <Menu size={20} />
    </button>

    {/* ✅ Sidebar for large screens */}
    <aside className="hidden lg:block fixed top-15 left-0 h-screen">
      {SidebarContent}
    </aside>

    {/* ✅ Mobile Sidebar Overlay */}
    {isOpen && (
      <div className="fixed inset-0 z-40 top-15 left-0 bg-opacity-40 flex">
        <div className="relative">
          {SidebarContent}
        </div>

        {/* ✅ Close sidebar if click outside */}
        <div className="flex-1" onClick={() => setIsOpen(false)} />
      </div>
    )}
  </>
);

};

export default Sidebar;





