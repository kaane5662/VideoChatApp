"use client"

import { useState } from "react"
import { BasicInfoStep } from "./BasicInfoStep"
import { TechnicalSkillsStep } from "./TechnicalSkillsStep"
import { AdditionalInfoStep } from "./AdditionalInfoStep"
import { FinalDetailsStep } from "./FinalStep"
import { ReviewStep } from "./ReviewStep"
import { StepIndicator } from "./StepIndicator"
import {motion,AnimatePresence} from "framer-motion"
import { ArrowLeft, LoaderCircle, Save, Send } from "lucide-react"
import { toast } from "react-toastify"
import { createProfile } from "@/app/services/profiles"
import { useRouter } from "next/navigation"



export type ProfileData = {
    firstName: string
    lastName: string
    programmingLanguages: string[]
    frameworks: string[]
    currentRole: string
    industry: string
    developmentInterests: string[]
    description: string
    availability: string
    experience: string
    skills: string[]
    timezone: string
    githubUrl: string
    portfolioUrl: string
    linkedInUrl: string
    twitterUrl: string
  }
  
  export const initialData: ProfileData = {
    firstName: "",
    lastName: "",
    programmingLanguages: [],
    frameworks: [],
    currentRole: "",
    industry: "",
    developmentInterests: [],
    description: "",
    availability: "",
    experience: "",
    skills: [],
    timezone: "",
    githubUrl: "",
    portfolioUrl: "",
    linkedInUrl: "",
    twitterUrl: "",
  }

export function OnboardingForm() {
  const [step, setStep] = useState(1)
  const [creating, setCreating] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>(initialData)
  const router = useRouter()
  const totalSteps = 5

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async() => {
    // Here you would typically send the data to your API
    setCreating(true)
    try{
        await createProfile(profileData as any)
        toast.success("Profile created successfully")
        router.refresh()
    }catch(error:any){
        toast.error(error.message)
    }finally{setCreating(false)}
    console.log("Submitting profile data:", profileData)
    // alert("Profile submitted successfully!")
  }

  return (
    <div className="bg-white rounded-xl w-[800px] shadow-lg overflow-hidden">
      <div className="bg-secondary p-6 text-white">
        <h1 className="text-2xl font-bold">Complete your Technical Profile</h1>
        <p className="text-white/80">Complete your profile to get matched with the perfect partner</p>
      </div>

      <div className="p-6">
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
        <AnimatePresence mode="wait">
            <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8">
            {step === 1 && <BasicInfoStep data={profileData} updateData={updateProfileData} />}

            {step === 2 && <TechnicalSkillsStep data={profileData} updateData={updateProfileData} />}

            {step === 3 && <AdditionalInfoStep data={profileData} updateData={updateProfileData} />}

            {step === 4 && <FinalDetailsStep data={profileData} updateData={updateProfileData} />}

            {step === 5 && <ReviewStep data={profileData} />}
            </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft
              />
              
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < totalSteps ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
            >
              {!creating ? (
            <div className="flex items-center gap-2">

              <Send className="h-5 w-5" />
              Save Profile
            </div>

          ):(

              <LoaderCircle className="h-5 w-5 animate-spin" />

          )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

