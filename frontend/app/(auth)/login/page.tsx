"use client"
import { googleOAuth, login } from "@/app/services/auth"
import axios from "axios"
import { headers } from "next/headers"
import Link from "next/link"
import { permanentRedirect, redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaGithub, FaGoogle } from "react-icons/fa"


export default  function Login(){
    const router = useRouter()
    const [error,setError] = useState("")
    
    const submitForm = async (e:any)=>{
        e.preventDefault()
        setError("")
        const formData = new FormData(e.target)
        try{
            await login(formData)
            location.href = "/platform/dashboard"
        }catch(error:any){
            setError(error.message)
        }finally{()=>setError('')}
    }

    const onGoogleSubmit = ()=>{
        // "use server"
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/google`
    }
    const onGithubSubmit = ()=>{
        // "use server"
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/github`
    }

    return(
        <main className="   items-center flex flex-col justify-center h-screen ">
            <form onSubmit={submitForm} className="gap-4 flex flex-col w-[500px] h-fit">
                <div className="flex gap-2 flex-col">
                    <h1 className="font-bold text-4xl">Welcome back!</h1>
                    <p className="text-opacity-50 text-black text-lg">Let’s find your perfect co-founder.</p>

                </div>
                <div className="flex gap-4 flex-col">
                    <div className="flex gap-2 flex-col">
                        <h2 className="text-sm ">Email</h2>
                        <input placeholder="Enter your email" name="Email" type="text" className="w-full p-2 text-md bg-opacity-0 border-2 border-black border-opacity-15 rounded-xl shadow-md bg-slate-50"></input>

                    </div>
                    <div className="flex gap-2 flex-col">
                        <h2 className="text-sm ">Password</h2>
                        <input placeholder="Enter your password" name="Password" type="password" className="w-full p-2 text-md bg-opacity-0 border-2 border-black border-opacity-15 rounded-xl shadow-md bg-slate-50"></input>

                    </div>     
                </div>
                {error.length > 0 && (<p className="text-red-700 text-sm">{error}</p>)}
                <button type = "submit" className=" bg-secondary text-white p-4 rounded-xl shadow-md hover:opacity-70 duration-300 ">Log In</button>  
                <div className="flex gap-4">
                    <button type="button" onClick={onGithubSubmit} className="w-full justify-center p-3 flex gap-4 items-center bg-complementary  border-2 border-opacity-15 rounded-xl shadow-md hover:opacity-70 duration-300"> <FaGithub size={20}></FaGithub> Sign In</button>
                </div>
                <h3 className="text-center text-opacity-50 text-black">New here? <Link className=" underline" href={"/signup"}>Create an account</Link></h3>
                {/* <div className="flex gap-4">
                    <h3 onClick={onGoogleSubmit} className="w-full justify-center p-3 flex gap-4 items-center border-black border-2 border-opacity-15 rounded-xl shadow-md"> <FaGoogle ></FaGoogle> Sign In</h3>
                </div> */}
            </form>
        </main>
    )
}