"use client"
import { IMessage, IProfile } from "@/app/interfaces";
import { deleteMessageBubble, editMessageBubble, getDirectMessagesThread, getMessagesInThread } from "@/app/services/messages";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import * as signalR from '@microsoft/signalr';
import { getMyProfile, getMyProfileClient } from "@/app/services/profiles";
import { cookies } from "next/headers";
import { profile } from "console";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
// import { useUser } from "@/app/providers/UserContext";

export default function MessageThread({params}:any){
    const {id}:{id:number} = params;
    const [OtherProfile, setOtherProfile] = useState<IProfile | null>(null)
    const [MyProfile, setMyProfile] = useState<IProfile >()
    const [Messages, setMessages] = useState<IMessage[]>([])
    const [connection,setConnection] = useState<signalR.HubConnection>()
    const [Typers,setTypers] = useState<IProfile[]>([])
    const hasConnection = useRef(false)
    const [earliest,setEarliest] = useState(new Date())
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const hasRun = useRef(false)
    const [text,setText] = useState("")
    const [editing,setEditing] = useState<number | null>(null)
    // const {user,setUser}= useUser()
    const getMessagesThread = async ()=>{
        try{
           var data = await getDirectMessagesThread(id)
           console.log(data)
           setOtherProfile(data)
        }catch(error){
            console.log(error)
        }
    }
    const getThreadMessages = async ()=>{
        try{
            if(hasRun.current) return;
            hasRun.current = true
           var data = await getMessagesInThread(id,earliest)
           console.log(data)
           if(!data?.error && data.length > 0){
                setEarliest( new Date(data[data.length-1].createdAt))
           }
           setMessages(prev=>[...data.toReversed(),...prev])
           hasRun.current = false
        }catch(error){
            console.log(error)
        }
    }
    const deleteMessage = async (messageId:number)=>{
        try{
            await connection?.invoke("DeleteMessageBubble", Number(id),Number(messageId))
        }catch(err){
            console.log(err)
        }
        
    }
    const editMessage = async (messageId:number, formData:FormData)=>{
        console.log("You here",id)
        const text = formData.get("text") as string
        try{
            await connection?.invoke("EditMessageBubble", Number(id),Number(messageId),text)
        }catch(err){
            console.log(err)
        }finally{setEditing(null)}
    }
    
    const initLiveChat = async ()=>{
        if(hasConnection.current == true) return
        console.log("Creating live chat")
        hasConnection.current = true
        const hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/chatHub`,{withCredentials:true})
          .configureLogging(signalR.LogLevel.Information)
          .build();
        setConnection(hubConnection);
        
        hubConnection.on('MessageRecieved', async(message:IMessage)=>{
            console.log("Message recieved"+OtherProfile)
            if(OtherProfile == null) return
            setMessages(prev=>[...prev,message])
        })
        hubConnection.on('MessageEdited', async(id:number, text:string)=>{
            console.log("Message edited"+id,text)
            if(OtherProfile == null) return
            setMessages((prevMessages) =>
                prevMessages.map((m) => (m.id === id ? { ...m, text } : m))
            );
        })
        hubConnection.on('MessageDeleted', async(id:number)=>{
            console.log("Message recieved"+OtherProfile)
            if(OtherProfile == null) return
            setMessages((prevMessages) =>
                prevMessages.filter((m) => m.id !== id)
            );
            
        })
        hubConnection.on('UserTyping', async(connectionId:string,profile:IProfile)=>{
            console.log("User typing recieved"+OtherProfile)
            const tempProfile = profile
            setTypers(prev=>[...prev,tempProfile])
            setTimeout(()=>{
                setTypers((prev)=>prev.filter((profile:IProfile)=>profile.id != tempProfile.id))
            },10000)
        })
            
        try {
            await hubConnection.start();
            await hubConnection.invoke("JoinDmThread", Number(id)).catch((err)=>console.log(err));
        } catch (error) {
            console.log("Connection failed: ", error);
        }

        
        
    }
    const sendMessage = async (e:FormData)=>{
        try{
            console.log(text)
            if(text.length < 1 || MyProfile == null) return toast.error("Type at least one word")
            await connection?.invoke("SendDirectMessage",Number(id),text) as IMessage
            setText("")
           
        }catch(error){
            console.log(error)
        }
    }

    const startTyping = async()=>{
        console.log("Typing")
        try{
            connection?.invoke("TypingInDmThread",Number(id))
        }catch(error){

        }
    }
    
    const getCurrentUser = async()=>{
        const data = await getMyProfileClient()
        console.log(data)
        setMyProfile(data)
    }

    useEffect(()=>{
        getMessagesThread()
        getCurrentUser()
        getThreadMessages()
        // getMessagesThread()
    },[])

    useEffect(() => {
        // Scroll to the bottom if messages change
        if (messagesEndRef.current) {
            const container = messagesEndRef.current;
            console.log(container.scrollTop, container.scrollHeight)
            container.scrollTop = container.scrollHeight;
            
        }
      }, [Messages]);

    useEffect(()=>{
        if(!OtherProfile) return 
        // console.log("AHHHHHH")
        initLiveChat()
        
        return () => {
            connection?.stop();
        };
        
    },[OtherProfile])

    if(!OtherProfile) return(
        <h1>Loading</h1>
    )
    // useEffect(()=>{connection?.invoke("JoinDmThread",id)},[connection])
    return(
        <main className="flex flex-col justify-between h-full">
            <div className="flex gap-4 items-center w-full border-y-2 p-2">
                <div className="relative h-fit">
                    <img className="h-8 w-8 bg-secondary rounded-full"/>
                  

                </div>
                <div className="flex flex-col gap-0">
                        <h1 className="font-semibold text-xl">{OtherProfile.firstName+" "+OtherProfile.lastName}</h1> 
                    <p className="text-sm text-slate-500">{OtherProfile.industry}</p> 

                </div>
            </div>
            <div ref={messagesEndRef} className=" overflow-y-scroll flex flex-col h-full p-10 gap-4 items-center ">
                <button onClick={getThreadMessages} className="text-sm rounded-xl px-4 p-2 bg-secondary text-complementary">Load More</button>
                {MyProfile && Messages?.map((message:IMessage,index:number)=>{
                    return(
                        <div key={index} className={`flex relative flex-col gap-1 w-[50%] ${message.fromProfileId == MyProfile.id ? "ml-auto":" "}`}>
                            {/* <p className="text-black">{message.id}</p> */}
                            {message.fromProfileId == MyProfile.id && (<div className="flex gap-4 items-center text-xs">
                                <button className="text-slate-500 hover:scale-105" onClick={()=>deleteMessage(message.id)}><FaTrashCan/></button>
                                <button className="text-slate-500 hover:scale-105" onClick={()=>setEditing(message.id)}><FaEdit/></button>
                            </div>)}
                            {editing && message.id == editing ? (
                                <form className="flex gap-2" action={(e)=>editMessage(message.id,e)}>
                                    <textarea name="text" defaultValue={message.text} className={`px-4 p-2 text-sm w-fit rounded-xl shadow-md border-2`}></textarea>
                                    <button type="submit" className="rounded-xl w-fit h-fit bg-secondary text-sm p-2 px-4 text-complementary">Submit</button>
                                </form>
                            ):(

                            <div>
                                <p className={`px-4 p-2 text-sm w-fit rounded-xl shadow-md ${message.fromProfileId == MyProfile.id ? "bg-secondary text-white":" bg-slate-100 text-black"}`}>{message.text}</p>
                                <h3 className="text-xs text-slate-500">{ (message.firstName || (message.fromProfileId == OtherProfile.id ? OtherProfile.firstName : MyProfile.firstName)) + " " + new Date(message.createdAt).toLocaleString()} </h3>
                            </div>
                            )}
                        </div>
                        
                    )
                })}
            </div>
            {/* <h1>Hello someone is typing</h1> */}
            <form action={sendMessage} className="chatbox flex flex-col gap-2 p-10 px-24">
                {Typers.length > 0 &&(
                    <h1 className="text-sm text-complementary">{Typers.map((typer)=>{
                        return(
                            <span>{typer.firstName}</span>
                        )
                    })} is typing</h1>
                ) }
                
                <div className=" flex flex-col gap-2 border-2 bg-slate-100 p-2 text-sm w-full shadow-md rounded-xl">
                    <input onFocus={startTyping } value={text} onChange={(e)=>setText(e.target.value)} name="text" placeholder="Send a message..." className="bg-white bg-opacity-0 text-sm w-full h-18 focus:ring-0 focus:outline-none"></input>
                    <button className="bg-secondary text-white shadow-md p-2 rounded-full ml-auto"><IoSend size={14}></IoSend></button>

                </div>
                
            </form>

        </main>
    )
}