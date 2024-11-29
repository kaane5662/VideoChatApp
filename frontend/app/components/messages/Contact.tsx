"use client"
import { IDirectMessage } from "@/app/interfaces";
import { useRouter } from "next/navigation";

export default function Contact({directMessage}:{directMessage:IDirectMessage}){
    const router = useRouter()
    return(

    <div onClick={()=>router.push(`/messages/${directMessage.roomId}`)} className="flex gap-4 hover:bg-opacity-10 hover:cursor-pointer duration-300 hover:bg-secondary ">
        <img className="h-14 w-14 rounded-full bg-secondary self-center"></img>
        <div className="flex  border-y p-4 w-full">
            
            <div className="flex-col gap-2 flex">
                <h3 className="text-xl font-bold">{directMessage.profileName}</h3>
                <p className="text-md  text-opacity-50 text-secondary">{directMessage.recentText}</p>
            </div>
            <h1 className=" justify-self-end text-sm ml-auto text-secondary text-opacity-50">{directMessage.recentCreatedAt}</h1>
        </div>
    </div>
    )
}