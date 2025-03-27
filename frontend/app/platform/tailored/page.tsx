"use client"
import { useEffect, useState } from "react";
import SimilarStep from "../../components/profiles/SimilarStep";
import { getSimilarProfiles } from "../../services/profiles";
import { ILookingFor, IProfile } from "../../interfaces";
import ProfileBanner from "../../components/profiles/ProfileBanner";
import ProfileHeader from "../../components/profiles/ProfileHeader";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Switch } from "@/app/components/ui/switch";
import { getSimilarLookingForProfileData } from "@/app/services/lookingFor";
import ProfileLookingFor from "@/app/components/lookingfor/ProfileLookingForHeader";
import ProfileLookingForHeader from "@/app/components/lookingfor/ProfileLookingForHeader";
import { FaCircle } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";



export default function Tailored(){
    const router = useRouter()
    const [Profiles,setProfiles]  = useState<IProfile[]|ILookingFor[]>([])
    const [filter,setFilter] = useState("similar")

    const getMatchingProfiles = async ()=>{
        setProfiles([])
        try{
           
            const res = filter == "lookingForMe"? 
            await  getSimilarLookingForProfileData():
            await getSimilarProfiles(filter=="similar"?"similar":"lookingFor")
            console.log(res)
            setProfiles(res)
        }catch(err:any){
            
            toast.error(err.response.data || "Unexpected error has occured")
            if(err.response.status == 403)
                router.push("/platform/settings?displayPlans=yes")
        }
    }

    useEffect(()=>{
        getMatchingProfiles()
    },[filter])

    if(Profiles == null) redirect("/platform/profile")
    //convert to server component
    return(
        <main className="  min-h-screen p-12 gap-8 flex flex-col ">
            {/* for landing page */}
            {/* <div className="flex flex-col gap-2  p-12 rounded-xl ">
                <h1 className="font-bold text-6xl w-[50%]">Discover Co-Founders Like You!</h1>
                <h3 className="text-black text-opacity-50 text-2xl w-[50%]">Let our AI match you with profiles that align with your vision and skills.</h3>
                <h4 className="font-bold mt-5">How it Works</h4>
                <div className="grid grid-cols-4 gap-8">
                    <SimilarStep desc="We consider your skills, experience, and goals." header="Analyze Your Profile"></SimilarStep>
                    <SimilarStep desc="Our AI compares your profile with thousands of others." header="Find Matching Profiles"></SimilarStep>
                    <SimilarStep desc="Explore a personalized list of potential co-founders." header="Get Tailored Recommendations"></SimilarStep>
                </div>
                <button className="bg-blue-800 p-4 mt-8 px-8 text-white w-fit rounded-xl">Find Similar Profiles</button>
            </div> */}
            <div className="flex flex-col gap-2">
                <h1 className="font-bold text-3xl">Your AI-Powered Matches</h1>
                <h3 className="text-opacity-50 text-md text-black">Based on your profile, we’ve found these co-founders for you.</h3>
                <div className="flex gap-2 items-center">
                    <div className="flex text-sm gap-2 items-center">
                        <button onClick={()=>setFilter("similar")} disabled={filter == "similar"} className="border-2 disabled:bg-secondary duration-300 rounded-full w-4 h-4"/>
                        <p>Similar Skillset</p>
                    </div>
                    <div className="flex text-sm gap-2 items-center">
                        <button onClick={()=>setFilter("lookingFor")} disabled={filter == "lookingFor"} className="border-2 disabled:bg-secondary duration-300 rounded-full w-4 h-4"/>
                        <p>You are Looking For</p>
                    </div>
                    <div className="flex text-sm gap-2 items-center">
                        <button onClick={()=>setFilter("lookingForMe")} disabled={filter == "lookingForMe"} className="border-2 disabled:bg-secondary duration-300 rounded-full w-4 h-4"/>
                        <p>Looking For you</p>
                    </div>
                    
                </div>
            </div>
            {Profiles.length > 0 ?(
                <div className="grid grid-cols-3 gap-4">
                    {Profiles.map((profile:any, index)=>{
                        return(
                            filter == "lookingForMe"?<ProfileLookingForHeader lookingFor={profile} key={index}/> :<ProfileHeader key={index} Profile={profile}/>
                        )
                    })}
                </div>

            ):(
                <div className="font-bold w-full justify-center flex items-center h-full ">
                        <AiOutlineLoading size={30} className="animate-spin text-secondary"/>
                    </div>
            )}
            <h1></h1>
        </main>
    )
}