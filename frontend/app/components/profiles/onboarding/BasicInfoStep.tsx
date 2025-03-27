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
import { Github, Globe, Linkedin, Twitter } from "lucide-react"



interface BasicInfoStepProps {
  data: ProfileData
  updateData: (data: Partial<ProfileData>) => void
}

export function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <p className="text-gray-500 mb-6">Let&apos;s start with some basic details about you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={data.firstName}
              onChange={(e) => updateData({ firstName: e.target.value })}
              placeholder="John"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
              placeholder="Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
            />
          </div>

    
          <div className="space-y-2">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Current Role
            </label>
            <Select value={data.currentRole} onValueChange={(value) => updateData({ currentRole: value })}>
              <SelectTrigger id="experience" className="w-full">
                <SelectValue placeholder="Select your current role" />
              </SelectTrigger>
              <SelectContent className=" bg-white">
                {constants.roles.map((level) => (
                  <SelectItem className="hover:bg-secondary/10 hover:cursor-pointer" key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <Select value={data.experience} onValueChange={(value) => updateData({ experience: value })}>
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


          <div className="space-y-2 md:col-span-2">
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <Select value={data.timezone} onValueChange={(value) => updateData({ timezone: value })}>
              <SelectTrigger id="timezone" className="w-full">
                <SelectValue placeholder="Select your timezone" />
              </SelectTrigger>
              <SelectContent  className=" bg-white">
                {constants.timezones.map((timezone) => (
                  <SelectItem className="hover:bg-secondary/10 hover:cursor-pointer" key={timezone} value={timezone}>
                    {timezone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium">Social Profiles</h3>
            <p className="text-sm text-gray-500">
              Add your social media profiles to help potential co-founders connect with you.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
              GitHub Profile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="githubUrl"
                type="url"
                value={data.githubUrl}
                onChange={(e) => updateData({ githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700">
              Portfolio Website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="portfolioUrl"
                type="url"
                value={data.portfolioUrl}
                onChange={(e) => updateData({ portfolioUrl: e.target.value })}
                placeholder="https://yourportfolio.com"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700">
              LinkedIn Profile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Linkedin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="linkedInUrl"
                type="url"
                value={data.linkedInUrl}
                onChange={(e) => updateData({ linkedInUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700">
              Twitter Profile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Twitter className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="twitterUrl"
                type="url"
                value={data.twitterUrl}
                onChange={(e) => updateData({ twitterUrl: e.target.value })}
                placeholder="https://twitter.com/username"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

