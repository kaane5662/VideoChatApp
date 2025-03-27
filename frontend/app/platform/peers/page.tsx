"use client"
import { useEffect, useRef, useState } from "react";
import * as signalR from '@microsoft/signalr';
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import { FaCamera, FaMagic, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { BiVolume, BiVolumeLow } from "react-icons/bi";
import { BsCamera, BsCameraVideo, BsCameraVideoFill, BsCameraVideoOff, BsFillCameraVideoOffFill } from "react-icons/bs";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import Chat from "@/app/components/video/Chat";
import { IProfile, IVideoChat } from "@/app/interfaces";
import InitDm from "@/app/components/messages/InitDm";
import Intro from "@/app/components/video/Intro";
import { ImSpinner8 } from "react-icons/im";
import Router from 'next/router';
import { toast } from "react-toastify";
import AcceptMatch from "@/app/components/popups/AcceptMatch";

export default function Peers(){
    // const {id} = useParams()
    const router = useRouter()
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null)
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [joinedSession, setJoinedSession] = useState(false)
    const [ConnectedProfile, setConnectedProfile] = useState<IProfile | null>(null)
    const peerConnection= useRef<RTCPeerConnection | null>(null);
    
    const [displayMatch,setDisplayMatch] = useState(false)
    const [matchDisabled,setMatchDisabled] = useState(false)

    const [muted, setMuted] = useState(true)
    const [videoToggled, setVideoToggled] = useState(false)
    const [screenShareToggled, setScreenShareToggled] = useState(false)
    const joiningRoom = useRef(true)  
    const [messages,setMessages] = useState<IVideoChat[]>([])
    
    const [lookingFor,toggleLookingFor] = useState(false)

    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    }

  

    const createOffer = async ()=>{
        console.log("Creating offer")
        streamRef.current = null
        
        console.log(videoToggled,muted)
        const pc = new RTCPeerConnection(configuration)
        peerConnection.current = pc
        let stream:MediaStream;
        // if(muted && !videoToggled && !screenShareToggled) {peerConnection.current.close()}   
        // if(screenShareToggled){
        //     stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: !muted })
        // }else{
        //     stream = await navigator.mediaDevices.getUserMedia({ video: videoToggled, audio: !muted })
        // }
        if(!videoToggled && muted) return
        stream = await navigator.mediaDevices.getUserMedia({ video: videoToggled, audio: !muted })
        
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

    const initSignalR = async (hubConnection:signalR.HubConnection) => {
        
        setConnection(hubConnection);

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
            // console.log("Recieved offer: ",fromConnectionId)
            const pc = new RTCPeerConnection(configuration);
            peerConnection.current = pc

            pc.ontrack = (event) => {
                console.log(event)
                if (remoteVideoRef.current) {
                    console.log("Streaming the video", event.streams[0])
                    remoteVideoRef.current.srcObject = event.streams[0];
                    
                }
                event.track.onmute=()=>{
                    console.log("Camera closed")
                    remoteVideoRef.current && (remoteVideoRef.current.srcObject = null)
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
            // console.log(candidate)
            // if(!peerConnection.current.signalingState || peerConnection.current.signalingState == "stable") {
            //     remoteVideoRef.current && (remoteVideoRef.current.srcObject = null)
            //     return
            // }
            if(!peerConnection.current.signalingState) return
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
          
        });

        hubConnection.on('LeftRoom', async(candidate)=>{
            streamRef.current = null
            peerConnection.current?.close()
            streamRef.current = null
            console.log("left room")
            toast.info("User has left the room")
        })
        
        hubConnection.on('onError',async(message,code,redirect=true)=>{
            console.log(message, code)
            toast.error(message)
            
            if(code == 405) {
                console.log("reattempting")
                await joinRoom()
            }
            if(code == 403){
                if(redirect)
                    router.replace("/platform/settings?displayPlans=yes")
                // setJoinedSession(false);
            }
            if(code == 404){
                router.replace("/platform/lookingfor")
            }

            
        })
        hubConnection.on('messageRecieved',async(sender:string, message:string)=>{
            console.log(sender)
            setMessages((prevMessages) => [...prevMessages, {message:message, isSender:false}]);
        })
        hubConnection.on('sendMatch',async(sender:string, message:string)=>{
            setDisplayMatch(true)
        })
        hubConnection.on('onMatch',async()=>{
            setDisplayMatch(false)
            toast.success("Peer is now a match")
            setMatchDisabled(true)
        })


        
  
        await hubConnection.start();
        console.log(hubConnection.state)
        

    };
    const toggleMute = () => {
        if (localVideoRef.current) {
            const audioTracks = streamRef.current?.getAudioTracks()
            audioTracks?.forEach(track => track.enabled = !track.enabled);
            setMuted(prev => !prev);
        }
    };


    const toggleCamera = () => {
        console.log("on camera change",videoToggled)
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                streamRef?.current?.removeTrack(track);
              });
      
            if (videoTrack) {
                // Toggle the enabled state
                videoTrack.enabled = !videoTrack.enabled;

                console.log(`Video track is now ${videoTrack.enabled ? "enabled" : "disabled"}`);
            }
            
        }
        setVideoToggled(!videoToggled)
    };

    const joinRoom = async () =>{
        if(!connection) return;
        setJoinedSession(true)
        
        
        console.log("Joining room")
        connection.invoke("JoinPool",lookingFor)

    }

    const endSession = async ()=>{
        if(!connection && !peerConnection) return;
        
        peerConnection.current = null
      
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
              track.stop();
            });
        }
        setMuted(true)
        setVideoToggled(false)
        setMessages([])
        await connection?.invoke("LeaveRoom").catch(err => console.error(err))
        setConnectedProfile(null)
        setJoinedSession(false)
        // connection?.stop()
    }

    const skipRoom = async () =>{
        if(!connection && !peerConnection) return;
        console.log("Skipping Room")
        peerConnection.current = null
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
              track.stop();
            });
        }
        setMuted(true)
        setVideoToggled(false)
        setMessages([])
        setConnectedProfile(null)
        await connection?.invoke("LeaveRoom").catch(err => console.error(err))
        await joinRoom()
    }

    const sendMessage = async(text:string)=>{
        if(!connection && !peerConnection) return;
        console.log(text)
        await connection?.invoke("SendMessage",text).then(()=>{
            setMessages((prevMessages) => [...prevMessages, {message:text,isSender:true}]);
            
        })
    }

    const sendMatch = async()=>{
        if(!connection && !peerConnection) return toast.error("No connection with another peer")
        if(!ConnectedProfile) return toast.error("Not connected to another profile")
        toast.success("Sent match request")
        
        try{
            if(matchDisabled) return
            setMatchDisabled(true)
            connection?.invoke("SendMatchRequest")
            setTimeout(()=>{
                setMatchDisabled(false)
            },10000)
        }catch(error){console.log(error)}
       
    }
    const acceptMatchRequest = async()=>{
        if(!connection && !peerConnection) return toast.error("No connection with another peer")
        if(!ConnectedProfile) return toast.error("Not connected to another profile")
        connection?.invoke("AcceptMatchRequest",ConnectedProfile.identityUserId)
        setDisplayMatch(false)
    }
  


    useEffect(()=>{
        if(!connection) return
        createOffer()
        
    },[muted,videoToggled])

    useEffect(()=>{
        if(ConnectedProfile)
            setMatchDisabled(false)
    },[ConnectedProfile])

    // useEffect(()=>{
    //     if(remoteVideoRef.current)
    //         remoteVideoRef.current.volume = videoVolume
    // },[videoVolume])
    
    
    useEffect(()=>{
        console.log("Initialized")
        const hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/chatHub`,{withCredentials:true})
          .configureLogging(signalR.LogLevel.Information)
          .build();
        initSignalR(hubConnection)
        return()=>{
            console.log("Connection state: ",hubConnection.state)
            console.log("Unmounted component")
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                  track.stop();
                });
              }
            if (peerConnection.current) {
                peerConnection.current.close();
            }
            if(hubConnection.state == signalR.HubConnectionState.Disconnected || hubConnection.state == signalR.HubConnectionState.Connecting) return
            hubConnection.stop().then(()=>console.log("Disconnected session"))
            

        }
    },[])

    if(!joinedSession){
        return(
            <Intro setPreferences={toggleLookingFor} preference={lookingFor} joinRoom={joinRoom}></Intro>
        )
    }


    

    return(
        <main className=" p-12 flex gap-8 h-screen bg-slate-50">
            {/* <h1 className="text-sm font-semibold text-black">Room Id: <span className="text-opacity-50 text-black font-normal">{id}</span></h1> */}
            {displayMatch && <AcceptMatch onAcceptMatch={acceptMatchRequest} onSetShow={setDisplayMatch}/>}
            {ConnectedProfile ? (
               
            <div className="gap-8 relative self-center h-fit w-[1000px] rounded-sm">
                <video className="h-[125px] absolute w-[200px] object-cover bg-white border-2 bg-opacity-20 right-0 top-0 border-opacity-35 border-white rounded-xl " ref={localVideoRef} autoPlay muted></video>
                <video className="h-[600px] w-[1000px] object-cover bg-black rounded-xl" ref={remoteVideoRef} playsInline autoPlay></video>
                {ConnectedProfile && peerConnection.current && (
                    <div className="h-8 w-8 bg-secondary rounded-full top-0 top-2 left-2 self-center flex justify-center absolute">
                        {ConnectedProfile?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold text-white w-fit text-xs">{ConnectedProfile?.firstName[0]} {ConnectedProfile?.lastName[0]}</h1>)}
                    </div>

                )}
                <div className="p-2 px-12 bg-opacity-40 absolute mx-auto bottom-10 right-0 left-0  rounded-sm flex gap-4 w-fit self-center text-white">
                    <button onClick={toggleMute}>
                    {!muted ? (<FaMicrophoneSlash size={50} className="bg-red-500 rounded-md text-white p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-black text-white "></FaMicrophoneSlash>):(<FaMicrophone size={50} className="bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 text-white border-black "></FaMicrophone>)}

                    </button>
                    <button onClick={toggleCamera}>
                    {!videoToggled ? (<BsCameraVideoFill size={50} className="bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 text-white p-3   border-opacity-15 border-black "></BsCameraVideoFill>):(<BsFillCameraVideoOffFill size={50} className="bg-red-500 rounded-md text-white p-3  border-opacity-15 border-black "></BsFillCameraVideoOffFill>)}
                    </button>
                    {/* <button onClick={()=>setScreenShareToggled(!screenShareToggled)}>
                        {!screenShareToggled ? (<LuScreenShare  size={50} className="bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-black "></LuScreenShare>):(<LuScreenShareOff  size={50} className="bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 p-3  bg-red-500 text-white border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-black "></LuScreenShareOff>)}
                    </button> */}
                    {/* <button className="relative flex justify-center"> */}
                        {/* {volumePopUp && 
                        <input value={videoVolume} min={0} max={1} step={.1} className="p-1 absolute -top-8 text-secondary left-auto right-auto !rounded-sm accent-secondary" 
                        onChange={(e)=>setVolume(parseFloat(e.target.value))} 
                        type="range"/>}
                         */}
                        {/* <BiVolumeLow  size={50} className="bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-black "></BiVolumeLow> */}
                    {/* </button> */}
                    
                    <IoExit onClick={skipRoom} size={50} className="bg-secondary rounded-md text-white p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-white ">Leave Room</IoExit>
                    <FaPhoneSlash onClick={endSession} size={50} className="bg-red-500 rounded-md text-white p-3  border-opacity-15 hover:cursor-pointer duration-300 hover:opacity-70 border-white "></FaPhoneSlash>
                </div>
                
            </div>
            ):(
                <div className="flex p-12 gap-4 flex-col w-full">
                    <p>Finding your perfect match</p>
                    <ImSpinner8 className="text-secondary animate-spin" size={20}></ImSpinner8>
                </div>
            )}
            <div className="flex flex-col gap-2  h-full max-w-[30%] w-[30%] ">
                <Chat connectedProfile={ConnectedProfile} sendMessage={sendMessage} messages={messages}/>
                <button disabled={matchDisabled} onClick={sendMatch} className="p-2 w-full justify-center rounded-xl px-4 bg-secondary text-white disabled:bg-opacity-30 flex gap-2 items-center duration-300 disabled:hover:opacity-30 hover:opacity-50"><FaMagic size={12}/>Match </button>
            </div>
            

        </main>
    )
}