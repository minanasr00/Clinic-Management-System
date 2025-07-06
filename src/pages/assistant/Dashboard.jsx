import Sidebar from "./Sidebar";
import DashboardCards from "./DashboardCards";
import DashboardChart from './DashboardChart';
import AppointmentStatusPie from "./AppointmentStatusPie";


const Dashboard = () => {
  const stats = {
    patients: 24,
    confirmed: 12,
    upcoming: 5,
    unreadChats: 3,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="ml-60 p-6 bg-[#f9f9ff] h-full w-full overflow-hidden">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Dashboard Overview</h2>

        {/* Summary Cards */}
        <div className="p-6">
          <DashboardCards stats={stats} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <DashboardChart />
            <AppointmentStatusPie />
          </div>
        </div>
      </main>
    </div>
  );
};


export default Dashboard;
