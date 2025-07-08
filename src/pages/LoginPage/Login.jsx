import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import * as z from "zod"
import { signIn, signinWithGoogle } from "../../services/firebase/auth";
import { FirebaseError } from "firebase/app";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/Authcontext";



export default function Login() {
    const { user } = useContext(AuthContext)
    console.log(user);
    const [submitMessage, setSubmitMessage] = useState() 
    const navigate = useNavigate()
    const loginSchema = z.object({
        email: z.string().email("email invalid").min(1, 'email is required'),
        password: z.string().min(1,"password.required")
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange"
    })

    const onSubmit = async (data) => {
        try {
            setSubmitMessage(null)
            await signIn(data.email, data.password)
            navigate("/")
        } catch (error) {
            console.log(error);
            if (error instanceof FirebaseError) {
                setSubmitMessage(error.message)
            }
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
        <div className={`bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url("../../assets/log-reg-612x612.jpg")] w-full min-h-screen  bg-cover bg-center bg-no-repeat flex  justify-center items-center`}>
            <div className="sm:w-[75%] md:w-[50%] h-[50%] bg-[#000000cc] text-white flex flex-col items-center p-5">
                <div className="text-[2rem]"> Sign In</div>
                <div className="md:w-[75%] sm:w-[100%]">
                        <form onSubmit={handleSubmit(onSubmit)} className=" mx-auto">
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" id="email" {...register("email")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="name@gmail.com" />
                            {errors.email && <div className="text-red-700">{errors.email.message}</div> }
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                            <input type="password" id="password" {...register("password")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" />
                            {errors.password && <div className="text-red-700">{errors.password.message}</div> }
                        </div>
                        <div className="flex items-start mb-5">
                            <div className="flex items-center h-5">
                            <input id="terms" type="checkbox"  className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600  dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                            </div>
                            <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
                        </div>
                        {submitMessage && <div className="text-center text-red-700">{submitMessage}</div> }
                        <button type="submit" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 w-full">Sign In</button>
                    </form>
                    <div className="my-3 text-center text-gray-400"> OR</div>
                    <div>
                        <button onClick={handleGoogleSub} type="button" className=" justify-center w-full text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 me-2 mb-2">
                            <FcGoogle className="text-3xl me-2"/>    
                            Continue With Google
                        </button>
                    </div>
                    <div>
                        Don't Have account? <Link to="/register" className="hover:text-blue-700"> Sign UP</Link>
                    </div>
                </div>
            </div>
        </div>
    </>
}
