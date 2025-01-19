import { cookies } from "next/headers";
import ProfileForm from "../../components/profiles/ProfileForm";
import { IProfile } from "../../interfaces";
import { getMyProfile } from "../../services/profiles";


export default async function ProfilePage(){
    const Profile:IProfile = await getMyProfile(cookies().toString())

    
    
    return(
        <main className="min-h-screen justify-center items-center flex p-12  overflow-y-scroll">
            
            <ProfileForm ProfileData={Profile}></ProfileForm>
        </main>
    )
}