import React, { useState } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import AdminSideNav from "../doctor/AdminSideNav";
import doctorimg from "../../assets/istockphoto-92347250-612x612.jpg";
import logo from "../../assets/logo.jpg";

const PatientState = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedPatient = {
    name: "Alice Johnson",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    nextAppointment: "2025-07-12",
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mobile Sidebar and Overlay */}
      {sidebarOpen && (
        <>
          {/* Black overlay */}
          <div
            className="fixed inset-0 bg-opacity-40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg overflow-y-auto">
            <AdminSideNav />
          </div>
        </>
      )}

      {/* Main layout */}
      <div className="flex h-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AdminSideNav />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#f7fafc]">
          {/* Top Navbar */}
          <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-2 font-semibold text-xl text-[#299eed]">
              {/* Hamburger (mobile only) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-700 text-2xl mr-2"
              >
                <FaBars />
              </button>
              <img
                src={logo}
                alt="Logo"
                className="w-8 h-8"
              />
              <span>Clinic System</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaBell className="text-xl text-gray-600 cursor-pointer" />
              <img
                src={doctorimg}
                className="w-10 h-10 rounded-full object-cover"
                alt="Doctor"
              />
            </div>
          </nav>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 bg-[#f8fafc]">
            <h1 className="text-2xl sm:text-3xl font-bold">{selectedPatient.name}</h1>

            {/* Personal Info */}
            <section className="bg-white p-6 rounded shadow">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm sm:text-base text-gray-700">
                <div className="font-bold">Full Name:</div>
                <div>{selectedPatient.name}</div>
                <div className="font-bold">Gender:</div>
                <div>Female</div>
                <div className="font-bold">Email:</div>
                <div>alice@example.com</div>
                <div className="font-bold">Date of Birth:</div>
                <div>1991-05-20</div>
                <div className="font-bold">Contact:</div>
                <div>+201123456789</div>
                <div className="font-bold">Address:</div>
                <div>Cairo, Egypt</div>
              </div>
            </section>

            {/* Appointment History */}
            <section className="bg-white p-6 rounded shadow">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Appointment History</h2>
                <button className="text-[#299eed] text-sm hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base font-semibold text-left">
                  <thead className="text-gray-500 border-b">
                    <tr>
                      <th className="py-2">Date</th>
                      <th className="py-2">Time</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-2">2025-05-12</td>
                      <td className="py-2">9:00 AM</td>
                      <td className="py-2">Checkup</td>
                      <td className="py-2">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Prescriptions */}
            <section className="bg-white p-6 rounded shadow">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Prescriptions</h2>
                <button className="bg-[#299eed] text-white px-4 py-2 rounded-full text-xs sm:text-sm hover:bg-[#247cc4]">
                  + Add New
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base font-semibold text-left">
                  <thead className="text-gray-500 border-b">
                    <tr>
                      <th className="py-2">Medication</th>
                      <th className="py-2">Dosage</th>
                      <th className="py-2">Frequency</th>
                      <th className="py-2">Refills</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-2">Atorvastatin</td>
                      <td className="py-2">10mg</td>
                      <td className="py-2">Once Daily</td>
                      <td className="py-2">2</td>
                      <td className="py-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientState;
