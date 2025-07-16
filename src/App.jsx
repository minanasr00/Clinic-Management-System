import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Updated to 'react-router-dom' if you're using it
import '../src/App.css';

// ===== Doctor Pages =====
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AddAssistantPage from './pages/Doctor/AddNewAssistant';
import PatientState from './pages/Doctor/PatientState';

// Optional: only keep if you're using TanStack Query
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// Optional: auth provider only if needed now
// import AuthProvider from './context/Authcontext';

// ===== Optional Fallback Page =====
// import PageNotFound from './pages/PageNotFound/PageNotFound'

// ======= Minimal Route Setup (Doctor Only) =======

const routes = [
  // ✅ Direct access to the Doctor Dashboard
  { path: "/doctor/dashboard", element: <DoctorDashboard /> },

  // ✅ Optional: Uncomment if you want to test other doctor pages
  { path: "/doctor/add-assistant", element: <AddAssistantPage /> },
  { path: "/doctor/PatientState", element: <PatientState /> },

  // ❌ Commented out everything else for now
  // {
  //   path: "/patient", element: (
  //     <Authgaurd allowedRoles={["patient"]}>
  //       <Layout />
  //     </Authgaurd>
  //   ), children: [
  //     { index: true, element: <Navigate to="/patient/Home" replace /> },
  //     { path: "/patient/Home", element: <Home /> },
  //     { path: "Medical history", element: <MedicalHistory /> },
  //     { path: "Book Appointment", element: <BookAppointment /> },
  //     { path: "payment", element: <Payment /> },
  //   ]
  // },

  // {
  //   path: "/assistant", element: (
  //     <Authgaurd allowedRoles={["assistant"]}>
  //       <AssistantLayout />
  //     </Authgaurd>
  //   ), children: [
  //     { index: true, element: <Navigate to="/assistant/dashboard" replace /> },
  //     { path: "/assistant/dashboard", element: <Dashboard /> },
  //     { path: "/assistant/appointments", element: <AssistantAppointments /> },
  //     { path: "/assistant/patients", element: <Patients /> },
  //     { path: "/assistant/Messages", element: <Messages /> }
  //   ]
  // },

  // { path: "/", element: <LogRegGaurd><Login /></LogRegGaurd> },
  // { path: "/register", element: <LogRegGaurd><Register /></LogRegGaurd> },
  // { path: '*', element: <PageNotFound /> }
];

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

function App() {
  return (
    <>
      {/* Optional: Remove <AuthProvider> for now if not using */}
      {/* <AuthProvider> */}
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      {/* </AuthProvider> */}
    </>
  );
}

export default App;
