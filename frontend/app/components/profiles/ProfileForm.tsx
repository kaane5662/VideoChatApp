"use client"
import PaddedList from "@/app/helpers/PaddedList";
import { IProfile } from "@/app/interfaces";
import { createProfile, getSimilarProfiles, updateProfile } from "@/app/services/profiles";
import { constants } from "@/app/helpers/constants";
import { useEffect, useState } from "react";
import CheckboxDropdown from "@/app/helpers/CheckboxDropdown";
import { ImSpinner2 } from "react-icons/im";

export default function ProfileForm({ProfileData}:{ProfileData:IProfile}){
    const [Profile,setProfile] = useState<IProfile>(ProfileData )
    const [changes,setChanges] = useState(false)
    const [saving, setSaving] = useState(false)
    const changeDropdownField = (options:string[], field:keyof IProfile) =>{
        let newProfile = {
            ...Profile,
            [field]: options
        }
        setProfile(newProfile)

        console.log(Profile)
    }
    const generateProfile = async ()=>{
        setSaving(true)
        try{
            const res = await createProfile(Profile)
        }catch(error){
            console.log(error)
        }
        setSaving(false)
    }
    const updateProfileData = async ()=>{
        setSaving(true)
        try{
            const res = await updateProfile(Profile)
            setChanges(false)
        }catch(error){
            console.log(error)
        }
        setSaving(false)
    }

    useEffect(()=>{
        console.log(Profile)
        if(Profile == ProfileData){
            setChanges(false)
        }else{
            setChanges(true)
        }
    },[Profile])

    return(
        <div className="grid grid-cols-2 gap-4 w-[80%] relative">
            { changes &&(<div className="absolute w-100% -top-10 w-full flex justify-center ">
                <div className=" fixed p-4 items-center flex gap-24 flex justify-center bg-secondary rounded-md bg-opacity-10 w-fit">
                    <h1>You have unsaved changes</h1>
                    {!saving ?(
                        <button onClick={()=> ProfileData ? updateProfileData() : generateProfile()} className="bg-secondary text-white p-2 rounded-md px-8 text-md shadow-2xl">{ProfileData? "Save":"Create"}</button>    
                    ):(
                        <div className="p-2 px-8 rounded-md bg-secondary bg-opacity-50">
                            <ImSpinner2 className=" animate-spin text-white "></ImSpinner2>
                        </div>
                    )}
                    

                </div>
            </div>)}

            <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-4 bg-white rounded-md p-6 border-2">
                    <div className="w-fit h-fit relative">
                        <img className="h-16 w-16    bg-secondary rounded-full">
                            
                        </img>
                        {Profile?.lastName?.length > 0 && (<h1 className="absolute top-0 bottom-0 left-0 right-0 my-auto h-fit mx-auto font-bold text-white w-fit text-xl">{Profile?.firstName[0]} {Profile?.lastName[0]}</h1>)}
                    </div>
                    <div className="flex flex-col ">
                        <h1 className="font-bold text-xl">{Profile?.firstName} {Profile?.lastName}</h1>
                        <p className="text-black text-opacity-50 text-md">{Profile?.currentRole}</p>

                    </div>
                </div>


                <div className="bg-white p-6 flex flex-col gap-4 rounded-md border-2">
                    <h1 className="text-xl font-bold">Profile</h1>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1 flex flex-col gap-2">
                            <label className="text-sm text-black text-opacity-60 ">First Name</label>
                            <input placeholder="Enter first name" onChange={(e)=>setProfile({...Profile,["firstName"]:e.target.value})} defaultValue={Profile?.firstName} name="firstName" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 "></input>
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                            <label className="text-sm text-black text-opacity-60 ">Last Name</label>
                            <input placeholder="Enter last name" onChange={(e)=>setProfile({...Profile,["lastName"]:e.target.value})} defaultValue={Profile?.lastName} name="lastName" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 "></input>
                        </div>
                        
                        <div className="flex flex-col gap-2 col-span-2">
                            <label className="text-sm text-black text-opacity-60 ">Industry</label>
                            <select onChange={(e)=>setProfile({...Profile,["industry"]:e.target.value})} defaultValue={Profile?.industry} name="industry" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 ">
                                {constants.industries.map((interests,index)=>{
                                    return(
                                        <option key={index} value={interests} className="p-2">{interests}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 ">
                            <label className="text-sm text-black text-opacity-60 ">Avaliability</label>
                            <select onChange={(e)=>setProfile({...Profile,["avaliability"]:e.target.value})} defaultValue={Profile?.avaliability} name="avaliabilty" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 ">
                                <option value={"Part-Time"}>Part Time</option>
                                <option value={"Full Time"}>Full Time</option>
                                <option value={"Contract"}>Contract</option>
                            </select>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-black text-opacity-60 ">Current Role</label>
                            <select onChange={(e)=>setProfile({...Profile,["currentRole"]:e.target.value})} defaultValue={Profile?.currentRole} name="interests" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 ">
                                {constants.roles.map((role,index)=>{
                                    return(
                                        <option key={index} value={role} className="p-2">{role}</option>
                                    )
                                })}
                            </select>
                        </div>  
                        
                        

                    </div>
                
                </div>

                <div className="bg-white p-6 flex flex-col gap-4 rounded-md border-2">
                    <h1 className="text-xl font-bold">Links and Socials</h1>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="col-span-1 flex flex-col gap-2">
                            <label className="text-sm text-black text-opacity-60 ">Github URL</label>
                            <input placeholder="github.com/username" onChange={(e)=>setProfile({...Profile,["githubUrl"]:e.target.value})} defaultValue={Profile?.githubUrl} name="firstName" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 "></input>
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                            <label className="text-sm text-black text-opacity-60 ">LinkedIn URL</label>
                            <input placeholder="linkedin.com/" onChange={(e)=>setProfile({...Profile,["linkedInUrl"]:e.target.value})} defaultValue={Profile?.linkedInUrl} name="lastName" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 "></input>
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                            <label className="text-sm text-black text-opacity-60 ">Twitter URL</label>
                            <input placeholder="x.com/username" onChange={(e)=>setProfile({...Profile,["twitterUrl"]:e.target.value})} defaultValue={Profile?.twitterUrl} name="lastName" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 "></input>
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                            <label className="text-sm text-black text-opacity-60 ">Portfolio URL</label>
                            <input placeholder="Enter your portfolio url" onChange={(e)=>setProfile({...Profile,["portfolioUrl"]:e.target.value})} defaultValue={Profile?.portfolioUrl} name="lastName" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 "></input>
                        </div>
                        
                       
                        
                    
                        
                        

                    </div>
                
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="col-span-2 flex flex-col gap-4 p-6 bg-white rounded-md border-2">
                    <label className="text-xl font-bold ">Bio</label>
                    <textarea placeholder="Aspiring software engineer trying to build a fintech startup" onChange={(e)=>setProfile({...Profile,["description"]:e.target.value})} defaultValue={Profile?.description} name="description" className=" border-black border-opacity-15 rounded-md p-2 text-sm border-2 h-[100px] "></textarea>
                </div>
                <div className="flex flex-col gap-4 col-span-2 bg-white p-6 rounded-md border-2">
                    <label className="text-xl font-bold ">Frameworks</label>
                    {<PaddedList items={Profile?.frameworks}></PaddedList>}
                    <CheckboxDropdown checked={ProfileData?.frameworks} options={constants.frameworks} title="Choose your Frameworks" onSelectionChange={(e:any)=>changeDropdownField(e,"frameworks")}/>
                </div>
                <div className="flex flex-col gap-4 col-span- bg-white p-6 rounded-md border-2">
                    <label className="font-bold text-xl ">Languages</label>
                    {<PaddedList items={Profile?.programmingLanguages}></PaddedList>}
                    <CheckboxDropdown checked={ProfileData?.programmingLanguages} options={constants.languages} title="Languages" onSelectionChange={(e:any)=>changeDropdownField(e,"programmingLanguages")}/>
                </div>

                <div className="flex flex-col gap-4 col-span-2 bg-white p-6 rounded-md border-2">
                    <label className="text-xl font-bold ">Interests</label>
                    {<PaddedList items={Profile?.developmentInterests}></PaddedList>}
                    <CheckboxDropdown checked={ProfileData?.developmentInterests} options={constants.interests} title="Interests" onSelectionChange={(e:any)=>changeDropdownField(e,"developmentInterests")}/>
                </div>
            </div>
        </div>
    )
}