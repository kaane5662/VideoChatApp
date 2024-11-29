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

export default async function Navbar(){
    const MyProfile:IProfile = await getMyProfile(cookies().toString());

    return(
        <main className="flex flex-col j max-h-screen min-w-[15%] pt-12 bg-secondary text-primary text-opacity-75 border-secondary border-opacity-10">
                <h1 className="text-3xl font-bold p-4 text-primary">VideoApp</h1>
                <div className="flex gap-4 rounded-t-xl items-center p-4 ">
                    <div className="w-fit h-fit relative">
                        <img className="h-12 w-12    bg-primary rounded-full">
                            
                        </img>
                        {MyProfile?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold   w-fit text-xl">{MyProfile?.firstName[0]} {MyProfile?.lastName[0]}</h1>)}
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-bold text-white">{MyProfile?.firstName} {MyProfile?.lastName}</h2>
                        <h3 className="text-sm text-white text-opacity-50 ">{MyProfile?.currentRole}</h3>
                    </div>
                    
                </div>
                <div className="flex flex-col text-secondary gap-0">
                    <Link href={'/dashboard'}>
                        <h2 className="text-md text-primary text-opacity-75 flex gap-4 items-center hover:bg-complementary px-8 p-3 hover:text-secondary duration-200 rounded-sm"> <FaHome/> Home</h2>
                    </Link>
                    <Link href={'/peers'}>
                        <h2 className="text-md text-primary text-opacity-75 flex gap-4 items-center hover:bg-complementary px-8 p-3 hover:text-secondary duration-200 rounded-sm"> <BsFillCameraVideoFill/> Chat</h2>
                    </Link>
                    <Link href={'/profile'}>
                        <h2 className="text-md text-primary text-opacity-75 flex gap-4 items-center hover:bg-complementary px-8 p-3 hover:text-secondary duration-200 rounded-sm"> <FaUser/> Profile</h2>
                    </Link>
                    <Link href={'/messages'}>
                        <h2 className="text-md text-primary text-opacity-75 flex gap-4 items-center hover:bg-complementary px-8 p-3 hover:text-secondary duration-200 rounded-sm"> <FaMessage   /> Messages</h2>
                    </Link>
                    {/* <Link href={'/search'}>
                        <h2 className="text-md text-primary text-opacity-75 flex gap-4 items-center hover:bg-complementary px-8 p-3 hover:text-secondary duration-200 rounded-sm"> <FaSearch/> Explore</h2>
                    </Link> */}
                    <Link href={'/tailored'}>
                        <h2 className="text-md text-primary text-opacity-75 flex gap-4 items-center hover:bg-complementary px-8 p-3 hover:text-secondary duration-200 rounded-sm"> <FaMagic/> Matches</h2>
                    </Link>
                    <form action={async()=>{"use server";signOut(cookies().toString())}}> 
                         
                        <button type="submit" className="text-md text-primary text-opacity-75 w-full flex gap-4 items-center hover:bg-complementary px-8 p-3 hover:text-secondary duration-200 rounded-sm"> <IoLogOut/> Logout</button>
                    </form>
                    
                </div>
                

        </main>
    )
}