import { Link } from "react-router";
import { useForm,} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {signUp } from "../../services/firebase/auth";
import { useState } from "react";
import { FirebaseError } from 'firebase/app';

export default function Register() {
    const [submitMessage , setSubmitMessage]  = useState(null)
    // console.log(user);

    const signUpSchema = z.object({
        email: z.string().email("Invalid Email").min(1, "Email is required"),
        password: z.string()
                .min(8, 'Password must be at least 8 characters')
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
        confirmPassword:z.string().min(1,"confirm password is required")
        
    }).refine((data) => {
        return data.password === data.confirmPassword
    }, {
        message: "Password don't match",
        path: ['confirmPassword']
    })



    const { register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(signUpSchema),
        mode: "onChange"
    })

    const onSubmet = async (data) => {
        try {
            setSubmitMessage(null)
            const res = await signUp(data.email, data.password)
            console.log(res);
            
        } catch (error) {
            if (error instanceof FirebaseError) {
                setSubmitMessage(error.code);
            }
        }
    }
    return <>
        <div className={`bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url("../assets/zjgs096khv591.jpg")] w-full min-h-screen bg-cover bg-center bg-no-repeat flex  justify-center items-center`}>
                    <div className="sm:w-[75%] md:w-[50%] h-[50%] bg-[#000000cc] text-white flex flex-col items-center p-5">
                        <div className="text-[2rem]"> Sign Up</div>
                        <div className="md:w-[75%] sm:w-[100%]">
                                <form onSubmit={handleSubmit(onSubmet)} className=" mx-auto">
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
                                <div className="mb-5">
                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                    <input type="password" id="confirmPassword" {...register("confirmPassword")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" />
                                    {errors.confirmPassword && <div className="text-red-700">{errors.confirmPassword.message}</div> }
                                </div>
                                <div className="flex items-start mb-5">
                                    <div className="flex items-center h-5">
                                    <input id="terms" type="checkbox"  className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600  dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                                    </div>
                                    <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
                                    </div>
                                    {submitMessage && <div className="my-3 text-red-700 text-center">{submitMessage}</div>}
                                <button type="submit" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 w-full">Sign Up</button>
                            </form>
                            <div>
                                Have account? <Link to="/login" className="hover:text-blue-700"> Sign In</Link>
                            </div>
                        </div>
                    </div>
                </div>
    </>
}
