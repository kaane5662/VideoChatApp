"use client"

import { constants } from "@/app/helpers/constants"
import { ProfileData } from "./OnboardingForm"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"



interface FinalDetailsStepProps {
  data: ProfileData
  updateData: (data: Partial<ProfileData>) => void
}

export function FinalDetailsStep({ data, updateData }: FinalDetailsStepProps) {
  

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Final Details</h2>
          <p className="text-gray-500 mb-6">Just a few more details to complete your profile.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              About You
            </label>
            <textarea
              id="description"
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              placeholder="Tell potential co-founders about yourself, your background, and what you&apos;re looking to build..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary min-h-[150px]"
              required
            />
            <p className="text-sm text-gray-500">
              Be specific about your goals, experience, and what you&apos;re looking for in a co-founder.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <div className="space-y-2">
            <Select value={data.availability} onValueChange={(value) => updateData({ availability: value })}>
                <SelectTrigger id="availability" className="w-full">
                  <SelectValue placeholder="Select your avaliability" />
                </SelectTrigger>
                <SelectContent className="bg-white" >
                  {constants.availability.map((avail) => (
                    <SelectItem className="hover:bg-secondary/10 hover:cursor-pointer bg-white" key={avail} value={avail}>
                      {avail}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

