import PaddedList from "@/app/helpers/PaddedList";
import { ILookingFor } from "@/app/interfaces";
import Link from "next/link";
import { FaCircle } from "react-icons/fa";

export default function ProfileLookingForHeader({lookingFor}:{lookingFor:ILookingFor}){
    return(
        <Link href={`/platform/profile/${lookingFor.profileId}`} className="flex hover:opacity-90 flex-col rounded-xl relative shadow-md border-2 hover:shadow-xl duration-300 w-full gap-4 p-4">
            <div className="text-sm flex flex-col">
                <div className="flex gap-2 items-center">
                    <div className="w-fit h-fit relative">
                        <img className="h-8 w-8 bg-secondary rounded-full">
                            
                        </img>
                        {lookingFor?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold text-white w-fit text-xs">{lookingFor?.firstName[0]} {lookingFor?.lastName[0]}</h1>)}
                    </div>
                    <div className="flex flex-col">
                        <p className="text-md font-bold">{lookingFor.firstName} {lookingFor.lastName}</p>

                    <h1 className=" text-slate-500 text-xs">Looking For</h1>
                    </div>

                </div>
            </div>
            
            <div className="flex flex-col gap-0">
                <p className="text-;g font-semibold">{lookingFor.role}</p>
                <div className="flex text-slate-500 items-center gap-2 text-xs">
                    <p className=" text-slate-500">{lookingFor.industry}</p>
                    <FaCircle size={5}/>
                    <p className=" text-slate-500">{lookingFor.avaliability||"Full-Time"}</p>
                </div>
            </div>
           
            <h1 className="text-slate-500 text-sm">{lookingFor.description}</h1>
            
            <PaddedList className="" items={[...lookingFor.frameworks || [],...lookingFor.skills || []]}/>
            {/* <PaddedList className=" text-secondary bg-white border-none" items={lookingFor.skills}/> */}
            {lookingFor.similarityScore && lookingFor.similarityScore > 0?(<p className="text-complementary text-white absolute p-1 px-2 top-4 text-xs right-4 rounded-xl ml-auto bg-secondary">{Math.round(lookingFor?.similarityScore*100)}% Match</p>):null}
        
        </Link>
    )
}