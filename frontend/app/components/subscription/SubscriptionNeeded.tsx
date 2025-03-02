"use client"
import { redirect, useRouter } from "next/navigation";

export default function SubscriptionNeeded(){
    const router = useRouter()
    return(
        <div className="flex flex-col gap-4">
            <label className="text-slate-500 text-sm">This feature requires a subscription</label>
            <button onClick={()=>router.push("/platform/settings?displayPlans=yes")} className="bg-secondary rounded-xl p-2 text-white w-fit hover:opacity-50 duration-300">Upgrade Plan</button>
        </div>
    )
}