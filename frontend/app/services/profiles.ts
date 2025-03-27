import axios from "axios"
import { IProfile } from "../interfaces"

export async function getProfile(id:string) {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/${id}`,{cache:"no-cache"})
        const data =  await res.json()
        console.log("El user data",data)
        return data
    }catch(error){
        console.log(error)
    }
}

export async function getSimilarProfiles(lookingFor:string) {
    
    console.log("Loonig fofr", lookingFor)
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/similar?lookingFor=${lookingFor}`,{withCredentials:true})
        return response.data
    }catch(error:any){
        throw error
        console.log(error)
    }
}

export async function getSimilarProfiles2(cookie:string,results:number=25) {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/similar?results=${results}`,{ headers: { Cookie: cookie }})
        console.log("Profiles ", response.data)
        return response.data
    }catch(error){
        return error
        console.log(error)
    }
}
export async function getSimilarProfilesToProfile(id:string,cookie:string) {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/similar/${id}?results=4`,{ headers: { Cookie: cookie }})
        console.log(response.data)
        return response.data || []
    }catch(error:any){
        throw {error:error.response.data.error}
        console.log(error)
    }
}



export async function getSimilarProfilesById(id:string){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/similar/${id}`,{cache:"force-cache"})
        return await res.json()
    }catch(error){
        console.log(error)
    }
}



export async function getMyProfile(cookie:string) {
    try{
        console.log(cookie)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`,{ headers: { Cookie: cookie }})
        return res.data
    }catch(error){
        console.log(error)
    }
}
export async function getMyProfileClient() {
    try{
        
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`,{withCredentials:true})
        return res.data
    }catch(error:any){
        throw {
            error:error.message,
            status:404
        }
    }
}

export async function searchProfiles(searchParams:string) {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/search?${searchParams}`,{withCredentials:true})
        return response.data
    }catch(error){
        throw error
        console.log(error)
    }
    
}

export async function createProfile(profileData:IProfile) {
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`,profileData,{withCredentials:true})
        return response.data
    }catch(error:any){
        console.log(error)
        if(error?.response?.data.errors){
            const keys = Object.values(error.response.data.errors)
            if(error.response.data.errors?.profileInput){
                throw new Error("Missing required input fields")
            }
            throw new Error(keys[0] as string)
        }
        if(error?.response?.data){
            throw new Error(error?.response?.data)
        }
        throw new Error("Unexpected error has occured")
    }
}
export async function updateProfile(profileData:IProfile) {
    try{
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`,profileData,{withCredentials:true})
        return response.data
    }catch(error:any){
        if(error?.response?.data.errors){
            const keys = Object.values(error.response.data.errors)
            throw new Error(keys[0] as string)
        }
        if(error?.response?.data){
            throw new Error(error?.response?.data)
        }
    }
}


