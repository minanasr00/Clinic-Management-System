import { Outlet } from "react-router"
import AdminSideNav from "./AdminSideNav"

function DoctorLayout() {
    return (
       <>
       <AdminSideNav />
       <Outlet />
       </>
    )
}

export default DoctorLayout
