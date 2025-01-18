// "use client"
import ProfileBanner from "@/app/components/profiles/ProfileBanner";
import PaddedList from "@/app/helpers/PaddedList"
import { IProfile } from "@/app/interfaces"
import { getProfile } from "@/app/services/profiles"
import { useState } from "react"


export default async function Profile({params}:any){
    const {id} = params;
    const ProfileData:IProfile = await getProfile(id);
    
    return(
        <main className="bg-slate-50 h-screen flex items-center p-24 justify-center">
            <ProfileBanner ProfileData={ProfileData}/>
        </main>
    )
}