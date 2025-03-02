import { IProfile } from "@/app/interfaces";
import { signOut } from "@/app/services/auth";
import { getMyProfile } from "@/app/services/profiles";
import { cookies } from "next/headers";
import Link from "next/link";
import { BsFillCameraFill, BsFillCameraVideoFill } from "react-icons/bs";
import { FaHome, FaMagic, FaPhone, FaSearch, FaUser } from "react-icons/fa";
import { FaGear, FaMessage, FaPerson } from "react-icons/fa6";
import { IoLogOut, IoSettings } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

export default async function PlatformNavbar(){
    const MyProfile:IProfile = await getMyProfile(cookies().toString());

    return(
        <main className="flex flex-col j self-center h-screen w-[15%] pt-12 rounded-3xl bg-gradient-to-br from-10% from-black/0 to-secondary/10 shadow-sm  text-primary  ">
                <h1 className="text-2xl font-bold p-2 flex-col flex items-center gap-0"><img className=" w-16 h-fit" src="/Logo.png"></img> Techmatch</h1>
                <div className="flex gap-2 rounded-t-xl p-2 py-8 items-center self-center ">
                    
                    <img className=" bg-secondary h-8 w-8 rounded-full"></img>
                    <div className="flex flex-col">
                        <h2 className="font-bold  text-md">{MyProfile?.firstName} {MyProfile?.lastName}</h2>
                        <h3 className="text-xs text-slate-500">{MyProfile?.currentRole}</h3>
                    </div>
                    
                </div>
                <div className="flex flex-col  gap-0">
                    <Link href={'/platform/dashboard'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-2 hover:text-white duration-200 rounded-sm"> <FaHome/> Home</h2>
                    </Link>
                    <Link href={'/platform/peers'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-2 hover:text-white duration-200 rounded-sm"> <BsFillCameraVideoFill/> Chat</h2>
                    </Link>
                    <Link href={'/platform/profile'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-2 hover:text-white duration-200 rounded-sm"> <FaUser/> Profile</h2>
                    </Link>
                    <Link href={'/platform/messages'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-2 hover:text-white duration-200 rounded-sm"> <FaMessage   /> Messages</h2>
                    </Link>
                    <Link href={'/platform/search'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-2 hover:text-white duration-200 rounded-sm"> <FaSearch/> Explore</h2>
                    </Link>
                    <Link href={'/platform/tailored'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-2 hover:text-white duration-200 rounded-sm"> <FaMagic/> Matches</h2>
                    </Link>
                    <Link href={'/platform/settings'}>
                        <h2 className="text-slate-500 text-sm flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-2 hover:text-white duration-200 rounded-sm"> <IoSettings/> Settings</h2>
                    </Link>
                    <form action={async()=>{"use server";signOut(cookies().toString())}}> 
                         
                        <button type="submit" className="text-slate-500 text-sm  w-full flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-2 hover:text-white duration-200 rounded-sm"> <IoLogOut/> Logout</button>
                    </form>
                    
                </div>
                

        </main>
    )
}