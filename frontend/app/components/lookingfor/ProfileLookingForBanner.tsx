"use client"
import PaddedList from "@/app/helpers/PaddedList"
import { ILookingFor } from "@/app/interfaces"
import { getLookingForProfileData } from "@/app/services/lookingFor"
import { useEffect, useState } from "react"
import { FaCircle } from "react-icons/fa"
import { toast } from "react-toastify"
import Loading from "../ui/loading"

export default function ProfileLookingForBanner({id}:{id:number}){
    const [LookingFor,setLookingFor] = useState<ILookingFor>()

    const fetchLookingFor = async()=>{
        try{
            const data = await getLookingForProfileData(id)
            console.log("Looking for",data)
            setLookingFor(data)
        }catch(err:any){
            console.log(err)
            if(err.status == 404 || err.status == 404) return
            // toast.error(err.message)
        }
    }
    useEffect(()=>{
        fetchLookingFor()
    },[])

    if(!LookingFor) return (<h1/>)

    return(
        <div className="flex w-full flex-col gap-4 items-center border-2 shadow-md p-8 rounded-xl text-center">
            <div className="flex flex-col gap-0 items-center">
                <div className="w-fit h-fit relative items-center flex">
                    <img className="h-8 w-8    bg-secondary rounded-full">
                        
                    </img>
                    {LookingFor && LookingFor?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold text-white w-fit text-xs">{LookingFor?.firstName[0]} {LookingFor?.lastName[0]}</h1>)}
                </div>
                <h2 className="text-sm text-slate-500 ">Looking For</h2>
                <h1 className="text-3xl font-bold">{LookingFor?.role}</h1>

            </div>
            <div className="flex text-slate-500 items-center gap-2 text-sm">
                <p className=" text-slate-500">{LookingFor?.industry}</p>
                <FaCircle size={5}/>
                <p className=" text-slate-500">{LookingFor?.avaliability||"Full-Time"}</p>
            </div>
            <div className="w-[500px] flex flex-col items-center gap-4">
                <p className="text-slate-500 text-sm">{LookingFor?.description}</p>
                <PaddedList items={LookingFor?.frameworks as any}/>
            </div>
        </div>
    )
}