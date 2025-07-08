import { useRef, useState } from 'react'
import { Cross } from 'lucide-react'
import { Link, Outlet } from 'react-router';
import { TiThMenuOutline } from "react-icons/ti";


export default function Layout() {
     const [activeNav, setActiveNav] = useState()
    const navItems = ['Home', 'Medical history', 'About Us']
    const ref = useRef(null)
    return <>
         <header className="bg-white shadow-sm px-6 py-4 text-[#0F141A]">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="w-8 h-8 bg-[#0F141A] rounded-full flex items-center justify-center">
                      <Cross className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-semibold font-[lexend] text-gray-900">Dr. Bennett's Clinic</span>
                  </div>
                <nav className="flex items-center space-x-4">
                    <div className='sm:hidden md:flex items-center space-x-6'>

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
                    <button className="bg-[#BFD9ED] text-md text-[#0F141A] px-6 py-2 rounded-lg font-medium hover:bg-teal-500 transition-colors">
                      Book Appointment
                    </button>
                    </div>
                    <div>
                        <TiThMenuOutline className='sm:block md:hidden text-2xl text-[#0F141A]' onClick={() => {
                            let element = ref.current
                            if (element) {
                                element.classList.toggle("sm:hidden")
                            }
                        }}/>
                    </div>
                   
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  </nav>
            </div>
             <div ref={ref} className='sm:hidden md:hidden border border-t-0 border-gray-100'>
                         {navItems.map((item) => (
                      <button
                        key={item}
                        onClick={() => setActiveNav(item)}
                        className={`text-md cursor-pointer w-full font-medium transition-colors ${
                          activeNav === item 
                            ? 'text-teal-600' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                    </div>
              </header>
        <Outlet></Outlet>
    </>
}

