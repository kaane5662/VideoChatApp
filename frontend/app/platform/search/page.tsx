"use client"
import { useEffect, useState } from "react";
import ProfileSearchBar from "../../components/profiles/ProfileSearchBar";
import { IProfile, IProfileSearch } from "../../interfaces";
import { createSearchParams } from "../../helpers/createSearchParams";
import axios from "axios";
import { searchProfiles } from "../../services/profiles";
import ProfileHeader from "../../components/profiles/ProfileHeader";
import Pagination from "@/app/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Search(){
    const router = useRouter()
    const [Profiles, setProfiles] = useState<IProfile | any>([])
    const [searchObject, setSearchObject] = useState<IProfileSearch | any>()
    const [currentPage,setCurrentPage] = useState(1);
    const [maxPages,setMaxPages] = useState(1);
    const fetchResults = async (options:string | string[], field:keyof IProfileSearch) => {
        
        const newSearchObject: IProfileSearch = {
            ...searchObject,         // Spread the current searchObject state
            [field]: options,
            page: currentPage         // Use computed property name to dynamically set the field
        };
        setSearchObject(newSearchObject)
        console.log(newSearchObject)
        const query:string = createSearchParams(newSearchObject)
        try{
            const results = await searchProfiles(query);

            setProfiles(results.paginatedResults)
            setMaxPages(results.count)
        }catch(error:any){
            console.log(error)
            toast.error(error?.response?.data || "Unexpected error has occured")
            if(error?.status == 403)
                router.push("/platform/settings?displayPlans=yes")
            

        }
        
    };

    useEffect(()=>{
        fetchResults([],"avaliability")
    },[currentPage])
    return(
        <main className="  min-h-screen gap-4 py-4 flex flex-col">
            <ProfileSearchBar updateResults={fetchResults}/>
            <div className="grid grid-cols-3 gap-8 px-12">
                {Profiles?.map((profile:IProfile)=>{
                    return(
                        <ProfileHeader Profile={profile}></ProfileHeader>
                    )
                })}
                
            </div>
            <Pagination totalPages={maxPages} onPageChange={setCurrentPage} currentPage={currentPage}></Pagination>
        </main>
    )
}