import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import * as z from "zod"
import { signIn, signinWithGoogle } from "../../services/firebase/auth";
import { FirebaseError } from "firebase/app";
import {  useContext, useState } from "react";
import { AuthContext } from "../../context/Authcontext";
import img from '../../assets/1.jpg'
import toast from "react-hot-toast";


export default function Login() {
    const {role , loading} = useContext(AuthContext)
    const [submitMessage, setSubmitMessage] = useState() 
    const navigate = useNavigate()
    const loginSchema = z.object({
        email: z.string().email("email invalid").min(1, 'email is required'),
        password: z.string().min(1,"password required")
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange"
    })

    const onSubmit = async (data) => {
        try {
            setSubmitMessage(null)
            await signIn(data.email, data.password)
            toast.success("User logged in successfully", {
                position: "top-right",
                close: 3000
            })
            if (loading && !role) {
                setSubmitMessage("Loading...")
            } else if( role === "patient" || role === "doctor" || role === "admin") {
                navigate(`/${role}`)
            }
        } catch (error) {
            console.log(error);
            if (error instanceof FirebaseError) {
                setSubmitMessage(getFriendlyError(error.code))
            }
        }
    }
    function getFriendlyError(code) {
  switch(code) {
    // Email/password login errors
    case 'auth/invalid-email':
      return "Please enter a valid email address";
    case 'auth/user-not-found':
      return "No account found with this email";
    case 'auth/wrong-password':
      return "Incorrect password";
    case 'auth/invalid-credential':
      return "Invalid login credentials";

    // Account status errors
    case 'auth/user-disabled':
      return "This account has been disabled";
    case 'auth/too-many-requests':
      return "Too many attempts. Try again later";

    // Network/technical errors
    case 'auth/network-request-failed':
      return "Network error. Check your connection";
    case 'auth/internal-error':
      return "Server error. Please try again";

    // Social login errors
    case 'auth/popup-closed-by-user':
      return "Login window was closed";
    case 'auth/cancelled-popup-request':
      return "Login cancelled";

    // General fallback
    default:
      return "Login failed. Please try again";
  }
}
    const handleGoogleSub = async () => {
        try {
            await signinWithGoogle()
            navigate("/")
        } catch (error) {
            console.log(error);
            
        }
    }
    return <>
        <div style={{backgroundImage:`url(${img})`}} className={` w-full min-h-screen bg-cover bg-left bg-no-repeat flex  justify-center items-center`}>
            <div className="sm:w-[75%] md:w-[50%] h-[50%] bg-[#000000cc] text-white flex flex-col items-center p-5">
                <div className="text-[2rem]"> Sign In</div>
                <div className="md:w-[75%] sm:w-[100%]">
                        <form onSubmit={handleSubmit(onSubmit)} className=" mx-auto">
                        <div className="mb-10">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" id="email" {...register("email")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="name@gmail.com" />
                            {errors.email && <div className="text-red-700">{errors.email.message}</div> }
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                            <input type="password" id="password" {...register("password")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" />
                            {errors.password && <div className="text-red-700">{errors.password.message}</div> }
                        </div>
                        {submitMessage && <div className="text-center text-red-700">{submitMessage}</div> }
                        <button type="submit" className="mt-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full text-md"> Sign In</button>
                    </form>
                    {/* <div className="my-3 text-center text-gray-400"> OR</div>
                    <div>
                        <button onClick={handleGoogleSub} type="button" className=" justify-center w-full text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 me-2 mb-2">
                            <FcGoogle className="text-3xl me-2"/>    
                            Continue With Google
                        </button>
                    </div> */}
                    <div className="text-center text-lg mt-3">
                        Don't Have account? <Link to="/register" className="hover:text-blue-700"> Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    </>
}
