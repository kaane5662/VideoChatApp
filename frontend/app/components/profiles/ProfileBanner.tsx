// "use client"
import PaddedList from "@/app/helpers/PaddedList";
import { IProfile } from "@/app/interfaces";
import { FaStar } from "react-icons/fa";
import BannerSides from "../modular/BannerSides";
import { createDirectMessageThread } from "@/app/services/messages";
import InitDm from "../messages/InitDm";

export default function ProfileBanner({ProfileData}:{ProfileData:IProfile}){

    const createThread = async ()=>{
        "use server"
        await createDirectMessageThread(ProfileData.id)
    }

    return(

        <div className ="grid grid-cols-2 gap-4 w-[80%] relative">
            <div className="bg-white flex flex-col col-span-2 gap-4 -mx-12 p-6 h-fit rounded-sm border-2 shadow-md">
                <div className="flex gap-8 items-center ">
                    <img className="bg-secondary h-16 w-16 rounded-full self-center"></img>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-xl">{ProfileData?.firstName} {ProfileData?.lastName}</h1>   
                        <h1 className="text-black text-opacity-50 text-md ">{ProfileData?.currentRole}</h1>

                    </div>
                    <InitDm profileId={ProfileData?.id}/>
                </div>
                <h1 className="text-md">{ProfileData.description}</h1>
            </div>
            <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-4 bg-white p-6 shadow-md border-2">
                        <h3 className="text-md font-bold">Links and Socials</h3>
                        <div className="flex flex-col gap-4 text-sm">
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold">Github URL</h4>
                                <a className="text-secondary text-opacity-50 hover:underline hover:cursor-pointer">{ProfileData?.githubUrl || "None"}</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold">LinkedIn URL</h4>
                                <a className="text-secondary text-opacity-50 hover:underline hover:cursor-pointer">{ProfileData?.linkedInUrl || "None"}</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold">Twitter URL</h4>
                                <a className="text-secondary text-opacity-50 hover:underline hover:cursor-pointer">{ProfileData?.twitterUrl || "None"}</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold">Portfolio URL</h4>
                                <a className="text-secondary text-opacity-50 hover:underline hover:cursor-pointer">{ProfileData?.portfolioUrl || "None"}</a>
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex flex-col gap-2 p-4 rounded-sm border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Frameworks</h2>
                        <PaddedList items={ProfileData?.frameworks}></PaddedList>
                    </div>
            </div>
            <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-4 col-span-2">
                    <div className="flex flex-col gap-2 p-4 rounded-sm border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Industry</h2>
                        <h3 className="  text-black text-opacity-50">{ProfileData?.industry}</h3>
                    </div>
                    <div className="flex flex-col gap-2 p-4 rounded-sm border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Avaliability</h2>
                        <h3 className="  text-black text-opacity-50">{ProfileData?.avaliability}</h3>
                    </div>
                    <div className="flex flex-col gap-2 p-4 rounded-sm border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Interests</h2>
                        <PaddedList items={ProfileData?.developmentInterests}></PaddedList>
                    </div>
                    <div className="flex flex-col gap-2 p-4 rounded-sm border-2 shadow-md bg-white">
                        <h2 className="font-bold text-md">Languages</h2>
                        <PaddedList items={ProfileData?.programmingLanguages}></PaddedList>
                    </div>
                </div>
            </div>
        </div>
        
        
        
    )
}