import { useNavigate } from "react-router"
import img from '../../assets/a-man-stands-near-the-smartphone-on-the-screen-error-404-page-system-error-vector.jpg'
import { useState } from "react"
import { AuthContext } from "../../context/Authcontext"

export default function PageNotFound() {
    const {role} = useState(AuthContext)
    const navigate = useNavigate()
    return <div
        className=" w-full h-screen flex justify-center items-center "  style={{ backgroundImage: `url(${img})`, backgroundSize: 'fit', backgroundPosition: 'center' }}>
       
        {/* <img src={img} className="w-full flex justify-center items-center h-screen object-fit object-center relative" alt="" /> */}
        <button onClick={() => {
            if (!role) {
                navigate("/")
                return
            } else {
                navigate(`/${role}`)
            }
        }}  className="px-19 py-2 text-white bg-black mt-60 rounded-3xl hover:bg-gray-600"> go to home</button>
  </div>
}
