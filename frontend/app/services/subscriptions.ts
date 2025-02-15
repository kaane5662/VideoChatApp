import axios from "axios"

export async function createCheckoutSession(annualPlan:boolean) {
    try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription`,{annualPlan},{withCredentials:true})
        const data =  await res.data
        return data
    }catch(error:any){
        throw new Error(error.message)
    }
}
export async function getBillingPortal() {
    try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription`,{withCredentials:true})
        const data =  await res.data
        return data
    }catch(error:any){
        throw new Error(error.message)
    }
}