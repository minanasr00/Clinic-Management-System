import { Outlet } from "react-router"
import AdminSideNav from "./AdminSideNav"

function DoctorLayout() {
    return (
        <div className="flex">
            <AdminSideNav />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
        </div>
    )
}

export default DoctorLayout
