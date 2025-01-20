import axios, { Axios, AxiosError } from "axios";  
import { redirect } from "next/navigation"

export async function login(FormData:FormData){
    try{
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,FormData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },withCredentials:true
        })
        console.log(res)
        return res.status
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
export async function signUp(FormData:FormData){
    try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,FormData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },withCredentials:true
        })
        return res.status
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
export async function signOut(cookie:string){
    // "use server"
    console.log("Logging out")
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,{credentials:"include",method:"DELETE"})
        // redirect("/login")
    }catch(error){
        console.log(error)
    }  
}

export async function googleOAuth(){ 
    window.location.href = `http://localhost:3000/api/user/auth/go`       
}