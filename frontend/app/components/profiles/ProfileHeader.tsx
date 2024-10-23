import PaddedList from "@/app/helpers/PaddedList";
import { IProfile } from "@/app/interfaces";
import Link from "next/link";

export default function ProfileHeader({Profile}:{Profile:IProfile}){
    return(
        <Link href={`/profile/${Profile?.id}`} className="rounded-sm border-secondary bg-white border-opacity-20 p-8 flex gap-2 hover:shadow-xl duration-300 hover:scale-105 flex-col relative border-2 shadow-md ">
            <div className="flex gap-4 items-center">
                <div className="w-fit h-fit relative">
                    <img className="h-16 w-16    bg-secondary rounded-full">
                        
                    </img>
                    {Profile?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold text-white w-fit text-xl">{Profile?.firstName[0]} {Profile?.lastName[0]}</h1>)}
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">{Profile?.firstName} {Profile?.lastName}</h1>
                    <h3 className="text-md text-secondary text-opacity-50">{Profile?.currentRole}</h3>
                </div>
                
                
            </div>
            {/* <h3 className="text-sm text-secondary text-opacity-50">Interests</h3>
            <PaddedList items={Profile.developmentInterests}/>
            <h3 className="text-sm text-secondary text-opacity-50">Languages</h3>
            <PaddedList items={Profile.programmingLanguages}/> */}
            <div className="flex justify-between gap-4">
                        <p className="text-sm text-secondary text-opacity-50">{Profile.industry}</p>
                        <p className="text-sm text-secondary text-opacity-50">{Profile.avaliability}</p>
            </div>
            {Profile.similarityScore && Profile.similarityScore > 0 && (<p className="text-complementary text-white p-2 top-0 text-xs right-0 rounded-xl ml-auto bg-secondary">{Math.round(Profile?.similarityScore*100)}% Match</p>)}
        </Link>
    )
}