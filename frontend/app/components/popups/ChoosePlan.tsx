"use client"

import { createCheckoutSession, getBillingPortal } from "@/app/services/subscriptions";
import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaCheckCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";




export default function ChoosePlan({onSetShow}:{onSetShow:Function}){

    const subscribe = async(annualPlan:boolean)=>{
        try{
            const data = await createCheckoutSession(annualPlan)
            window.location.href = data.url
        }catch(error){
            console.log(error)
        }
    }
    

    return createPortal(
        <div className="fixed bg-black top-0 bg-opacity-10 justify-center items-center flex w-screen h-screen">
            <div className="flex flex-col gap-4 p-8 border-2 shadow-xl bg-white rounded-xl relative ">
                <FaXmark onClick={()=>onSetShow(false)} size={20} className=" hover:cursor-pointer absolute top-2 right-2"></FaXmark>
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-3xl">Choose Plan</h1>
                    <p className="text-md text-slate-500">Switch to annual pricing to save 30% off</p>

                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 border-2 p-4 rounded-md">
                        <h1 className="text-md">Premium</h1>
                        <h1 className="text-xl font-semibold">$5.99 per month</h1>
                        
                        <div className="flex flex-col gap-1 text-sm">
                            <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle> No video session limits</h1>
                            <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle> Unlimited direct messaging</h1>
                        </div>
                        <button onClick={()=>subscribe(false)} className="hover:opacity-70 duration-300 text-white bg-secondary p-2 rounded-xl">Subscribe</button>
                    </div>
                    <div className="flex flex-col gap-3 border-2 p-4 rounded-md">
                        <h1 className="text-md">Premium Yearly</h1>
                        <h1 className="text-xl font-semibold">$50.40 per year</h1>
                        <p className=" text-secondary border-2 bg-slate-100 font-semibold px-3 w-fit text-xs rounded-xl">Save 30%</p>
                        
                        <div className="flex flex-col gap-1 text-sm">
                            <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle> No video session limits</h1>
                            <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle> Unlimited direct messaging</h1>
                        </div>
                        <button onClick={()=>subscribe(true)} className="hover:opacity-70 duration-300 text-white bg-secondary p-2 rounded-xl">Subscribe</button>
                    </div>
                </div>
            </div>
            
        </div>
        , document.querySelector(".max-top") as HTMLElement
    )
}