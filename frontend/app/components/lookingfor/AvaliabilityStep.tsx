import { constants } from "@/app/helpers/constants";
import { OnboardingData } from "@/app/platform/lookingfor/page";
import { useState } from "react";

export default function AvailabilityStep({formData,updateFormData}:{formData:OnboardingData,updateFormData:CallableFunction}){
    
    const handleAvailabilityChange = (value: string) => {
        updateFormData("availability", value)
    }
    
    return(
        <div className="flex flex-col gap-8 w-fit">
            <div className="flex flex-col gap-2">
                <h1 className="font-bold text-2xl">What's your avaliabilty?</h1>
                <p className="text-slate-500">Let us know how much time you can dedicate to working with your technical match.</p>
            </div>
            <div className="flex flex-col gap-2">
            {constants.availability.map((option) => (
            <div
                key={option}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.availability === option
                    ? "border-secondary bg-slate-100"
                    : "border-slate-200 hover:border-secondary hover:border-opacity-50"
                }`}
                onClick={() => {
                handleAvailabilityChange(option)
                }}
            >
                <div className="flex items-center">
                <div
                    className={`w-4 h-4 rounded-full mr-3 ${
                    formData.availability === option ? "bg-secondary" : "border border-slate-300"
                    }`}
                />
                <span className="text-slate-800">{option}</span>
                </div>
            </div>
            ))}
            </div>
        </div>
    )
}