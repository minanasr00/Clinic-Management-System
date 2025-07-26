import { Outlet } from "react-router"
import AdminSideNav from "../Doctor/AdminSideNav"
// import { useState } from "react";
// import { FaBars } from "react-icons/fa";

function DoctorLayout() {
    // const [sidebarOpen, setSidebarOpen] = useState(false);
    
    return (
        <div className="flex h-screen overflow-hidden">
            {/* <button className="md:hidden absolute top-8 left-1 z-50 p-2 text-gray-700 focus:outline-none" onClick={() => {
            setSidebarOpen(true)
            }}>
                <FaBars size={20} />
            </button>
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
            )} */}
            
            <div className="hidden md:block w-64 bg-white shadow-lg h-full">
            <AdminSideNav />
            </div>
                <main className="flex-1 overflow-y-hidden bg-gray-50 p-4">
                    <Outlet />
                </main>
        </div>
    )
}

export default DoctorLayout
