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
import MainLayout from './pages/MainLayout/MainLayout';
import Layout from './pages/PatientView/Layout';
import MedicalHistory from './pages/PatientView/MedicalHistory/MedicalHistory';
import Payment from './pages/PatientView/Payment/Payment';
import BookAppointment from './pages/PatientView/BookAppointment/BookAppointment';

const routes = [
  {
    path: '/', element: <MainLayout></MainLayout>, children: [
      {
        path: "/", element: <Layout></Layout>, children: [  
          { path: "/", element:<Navigate to="/Home" replace /> }, 
          { path: "Home", element: <Home></Home> }, 
          { path: "Medical history", element: <MedicalHistory></MedicalHistory> },
          {path: "Book Appointment", element: <BookAppointment></BookAppointment> },
          { path: "payment", element: <Payment></Payment> },
      ] },
      { path: "/login", element: <Login></Login> },
      {path:"/register",element:<Register></Register>}      
    ]
  },
  {path : '*' ,element:<PageNotFound></PageNotFound>}
] 
const router = createBrowserRouter(routes)
const queryClient = new QueryClient()
function App() {

  return <>
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/> 
    </QueryClientProvider>
    </AuthProvider>
    </>
}

export default App
