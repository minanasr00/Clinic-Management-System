import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardCards from "./DashboardCards";
import DashboardChart from "./DashboardChart";
// import AppointmentStatusPie from "./AppointmentStatusPie";
import CustomCalendar from "./CustomCalendar";

const Dashboard = () => {
  const [showAppointmentsTable, setShowAppointmentsTable] = useState(false);
const [selectedDate, setSelectedDate] = useState("");

  const stats = {
    patients: 24,
    confirmed: 12,
    upcoming: 5,
    unreadChats: 3,
  };

  const handleCardClick = (key) => {
    if (key === "upcoming") {
      setShowAppointmentsTable(!showAppointmentsTable); // toggle
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
  {/* Navbar */}
  <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-6 border-b border-gray-200">
    <h1 className="text-xl font-bold text-gray-800">Medicall</h1>
  </nav>

  <div className="flex flex-1 mt-10 overflow-hidden">
    <Sidebar />

    <main className="ml-60 p-6 bg-[#ffffff] w-full overflow-y-auto">
        <h2 className="text-2xl font-semibold text-grey-900 mt-5 ml-10">Dashboard Overview</h2>

        <div className="p-6">
          <DashboardCards stats={stats} onCardClick={handleCardClick} />

          {/* ✅ جدول المواعيد */}
     {showAppointmentsTable && (
  <div className="bg-[#f9fcfd] p-6 rounded-xl shadow mb-10">
    <h3 className="text-xl font-bold mb-4">Upcoming Appointments</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-900">
        <thead>
          <tr className="text-left text-gray-700">
            <th className="px-6 py-3 font-semibold">Patient Name</th>
            <th className="px-6 py-3 font-semibold">Date</th>
            <th className="px-6 py-3 font-semibold">Time</th>
            <th className="px-6 py-3 font-semibold">Type</th>
            <th className="px-6 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white rounded-lg overflow-hidden">
          {[
            ["Sophia Clark", "2024-03-15", "10:00 AM", "Consultation"],
            ["Ethan Bennett", "2024-03-15", "11:30 AM", "Follow-up"],
            ["Olivia Harper", "2024-03-16", "09:00 AM", "Check-up"],
            ["Liam Foster", "2024-03-16", "02:00 PM", "Emergency"],
            ["Ava Morgan", "2024-03-17", "10:30 AM", "Consultation"],
          ].map(([name, date, time, type], index) => (
            <tr
              key={index}
              className={`border-t ${index === 0 ? "border-gray-200" : "border-gray-200"}`}
            >
              <td className="px-6 py-4">{name}</td>
              <td className="px-6 py-4 text-sky-600 font-medium">{date}</td>
              <td className="px-6 py-4 text-sky-600 font-medium">{time}</td>
              <td className="px-6 py-4">
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-md">
                  {type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-md">
                  Scheduled
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}



  <div className="grid grid-cols-1 md:grid-cols-2 gap-6  items-stretch">
  <div className="h-full mt-0">
    <DashboardChart />
   
  </div>
  <div className="h-full mt-3">
    <CustomCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
  </div>
</div>

        </div>
      </main>
    </div>
    </div>
  );
};

export default Dashboard;

