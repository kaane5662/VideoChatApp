"use client"
import { IProfile } from "@/app/interfaces";
import { getUser, signOut } from "@/app/services/auth";
import { getMyProfile, getMyProfileClient } from "@/app/services/profiles";
import { cookies } from "next/headers";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillCameraFill, BsFillCameraVideoFill } from "react-icons/bs";
import { FaHome, FaMagic, FaPhone, FaSearch, FaSpinner, FaUser } from "react-icons/fa";
import { FaGear, FaMessage, FaPerson } from "react-icons/fa6";
import { IoLogOut, IoSettings } from "react-icons/io5";
import { MdDashboard, MdFeedback, MdWork } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { toast } from "react-toastify";
import useSWR from "swr";

export default function PlatformNavbar(){
    const [MyProfile,setMyProfile] = useState<IProfile>()
    const router = useRouter()
    const pathname = usePathname()
    const getProfile = async()=>{
        try{
            const profile = await getMyProfileClient()
            console.log("My prodile",profile)
            setMyProfile(profile)
        }catch(error:any){
            if(error.status == 404){
                
                if(pathname != "/platform/profile"){
                    router.push("/platform/profile")
                    // toast.error("Profile not found")
                }else{console.log("Not the profile page")}
                
            }
        }
    }
    const logOut = async()=>{
        try{
            await signOut()
            location.href = "/login"
        }catch(error:any){
            if(error.status == 404){
                
                if(pathname != "/platform/profile"){
                
                    // toast.error("Profile not found")
                    router.push("/platform/profile")
                }else{console.log("Not the profile page")}
                
            }
        }
    }

    
    useEffect(()=>{
        getProfile()
    },[])

    if(!MyProfile)
        return(
            <main className="flex flex-col j self-center h-screen w-[15%] pt-12 rounded-3xl bg-gradient-to-br from-10% from-black/0 to-secondary/10 text-primary shadow-lg animate-pulse  ">
                
            </main>
        )
    
    
    return(
        <main className="flex flex-col j self-center h-screen w-[15%] pt-12  bg-gradient-to-br from-10% from-black/0 to-secondary/10 text-primary shadow-lg rounded-xl ">
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
                    <Link className="px-4" href={'/platform/peers'}>
                        <h2 className="text-white from-secondary bg-gradient-to-bl to-secondary/70 shadow-md text-sm flex gap-3 items-center  hover:scale-105 rounded-xl px-8 active:scale-90 p-2 duration-200 "> <BsFillCameraVideoFill size={12}/> Chat</h2>
                    </Link>
                    <section className="flex flex-col gap-2 px-4 p-2">
                        <label className="text-xs font-bold text-slate-700  ">Navigation</label>
                        <div className="flex px-4 flex-col gap-2">
                            <Link href={'/platform/dashboard'}>
                                <h2 className="text-slate-500 text-sm flex gap-3 items-center hover:mx-1 rounded-xl  active:scale-90 duration-200 rounded-sm"> <FaHome size={12}/> Home</h2>
                            </Link>
                            <Link href={'/platform/search'}>
                                <h2 className="text-slate-500 text-sm flex gap-3 items-center hover:mx-1 rounded-xl  active:scale-90 duration-200 rounded-sm"> <FaSearch size={12}/> Explore</h2>
                            </Link>
                            <Link href={'/platform/tailored'}>
                                <h2 className="text-slate-500 text-sm flex gap-3 items-center hover:mx-1 rounded-xl  active:scale-90 duration-200 rounded-sm"> <FaMagic size={12}/> Matches</h2>
                            </Link>

                        </div>
                    </section>
                    <section className="flex flex-col gap-2 px-4 p-2">
                        <label className="text-xs font-bold text-slate-700  ">Profile and Preferences</label>
                        <div className="flex px-4 flex-col gap-2">
                        <Link href={'/platform/profile'}>
                            <h2 className="text-slate-500 text-sm flex gap-3 items-center hover:mx-1 rounded-xl  active:scale-90  duration-200 rounded-sm"> <FaUser size={12}/> Profile</h2>
                        </Link>
                        <Link href={'/platform/lookingfor'}>
                            <h2 className="text-slate-500 text-sm flex gap-3 items-center hover:mx-1 rounded-xl  active:scale-90  duration-200 rounded-sm"> <MdWork size={12}/> Preferences</h2>
                        </Link>

                        </div>
                    </section>
                    <section className="flex flex-col gap-2 px-4 p-2">
                        <label className="text-xs font-bold text-slate-700  ">Communication</label>
                        <div className="flex px-4 flex-col gap-2">

                            <Link href={'/platform/messages'}>
                                <h2 className="text-slate-500 text-sm flex gap-3 items-center hover:mx-1 rounded-xl active:scale-90 duration-200 rounded-sm"> <FaMessage  size={12} /> Messages</h2>
                            </Link>
                        </div>
                        
                    </section>
                    <section className="flex flex-col gap-2 px-4 p-2">
                        <label className="text-xs font-bold text-slate-700  ">Settings And Account</label>
                        <div className="flex px-4 flex-col gap-2">
                        <Link href={'/platform/settings'}>
                        <h2 className="text-slate-500 text-sm flex gap-3 items-center hover:mx-1 rounded-xl  active:scale-90 duration-200 rounded-sm"> <IoSettings size={12}/> Settings</h2>
                        </Link>
                        <Link href={'/platform/feedback'}>
                            <h2 className="text-slate-500 text-sm flex gap-3 items-center hover:mx-1 rounded-xl  active:scale-90 duration-200 rounded-sm"> <MdFeedback size={12}/> Feedback</h2>
                        </Link>
                    
                        <button onClick={logOut} type="submit" className="text-slate-500 text-sm  w-full flex gap-3 items-center hover:mx-1 rounded-xl  active:scale-90 duration-200 rounded-sm"> <IoLogOut/> Logout</button>

                        </div>
                    </section>
                    
                    
                    
                
                    
                    
                </div>
                

        </main>
    )
}