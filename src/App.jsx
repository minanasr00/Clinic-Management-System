import {createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import '../src/App.css'
import Login from './pages/LoginPage/Login'
import Register from './pages/RegisterPage/Register'

import AuthProvider from './context/Authcontext';
 import {QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import PageNotFound from './pages/PageNotFound/PageNotFound'
import Home from './pages/PatientView/Home/Home';
import Layout from './pages/PatientView/Layout';
import MedicalHistory from './pages/PatientView/MedicalHistory/MedicalHistory';
import Payment from './pages/PatientView/Payment/Payment';
import BookAppointment from './pages/PatientView/BookAppointment/BookAppointment';
import Authgaurd from './components/Authgaurd';
import LogRegGaurd from './components/logRegGaurd';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import AppointmentsPage from './pages/Doctor/Appointments';
import AddAssistantPage from './pages/Doctor/AddNewAssistant';
import PatientState from './pages/Doctor/PatientState';
import Dashboard from './pages/assistant/Dashboard';
import AssistantAppointments from './pages/assistant/AssistantAppointments';
import AssistantLayout from './pages/assistant/AssistantLayout';
import Patients from './pages/assistant/Patients';
import Messages from './pages/assistant/AssistantChat';
import { Toaster } from 'react-hot-toast';

const routes = [
  {
    path: "/patient", element: <Authgaurd allowedRoles={["patient"]}><Layout></Layout></Authgaurd>, children: [
      { index: true, element: <Navigate to="/patient/Home" replace /> },
      { path: "/patient/Home", element: <Home></Home> },
      { path: "Medical history", element: <MedicalHistory></MedicalHistory> },
      { path: "Book Appointment", element: <BookAppointment></BookAppointment> },
      { path: "payment", element: <Payment></Payment> },
    ]
  },
  {
    path: "/doctor", element: <Authgaurd allowedRoles={["doctor"]}><DoctorDashboard /></Authgaurd>, children: [
      { path: "/doctor/Dashboard", element: <DoctorDashboard></DoctorDashboard> },
      // { path: "/Appointments", element: <AppointmentsPage></AppointmentsPage> },
      { path: "AddAssistant", element: <AddAssistantPage></AddAssistantPage> },
      { path: 'PatientState', element: <PatientState></PatientState> }
    ]
  },
  {
    path: "/assistant", element: <Authgaurd allowedRoles={["assistant"]}><AssistantLayout/></Authgaurd>, children: [
      { index : true, element: <Navigate to="/assistant/dashboard" replace/> },
      { path: "/assistant/dashboard", element: <Dashboard /> },
      { path: "/assistant/appointments", element: <AssistantAppointments/> },
      { path: "/assistant/patients", element: <Patients/> },
      { path: "/assistant/Messages", element: <Messages/> }
    ]
  },
  { path: "/", element:<LogRegGaurd><Login></Login></LogRegGaurd>  },
  { path: "/register", element:<LogRegGaurd><Register></Register> </LogRegGaurd> },
  {path : '*' ,element:<PageNotFound></PageNotFound>}
] 
const router = createBrowserRouter(routes)
const queryClient = new QueryClient()
function App() {

  return <>
    <Toaster></Toaster>
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/> 
    </QueryClientProvider>
    </AuthProvider>
    </>
}

export default App