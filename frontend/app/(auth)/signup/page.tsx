"use client"
import { signUp } from "@/app/services/auth"
import axios from "axios"
import { headers } from "next/headers"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaGithub } from "react-icons/fa"

export default function SignUp(){
    const router = useRouter()
    const [error,setError] = useState("")
    const submitForm = async (e:any)=>{
        e.preventDefault()
        const formData = new FormData(e.target)
        try{
            await signUp(formData)
            router.replace("/platform/dashboard")
        }catch(error:any){
            console.log(error.message)
            setError(error.message)
            // throw new Error("An error has occured")
        }
        

    }

    const onGithubSubmit = ()=>{
        // "use server"
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/github`
    }


    return(
        <main className=" items-center    flex justify-center h-screen ">
            <form onSubmit={submitForm} className="gap-4 flex flex-col w-[500px] h-fit">
                <div className="flex gap-2 flex-col">
                    <h1 className="font-bold text-4xl">Join Us!</h1>
                    <p className="text-opacity-50 text-black text-lg">Let’s kickstart your entrepreneurial journey.</p>

                </div>
                <div className="flex gap-4 flex-col">
                    <div className="flex gap-2 flex-col">
                        <h2 className="text-sm ">Email</h2>
                        <input placeholder="Enter an email" name="Email" type="text" className="w-full p-2 text-md bg-opacity-0 border-2 border-black border-opacity-15 rounded-xl shadow-md bg-slate-50"></input>

                    </div>
                    <div className="flex gap-2 flex-col">
                        <h2 className="text-sm ">Password</h2>
                        <input placeholder="Enter an password" name="Password" type="password" className="w-full p-2 text-md bg-opacity-0 border-2 border-black border-opacity-15 rounded-xl shadow-md bg-slate-50"></input>

                    </div>     
                    <div className="flex gap-2 flex-col">
                        <h2 className="text-sm ">Confirm Password</h2>
                        <input placeholder="Confirm your password" name="ConfirmPassword" type="password" className="w-full p-2 text-md bg-opacity-0 border-2 border-black border-opacity-15 rounded-xl shadow-md bg-slate-50"></input>

                    </div>     
                </div>
                {error.length > 0 && (<p className="text-red-700 text-sm">{error}</p>)}
                <button type = "submit" className=" bg-secondary text-slate-100 p-4 rounded-xl shadow-md hover:opacity-70 duration-300 ">Create Account</button>
                <button type="button" onClick={onGithubSubmit} className="w-full justify-center p-3 flex gap-4 items-center bg-complementary  border-2 border-opacity-15 rounded-xl shadow-md hover:opacity-70 duration-300"> <FaGithub size={20}></FaGithub> Sign In</button>
                <h3 className="text-center text-opacity-50 ">Have an account? <Link className=" underline" href={"/login"}>Log in</Link></h3>
            </form>
        </main>
    )
}