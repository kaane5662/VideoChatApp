"use client"
import CheckboxDropdown from "@/app/helpers/CheckboxDropdown";
import { constants } from "@/app/helpers/constants";

export default function ProfileSearchBar({updateResults}:{updateResults:Function}){
    
    return(
        <div className="  p-12 gap-2 flex flex-col rounded-md w-full  ">
            <h1 className="text-4xl font-bold">Find Your Perfect Co-Founder!</h1>
            <h2 className="text-black text-opacity-50 text-md">Search profiles tailored to your business needs.</h2>
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
        </div>
    )

}