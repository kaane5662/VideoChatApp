"use client"

import { constants } from "@/app/helpers/constants"
import PaddedList from "@/app/helpers/PaddedList"

import { Check, X } from "lucide-react"
import { useState } from "react"
import { OnboardingData } from "./OnboardingForm"

interface StepProps {
  formData: OnboardingData
  updateFormData: (field: keyof OnboardingData, value: any) => void
}

export default function FrameworksStep({ formData, updateFormData }: StepProps) {
  

  const [frameworkInput,setFrameworkInput] = useState('')
  const addFramework = (framework:any=null) => {
    if(framework)
      updateFormData("frameworks",
        [...formData.frameworks, framework]
      )
    if (frameworkInput.trim() && !formData.frameworks.includes(frameworkInput.trim())) {
      updateFormData("frameworks",
        [...formData.frameworks, frameworkInput],
      )
    }
    setFrameworkInput("")
  }
  const addSkill = (skill:any=null) => {
    if(skill)
      updateFormData("skills",
        [...formData.skills, skill]
      )
    if (frameworkInput.trim() && !formData.skills.includes(frameworkInput.trim())) {
      updateFormData("skills",
        [...formData.skills, frameworkInput],
      )
    }
    setFrameworkInput("")
  }

  const removeSkill = (skill: string) => {
    updateFormData('skills',
      formData.skills.filter((f) => f !== skill),
    )
  }
  const removeFramework = (framework: string) => {
    updateFormData('frameworks',
      formData.frameworks.filter((f) => f !== framework),
    )
  }
  return (
    <div className="gap-4 flex flex-col">
        <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold ">Technical Section</h2>
            <p className="text-slate-500">Select all the frameworks your AI cofounder should be familiar with.</p>
            

        </div>
        <div className="flex flex-wrap gap-4 ">
              {formData.frameworks.map((framework) => (
                <span
                  key={framework}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {framework}
                  <button
                    type="button"
                    onClick={() => removeFramework(framework)}
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-600"
                  >
                    <X/>
                    <span className="sr-only">Remove {framework}</span>
                  </button>
                </span>
              ))}
            </div>
          
        <div className="flex gap-2">
              <input
                id="frameworks"
                type="text"
                value={frameworkInput}
                onChange={(e) => setFrameworkInput(e.target.value)}
                placeholder="e.g. React, Django, .NET"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addFramework()
                  }
                }}
              />
              <button
                type="button"
                onClick={addFramework}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
              >
                Add
              </button> 
            </div>
            <p className="text-sm text-gray-500">Press Enter or click Add to add a framework</p>
            <div className="">
            <p className="text-sm font-medium mb-2">Common frameworks:</p>
            <div className="flex flex-wrap gap-2">
                {constants.frameworks.map((framework) => (
                <span
                    key={framework}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-300 cursor-pointer hover:bg-gray-100"
                    onClick={()=>addFramework(framework)}
                >
                    {framework}
                </span>
                ))}
            </div>
            </div>
        <p className="text-slate-500">Select extra skills you want your AI cofounder to have</p>
        <div className="flex flex-wrap gap-2 ">
              {formData.skills.map((framework) => (
                <span
                  key={framework}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {framework}
                  <button
                    type="button"
                    onClick={() => removeSkill(framework)}
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-600"
                  >
                    <X/>
                    <span className="sr-only">Remove {framework}</span>
                  </button>
                </span>
              ))}
            </div>
        
        <div className="flex gap-2">
              <input
                id="frameworks"
                type="text"
                value={frameworkInput}
                onChange={(e) => setFrameworkInput(e.target.value)}
                placeholder="e.g. React, Django, .NET"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addFramework()
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill }
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
              >
                Add
              </button> 
            </div>
            <p className="text-sm text-gray-500">Press Enter or click Add to add a common skill</p>
            <div className="">
            <p className="text-sm font-medium mb-2">Common frameworks:</p>
            <div className="flex flex-wrap gap-2">
                {constants.commonSkills.map((commonSkill) => (
                <span
                    key={commonSkill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-300 cursor-pointer hover:bg-gray-100"
                    onClick={()=>addSkill(commonSkill)}
                >
                    {commonSkill}
                </span>
                ))}
            </div>
            </div>

      
    </div>
  )
}

