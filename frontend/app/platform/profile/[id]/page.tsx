// "use client"
import ProfileLookingForBanner from "@/app/components/lookingfor/ProfileLookingForBanner";
import ProfileLookingFor from "@/app/components/lookingfor/ProfileLookingForHeader";
import ProfileBanner from "@/app/components/profiles/ProfileBanner";
import SimilarProfilesToProfile from "@/app/components/profiles/SimilarProfilesToProfile";
import PaddedList from "@/app/helpers/PaddedList"
import { IProfile } from "@/app/interfaces"
import { getProfile } from "@/app/services/profiles"



export default async function Profile({params}:any){
    const {id} = params;
    const ProfileData:IProfile = await getProfile(id);
    
    return(
        <main className=" min-h-screen flex flex-col gap-8 items-center p-24 py-12 justify-center">
            <ProfileBanner ProfileData={ProfileData}/>
            <ProfileLookingForBanner id={id}/>
            <SimilarProfilesToProfile id={id}/>
            {/* <ProfileLookingFor/> */}
        </main>
    )
}