import { cookies } from "next/headers";
import ProfileForm from "../../components/profiles/ProfileForm";
import { IProfile } from "../../interfaces";
import { getMyProfile } from "../../services/profiles";
import { OnboardingForm } from "@/app/components/profiles/onboarding/OnboardingForm";


export default async function ProfilePage(){
    const Profile:IProfile = await getMyProfile(cookies().toString())

    
    
    return(
        <main className="min-h-screen justify-center items-center flex p-6  overflow-y-scroll">
            {Profile ? (<ProfileForm existingProfile={Profile as any} />) :(<OnboardingForm/>)}
            {/* <ProfileForm ProfileData={Profile}></ProfileForm> */}
        </main>
    )
}