"use client"

import { IDirectMessage } from "@/app/interfaces"
import { createDirectMessageThread } from "@/app/services/messages"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaSpinner } from "react-icons/fa"

export default function InitDm({profileId}:{profileId:number}){
    const router = useRouter()
    const [loading,setLoading] = useState(false)
    
    const createThread = async ()=>{
        setLoading(true)
        try{
            var newRoomId:IDirectMessage = await createDirectMessageThread(profileId)
            router.push(`/platform/messages/${newRoomId  }`)
        }catch(err:any){
            console.log(err.message)
        }
        setLoading(false)
    }
    return(

        loading ?(
            <FaSpinner className="rounded-xl p-2 px-4 h-fit bg-opacity-70 hover:opacity-70 duration-300 bg-secondary text-white ml-auto"></FaSpinner>
        ):(
            <button onClick={createThread} className="rounded-full text-sm h-fit p-2 px-4 hover:opacity-70 duration-300 bg-secondary text-white ml-auto">Message</button>
        )
        
    )
}