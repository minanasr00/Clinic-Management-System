import { useNavigate } from "react-router"
import img from '../../assets/page-404.jpg'

export default function PageNotFound() {
    const navigate = useNavigate()
    return <div
        className=" w-full h-screen">
        <img src={img} className="w-full h-screen object-cover object-center relative" alt="" />
        <button onClick={() => {
            navigate("/")
        }}  className="absolute top-[59%] left-[44%]  px-19 py-2 text-white"> 🔗</button>
  </div>
}
