
import { constants } from "@/app/helpers/constants"

import { Check, LoaderCircle, Save, X } from "lucide-react"
import Loading from "../ui/loading"
import OnboardingForm, { OnboardingData } from "./OnboardingForm"
import { useState } from "react"
import { toast } from "react-toastify"
import { updateLookingForData } from "@/app/services/lookingFor"
import { FaSave } from "react-icons/fa"
import PaddedList from "@/app/helpers/PaddedList"
import CheckboxDropdown from "@/app/helpers/CheckboxDropdown"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StepProps {
  formDataInitial: OnboardingData 
 
}

export default function LookingForForm({ formDataInitial}: StepProps) {
  const [formData,setFormData] = useState<OnboardingData>(formDataInitial)
  const [frameworkInput,setFrameworkInput] = useState('')
  const [skillsInput,setSkillsInput] = useState('')
  const [saving, setSaving] = useState(false)
  const updateFormData = (field: keyof OnboardingData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
  }
  
  

  const updatePreferences = async() => {
    setSaving(true)
    try{
      console.log(formData)
      const res = await updateLookingForData(formData)
      toast.success("Preferences updated successfully")
      // location.href = "/platform/profile"
    }catch(error:any){
      toast.error(error.message)
    }finally{setSaving(false)}

  }

  
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
    if(!formData.skills) return updateFormData("skills",[skill])
    if(skill)
      updateFormData("skills",
        [...formData.skills, skill]
      )
    if (skillsInput.trim() && !formData.skills.includes(skillsInput.trim())) {
      updateFormData("skills",
        [...formData.skills, skillsInput],
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
    <div className="flex flex-col gap-8 bg-white rounded-xl shadow-lg w-[800px] self-center">
        <div className="flex flex-col gap-2 rounded-t-xl bg-secondary p-8">
            <h2 className="text-2xl font-semibold text-white ">Update Preferences</h2>
            <p className="text-slate-200 ">What do you look for in your technical match.</p>
        </div>

      <div className="space-y-6 p-8">
        <div className="space-y-2 bg-slate-50 p-4">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <Select value={formData.experience} onValueChange={(value) => updateFormData("experience",value)}>
              <SelectTrigger id="experience" className="w-full bg-white">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent className="bg-white" >
                {constants.experience.map((level) => (
                  <SelectItem className="bg-white hover:bg-secondary/10 hover:cursor-pointer" key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        <div className="bg-slate-50   p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Description</h3>
          <textarea placeholder="Looking for a Machine learning engineering with regression experience" onChange={(e)=>updateFormData("description", e.target.value)}  className=" h-36 border-2 w-full p-1 text-sm rounded-md" value={formData.description}>

          </textarea>
          
        </div>

        <div className="space-y-2 bg-slate-50 p-4">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Desired Role
            </label>
            <Select value={formData.role} onValueChange={(value) => updateFormData("experience",value)}>
              <SelectTrigger id="experience" className="w-full bg-white">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent className="bg-white" >
                {constants.roles.map((role) => (
                  <SelectItem className="bg-white hover:bg-secondary/10 hover:cursor-pointer" key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {formData?.skills?.map((framework) => (
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
                onChange={(e) => setSkillsInput(e.target.value)}
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

        <div className="space-y-2 bg-slate-50 p-4">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Desired Availability
            </label>
            <Select value={formData.availability} onValueChange={(value) => updateFormData("availability",value)}>
              <SelectTrigger id="experience" className="w-full bg-white">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent className="bg-white" >
                {constants.availability.map((avail) => (
                  <SelectItem className="bg-white hover:bg-secondary/10 hover:cursor-pointer" key={avail} value={avail}>
                    {avail}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        
      </div>
      <button className="flex gap-2 items-center bg-secondary hover:opacity-50 text-white p-3 rounded-md w-full justify-center" onClick={updatePreferences}> 
      {!saving ? (
            <div className="flex items-center gap-2">

              <Save className="h-5 w-5" />
              Save Preferences
            </div>

          ):(

              <LoaderCircle className="h-5 w-5 animate-spin" />

          )}
      </button>

    </div>
  )
}

