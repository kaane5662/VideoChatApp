"use client"

import { useEffect, useState } from "react"

import { createLookingForProfile, getLookingForProfileData, getMyLookingForData, updateLookingForData } from "@/app/services/lookingFor"
import axios from "axios"
import { toast } from "react-toastify"
import Loading from "@/app/components/ui/loading"
import LookingForForm from "@/app/components/lookingfor/LookingForForm"
import OnboardingForm from "@/app/components/lookingfor/OnboardingForm"
import { ILookingFor } from "@/app/interfaces"
// import StepIndicator from "@/components/StepIndicator"
// import AvailabilityStep from "@/components/steps/AvailabilityStep"
// import DescriptionStep from "@/components/steps/DescriptionStep"
// import RoleStep from "@/components/steps/RoleStep"
// import FrameworksStep from "@/components/steps/FrameworksStep"
// import IndustryStep from "@/components/steps/IndustryStep"
// import ConfirmationStep from "@/components/steps/ConfirmationStep"

export type OnboardingData = {
  availability?: string
  description: string
  role: string
  frameworks: string[]
  industry: string
}

export default function LookingFor() {
  const [exists,setExists] = useState(true)
  const [loading,setLoading] = useState(true)
  const [formData, setFormData] = useState<ILookingFor>()

  
  const getPreferences = async()=>{
    setLoading(true)
    try{
      const formData = await getMyLookingForData()
      setFormData(formData)
    }catch(error:any){
      console.error(error)
      if(error.status == 404){
        return setExists(false)
      }
      toast.error("Unexpected error has occured")
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    getPreferences()
  },[])

  




  if(loading)
    return <Loading/>

  return (
    <div className=" min-h-screen flex justify-center py-12 px-32">
      {!exists ? (<OnboardingForm/>):(<LookingForForm formDataInitial={formData as any}/>)}
      
    </div>
  )
}