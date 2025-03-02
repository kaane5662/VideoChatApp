"use client"
import { IDirectMessage } from "@/app/interfaces";
import { useRouter } from "next/navigation";

export default function Contact({directMessage}:{directMessage:IDirectMessage}){
    const router = useRouter()
    return(

    <div onClick={()=>router.push(`/platform/messages/${directMessage.roomId}`)} className="flex gap-4 hover:bg-opacity-10 hover:cursor-pointer duration-300 hover:bg-secondary bg-white">
        
        <div className="flex gap-4  border-y p-4 w-full">
        <img className="h-8 w-8 rounded-full bg-secondary"></img>
            <div className="flex-col gap-2 flex">
                <div className="flex gap-4">
                    <h3 className="text-xl font-bold">{directMessage.profileName}</h3>
                    {directMessage.type == "match" ?(<p className="text-secondary text-sm font-semibold">Match</p>):
                    (<p className="text-secondary text-sm font-semibold">Cold</p>) }
                    
                </div>
                <p className="text-md  text-slate-500">{directMessage.recentText}</p>
            </div>
            <h1 className=" justify-self-end text-sm ml-auto text-slate-500">{directMessage.recentCreatedAt}</h1>
        </div>
    </div>
    )
}