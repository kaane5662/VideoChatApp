import PaddedList from "@/app/helpers/PaddedList";
import { IProfile } from "@/app/interfaces";
import Link from "next/link";
import { FaCircle } from "react-icons/fa";

export default function ProfileHeader({Profile}:{Profile:IProfile}){
    return(
        <Link href={`/platform/profile/${Profile?.id}`} className="rounded-md border-2 border-2 bg-white border-opacity-20 p-6 flex gap-4 hover:shadow-xl duration-300 hover:scale-105 flex-col relative  shadow-xl ">
            <div className="flex gap-4 items-center">
                <div className="w-fit h-fit relative">
                    <img className="h-8 w-8    bg-secondary rounded-full">
                        
                    </img>
                    {Profile?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold text-white w-fit text-xs">{Profile?.firstName[0]} {Profile?.lastName[0]}</h1>)}
                </div>
                <div className="flex flex-col">
                    <h1 className="text-md font-bold">{Profile?.firstName} {Profile?.lastName}</h1>
                    <div className="flex  gap-2 items-center">
                            <h3 className="text-xs text-slate-500">{Profile?.currentRole}</h3>
                            <FaCircle className="text-slate-300" size={5}/>
                            <p className="text-xs text-slate-500">{Profile.industry}</p>
                        </div>
                </div>
                
                
            </div>
            
            <div className="flex flex-col justify-between gap-2 border-top-2">
                        
                        
                        <div className="w-[80%]">
                        <PaddedList items={Profile.frameworks}/>

                        </div>
            </div>
            {Profile.similarityScore && Profile.similarityScore > 0?(<p className="text-complementary text-white absolute p-1 px-2 top-4 text-xs right-4 rounded-xl ml-auto bg-secondary">{Math.round(Profile?.similarityScore*100)}% Match</p>):null}
        </Link>
    )
}