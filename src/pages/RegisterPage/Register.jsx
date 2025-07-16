import { Link } from "react-router";
import { useForm,} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {signUp } from "../../services/firebase/auth";
import { useState } from "react";
import { FirebaseError } from 'firebase/app';
import img from '../../assets/1.jpg'

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
        confirmPassword: z.string().min(1, "confirm password is required"),
        name: z.string().min(1, "Name is required").max(20, "Name must be less than 20 characters"),
        phone: z.string().min(1, "Phone is required").regex(/^(?:\+20|0)?1[0125][-\s]?[0-9]{4}[-\s]?[0-9]{4}$/, "Phone number must be 10 digits"),
        dob: z.string().min(1, "Date of birth is required").refine((val) => {
      // Validate date format (YYYY-MM-DD)
      const regex = /^\d{2}-\d{2}-\d{4}$/;
      return regex.test(val);
    }, {
      message: "Invalid date format. Use DD-MM-YYYY"
        }),
        gender: z.enum(["male", "female"], {
    required_error: "Gender selection is required",
    invalid_type_error: "Please select a valid gender option"
        })
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
        <div style={{backgroundImage:`url(${img})`}} className={` w-full min-h-screen bg-cover bg-center bg-no-repeat flex  justify-center items-center`}>
                    <div className="sm:w-[75%] md:w-[50%] h-[50%] bg-[#000000cc] text-white flex flex-col items-center p-5">
                        <div className="text-[2rem]"> Sign Up</div>
                        <div className="md:w-[75%] sm:w-[100%]">
                                <form onSubmit={handleSubmit(onSubmet)} className=" mx-auto">
                                <div className="mb-5">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                    <input type="text" id="name" {...register("name")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="Your Name" />
                                    {errors.name && <div className="text-red-700">{errors.name.message}</div> }
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input type="email" id="email" {...register("email")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="name@gmail.com" />
                                    {errors.email && <div className="text-red-700">{errors.email.message}</div> }
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" id="password" {...register("password")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" />
                                    {errors.password && <div className="text-red-700">{errors.password.message}</div> }
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                    <input type="password" id="confirmPassword" {...register("confirmPassword")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" />
                                    {errors.confirmPassword && <div className="text-red-700">{errors.confirmPassword.message}</div> }
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                                    <input type="text" id="phone" {...register("phone")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" />
                                    {errors.phone && <div className="text-red-700">{errors.phone.message}</div> }
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date Of Birth     (format dd-MM-YYYY)</label>
                                    <input type="text" id="dob" {...register("dob")} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" />
                                    {errors.dob && <div className="text-red-700">{errors.dob.message}</div> }
                                </div>
                                <div className="mb-5">
                             <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="male"
                                    className="h-4 w-4  text-blue-600 focus:ring-blue-500 border-gray-300"
                                    {...register("gender")}
                                />
                                <span className="ml-2 text-white me-5">Male</span>
                                </label>
                                
                                <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="female"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    {...register("gender")}
                                />
                                <span className="ml-2 text-white">Female</span>
                                </label>
                                    {errors.gender && <div className="text-red-700">{errors.gender.message}</div> }
                                </div>
                                <div className="flex items-start mb-5">
                                    
                                    </div>
                                    {submitMessage && <div className="my-3 text-red-700 text-center">{submitMessage}</div>}
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full">Sign Up</button>
                            </form>
                            <div>
                                Have account? <Link to="/login" className="hover:text-blue-700"> Sign In</Link>
                            
                    </div>  
                        </div>
                    </div>
                </div>
    </>
}
