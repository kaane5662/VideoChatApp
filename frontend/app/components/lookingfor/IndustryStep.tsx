"use client"

import { constants } from "@/app/helpers/constants"
import { OnboardingData } from "@/app/platform/lookingfor/page"
import { useState } from "react"



interface StepProps {
  formData: OnboardingData
  updateFormData: (field: keyof OnboardingData, value: any) => void
}

export default function IndustryStep({ formData, updateFormData }: StepProps) {
  const [options,setOptions] = useState<string[]>(constants.industries)
  const onSearch = (e:any)=>{
    setOptions(prev=>constants.industries.filter((option)=>option.toLowerCase().includes(e.target.value.toLowerCase())))
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold">What industry are you in?</h2>
        <p className="text-slate-500">Select the industry your startup or project operates in.</p>

      </div>
      <div className="flex flex-col gap-2">
        <input placeholder="Enter an industry" onChange={onSearch} className="rounded-md p-2 border-2 w-full"></input>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => (
          <div
            key={option}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.industry === option
                ? "border-secondary bg-slate-100"
                : "border-slate-200 hover:border-secondary hover:border-opacity-50"
            }`}
            onClick={() => updateFormData("industry", option)}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-3 ${
                  formData.industry === option ? "bg-secondary" : "border border-slate-300"
                }`}
              />
              <span className="text-slate-800">{option}</span>
            </div>
          </div>
        ))}
      </div>

      {formData.industry === "" && <div className="mt-4 text-sm text-red-500">Please select an industry</div>}
    </div>
  )
}

