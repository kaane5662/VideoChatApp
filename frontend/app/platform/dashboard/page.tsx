import { cookies } from "next/headers"
import { IDirectMessage, IProfile, IUser } from "../../interfaces"
import { getMyProfile, getSimilarProfiles, getSimilarProfiles2 } from "../../services/profiles"
import Navbar from "../../components/main/PlatformNavbar";
import { FaMagic, FaUserFriends } from "react-icons/fa";
import ActivityCard from "../../components/dashboard/ActivityCard";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { MdGeneratingTokens } from "react-icons/md";
import { profile } from "console";
import ProfileHeader from "../../components/profiles/ProfileHeader";
import { redirect } from "next/navigation";
import { getDirectMessages } from "@/app/services/messages";
import Contact from "@/app/components/messages/Contact";
import { getUser2 } from "@/app/services/auth";
import dynamic from "next/dynamic";
import SubscriptionNeeded from "@/app/components/subscription/SubscriptionNeeded";
const AdBanner = dynamic(() => import("../../components/ads/GoogleAdsense"), {
    ssr: false,
   });

export default async function Dashboard(){
    const promise1 = getMyProfile(cookies().toString());
    const promise2 = getDirectMessages(cookies().toString(),2);
    const promise3 = getSimilarProfiles2(cookies().toString(),3+1);
    const promise4 = getUser2(cookies().toString())
    
    const [Profile,RecentDms,ReccomendedProfiles,User] = await Promise.all([promise1,promise2,promise3,promise4])
    if(Profile == null) return redirect("/platform/profile")
    return(
        <main className="  min-h-screen p-12 gap-8 flex flex-col ">
            {/* <Navbar></Navbar> */}
            {/* <AdBanner data-full-width-responsive="true" data-ad-format="display"  data-ad-slot="6246522761"></AdBanner> */}
            <div className="flex flex-col gap-2">
                <h1 className="font-bold text-4xl ">Hi, {Profile?.firstName}</h1>
                <h3 className="text-slate-500 text-md">Your journey to finding the perfect co-founder starts here.</h3>
            </div>
            
            <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl ">Activity Overview</h1>
                <div className="flex gap-8">
                    <ActivityCard icon={<FaUserFriends size={20}></FaUserFriends>} title="Connections" value={"Coming soon"}/>
                    <ActivityCard icon={<FaMagic size={20}></FaMagic>} title="Matches Left" value={User?.matches}/>
                    <ActivityCard icon={<MdGeneratingTokens size={20}/>} title="Video Credits" value={User?.credits}/>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl flex gap-8">Catch Up</h1>
                <div className="grid grid-cols-2 gap-4">
                    {RecentDms && RecentDms.length > 0 ? RecentDms.map((recentDm:IDirectMessage)=>{
                        return(

                            <Contact directMessage={recentDm}></Contact>
                        )

                    }):(<p className="text-slate-500 text-sm">Start messaging someone to start a conversation</p>)}

                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl flex gap-8">Recommended  </h1>
                {ReccomendedProfiles?.response &&
                    (<SubscriptionNeeded/>)
                    }
                <div className="grid grid-cols-3 gap-8">
                    {/* {Profile.} */}
                    {!ReccomendedProfiles?.response && ReccomendedProfiles?.map((profile:IProfile,index:any)=>{
                        return(
                            <ProfileHeader key={index} Profile={profile}></ProfileHeader>
                        )
                    })}
                    
                </div>
            
            </div>
        </main>
    )
}