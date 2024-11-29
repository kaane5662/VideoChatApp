import axios from "axios"
import { IProfile } from "../interfaces"

export async function getProfile(id:string) {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/${id}`,{cache:"no-cache"})
        const data =  await res.json()
        console.log(data)
        return data
    }catch(error){
        console.log(error)
    }
}

export async function getSimilarProfiles() {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/similar`,{withCredentials:true})
        return response.data
    }catch(error){
        console.log(error)
    }
}

export async function getSimilarProfiles2(cookie:string) {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/similar`,{ headers: { Cookie: cookie }})
        return response.data
    }catch(error){
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
    }catch(error){
        console.log(error)
    }
}

export async function searchProfiles(searchParams:string) {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/search?${searchParams}`)
        return response.data
    }catch(error){
        console.log(error)
    }
    
}

export async function createProfile(profileData:IProfile) {
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`,profileData,{withCredentials:true})
        return response.data
    }catch(error){
        console.log(error)
    }
}
export async function updateProfile(profileData:IProfile) {
    try{
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`,profileData,{withCredentials:true})
        return response.data
    }catch(error){
        console.log(error)
    }
}


