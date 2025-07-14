import { useNavigate } from "react-router"
import img from '../../assets/page-404.jpg'
import { useState } from "react"
import { AuthContext } from "../../context/Authcontext"

export default function PageNotFound() {
    const {role} = useState(AuthContext)
    const navigate = useNavigate()
    return <div
        className=" w-full h-screen">
        <img src={img} className="w-full h-screen object-cover object-center relative" alt="" />
        <button onClick={() => {
            if (!role) {
                navigate("/")
                return
            } else {
                navigate(`/${role}`)
            }
        }}  className="absolute top-[59%] left-[44%]  px-19 py-2 text-white bg-black rounded-3xl hover:bg-gray-600"> go to home</button>
  </div>
}
