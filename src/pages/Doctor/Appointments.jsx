import { useEffect, useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuPlus, LuSearch, LuCalendar } from 'react-icons/lu';
import { fetchAppointments } from '../../services/firebase/appointmentsServiceDoctor';
import { FaBars } from 'react-icons/fa';
import AdminSideNav from './AdminSideNav';

export default function AppointmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today's date
  const [appointments, setAppointments] = useState([]); // State to hold appointments

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAppointments = await fetchAppointments();
      setAppointments(fetchedAppointments);
    };
    fetchData();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
  if (!appointment.start_time) return false; // Skip if start_time is not defined
  // Convert Firestore timestamp to JavaScript Date object
  const appointmentDate = appointment.start_time.toDate();
  return appointmentDate.getFullYear() === selectedDate.getFullYear() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getDate() === selectedDate.getDate();
});
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendarDays = () => {
    const days = [];
    const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    
    // Day headers
    dayNames.forEach((day, index) => {
      days.push(
        <div key={`header-${index}`} className="text-center text-sm font-medium text-gray-500 py-2">
          {day}
        </div>
      );
    });

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      const isToday = day === new Date().getDate() &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear(); // Highlighting today's date

      days.push(
        <div
          key={day}
          onClick={() => {
            const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            setSelectedDate(newSelectedDate);
          }}
          className={`h-10 flex items-center justify-center cursor-pointer rounded-md text-sm font-medium transition-colors ${
            isSelected 
              ? 'bg-blue-600 text-white' 
              : isToday 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-4 bg-gray-50">
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
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
      {/* Top bar for mobile */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow fixed top-0 left-0 right-0 z-40">
        <button onClick={() => setSidebarOpen(true)} className="text-xl text-gray-700">
          <FaBars />
        </button>
        <h1 className="text-xl font-bold text-[#299eed]">Appointments</h1>
        <div className="w-6" /> {/* Spacer */}
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
          <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Appointments</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Left Panel - Calendar and Search */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <LuChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <LuChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendarDays()}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Appointments for Selected Day */}
          <div className="lg:col-span-1 h-screen">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointments for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
              
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{appointment.start_time.toDate().toLocaleString()}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' 
                          : appointment.status === 'delayed' ? 'bg-yellow-100 text-yellow-800'
                          : appointment.status === 'cancelled' ? 'bg-red-100 text-red-800'
                          : appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {appointment.patient_name || 'Unknown Patient'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {appointment.reason_for_visit || 'No reason provided'}
                    </div>
                  </div>
                ))}
                
                {appointments.length === 0 && (
                  <div className="text-center py-8">
                    <LuCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments scheduled for this day</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}