import PaddedList from "@/app/helpers/PaddedList";
import { IProfile, IVideoChat } from "@/app/interfaces";
import { useRouter } from "next/navigation";
import { Ref, useEffect, useRef, useState } from "react";
import { FaCircle, FaMagic } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";


export default function Chat({messages,sendMessage, connectedProfile}:{messages:IVideoChat[],sendMessage:CallableFunction, connectedProfile:IProfile|null}){
    const [text,setText] = useState("")
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const onMessageSent = async(e:any)=>{
        e.preventDefault()
        await sendMessage(text)
        setText("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault(); // Prevents new line
          onMessageSent(e as unknown as React.FormEvent); // Submit form
        }
      };

    useEffect(() => {
        // Scroll to the bottom if messages change
        if (messagesEndRef.current) {
            const container = messagesEndRef.current;
            console.log(container.scrollTop, container.scrollHeight)
            container.scrollTop = container.scrollHeight;
            
        }
      }, [messages]);
    return(
        <div className="flex flex-col bg-white gap-4 p-4 relative w-full h-full justify-between shadow-md rounded-xl ">
            <h1 className="font-bold text-xl">Live Chat</h1>
            <div ref={messagesEndRef}  className="flex flex-col gap-3 max-h-full h-full overflow-y-scroll">
                {connectedProfile && (
                    <div className="flex gap-4 flex-col">
                        <div className="flex flex-col gap-0">
                            <div className="flex items-center">
                                <div className="flex items-end gap-x-2 leading-none">
                                    <h1 onClick={()=>window.open(`/platform/profile/${connectedProfile.id}`)} className="text-secondary font-bold text-lg underline hover:cursor-pointer">{connectedProfile?.firstName}</h1> 
                                    <label className="font-bold  text-sm">has joined</label>
                                </div>
                                <p className="text-white rounded-xl bg-secondary p-0 px-2 text-xs w-fit ml-auto ">{connectedProfile.similarityScore && (connectedProfile.similarityScore*100).toFixed(0)}% Match</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                                <p className=" text-slate-500">{connectedProfile?.industry}</p>
                                <FaCircle className="text-slate-300" size={5}/>
                                <p className=" text-slate-500">{connectedProfile.currentRole}</p>
                            </div>
                            
                        </div>
                        <PaddedList items={[...connectedProfile?.frameworks ||[],...connectedProfile?.skills||[]]}></PaddedList>
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
            <form onSubmit={onMessageSent} className=" bottom-0 w-full flex flex-col gap-1 p-2 text-sm w-full h-fit  bg-slate-50 overflow-y-auto border-2 rounded-xl  ">
                <textarea  value={text}
                onKeyDown={handleKeyDown}
                placeholder="Enter message..." onChange={(e)=>setText(e.target.value)} className=" bg-opacity-0 bg-white focus:ring-0 focus:outline-none focus:border-0 focus:border-transparent text-sm w-full h-16 "></textarea>
                <button className="flex gap-2  ml-auto hover:cursor-pointer hover:scale-105">
                    <IoIosSend size={20} className=" text-secondary rounded-full  "></IoIosSend>
                    <p className="text-slate-500 text-sm">Send</p>
                </button>
            </form>
            
        </div>
    )
}