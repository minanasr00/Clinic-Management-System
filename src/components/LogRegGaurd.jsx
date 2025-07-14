import { useContext } from "react";
import { AuthContext } from "../context/Authcontext";
import { Navigate } from "react-router";

function LogRegGaurd({ children }) {
    const { user, role, loading } = useContext(AuthContext);    
    if (loading) {
        return <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">Loading...</div>
    }
    return (
        <>
            {user ? <Navigate to={`/${role}`} /> : children } 
        </>
    )
}

export default LogRegGaurd
