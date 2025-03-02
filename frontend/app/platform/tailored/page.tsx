"use client"
import { useEffect, useState } from "react";
import SimilarStep from "../../components/profiles/SimilarStep";
import { getSimilarProfiles } from "../../services/profiles";
import { IProfile } from "../../interfaces";
import ProfileBanner from "../../components/profiles/ProfileBanner";
import ProfileHeader from "../../components/profiles/ProfileHeader";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";


export default function Tailored(){
    const router = useRouter()
    const [Profiles,setProfiles]  = useState<IProfile[]>([])
    const getMatchingProfiles = async ()=>{
        try{
            const res = await getSimilarProfiles()
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
    },[])

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
            </div>
            <div className="grid grid-cols-3 gap-4">
                {Profiles.map((profile, index)=>{
                    return(
                        <ProfileHeader key={index} Profile={profile}/>
                    )
                })}
            </div>
            <h1></h1>
        </main>
    )
}