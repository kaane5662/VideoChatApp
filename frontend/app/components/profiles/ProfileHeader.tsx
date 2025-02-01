import PaddedList from "@/app/helpers/PaddedList";
import { IProfile } from "@/app/interfaces";
import Link from "next/link";

export default function ProfileHeader({Profile}:{Profile:IProfile}){
    return(
        <Link href={`/platform/profile/${Profile?.id}`} className="rounded-xl border-2 bg-white border-opacity-20 p-8 flex gap-2 hover:shadow-xl duration-300 hover:scale-105 flex-col relative border-2 shadow-xl ">
            <div className="flex gap-4 items-top">
                <div className="w-fit h-fit relative">
                    <img className="h-8 w-8    bg-secondary rounded-full">
                        
                    </img>
                    {Profile?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold text-white w-fit text-xs">{Profile?.firstName[0]} {Profile?.lastName[0]}</h1>)}
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold">{Profile?.firstName} {Profile?.lastName}</h1>
                    <h3 className="text-sm text-slate-500">{Profile?.currentRole}</h3>
                </div>
                
                
            </div>
            
            <div className="flex flex-col justify-between gap-4 border-top-2">
                        <p className="text-sm text-slate-500">{Profile.industry}</p>
                        <div className="w-[80%]">
                        <PaddedList items={Profile.frameworks}/>

                        </div>
            </div>
            {Profile.similarityScore && Profile.similarityScore > 0?(<p className="text-complementary text-white absolute p-1 px-2 top-6 text-xs right-6 rounded-xl ml-auto bg-secondary">{Math.round(Profile?.similarityScore*100)}% Match</p>):null}
        </Link>
    )
}