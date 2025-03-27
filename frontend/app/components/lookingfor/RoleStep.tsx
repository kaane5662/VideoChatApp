"use client"

import { constants } from "@/app/helpers/constants"
import { OnboardingData } from "@/app/platform/lookingfor/page"




interface StepProps {
  formData: OnboardingData
  updateFormData: (field: keyof OnboardingData,value: any) => void
}

export default function RoleStep({ formData, updateFormData }: StepProps) {
  

  return (
    <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold ">What technical expertise are you looking for?</h2>
            <p className="text-slate-500">Select the primary role you need your AI cofounder to fill.</p>
           

        </div>

      <div className="space-y-3">
        
        {constants.roles.map((option) => (
          <div
            key={option}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.role === option ? "border-secondary bg-slate-100" : "border-slate-100 hover:border-secondary hover:border-opacity-20"
            }`}
            onClick={() => updateFormData("role", option)}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-3 ${
                  formData.role === option ? "bg-secondary" : "border border-slate-300"
                }`}
              />
              <div>
                <div className="text-slate-800 font-medium">{option}</div>
   
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

