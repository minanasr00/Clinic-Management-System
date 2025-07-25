/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardCards from "./DashboardCards";
import DashboardChart from "./DashboardChart";
import CustomCalendar from "./CustomCalendar";
import {
  getUpcomingAppointmentsCount,
  getCompletedAppointments,
  getUpcomingAppointments,
  getCompletedPatientsCount,
} from "../../services/firebase/appointmentsServices";
import { getPatientsCount } from "../../services/firebase/AssistantpatientsServices";
import { getAllUnreadMessagesForUser } from "../../services/firebase/chatServices";
import { useContext } from "react";
import { AuthContext } from "../../context/Authcontext";



const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState("");
  const [stats, setStats] = useState({
    patients: 0,
    confirmed: 0,
    upcoming: 0,
    unreadChats: 3,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [showUnreadTable, setShowUnreadTable] = useState(false);
  const [showUpcomingTable, setShowUpcomingTable] = useState(false);
  const [showConfirmedTable, setShowConfirmedTable] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [upcomingCount, patientCount, completedCount] = await Promise.all([
          getUpcomingAppointmentsCount(),
          getPatientsCount(),
          getCompletedPatientsCount(),
        ]);
        const unreadMsgs = await getAllUnreadMessagesForUser(user.uid);

        setStats({
        upcoming: upcomingCount,
        patients: patientCount,
        confirmed: completedCount,
        unreadChats: unreadMsgs.length,
        });
      } catch (err) {
        console.error("Error loading stats", err);
      }
    };

    fetchStats();
  }, []);

  const handleCardClick = async (key) => {
    if (key === "unreadChats") {
    setShowUpcomingTable(false);
    setShowConfirmedTable(false);

    const msgs = await getAllUnreadMessagesForUser(user.uid);

    // جلب أسماء المرسلين بدل الـ senderId
    const msgsWithSenderNames = await Promise.all(
      msgs.map(async (msg) => {
        const senderRef = doc(db, "users", msg.senderId);
        const senderSnap = await getDoc(senderRef);
        const senderName = senderSnap.exists() ? senderSnap.data().name : "Unknown";
        return { ...msg, senderName };
      })
    );

    setUnreadMessages(msgsWithSenderNames);
    setShowUnreadTable(true);
  }
if(key=='patients'){
  window.location.href='/assistant/Patients'
}
if (key === "unreadChats") {

  window.location.href='/assistant/messages'


  // setShowUpcomingTable(false);
  // setShowConfirmedTable(false);
  // const msgs = await getAllUnreadMessagesForUser(user.uid);
  // setUnreadMessages(msgs);
  // setShowUnreadTable(true);
}

    if (key === "upcoming") {
      setShowConfirmedTable(false);
      const data = await getUpcomingAppointments();
      setUpcomingAppointments(data);
      setShowUpcomingTable(true);
    }

    if (key === "confirmed") {
      setShowUpcomingTable(false);
      const data = await getCompletedAppointments();
      setConfirmedAppointments(data);
      setShowConfirmedTable(true);
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
          <h2 className="text-2xl font-semibold text-grey-900 mt-5 ml-10">
            Dashboard Overview
          </h2>

          <div className="p-6">
            <DashboardCards stats={stats} onCardClick={handleCardClick} />
            
            {/* ✅ جدول upcoming */}
            {showUpcomingTable && (
              <div className="bg-[#f9fcfd] p-6 rounded-xl shadow mb-10">
                <h3 className="text-xl font-bold mb-4">Upcoming Appointments</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-900">
                    <thead>
                      <tr className="text-left text-gray-700">
                        <th className="px-6 py-3 font-semibold">Patient Name</th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                        <th className="px-6 py-3 font-semibold">Time</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white rounded-lg overflow-hidden">
                      {upcomingAppointments.map((appt) => {
                        const date = new Date(appt.start_time.seconds * 1000);
                        return (
                          <tr key={appt.id} className="border-t border-gray-200">
                            <td className="px-6 py-4">{appt.patient_name}</td>
                            <td className="px-6 py-4 text-sky-600 font-medium">
                              {date.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sky-600 font-medium">
                              {date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-sm font-medium px-3 py-1 rounded-md capitalize ${
                                  appt.status === "scheduled"
                                    ? "bg-blue-100 text-blue-700"
                                    : appt.status === "delayed"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {appt.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ✅ جدول confirmed */}
            {showConfirmedTable && (
              <div className="bg-[#f9fcfd] p-6 rounded-xl shadow mb-10">
                <h3 className="text-xl font-bold mb-4">Completed Appointments</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-900">
                    <thead>
                      <tr className="text-left text-gray-700">
                        <th className="px-6 py-3 font-semibold">Patient Name</th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                        <th className="px-6 py-3 font-semibold">Time</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white rounded-lg overflow-hidden">
                      {confirmedAppointments.map((appt) => {
                        const date = new Date(appt.start_time.seconds * 1000);
                        return (
                          <tr key={appt.id} className="border-t border-gray-200">
                            <td className="px-6 py-4">{appt.patient_name}</td>
                            <td className="px-6 py-4 text-sky-600 font-medium">
                              {date.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sky-600 font-medium">
                              {date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-md">
                                {appt.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {showUnreadTable && (
  <div className="bg-[#f9fcfd] p-6 rounded-xl shadow mb-10">
    <h3 className="text-xl font-bold mb-4">Unread Messages</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-900">
        <thead>
          <tr className="text-left text-gray-700">
            <th className="px-6 py-3 font-semibold">Sender</th>
            <th className="px-6 py-3 font-semibold">Message</th>
            <th className="px-6 py-3 font-semibold">Time</th>
          </tr>
        </thead>
        <tbody className="bg-white rounded-lg overflow-hidden">
          {unreadMessages.map((msg) => {
            const date = msg.createdAt?.toDate
              ? msg.createdAt.toDate()
              : new Date();
            return (
              <tr key={msg.id} className="border-t border-gray-200">
                <td className="px-6 py-4">{msg.senderName}</td>
                <td className="px-6 py-4">{msg.text}</td>
                <td className="px-6 py-4 text-sky-600 font-medium">
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <div className="h-full mt-0">
                <DashboardChart />
              </div>
              <div className="h-full mt-3">
                <CustomCalendar
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;



