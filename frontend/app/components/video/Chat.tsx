import PaddedList from "@/app/helpers/PaddedList";
import { IProfile, IVideoChat } from "@/app/interfaces";
import { useRouter } from "next/navigation";
import { Ref, useState } from "react";
import { IoSend } from "react-icons/io5";

export default function Chat({messages,sendMessage, connectedProfile}:{messages:IVideoChat[],sendMessage:CallableFunction, connectedProfile:IProfile|null}){
    const [text,setText] = useState("")
    const router = useRouter();
    return(
        <div className="flex flex-col bg-white gap-8 p-4 relative w-[30%] justify-between shadow-md ">
            <h1 className="font-bold text-xl">Live Chat</h1>
            <div className="flex flex-col gap-3 h-full overflow-y-scroll">
                {connectedProfile && (
                    <div className="">
                        <h1 className="font-bold"><span onClick={()=>router.push(`/profiles/${connectedProfile.id}`)} className=" text-complementary underline hover:cursor-pointer">{connectedProfile?.firstName}</span> has joined</h1>
                        <p className="text-sm text-opacity-50 text-secondary">{connectedProfile?.industry}</p>
                        <PaddedList items={connectedProfile?.frameworks}></PaddedList>
                    </div>

                )
                }
                {messages.map((message:IVideoChat,index:number)=>{
                    return(
                        
                            <p key={index} className={`p-1 px-4 w-fit rounded-lg text-sm ${message.isSender ? "bg-secondary text-white": "bg-slate-200 self-end"}`}>{message.message}</p>
                        
                    )
                })}
                
                
            </div>
            <div className=" bottom-0 w-full flex gap-4   ">
                <textarea placeholder="Enter message..." onChange={(e)=>setText(e.target.value)} className="p-2 text-sm w-full h-50 bg-slate-50 overflow-y-auto border-2 rounded-sm "></textarea>
                <IoSend onClick={()=>sendMessage(text)} className="text-white h-10 w-10 bg-secondary p-2 w-[15%] rounded-full hover:cursor-pointer"></IoSend>
            </div>
        </div>
    )
}