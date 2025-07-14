import { Outlet } from "react-router"
import Sidebar from "../../components/Sidebar"

function AssistantLayout() {
    return (
        <div>
            <Sidebar />
            <main className="flex-1 p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default AssistantLayout
