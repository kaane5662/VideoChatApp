// "use client"
import ProfileBanner from "@/app/components/profiles/ProfileBanner";
import Similar from "@/app/components/profiles/Similar";
import SimilarProfilesToProfile from "@/app/components/profiles/SimilarProfilesToProfile";
import PaddedList from "@/app/helpers/PaddedList"
import { IProfile } from "@/app/interfaces"
import { getProfile } from "@/app/services/profiles"
import { useState } from "react"


export default async function Profile({params}:any){
    const {id} = params;
    const ProfileData:IProfile = await getProfile(id);
    
    return(
        <main className=" min-h-screen flex flex-col gap-8 items-center p-24 justify-center">
            <ProfileBanner ProfileData={ProfileData}/>
            <SimilarProfilesToProfile id={id}/>
        </main>
    )
}