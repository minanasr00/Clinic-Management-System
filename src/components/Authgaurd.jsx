import { useContext } from "react"
import { AuthContext } from "../context/Authcontext"
import { Navigate } from "react-router"
import { ClockLoader } from "react-spinners"
function Authgaurd({ children, allowedRoles }) {
    const { user, role, loading } = useContext(AuthContext)
    if (loading) {
        return <div className="flex items-center justify-center h-screen text-xl font-semibold text-blue-600"><ClockLoader size={80} color="blue"/></div>
    }
    return (
        <> 
            {user && allowedRoles.includes(role) ? children : <Navigate to="/" />}
        </>
    )
}

export default Authgaurd
