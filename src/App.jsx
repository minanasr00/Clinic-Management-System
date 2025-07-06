import {createBrowserRouter, RouterProvider } from 'react-router'
import '../src/App.css'
import Login from './pages/LoginPage/Login'
import Register from './pages/RegisterPage/Register'
import Layout from './pages/Layout/Layout'
import Home from './pages/Home/Home'
import AuthProvider from './context/Authcontext';
 import {QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import PageNotFound from './pages/PageNotFound/PageNotFound'
const routes = [
  {
    path: '/', element: <Layout></Layout>, children: [
      { path: "/", element: <Home></Home> },
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
