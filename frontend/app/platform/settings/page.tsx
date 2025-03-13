"use client"
import ChoosePlan from "@/app/components/popups/ChoosePlan";
import Loading from "@/app/components/ui/loading";
import { IUser } from "@/app/interfaces";
import { getBillingPortal } from "@/app/services/subscriptions";
import { fetcher } from "@/app/utils/fetcher";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

export default function Settings(){
    const [planPopup,setPlanPopup] = useState(false)
    const {data,isLoading,error} = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, fetcher)
    const searchParams= useSearchParams()
    const [mounted,setMounted] = useState(false)
    useEffect(()=>{
        setMounted(true)
    },[])
    useEffect(()=>{
        if(!mounted) return
        if( searchParams.get("displayPlans") == "yes"){
            setPlanPopup(true)
        }
        if(searchParams.get("success")){
            searchParams.get("success") == "yes" ? 
            toast.success("Subscription purchased successfully. Please wait at least 5 minutes to update"): toast.error("Canceled checkout process")
        }
    },[mounted])
   
    if(isLoading) 
        return <Loading/>
    console.log(data)

    const User:IUser = data

    

    function getPlan(){
        if(User.annualPlan) return "Yearly"
        if(User.subscribed) return "Regular"
        return "Free"
    }
    const billingPortal = async()=>{
        try{
            const data = await getBillingPortal()
            console.log(data)
            window.location.href = data.url
        }catch(error){
            console.log(error)
        }
    }
    return(
        <main>
            {planPopup && <ChoosePlan onSetShow={setPlanPopup} />}
            <div className="flex flex-col gap-4 p-12 w-full">
                <div className="gap-8 flex flex-col">
                <h1 className="font-bold text-3xl border-b-2 pb-2">Settings</h1>    
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">Email</label>
                        <p className=" p-1 rounded-md pb-2  w-96 text-slate-500 text-sm">{User.email}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">User Id</label>
                        <p className=" p-1 rounded-md pb-2  w-96 text-slate-500 text-sm">{User.id}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">Customer Id</label>
                        <p className=" p-1 rounded-md pb-2  w-96 text-slate-500 text-sm">{User.stripeCustomerId || "None"}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">Current Plan</label>
                        <p className=" p-1 rounded-md pb-2 text-secondary w-96 text-sm">{getPlan()}</p>
                        {User.subscribed? (
                            <button onClick={billingPortal} className="bg-secondary text-white w-fit hover:opacity-70 p-2 px-4 rounded-md shadow-xl">Manage</button>
                        ):(
                            <button onClick={()=>setPlanPopup(true)} className="bg-secondary text-white w-fit hover:opacity-70 p-2 px-4 rounded-md shadow-xl text-sm">Choose Plan</button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}