"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import AvailabilityStep from "@/app/components/lookingfor/AvaliabilityStep"
import DescriptionStep from "@/app/components/lookingfor/DescriptionStep"
import FrameworksStep from "@/app/components/lookingfor/FrameworksStep"
import RoleStep from "@/app/components/lookingfor/RoleStep"
import IndustryStep from "@/app/components/lookingfor/IndustryStep"
import ConfirmationStep from "@/app/components/lookingfor/ConfirmationStep"
import { createLookingForProfile, getLookingForProfileData, getMyLookingForData } from "@/app/services/lookingFor"
import axios from "axios"
import { toast } from "react-toastify"
import Loading from "@/app/components/ui/loading"
import { useRouter } from "next/navigation"
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
  skills:string[]
  frameworks: string[]
  industry: string
  experience:string
}

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const [formData, setFormData] = useState<OnboardingData>({
    availability: undefined,
    description: "",
    role: "",
    frameworks: [],
    industry: "",
    skills:[],
    experience:""
  })


  const steps = [
    { name: "Availability", component: AvailabilityStep },
    { name: "Description", component: DescriptionStep },
    { name: "Role", component: RoleStep },
    { name: "Frameworks", component: FrameworksStep },
    { name: "Industry", component: IndustryStep },  
    { name: "Confirm", component: ConfirmationStep },
  ]

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async() => {
    // Here you would typically send the data to your backend
    // console.log("Form submitted:", formData)
    // Show success message or redirect
    try{
      const res = await createLookingForProfile(formData)
      toast.success("Preferences created successfully")
      router.refresh()
      // location.href = "/platform/profile"
    }catch(error:any){
      toast.error(error.message)
    }

  }

  const CurrentStepComponent = steps[currentStep].component

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  // Check if current step is valid to enable next button
  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Description
        return formData.description.trim().length > 15
      case 2: // Role
        return formData.role.trim().length > 0
      case 3: // Frameworks
        return formData.frameworks.length > 0
      case 4: // Industry
        return formData.industry.trim().length > 0
      default:
        return true
    }
  }


  return (

      
      <div className=" bg-white shadow-lg overflow-hidden rounded-xl w-[800px]">
        {/* <StepIndicator steps={steps.map((step) => step.name)} currentStep={currentStep} /> */}

        <div className=" p-8 bg-secondary border-b">
          <h1 className="text-white text-2xl font-bold ">Find Your AI Cofounder</h1>
          <p className="text-slate-200">Tell us what you're looking for to find your perfect AI match</p>
        </div>
        <div className=" min-h-[320px] p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent formData={formData} updateFormData={updateFormData} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 p-8 flex justify-between items-center">
          <button
            onClick={prevStep}
            className={`flex items-center px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors ${
              isFirstStep ? "invisible" : ""
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              className="flex items-center px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-50 transition-colors"
            >
              Submit
              <Check className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                isStepValid()
                  ? "bg-secondary text-white hover:opacity-50"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
 
  )
}