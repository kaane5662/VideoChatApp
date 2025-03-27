"use client"
import { useEffect, useState } from "react";
import ProfileSearchBar from "../../components/profiles/ProfileSearchBar";
import { ILookingFor, IProfile, IProfileSearch } from "../../interfaces";
import { createSearchParams } from "../../helpers/createSearchParams";
import axios from "axios";
import { searchProfiles } from "../../services/profiles";
import ProfileHeader from "../../components/profiles/ProfileHeader";
import Pagination from "@/app/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Switch } from "@/app/components/ui/switch";
import ProfileLookingForHeader from "@/app/components/lookingfor/ProfileLookingForHeader";
import { getLookingForProfileData, searchLookingFor } from "@/app/services/lookingFor";
import { AiOutlineLoading } from "react-icons/ai";


export default function Search(){
    const router = useRouter()
    const [Profiles, setProfiles] = useState<IProfile[] | ILookingFor[]>([])
    const [searchObject, setSearchObject] = useState<IProfileSearch | any>()
    const [currentPage,setCurrentPage] = useState(1);
    const [maxPages,setMaxPages] = useState(1);
    const [lookingFor,setLookingFor] = useState(false)
    const [loading,setLoading] = useState(false)
    const fetchResults = async (options:string | string[], field:keyof IProfileSearch) => {
        
        const newSearchObject: IProfileSearch = {
            ...searchObject,         // Spread the current searchObject state
            [field]: options,
            page: currentPage         // Use computed property name to dynamically set the field
        };
        setSearchObject(newSearchObject)
        console.log(newSearchObject)
        const query:string = createSearchParams(newSearchObject)
        setLoading(true)
        try{
            const results = lookingFor ? await searchLookingFor(query): await searchProfiles(query);

            setProfiles(results.paginatedResults)
            setMaxPages(results.count)
        }catch(error:any){
            console.log(error)
            toast.error(error?.response?.data || "Unexpected error has occured")
            if(error?.status == 403)
                router.push("/platform/settings?displayPlans=yes")
            

        }finally{setLoading(false)}
        
    };

    useEffect(()=>{
        fetchResults([],"avaliability")
    },[currentPage,lookingFor])
    return(
        <main className="  min-h-screen gap-4 flex flex-col p-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold">Find Your Perfect Co-Founder!</h1>
                <h2 className="text-black text-opacity-50 text-md">Search profiles tailored to your business needs.</h2>
            </div>
            <div className="flex gap-2">
                <Switch onCheckedChange={()=>setLookingFor(!lookingFor)} checked={lookingFor}/>
                <p className="text-sm">Looking For</p>
            </div>
            <ProfileSearchBar updateResults={fetchResults}/>
            {!loading ?(
                <div className="grid grid-cols-3 gap-8">
                    {Profiles?.map((profile:any, index)=>{
                        return(
                                lookingFor?<ProfileLookingForHeader lookingFor={profile} key={index}/> :<ProfileHeader key={index} Profile={profile}/>
                        )
                    })}
                    
                </div>

            ):(
                <div className="font-bold w-full justify-center flex items-center h-full ">
                    <AiOutlineLoading size={30} className="animate-spin text-secondary"/>
                </div>
            )}
            <Pagination totalPages={maxPages} onPageChange={setCurrentPage} currentPage={currentPage}></Pagination>
        </main>
    )
}