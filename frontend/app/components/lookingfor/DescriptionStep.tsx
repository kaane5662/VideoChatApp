"use client"

import { constants } from "@/app/helpers/constants"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OnboardingData } from "./OnboardingForm"

interface StepProps {
  formData: OnboardingData
  updateFormData: (field: keyof OnboardingData, value: any) => void
}

export default function DescriptionStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
        <div className="flex gap-2 flex-col">
            <h2 className="text-3xl font-semibold text-slate-900">Describe what you're looking for</h2>
            <p className="text-slate-500">Tell us about your project and what you need in an cofounder.</p>
        </div>

      <div className="space-y-2">
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="I'm looking for an AI cofounder who can help me with..."
          className="w-full h-40 p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent resize-none"
          required
        />
        <div className="text-right text-sm text-slate-500">
          {formData.description.length} characters
          {formData.description.length === 0 && <span className="text-red-500"> (required)</span>}
        </div>
      </div>
      <div className="space-y-2">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Prefered Experience Level
            </label>
            <Select value={formData.experience} onValueChange={(value) => updateFormData("experience",value)}>
              <SelectTrigger id="experience" className="w-full">
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
    </div>
  )
}

