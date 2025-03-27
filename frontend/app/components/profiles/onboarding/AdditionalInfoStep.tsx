"use client"

import { useState } from "react"
import { ProfileData } from "./OnboardingForm"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { constants } from "@/app/helpers/constants"
import { X } from "lucide-react"


interface AdditionalInfoStepProps {
  data: ProfileData
  updateData: (data: Partial<ProfileData>) => void
}

export function AdditionalInfoStep({ data, updateData }: AdditionalInfoStepProps) {
    const [interestInput, setInterestInput] = useState("")
    const [skillInput, setSkillInput] = useState("")
  
    
  
    const addInterest = () => {
      if (interestInput.trim() && !data.developmentInterests.includes(interestInput.trim())) {
        updateData({
          developmentInterests: [...data.developmentInterests, interestInput.trim()],
        })
        setInterestInput("")
      }
    }
  
    const removeInterest = (interest: string) => {
      updateData({
        developmentInterests: data.developmentInterests.filter((i) => i !== interest),
      })
    }
  
    const addSkill = (skill: string = skillInput.trim()) => {
      if (skill && !data.skills.includes(skill)) {
        updateData({
          skills: [...data.skills, skill],
        })
        setSkillInput("")
      }
    }
  
    const removeSkill = (skill: string) => {
      updateData({
        skills: data.skills.filter((s) => s !== skill),
      })
    }
  
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            <p className="text-gray-500 mb-6">Tell us more about your interests and additional skills.</p>
          </div>
  
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <Select value={data.industry} onValueChange={(value) => updateData({ industry: value })}>
                <SelectTrigger id="industry" className="w-full">
                  <SelectValue placeholder="Select your preferred industry" />
                </SelectTrigger>
                <SelectContent className="bg-white" >
                  {constants.industries.map((industry) => (
                    <SelectItem className="hover:bg-secondary/10 hover:cursor-pointer bg-white" key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
  
            <div className="space-y-4">
              <label htmlFor="developmentInterests" className="block text-sm font-medium text-gray-700">
                Development Interests
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {data.developmentInterests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {interest}</span>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  id="developmentInterests"
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="e.g. Web3, Mobile Apps, AI/ML"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addInterest()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
  
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Additional Skills</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {data.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {skill}</span>
                    </button>
                  </span>
                ))}
              </div>
  
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a custom skill"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addSkill()}
                  className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Add
                </button>
              </div>
  
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Common skills:</p>
                <div className="flex flex-wrap gap-2">
                  {constants.commonSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-300 cursor-pointer hover:bg-gray-100"
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

