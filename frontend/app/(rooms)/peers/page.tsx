"use client"
import { useEffect, useRef, useState } from "react";
import * as signalR from '@microsoft/signalr';
import { useParams } from "next/navigation";
import { FaCamera, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { BiVolume, BiVolumeLow } from "react-icons/bi";
import { BsCamera, BsCameraVideo, BsCameraVideoFill, BsCameraVideoOff, BsFillCameraVideoOffFill } from "react-icons/bs";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import Chat from "@/app/components/video/Chat";
import { IProfile, IVideoChat } from "@/app/interfaces";
import InitDm from "@/app/components/messages/InitDm";
import Intro from "@/app/components/video/Intro";

export default function Peers(){
    // const {id} = useParams()
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null)
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [joinedSession, setJoinedSession] = useState(false)
    const [ConnectedProfile, setConnectedProfile] = useState<IProfile | null>(null)
    const peerConnection= useRef<RTCPeerConnection | null>(null);
    

    const [muted, setMuted] = useState(false)
    const [videoToggled, setVideoToggled] = useState(false)
    const [screenShareToggled, setScreenShareToggled] = useState(false)
    const joiningRoom = useRef(true)  
    const [messages,setMessages] = useState<IVideoChat[]>([])


    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    }


    const createOffer = async ()=>{
        console.log("Creating offer")
        streamRef.current = null
        

        const pc = new RTCPeerConnection(configuration)
        peerConnection.current = pc
        let stream;
        // if(muted && !videoToggled && !screenShareToggled) {peerConnection.current.close()}   
        // if(screenShareToggled){
        //     stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: !muted })
        // }else{
        //     stream = await navigator.mediaDevices.getUserMedia({ video: videoToggled, audio: !muted })
        // }
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        
        // streamRef.current = stream
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track=>pc.addTrack(track,stream))
        streamRef.current = stream
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await connection?.invoke('SendOffer', JSON.stringify(offer)).catch(err => console.error(err))
        console.log("Connection request sent")

    }

    const initSignalR = async () => {
        const hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/chatHub`,{withCredentials:true})
          .configureLogging(signalR.LogLevel.Information)
          .build();

        hubConnection.on('RoomJoined', async()=>{
            joiningRoom.current = false
            console.log("Matched with a user and joined room")
            setMessages([])
            setConnectedProfile(null)
            createOffer()
        })

        hubConnection.on('OnClientJoin', async(connection:string, profile:IProfile)=>{
            console.log(profile)
            setConnectedProfile(profile)
        })
  
        hubConnection.on('ReceiveOffer', async (fromConnectionId,offer) => {
            console.log("Recieved offer: ",fromConnectionId)
            const pc = new RTCPeerConnection(configuration);
            peerConnection.current = pc

            pc.ontrack = (event) => {
                if (remoteVideoRef.current) {
                    console.log("Streaming the video", event.streams[0])
                    remoteVideoRef.current.srcObject = event.streams[0];
                    
                }
            };

            pc.onicecandidate = (event) => {
                console.log("Sending ice canidates")
                if (event.candidate) {
                    hubConnection.invoke('SendIceCandidate', JSON.stringify(event.candidate));
                }
            };

            pc.onsignalingstatechange = () => {
                console.log("Signaling state:", pc.signalingState);
            };

            await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            hubConnection.invoke('SendAnswer', fromConnectionId, JSON.stringify(answer));
            // hubConnection.invoke('SendOffer', id, JSON.stringify(answer));
          
        });
  
        hubConnection.on('ReceiveAnswer', async (answer) => {
            //
            console.log("Recieved answer")
            if(!peerConnection.current) return
            if (peerConnection.current.signalingState !== 'stable') {
                console.log("Recieved and set remote desc")
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
            } else {
                console.error(`Cannot set remote description in state: ${peerConnection.current.signalingState}`);
            }
          
        });
  
        hubConnection.on('ReceiveCandidate', async (candidate) => {
            if (!peerConnection.current) return
            console.log("Recived ICE candidate" );
            console.log(candidate)
            // console.log(candidate)
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
          
        });

        hubConnection.on('LeftRoom', async(candidate)=>{
            streamRef.current = null
            peerConnection.current?.close()
            streamRef.current = null
            joinRoom()
        })

        hubConnection.on('onError',async(message,code)=>{
            console.log(message)
        })
        hubConnection.on('messageRecieved',async(sender:string, message:string)=>{
            console.log(sender)
            setMessages((prevMessages) => [...prevMessages, {message:message, isSender:false}]);
        })


        
  
        await hubConnection.start().then(() => {setConnection(hubConnection); });
        setConnection(hubConnection)
        

    };
    const toggleMute = () => {
        if (localVideoRef.current) {
            const audioTracks = streamRef.current?.getAudioTracks()
            audioTracks?.forEach(track => track.enabled = !track.enabled);
            setMuted(prev => !prev);
        }
    };

    const toggleCamera = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                if(!videoTrack.enabled) videoTrack.stop()
                
                setVideoToggled(videoTrack.enabled)
            }
        }
    };

    const joinRoom = async () =>{
        if(!connection && !peerConnection /*&& !joinRoom*/) return;
        setJoinedSession(true)
        
        
        console.log("Joining room")
        connection?.invoke("JoinPool")

    }

    const endSession = async ()=>{
        if(!connection && !peerConnection) return;
        
        peerConnection.current = null
      
        if(streamRef.current){
            const videoTrack = streamRef.current
            .getVideoTracks()
            .find((track) => track.kind === "video");
            
            if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
            
        }
        setJoinedSession(false)
        // connection?.stop()
    }

    const skipRoom = async () =>{
        if(!connection && !peerConnection) return;
        console.log("Skipping Room")
        streamRef.current = null
        peerConnection.current = null
        setMessages([])
        setConnectedProfile(null)
        await connection?.invoke("LeaveRoom").catch(err => console.error(err))
        await joinRoom()
        //recreate original sdp offer
        // await createOffer()
    }

    const sendMessage = async(text:string)=>{
        if(!connection && !peerConnection) return;
        console.log(text)
        await connection?.invoke("SendMessage",text).then(()=>{
            setMessages((prevMessages) => [...prevMessages, {message:text,isSender:true}]);
            
        })
    }
  


    useEffect(()=>{
        if(!connection) return
        createOffer()
    },[/*muted, videoToggled,*/ screenShareToggled])
    
    useEffect(()=>{
        console.log("Initialized")
        initSignalR()
        return()=>{connection?.stop()}
    },[])

    if(!joinedSession){
        return(
            <Intro joinRoom={joinRoom}></Intro>
        )
    }
    

    return(
        <main className=" p-12 flex gap-8 h-screen bg-slate-50 text-secondary">
            {/* <h1 className="text-sm font-semibold text-black">Room Id: <span className="text-opacity-50 text-black font-normal">{id}</span></h1> */}
            {ConnectedProfile ? (
               
            <div className="gap-8 relative self-center h-fit w-[1000px] rounded-sm">
                <video className="h-[125px] absolute w-[200px] object-cover bg-white border-2 bg-opacity-20 right-4 top-4 border-opacity-35 border-white rounded-sm " ref={localVideoRef} autoPlay muted></video>
                <video className="h-[600px] w-[1000px] object-cover bg-black rounded-sm" ref={remoteVideoRef} playsInline autoPlay></video>
                
                <div className="p-2 px-12 bg-opacity-40 absolute mx-auto bottom-10 right-0 left-0  rounded-sm flex gap-4 w-fit self-center text-white">
                    <button onClick={toggleMute}>
                    {!muted ? (<FaMicrophoneSlash size={50} className="bg-red-500 rounded-full text-white p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-black text-white "></FaMicrophoneSlash>):(<FaMicrophone size={50} className="bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 text-white border-black "></FaMicrophone>)}

                    </button>
                    <button onClick={toggleCamera}>
                    {!videoToggled ? (<BsCameraVideoFill size={50} className="bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 text-white p-3  border-opacity-15 border-black "></BsCameraVideoFill>):(<BsFillCameraVideoOffFill size={50} className="bg-red-500 rounded-full text-white p-3  border-opacity-15 border-black "></BsFillCameraVideoOffFill>)}
                    </button>
                    <button onClick={()=>setScreenShareToggled(!screenShareToggled)}>
                        {!screenShareToggled ? (<LuScreenShare  size={50} className="bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-black "></LuScreenShare>):(<LuScreenShareOff  size={50} className="bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 p-3  bg-red-500 text-white border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-black "></LuScreenShareOff>)}
                    </button>
                    
                    <BiVolumeLow onClick={joinRoom} size={50} className="bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-black "></BiVolumeLow>
                    
                    <IoExit onClick={skipRoom} size={50} className="bg-secondary rounded-full text-white p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-white ">Leave Room</IoExit>
                    <FaPhoneSlash onClick={endSession} size={50} className="bg-red-500 rounded-full text-white p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-white "></FaPhoneSlash>
                </div>
                
            </div>
            ):(
                <h1 className="w-full">Finding the perfect match for you...</h1>
            )}
            <Chat connectedProfile={ConnectedProfile} sendMessage={sendMessage} messages={messages}/>
            


        </main>
    )
}