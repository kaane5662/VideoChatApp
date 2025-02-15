import PaddedList from "@/app/helpers/PaddedList";
import { IProfile, IVideoChat } from "@/app/interfaces";
import { useRouter } from "next/navigation";
import { Ref, useState } from "react";
import { IoSend } from "react-icons/io5";

export default function Chat({messages,sendMessage, connectedProfile}:{messages:IVideoChat[],sendMessage:CallableFunction, connectedProfile:IProfile|null}){
    const [text,setText] = useState("")
    const router = useRouter();
    return(
        <div className="flex flex-col bg-white gap-8 p-4 relative w-[30%] justify-between shadow-md rounded-xl ">
            <h1 className="font-bold text-xl">Live Chat</h1>
            <div className="flex flex-col gap-3 h-full overflow-y-scroll">
                {connectedProfile && (
                    <div className="flex gap-4 flex-col">
                        <div className="flex flex-col gap-0">
                            <h1 className="font-bold text-opacity-50"><span onClick={()=>router.push(`/platform/profiles/${connectedProfile.id}`)} className=" text-secondary underline hover:cursor-pointer">{connectedProfile?.firstName}</span> has joined</h1>
                            <p className="text-sm text-slate-500">{connectedProfile?.industry}</p>
                            <p className="text-white rounded-xl bg-secondary p-1 px-3 text-xs w-fit">{connectedProfile.similarityScore && (connectedProfile.similarityScore*100).toFixed(0)}% Match</p>
                        </div>
                        <PaddedList items={connectedProfile?.frameworks}></PaddedList>
                    </div>

                )
                }
                <div className="p-4 gap-4 flex flex-col">

                    {messages.map((message:IVideoChat,index:number)=>{
                        return(
                                <div className={`flex flex-col gap-1 ${!message.isSender && "self-end"}`}>
                                    <label className="text-xs text-slate-500">{message.isSender? "You":connectedProfile?.firstName}</label>
                                    <p key={index} className={`p-1 px-4 w-fit rounded-xl text-sm ${message.isSender ? "bg-secondary text-white": "bg-slate-200 self-end"}`}>{message.message}</p>
                                </div>
                            
                        )
                    })}
                </div>
                
                
            </div>
            <div className=" bottom-0 w-full flex gap-4   ">
                <textarea placeholder="Enter message..." onChange={(e)=>setText(e.target.value)} className="p-2 text-sm w-full h-50 bg-slate-50 overflow-y-auto border-2 rounded-xl "></textarea>
                <IoSend onClick={()=>sendMessage(text)} className="text-white h-10 w-10 bg-secondary p-2 w-[15%] rounded-full hover:cursor-pointer"></IoSend>
            </div>
        </div>
    )
}