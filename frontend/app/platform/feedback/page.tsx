"use client"
import { constants } from "@/app/helpers/constants"
import { submitFeedback } from "@/app/services/auth"
import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { toast } from "react-toastify"


export default function Dashboard(){
    const [feedback,setFeedback] = useState("")
    const [feature,setFeature] = useState('Profile Database')
    const [sentFeedback,setSentFeedback] = useState(false)
    
    const onFeedbackSent = async()=>{
        try{
            await submitFeedback({feature,feedback})
            setFeedback('')
            setSentFeedback(true)
        }catch(error:any){
            toast.error(error.message)
        }
    }

    const onFeedbackChange = (e:any)=>{
        if(e.target.value.length > 500) return
        setFeedback(e.target.value)
    }
    if(sentFeedback)
        return(
            <main className="gap-8 flex flex-col items-center justify-center h-screen">
                <FaCheck size={40} className=" bg-secondary text-white rounded-full p-2"></FaCheck>
                <div className="flex flex-col gap-2 w-96 flex items-center text-center">
                    <h1 className="p-2 text-4xl font-bold">Thank you for your feedback</h1>
                    <p className="text-slate-500">Your input helps us improve Techmatch and make {feature} even better.</p>
                </div>
                <div className="gap-4 grid grid-cols-2 w-3/12 items-center">
                    <Link href={"/platform/dashboard"} className="text-white bg-secondary p-2 rounded-md hover:opacity-50 duration-300 w-full flex  text-center items-center justify-center">Back to Dashboard</Link>
                    <button onClick={()=>setSentFeedback(false)} className="border-2 p-2 rounded-md hover:opacity-50 duration-300 w-full">Send More Feedback</button>

                </div>
            </main>
        )
    return(
        <main className="  min-h-screen p-12 gap-8 flex flex-col ">
            {/* <Navbar></Navbar> */}
            {/* <AdBanner data-full-width-responsive="true" data-ad-format="display"  data-ad-slot="6246522761"></AdBanner> */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-4xl ">Share Your Feedback</h1>
                    <h3 className="text-slate-500 text-md">We value your input! Let us know what you think about Techmatch so we can make it even better.</h3>

                </div>
                <li className="flex flex-col gap-2 text-sm text-slate-500">
                    <ol>What’s working well?</ol>
                    <ol>What could be improved?</ol>
                    <ol>Any ideas or suggestions?</ol>
                </li>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Feature</label>
                <select onChange={(e)=>setFeature(e.target.value)}  name="feature" defaultValue={"Select a feature"} className="p-1 text-sm w-96 border-2 rounded-md">
                    {constants.features.map((feature,index)=>{
                        return(
                            <option key={index} value={feature} className="p-1 text-slate-500">{feature}</option>
                        )
                    })}
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Submit your Feedback</label>
                <textarea value={feedback} onChange={onFeedbackChange} name="feedback" placeholder="Enter your feedback" className="p-1 w-6/12 text-sm h-36 border-2  rounded-md"/>
                <p className="text-xs text-slate-500">{feedback.length}/500</p>
            </div>
            <button onClick={onFeedbackSent} className=" bg-secondary px-4 text-white p-2 w-fit rounded-md text-md hover:opacity-50 duration-300">Send Feedback</button>
            
        </main>
    )
}