"use client"
import { IProfile } from "@/app/interfaces";
import { getUser, getUser2, signOut } from "@/app/services/auth";
import { getMyProfile } from "@/app/services/profiles";
import { cookies } from "next/headers";
import Link from "next/link";
import { BsFillCameraFill, BsFillCameraVideoFill } from "react-icons/bs";
import { FaHome, FaMagic, FaPhone, FaSearch, FaUser, FaVideo } from "react-icons/fa";
import { FaGear, FaMessage, FaPerson } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { Logo } from "../ui/icons";
import { useEffect, useState } from "react";

export default function LandingNavbar(){
    const [User,setUser] = useState()

    const fetchUser = async()=>{
        try{
            const res = await getUser()
            setUser(res)
        }catch{}

    }
    useEffect(()=>{
        fetchUser()
    },[])

    return(
        <nav className="fixed w-screen h-fit z-[100000] max-md:hidden">
            <div className=" px-12 p-4 flex justify-between items-center bg-complementary">

                <Link href={"/"} className="text-2xl font-bold text-black flex items-center gap-4"> <img className=" w-16 h-fit" src="Logo.png"></img> TechMatch</Link>
                <div className="flex gap-4 items-center">
                    {User ? (
                        <Link href={"/platform/dashboard"} className=" bg-secondary shadow-md px-4 p-2 text-complementary rounded-xl hover:scale-105 duration-300"> Dashboard</Link>
                    ):(
                        <>
                        <Link href={"/signup"} className=" hover:scale-105 duration-300 border-2 shadow-md px-4 p-2 bg-secondary text-white rounded-xl">Find Match</Link>
                        <Link href={"/login"} className="hover:scale-105 duration-300 border-2 shadow-md px-4 p-2 rounded-xl">Login</Link>
                        </>
                    )}
                    
                </div>
            </div>
        </nav>
    )
}