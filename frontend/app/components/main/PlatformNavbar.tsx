"use client"
import { IProfile } from "@/app/interfaces";
import { getUser, signOut } from "@/app/services/auth";
import { getMyProfile, getMyProfileClient } from "@/app/services/profiles";
import { cookies } from "next/headers";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsFillCameraFill, BsFillCameraVideoFill } from "react-icons/bs";
import { FaHome, FaMagic, FaPhone, FaSearch, FaSpinner, FaUser } from "react-icons/fa";
import { FaGear, FaMessage, FaPerson } from "react-icons/fa6";
import { IoLogOut, IoSettings } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { toast } from "react-toastify";
import useSWR from "swr";

export default function PlatformNavbar(){
    const [MyProfile,setMyProfile] = useState<IProfile>()

    const getProfile = async()=>{
        try{
            const profile = await getMyProfileClient()
            console.log("My prodile",profile)
            setMyProfile(profile)
        }catch(error:any){
            toast.error(error.message)
        }
    }
    const logOut = async()=>{
        try{
            await signOut()
            location.href = "/login"
        }catch(error:any){
            toast.error(error.message)
        }
    }

    
    useEffect(()=>{
        getProfile()
    },[])

    if(!MyProfile)
        return(
            <main className="flex flex-col j self-center h-screen w-[15%] pt-12 rounded-3xl bg-gradient-to-br from-10% from-black/0 to-secondary/10 text-primary shadow-lg  ">
                <FaSpinner className="self-center flex animate-spin text-secondary"/>
            </main>
        )
    
    
    return(
        <main className="flex flex-col j self-center h-screen w-[15%] pt-12 rounded-3xl bg-gradient-to-br from-10% from-black/0 to-secondary/10 text-primary shadow-lg  ">
                <h1 className="text-2xl font-bold p-2 flex-col flex items-center gap-0"><img className=" w-16 h-fit" src="/Logo.png"></img> Techmatch</h1>
                <div className="flex gap-2 rounded-t-xl p-2 py-8 items-center self-center ">
                    
                <div className="h-8 bg-secondary rounded-full w-8 relative">
                    <img className="h-full w-full rounded-full bg-opacity-0 bg-slate-50"></img>
                    <p className="text-white flex self-center justify-center top-0 bottom-0 left-0 right-0 absolute text-sm">{MyProfile?.firstName?.substring(0,1)}</p>
                </div>
                    <div className="flex flex-col">
                        <h2 className="font-bold  text-md">{MyProfile?.firstName} {MyProfile?.lastName}</h2>
                        <h3 className="text-xs text-slate-500">{MyProfile?.currentRole}</h3>
                    </div>
                    
                </div>
                <div className="flex flex-col  gap-0">
                    <Link href={'/platform/dashboard'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:mx-1 rounded-xl px-8 active:scale-90 p-2 duration-200 rounded-sm"> <FaHome/> Home</h2>
                    </Link>
                    <Link href={'/platform/peers'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:mx-1 rounded-xl px-8 active:scale-90 p-2 duration-200 rounded-sm"> <BsFillCameraVideoFill/> Chat</h2>
                    </Link>
                    <Link href={'/platform/profile'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:mx-1 rounded-xl px-8 active:scale-90 p-2 duration-200 rounded-sm"> <FaUser/> Profile</h2>
                    </Link>
                    <Link href={'/platform/messages'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:mx-1 rounded-xl px-8 active:scale-90 p-2 duration-200 rounded-sm"> <FaMessage   /> Messages</h2>
                    </Link>
                    <Link href={'/platform/search'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:mx-1 rounded-xl px-8 active:scale-90 p-2 duration-200 rounded-sm"> <FaSearch/> Explore</h2>
                    </Link>
                    <Link href={'/platform/tailored'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:mx-1 rounded-xl px-8 active:scale-90 p-2 duration-200 rounded-sm"> <FaMagic/> Matches</h2>
                    </Link>
                    <Link href={'/platform/settings'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:mx-1 rounded-xl px-8 active:scale-90 p-2 duration-200 rounded-sm"> <IoSettings/> Settings</h2>
                    </Link>
                   
                    <button onClick={logOut} type="submit" className="text-slate-500 text-sm  w-full flex gap-4 items-center hover:mx-1 rounded-xl px-8 active:scale-90 p-2 duration-200 rounded-sm"> <IoLogOut/> Logout</button>
                    
                    
                </div>
                

        </main>
    )
}