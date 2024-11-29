"use client"
import { IMessage, IProfile } from "@/app/interfaces";
import { getDirectMessagesThread } from "@/app/services/messages";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import * as signalR from '@microsoft/signalr';
import { getMyProfile, getMyProfileClient } from "@/app/services/profiles";
import { cookies } from "next/headers";
import { profile } from "console";
// import { useUser } from "@/app/providers/UserContext";

export default function MessageThread({params}:any){
    const {id}:{id:number} = params;
    const [OtherProfile, setOtherProfile] = useState<IProfile | null>(null)
    const [MyProfile, setMyProfile] = useState<IProfile >()
    const [Messages, setMessages] = useState<IMessage[]>([])
    const [connection,setConnection] = useState<signalR.HubConnection>()
    const [Typers,setTypers] = useState<IProfile[]>([])
    const hasConnection = useRef(false)
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [text,setText] = useState("")
    // const {user,setUser}= useUser()
    const getMessagesThread = async ()=>{
        try{
           var data = await getDirectMessagesThread(id)
           console.log(data)
           setMessages(data.messages)
           setOtherProfile(data.otherProfile)
        }catch(error){
            console.log(error)
        }
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
        
        hubConnection.on('MessageRecieved', async(text)=>{
            console.log("Message recieved"+OtherProfile)
            if(OtherProfile == null) return
            setMessages(prev=>[...prev,{ text:text,firstName:OtherProfile.firstName,createdAt:new Date(Date.now()).toString(), fromProfileId:OtherProfile.id}])
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
            if(text.length < 1 || MyProfile == null) return
            await connection?.invoke("SendDirectMessage",Number(id),text)
            setMessages(prev=>[...prev,{ text:text,firstName:MyProfile.firstName,createdAt:new Date(Date.now()).toString(), fromProfileId:MyProfile.id}])
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
        getCurrentUser().then(getMessagesThread)
        // getMessagesThread()
    },[])

    useEffect(() => {
        // Scroll to the bottom if messages change
        if (messagesEndRef.current) {
            const container = messagesEndRef.current;
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
            <div className="flex gap-4 w-full border-y-2 p-2">
                <img className="h-14 w-14 self-center bg-secondary rounded-full">
                </img>
                <div className="flex flex-col gap-0">
                        <h1 className="font-semibold text-xl">{OtherProfile.firstName+" "+OtherProfile.lastName}</h1> 
                    <p className="text-md text-opacity-50 text-secondary">{OtherProfile.industry}</p> 

                </div>
            </div>
            <div ref={messagesEndRef} className=" overflow-y-scroll flex flex-col h-full p-10 gap-4 items-center ">
                {MyProfile && Messages?.map((message:IMessage,index:number)=>{
                    return(
                        <div key={index} className={`flex flex-col gap-1 w-[50%] ${message.fromProfileId == MyProfile.id ? "ml-auto":" "}`}>
                            <p className={`px-4 p-2 text-sm w-fit rounded-xl shadow-md ${message.fromProfileId == MyProfile.id ? "bg-secondary text-white":" bg-secondary bg-opacity-10"}`}>{message.text}</p>
                            <h3 className="text-sm text-opacity-50 text-secondary">{message.firstName + " " + new Date(message.createdAt).toLocaleString()} </h3>
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
                
                <div className=" flex gap-2">
                    <input onFocus={startTyping } value={text} onChange={(e)=>setText(e.target.value)} name="text" placeholder="Send a message..." className="border-2 p-2 text-sm w-full h-50 rounded-sm"></input>
                    <button><IoSend size={35} className="bg-secondary text-white p-2 rounded-full"></IoSend></button>

                </div>
                
            </form>

        </main>
    )
}