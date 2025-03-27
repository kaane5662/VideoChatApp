// "use client"
import PaddedList from "@/app/helpers/PaddedList";
import { IProfile } from "@/app/interfaces";
import { FaCircle, FaGithub, FaLinkedin, FaPortrait, FaStar, FaTwitter } from "react-icons/fa";
import BannerSides from "../modular/BannerSides";
import { createDirectMessageThread } from "@/app/services/messages";
import InitDm from "../messages/InitDm";
import Link from "next/link";
import { FaPerson } from "react-icons/fa6";
import { Circle } from "lucide-react";

export default function ProfileBanner({ProfileData}:{ProfileData:IProfile}){

    const createThread = async ()=>{
        "use server"
        await createDirectMessageThread(ProfileData.id)
    }

    return(

        <div className ="grid grid-cols-2 gap-4 relative w-full">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="bg-white flex flex-col col-span-2 gap-4  p-6 h-fit rounded-xl border-2 shadow-md">
                <div className="flex gap-4 ">
                    <div className="w-fit h-fit relative">
                        <img className="h-8 w-8    bg-secondary rounded-full">
                            
                        </img>
                        {ProfileData?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold text-white w-fit text-xs">{ProfileData?.firstName[0]} {ProfileData?.lastName[0]}</h1>)}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-lg">{ProfileData?.firstName} {ProfileData?.lastName}</h1>   
                        <div className="flex gap-2 items-center">
                            <h1 className=" text-slate-500 text-sm ">{ProfileData?.currentRole}</h1>
                            <FaCircle className=" text-slate-300" size={5}/>
                            <p className="text-sm text-slate-500">{ProfileData?.experience}</p>
                        </div>
                        

                    </div>
                    <InitDm profileId={ProfileData?.id}/>
                </div>
            </div>
            <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2 h-full bg-white p-6 shadow-md border-2 rounded-xl">
                        <h3 className="text-md font-bold">Bio</h3>
                        <p className="text-slate-500 text-sm">{ProfileData.description}</p>
                        <div className="flex gap-2 mt-auto">
                            <a href={ProfileData?.githubUrl} className="text-secondary underline bg-slate-100 border-2 px-2 p-1 rounded-full text-xs hover:underline hover:cursor-pointer"><FaGithub/></a>
                            <a href={ProfileData?.linkedInUrl} className="text-secondary underline bg-slate-100 border-2 px-2 p-1 rounded-full text-xs hover:underline hover:cursor-pointer"><FaLinkedin/></a>
                            <a href={ProfileData?.twitterUrl} className="text-secondary underline bg-slate-100 border-2 px-2 p-1 rounded-full text-xs hover:underline hover:cursor-pointer"><FaTwitter/></a>
                            <a href={ProfileData?.portfolioUrl} className="text-secondary underline bg-slate-100 border-2 px-2 p-1 rounded-full text-xs hover:underline hover:cursor-pointer"><FaPortrait/></a>
                        </div>
                       
                            <PaddedList items={ProfileData?.skills}/>
                        
                        {/* <div className="flex flex-col gap-4 text-sm">
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold text-sm">Github URL</h4>
                                <a href={ProfileData?.githubUrl} className="text-slate-400 text-xs hover:underline hover:cursor-pointer">{ProfileData?.githubUrl || "None"}</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold text-sm">LinkedIn URL</h4>
                                <a className="text-slate-400 text-xs hover:underline hover:cursor-pointer">{ProfileData?.linkedInUrl || "None"}</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold text-sm">Twitter URL</h4>
                                <a className="text-slate-400 text-xs hover:underline hover:cursor-pointer">{ProfileData?.twitterUrl || "None"}</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold text-sm">Portfolio URL</h4>
                                <a className="text-slate-400 text-xs hover:underline hover:cursor-pointer">{ProfileData?.portfolioUrl || "None"}</a>
                            </div>
                        </div> */}
                        
                    </div>
                    <div className="flex flex-col gap-2 p-4 rounded-xl border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Frameworks</h2>
                        <PaddedList items={ProfileData?.frameworks}></PaddedList>
                    </div>
            </div>
            <div className="flex flex-col gap-4">

                <div className="grid grid-cols-1 gap-4 col-span-2">
                    <div className="flex flex-col gap-2 p-4 rounded-xl border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Industry</h2>
                        <h3 className="  text-slate-500 text-sm">{ProfileData?.industry}</h3>
                    </div>
                    <div className="flex flex-col gap-2 p-4 rounded-xl border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Availability</h2>
                        <div className="flex gap-2 items-center">
                            <h3 className=" text-slate-500 text-sm ">{ProfileData?.availability}</h3>
                            <FaCircle className=" text-slate-300" size={5}/>
                            <p className="text-sm text-slate-500">{ProfileData?.timezone}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 p-4 rounded-xl border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Experience</h2>
                        <PaddedList items={ProfileData?.developmentInterests}></PaddedList>
                    </div>
                    <div className="flex flex-col gap-2 p-4 rounded-xl border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Languages</h2>
                        <PaddedList items={ProfileData?.programmingLanguages}></PaddedList>
                    </div>
                </div>
            </div>
        </div>
        
        
        
    )
}