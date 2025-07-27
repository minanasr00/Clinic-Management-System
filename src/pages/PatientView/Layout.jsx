import { useContext, useRef, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router';
import { TiThMenuOutline } from "react-icons/ti";
import { handleSignOut } from '../../services/firebase/auth';
import { AuthContext } from '../../context/Authcontext';
import doctorimg from "/arak-dental-logo.jpeg";


export default function Layout() {
  const [activeNav, setActiveNav] = useState()
  const { setLoading ,user} = useContext(AuthContext)
  const navItems = ['Home', 'Medical history']
  const ref = useRef(null)
  const navigate = useNavigate()
    return <>
          <header className="bg-white shadow-sm px-6 py-4 text-[#0F141A]">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div className="flex items-center space-x-1">
      <div className="w-8 h-8 bg-[#0F141A] rounded-full flex items-center justify-center">
        <img
          src={doctorimg}
          alt="Doctor"
          className="w-full h-full rounded-full"
        />
      </div>
      <span className="text-xl font-semibold font-[lexend] text-gray-900">Arak Dental Clinic</span>
    </div>
    
    {/* Desktop Navigation - hidden on mobile */}
    <nav className="hidden md:flex items-center space-x-4">
      <div className='flex items-center space-x-6'>
        {navItems.map((item) => (
          <Link
            to={item}    
            key={item}
            onClick={() => setActiveNav(item)}
            className={`text-md cursor-pointer font-medium transition-colors ${
              activeNav === item 
                ? 'text-teal-600' 
                : 'text-gray-700 hover:text-black'
            }`}
          >
            {item}
          </Link>
        ))}
        <Link onClick={()=>{setActiveNav("Book Appointment")}} to={"Book Appointment"} className={`${activeNav == "Book Appointment" ? "bg-teal-500" :""} bg-[#BFD9ED] text-md text-[#0F141A] px-6 py-2 rounded-lg font-medium hover:bg-teal-500 transition-colors`}>
          Book Appointment
        </Link>
        <Link onClick={()=>{setActiveNav("patient chat")}} to={"patient chat"} className={`${activeNav == "patient chat" ? "bg-teal-500" :""} bg-[#BFD9ED] text-md text-[#0F141A] px-6 py-2 rounded-lg font-medium hover:bg-teal-500 transition-colors`}>
          Chat
        </Link>
        <button onClick={() => {
          setLoading(true)
          handleSignOut()
          navigate("/")
        }} className='bg-red-700 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-800 transition-colors'>
          sign Out
        </button>
      </div>
      
      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-lg">{(user?.displayName?.charAt(0).toUpperCase())}{user?.displayName?.charAt(1)}</span>
      </div>
    </nav>
    
    {/* Mobile menu button - shown only on mobile */}
    <div className="md:hidden flex items-center space-x-4">
      <button onClick={() => {
        let element = ref.current
        if (element) {
          element.classList.toggle("hidden")
        }
      }}>
        <TiThMenuOutline className='text-2xl text-[#0F141A]' />
      </button>
      
      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-lg">{(user?.displayName?.charAt(0).toUpperCase())}{user?.displayName?.charAt(1)}</span>
      </div>
    </div>
  </div>
  
  {/* Mobile menu - hidden by default, shown when toggled */}
  <div ref={ref} className='hidden md:hidden flex flex-col bg-white py-2 gap-4 items-center border-t border-gray-200'>
    {navItems.map((item) => (
      <Link
        to={item}
        key={item}
        onClick={() => {
          setActiveNav(item);
          // Also hide the menu when an item is clicked
          let element = ref.current;
          if (element) {
            element.classList.add("hidden");
          }
        }}
        className={`text-md cursor-pointer w-full font-medium transition-colors ${
          activeNav === item 
            ? 'text-teal-600' 
            : 'text-gray-700 hover:text-black'
        }`}
      >
        {item}
      </Link>
    ))}
    <Link 
      onClick={()=>{
        setActiveNav("Book Appointment");
        let element = ref.current;
        if (element) {
          element.classList.add("hidden");
        }
      }} 
      to={"Book Appointment"} 
      className={`${activeNav == "Book Appointment" ? "bg-teal-500" :""} bg-[#BFD9ED] text-md text-[#0F141A] px-6 py-2 rounded-lg font-medium hover:bg-teal-500 transition-colors`}
    >
      Book Appointment
    </Link>
    <Link 
      onClick={()=>{
        setActiveNav("patient chat");
        let element = ref.current;
        if (element) {
          element.classList.add("hidden");
        }
      }} 
      to={"patient chat"} 
      className={`${activeNav == "patient chat" ? "bg-teal-500" :""} bg-[#BFD9ED] text-md text-[#0F141A] px-6 py-2 rounded-lg font-medium hover:bg-teal-500 transition-colors`}
    >
      Chat
    </Link>
    <button onClick={() => {
      setLoading(true)
      handleSignOut()
      navigate("/")
    }} className='bg-red-700 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-800 transition-colors'>
      sign Out
    </button>
  </div>
</header>
        <Outlet></Outlet>
    </>
}