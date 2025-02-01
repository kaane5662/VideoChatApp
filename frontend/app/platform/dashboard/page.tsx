import { cookies } from "next/headers"
import { IProfile } from "../../interfaces"
import { getMyProfile, getSimilarProfiles, getSimilarProfiles2 } from "../../services/profiles"
import Navbar from "../../components/main/PlatformNavbar";
import { FaMagic, FaUserFriends } from "react-icons/fa";
import ActivityCard from "../../components/dashboard/ActivityCard";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { profile } from "console";
import ProfileHeader from "../../components/profiles/ProfileHeader";

export default async function Dashboard(){
    const Profile:IProfile = await getMyProfile(cookies().toString());
    const ReccomendedProfiles:IProfile[] = await getSimilarProfiles2(cookies().toString());
    
    return(
        <main className="  min-h-screen p-12 gap-8 flex flex-col ">
            {/* <Navbar></Navbar> */}
            <div className="flex flex-col gap-2">
                <h1 className="font-bold text-4xl ">Hi, {Profile?.firstName}</h1>
                <h3 className="text-slate-500 text-lg">Your journey to finding the perfect co-founder starts here.</h3>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl ">Activity Overview</h1>
                <div className="flex gap-8">
                    <ActivityCard icon={<FaUserFriends size={20}></FaUserFriends>} title="Connections" value={"Coming soon"}/>
                    <ActivityCard icon={<FaMagic size={20}></FaMagic>} title="AI Matches" value={Profile?.matches}/>
                    <ActivityCard icon={<BsFillCameraVideoFill size={20}></BsFillCameraVideoFill>} title="Sessions" value={Profile?.sessions}/>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl flex gap-8">Recommended  </h1>
                <div className="grid grid-cols-3 gap-8">
                    {ReccomendedProfiles?.map((profile,index)=>{
                        return(
                            <ProfileHeader key={index} Profile={profile}></ProfileHeader>
                        )
                    })}
                </div>
            
            </div>
        </main>
    )
}