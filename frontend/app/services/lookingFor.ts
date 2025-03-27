import axios from "axios"
import { OnboardingData } from "../platform/lookingfor/page"

export async function createLookingForProfile(lookingForData:OnboardingData) {
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lookingfor`,lookingForData,{withCredentials:true})
        return response.data
    }catch(error:any){
        console.log(error)
        if(error?.response?.data.errors){
            const keys = Object.values(error.response.data.errors)
            throw new Error(keys[0] as string)
        }
        if(error?.response?.data){
            throw new Error(error?.response?.data)
        }
        throw new Error("Unexpected error has occured")
    }

}
export async function getLookingForProfileData(profileId:number) {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lookingfor/${profileId}`,{withCredentials:true})
        return response.data
    }catch(error:any){
        console.log(error)
       throw error
    }
}
export async function getSimilarLookingForProfileData() {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lookingfor/similar`,{withCredentials:true})
        return response.data
    }catch(error:any){
        console.log(error)
        if(error?.response?.data.errors){
            const keys = Object.values(error.response.data.errors)
            throw new Error(keys[0] as string)
        }
        if(error?.response?.data){
            throw new Error(error?.response?.data)
        }
    }
}
export async function updateLookingForData(lookingForData:OnboardingData) {
    try{
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lookingfor`,lookingForData,{withCredentials:true})
        return response.data
    }catch(error:any){
        console.log(error)
        if(error?.response?.data.errors){
            const keys = Object.values(error.response.data.errors)
            throw new Error(keys[0] as string)
        }
        if(error?.response?.data){
            throw new Error(error?.response?.data)
        }
        throw error
    }
}
export async function searchLookingFor(lookingForData:string) {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lookingfor/search?${lookingForData}`,{withCredentials:true})
        return response.data
    }catch(error:any){
        console.log(error)
        if(error?.response?.data.errors){
            const keys = Object.values(error.response.data.errors)
            throw new Error(keys[0] as string)
        }
        if(error?.response?.data){
            throw new Error(error?.response?.data)
        }
        throw error
    }
}
export async function getMyLookingForData() {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lookingfor`,{withCredentials:true})
        return response.data
    }catch(error:any){
        throw error
    }
}