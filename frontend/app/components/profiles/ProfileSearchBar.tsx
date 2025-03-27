"use client"
import CheckboxDropdown from "@/app/helpers/CheckboxDropdown";
import { constants } from "@/app/helpers/constants";

export default function ProfileSearchBar({updateResults}:{updateResults:Function}){
    
    return(
        
            <div className="grid grid-cols-5 gap-2 pt-4">
                <div className="flex flex-col gap-2 col-span-2  ">
                    
                    {/* <label className="text-sm text-black text-opacity-60 ">Industry </label> */}
                    <CheckboxDropdown onSelectionChange={updateResults} title="Industry" options={constants.industries}></CheckboxDropdown>
                </div>
                <div className="flex flex-col gap-2 ">
                    
                    {/* <label className="text-sm text-black text-opacity-60 ">Avaliablilty </label> */}
                    <CheckboxDropdown onSelectionChange={updateResults} title="Avaliability" options={constants.availability}></CheckboxDropdown>
                </div>
                <div className="flex flex-col gap-2 ">
                    
                    {/* <label className="text-sm text-black text-opacity-60 ">Industry </label> */}
                    <CheckboxDropdown onSelectionChange={updateResults} title="Interests" options={constants.interests}></CheckboxDropdown>
                </div>
                
                <div className="flex flex-col gap-2 ">
                    
                    {/* <label className="text-sm text-black text-opacity-60 ">Industry </label> */}
                    <CheckboxDropdown onSelectionChange={updateResults} title="Languages" options={constants.languages}></CheckboxDropdown>
                </div>
                <div className="flex flex-col gap-2 ">
                    
                    {/* <label className="text-sm text-black text-opacity-60 ">Industry </label> */}
                    <CheckboxDropdown onSelectionChange={updateResults} title="CurrentRole" options={constants.roles}></CheckboxDropdown>
                </div>
            </div>
        
    )

}