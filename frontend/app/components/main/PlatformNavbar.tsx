import { IProfile } from "@/app/interfaces";
import { signOut } from "@/app/services/auth";
import { getMyProfile } from "@/app/services/profiles";
import { cookies } from "next/headers";
import Link from "next/link";
import { BsFillCameraFill, BsFillCameraVideoFill } from "react-icons/bs";
import { FaHome, FaMagic, FaPhone, FaSearch, FaUser } from "react-icons/fa";
import { FaGear, FaMessage, FaPerson } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

export default async function PlatformNavbar(){
    const MyProfile:IProfile = await getMyProfile(cookies().toString());

    return(
        <main className="flex flex-col j max-h-screen min-w-[15%] pt-12 bg-white  border-r-2 text-primary  ">
                <h1 className="text-2xl font-bold p-4 flex-col flex items-center gap-2"><img className=" w-16 h-fit" src="/Logo.png"></img> TECHMATCH</h1>
                <div className="flex gap-4 rounded-t-xl p-4 px-8 flex-col ">
                    <div className="w-fit h-fit relative">
                        <img className="h-12 w-12    bg-secondary rounded-full">
                            
                        </img>
                        {MyProfile?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold text-secondary   w-fit text-xl">{MyProfile?.firstName[0]} {MyProfile?.lastName[0]}</h1>)}
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-bold  text-2xl">{MyProfile?.firstName} {MyProfile?.lastName}</h2>
                        <h3 className="text-md text-slate-500">{MyProfile?.currentRole}</h3>
                    </div>
                    
                </div>
                <div className="flex flex-col  gap-0">
                    <Link href={'/platform/dashboard'}>
                        <h2 className="text-slate-700 flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-3 hover:text-white duration-200 rounded-sm"> <FaHome/> Home</h2>
                    </Link>
                    <Link href={'/platform/peers'}>
                        <h2 className="text-slate-700 flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-3 hover:text-white duration-200 rounded-sm"> <BsFillCameraVideoFill/> Chat</h2>
                    </Link>
                    <Link href={'/platform/profile'}>
                        <h2 className="text-slate-700 flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-3 hover:text-white duration-200 rounded-sm"> <FaUser/> Profile</h2>
                    </Link>
                    <Link href={'/platform/messages'}>
                        <h2 className="text-slate-700 flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-3 hover:text-white duration-200 rounded-sm"> <FaMessage   /> Messages</h2>
                    </Link>
                    <Link href={'/platform/search'}>
                        <h2 className="text-slate-700 flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-3 hover:text-white duration-200 rounded-sm"> <FaSearch/> Explore</h2>
                    </Link>
                    <Link href={'/platform/tailored'}>
                        <h2 className="text-slate-700 flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-3 hover:text-white duration-200 rounded-sm"> <FaMagic/> Matches</h2>
                    </Link>
                    <form action={async()=>{"use server";signOut(cookies().toString())}}> 
                         
                        <button type="submit" className="text-slate-700  w-full flex gap-4 items-center hover:bg-secondary rounded-xl px-8 p-3 hover:text-white duration-200 rounded-sm"> <IoLogOut/> Logout</button>
                    </form>
                    
                </div>
                

        </main>
    )
}