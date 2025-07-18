import { LuBell } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router';
// import { handleSignOut } from '../../services/firebase/auth';
// 
export default function AdminNav() {
  // const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-4 border-b border-gray-200 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center w-full max-w-7xl mx-auto ">
            {/* <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex content-between items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">MediCall</span>
                </div>
              </div>
              
              {/* <nav className="flex space-x-8">
                <Link to="/DoctorDashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Dashboard</Link>
                <Link to="/AppointmentsPage" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Appointments</Link>
                <Link to="/PatientState" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Patients</Link>
                <button onClick={() => {
                                handleSignOut()
                                navigate("/")
                              }} className='bg-red-700 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-800 transition-colors'>
                                      Sign Out
                                </button>
              </nav> *
  
              <div className="flex items-center space-x-4">
                <LuBell className="w-6 h-6 text-gray-400 cursor-pointer" />
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div> */}
            {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-between">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">MediCall</span>
        </div>

        {/* Right Actions: Notification & Profile */}
        <div className="flex items-center space-x-4">
          <LuBell className="w-6 h-6 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer" />
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
        </div>
          </div>
        </header>
  )
}