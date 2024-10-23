"use client"
import { signUp } from "@/app/services/auth"
import axios from "axios"
import { headers } from "next/headers"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUp(){
    const router = useRouter()
    const submitForm = async (e:any)=>{
        e.preventDefault()
        const formData = new FormData(e.target)
        try{
            await signUp(formData)
            // router.push('/login')
        }catch(error:any){
            console.log(error.message)
            // throw new Error("An error has occured")
        }

    }

    return(
        <main className=" bg-slate-50  items-center    flex justify-center h-screen text-secondary">
            <form onSubmit={submitForm} className="p-12 gap-4 flex flex-col w-[45%] h-fit">
                <div className="flex gap-2 flex-col">
                    <h1 className="font-bold text-4xl">Join Us!</h1>
                    <p className="text-opacity-50 text-black text-lg">Let’s kickstart your entrepreneurial journey.</p>

                </div>
                <div className="flex gap-4 flex-col">
                    <div className="flex gap-2 flex-col">
                        <h2 className="text-sm ">Email</h2>
                        <input name="Email" type="text" className="w-full p-2 text-md bg-opacity-0 border-2 border-black border-opacity-15 rounded-md bg-slate-50"></input>

                    </div>
                    <div className="flex gap-2 flex-col">
                        <h2 className="text-sm ">Password</h2>
                        <input name="Password" type="password" className="w-full p-2 text-md bg-opacity-0 border-2 border-black border-opacity-15 rounded-md bg-slate-50"></input>

                    </div>     
                    <div className="flex gap-2 flex-col">
                        <h2 className="text-sm ">Confirm Password</h2>
                        <input name="ConfirmPassword" type="password" className="w-full p-2 text-md bg-opacity-0 border-2 border-black border-opacity-15 rounded-md bg-slate-50"></input>

                    </div>     
                </div>
                <button type = "submit" className=" bg-secondary text-slate-100 p-4 rounded-md ">Create Account</button>
                <h3 className="text-center text-opacity-50 text-secondary">Have an account? <Link className="text-secondary underline" href={"/login"}>Log in</Link></h3>
            </form>
        </main>
    )
}