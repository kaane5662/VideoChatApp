"use client"
import * as signalR from "@microsoft/signalr"
import { useParams } from "next/navigation";
import { createRef, Ref, useEffect, useRef, useState } from "react"


export default function Room(){
    const localVideoRef = useRef<any>(null);
    // const remoteVideoRef = useRef<any>(null);
    const {id} = useParams()
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const [peerConnection, setPeerConnection] = useState<any>();
    // const [peerConnections, setPeerConnections] = useState<any>([]);
    const peerConnections = useRef<any>({})
    const remoteVideoRefs = useRef<{ [key: string]: React.RefObject<HTMLVideoElement> }>({});
    const [localStream, setLocalSteam] = useState<MediaStream>()
    const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    };

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl("http://localhost:5133/chatHub")
            .build();
    
        connection.start()
            .then(() => console.log("Connection has been established"))
            .catch(err => console.error("Error connecting to SignalR: ", err));
    
        setConnection(connection);
    
        return () => {
            connection.stop();
        };
    }, []);
    
    useEffect(() => {
        if (!connection) return;
    
        connection.on("UserJoined", async (senderId) => {
            const pc = new RTCPeerConnection(configuration);
    
            // Attach event handlers for ICE candidate gathering and track events
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    connection.invoke("SendIceCandidate", id, JSON.stringify(event.candidate));
                }
            };
    
            pc.ontrack = (event) => {
                if (!remoteVideoRefs.current[senderId]) {
                    remoteVideoRefs.current[senderId] = createRef();
                }
                remoteVideoRefs.current[senderId].current.srcObject = event.streams[0];
            };
    
            // Store the peer connection
            peerConnections.current[senderId] = pc;
    
            // Create and send the offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            await connection.invoke("SendOffer", id, JSON.stringify(offer));
        });
    
        connection.on("ReceiveOffer", async (senderId, offer) => {
            let pc = peerConnections.current[senderId];
            
            if (!pc) {
                pc = new RTCPeerConnection(configuration);
    
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        connection.invoke("SendIceCandidate", id, JSON.stringify(event.candidate));
                    }
                };
    
                pc.ontrack = (event) => {
                    if (!remoteVideoRefs.current[senderId]) {
                        remoteVideoRefs.current[senderId] = createRef();
                    }
                    remoteVideoRefs.current[senderId].current.srcObject = event.streams[0];
                };
    
                peerConnections.current[senderId] = pc;
            }
    
            // Set the remote offer description
            await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
    
            // Add local tracks to the peer connection
            if (localVideoRef.current.srcObject) {
                localVideoRef.current.srcObject.getTracks().forEach(track => pc.addTrack(track, localVideoRef.current.srcObject));
            } else {
                console.error("No local stream available!");
            }
    
            // Create and send the answer
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await connection.invoke("SendAnswer", id, JSON.stringify(answer));
        });
    
        connection.on("ReceiveAnswer", async (senderId, answer) => {
            const pc = peerConnections.current[senderId];
            if (!pc) {
                console.error("Peer connection not found for sender:", senderId);
                return;
            }
    
            // Set the remote answer description
            await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
        });
    
        connection.on("ReceiveIceCandidate", async (senderId, candidate) => {
            const pc = peerConnections.current[senderId];
            if (!pc) {
                console.error("Peer connection not found for sender:", senderId);
                return;
            }
    
            // Add the received ICE candidate to the peer connection
            await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
        });
    
        return () => {
            connection.stop();
        };
    }, [connection]);
    
    const createCall = async () => {
        if (!connection) return;
    
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalSteam(localStream);
        localVideoRef.current.srcObject = localStream;
    
        await connection.invoke("join", id);
    
        // Add local tracks to all existing peer connections
        Object.values(peerConnections.current).forEach((pc) => {
            localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
        });
    };

    

    return(
        <main className=" p-12 flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Video Chat</h1>
            <div className="flex gap-24 my-12 self-center">
                <video className="h-[350px] w-[350px] object-cover bg-black" ref={localVideoRef} autoPlay muted></video>
                {/* <video className="h-[350px] w-[350px] object-cover bg-black" ref={remoteVideoRef} autoPlay playsInline></video> */}
                {Object.keys(remoteVideoRefs.current).map((key) => (
                    <video
                        key={key}
                        className="h-[350px] w-[350px] object-cover bg-black"
                        ref={remoteVideoRefs.current[key]} // Access the ref from the object
                        autoPlay
                        playsInline
                    ></video>
                ))}
            </div>
            <button onClick={createCall} className="self-center bg-red-600 rounded-md p-2 px-4 text-lg font-bold text-white">Start Call</button>
            


        </main>
    )
}