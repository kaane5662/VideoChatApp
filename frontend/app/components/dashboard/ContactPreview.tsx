"use client"
import { IDirectMessage } from "@/app/interfaces";
import { useRouter } from "next/navigation";

export default function ContactPreview({directMessage}:{directMessage:IDirectMessage}){
    const router = useRouter()
    return(

    <div onClick={()=>router.push(`/platform/messages/${directMessage.roomId}`)} className="flex flex-col gap-2 hover:bg-opacity-10 hover:cursor-pointer active:scale-95 duration-300 hover:bg-secondary bg-white  rounded-2xl shadow-lg  border-2 p-4">
        
        <div className="flex gap-4 w-full">
            <div className="h-8 bg-secondary rounded-full w-8 relative">
                <img className="h-full w-full rounded-full bg-opacity-0 bg-slate-50"></img>
                <p className="text-white flex self-center justify-center top-0 bottom-0 left-0 right-0 absolute text-sm">{directMessage?.profileName?.substring(0,1)}</p>
            </div>
            <div className="flex gap-4">
                <h3 className="text-xl font-bold">{directMessage.profileName}</h3>
                {directMessage.type == "match" ?(<p className="text-secondary text-sm font-semibold">Match</p>):
                (<p className="text-secondary text-sm font-semibold">Cold</p>) }
                
            <h1 className=" justify-self-end text-xs ml-auto text-slate-500">{directMessage.recentCreatedAt}</h1>
            </div>
        </div>
        <div className="flex-col gap-2 flex">
            <p className="text-sm  text-slate-500">{directMessage.recentText.substring(0,52)+"..."}</p>
        </div>
    </div>
    )
}