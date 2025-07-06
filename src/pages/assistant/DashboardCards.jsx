import { FaUser, FaCheckCircle, FaClock, FaEnvelope } from "react-icons/fa";

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      label: "Total Patients",
      value: stats.patients,
      icon: <FaUser className="text-blue-600 text-2xl" />,
      color: "bg-blue-50",
      badgeColor: "bg-blue-600",
    },
    {
      label: "Confirmed Appointments",
      value: stats.confirmed,
      icon: <FaCheckCircle className="text-green-600 text-2xl" />,
      color: "bg-green-50",
      badgeColor: "bg-green-600",
    },
    {
      label: "Upcoming Appointments",
      value: stats.upcoming,
      icon: <FaClock className="text-yellow-600 text-2xl" />,
      color: "bg-yellow-50",
      badgeColor: "bg-yellow-500",
    },
    {
      label: "Unread Messages",
      value: stats.unreadChats,
      icon: <FaEnvelope className="text-red-600 text-2xl" />,
      color: "bg-red-50",
      badgeColor: "bg-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`p-5 rounded-xl shadow hover:shadow-md transition ${card.color} flex items-center gap-4`}
        >
          <div className="relative">
            <div className="bg-white p-4 rounded-full shadow">{card.icon}</div>
            <div
              className={`absolute -top-2 -right-2 ${card.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full shadow`}
            >
              {card.value}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
