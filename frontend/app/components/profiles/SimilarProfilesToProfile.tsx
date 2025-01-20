import { IProfile } from "@/app/interfaces"
import { getSimilarProfilesToProfile } from "@/app/services/profiles"
import { cookies } from "next/headers"
import { useEffect, useState } from "react"
import ProfileHeader from "./ProfileHeader"

export default async function SimilarProfilesToProfile({id}:{id:string}){
    
    const SimilarProfiles:IProfile[] = await getSimilarProfilesToProfile(id,cookies().toString())
    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl text-secondary">Similar Profiles</h1>
            <div className="grid grid-cols-3 gap-8">
                {SimilarProfiles.splice(1).map((similarProfile,index)=>{
                    return(
                        <ProfileHeader Profile={similarProfile}></ProfileHeader>
                    )
                })}
            </div>
        </div>
    )
}