import axios, { Axios, AxiosError } from "axios"
export async function getDirectMessages(cookie:string,threads:number=-1) {
    try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages?threads=${threads}`,{ headers: { Cookie: cookie }})
        console.log(res.data)
        
        return res.data
    }catch(error){
        console.log(error)
    }
}
export async function createDirectMessageThread(targetProfileId:number) {
    console.log("yes")
    try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages`,{targetProfileId},{withCredentials:true})
        console.log("The data",res.data);
        return res.data
    }catch(error){
        throw error
        console.log(error)
    }
}
export async function getDirectMessagesThread(id:number) {
    try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages/${id}`,{withCredentials:true})
        console.log(res.data)
        return res.data
    }catch(error){
        console.log(error)
    }
}
export async function getMessagesInThread(id:number, date:Date) {
    try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages/thread/${id}?date=${date.toISOString()}`,{withCredentials:true})
        console.log(res.data)
        return res.data
    }catch(error){
        console.log(error)
    }
}
export async function deleteMessageBubble(id:Number) {
    try{
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages/bubble/${id}`,{withCredentials:true})
        console.log(res.data)
        return res.data
    }catch(error:any){
        if(error?.response?.status == 401) throw new Error("Forbidden to delete message")
        throw new Error("Unexpected error has occured")
    }
}
export async function editMessageBubble(id:Number, text:string) {
    try{
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages/bubble/${id}`,{text},{withCredentials:true})
        console.log(res.data)
        return res.data
    }catch(error:any){
        console.log(error)
        if(error?.response?.status == 401) throw new Error("Forbidden to delete message")
        throw new Error("Unexpected error has occured")
    }
}
