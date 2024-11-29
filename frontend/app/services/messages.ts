import axios from "axios"
export async function getDirectMessages(cookie:string) {
    try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages`,{ headers: { Cookie: cookie }})
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