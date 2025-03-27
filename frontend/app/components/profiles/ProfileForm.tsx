"use client"

import type React from "react"

import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, Globe, Linkedin, Twitter, X, Save, LoaderCircle } from "lucide-react"
import { constants } from "@/app/helpers/constants"
import { initialData, ProfileData } from "./onboarding/OnboardingForm"
import { updateProfile } from "@/app/services/profiles"
import { toast } from "react-toastify"
import { Spinnaker } from "next/font/google"
import { IProfile } from "@/app/interfaces"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
  existingProfile: IProfile
//   onSave: (data: ProfileData) => void
}

export default function ProfileForm({ existingProfile}: ProfileFormProps) {
  const router = useRouter()
  const [profileData, setProfileData] = useState<IProfile>({...initialData,...existingProfile})
  const [languageInput, setLanguageInput] = useState("")
  const [saving,setSaving] = useState(false)
  const [frameworkInput, setFrameworkInput] = useState("")
  const [interestInput, setInterestInput] = useState("")
  const [skillInput, setSkillInput] = useState("")

  const availabilityOptions = [
    { value: "full-time", label: "Full-time (40+ hours/week)" },
    { value: "part-time-20", label: "Part-time (20+ hours/week)" },
    { value: "part-time-10", label: "Part-time (10+ hours/week)" },
    { value: "weekends", label: "Weekends only" },
    { value: "flexible", label: "Flexible schedule" },
  ]

  const updateData = (data: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }))
  }

  // Tag management functions
  const addLanguage = () => {
    if (languageInput.trim() && !profileData.programmingLanguages.includes(languageInput.trim())) {
      updateData({
        programmingLanguages: [...profileData.programmingLanguages, languageInput.trim()],
      })
      setLanguageInput("")
    }
  }

  const removeLanguage = (language: string) => {
    updateData({
      programmingLanguages: profileData.programmingLanguages.filter((l) => l !== language),
    })
  }

  const addFramework = () => {
    if (frameworkInput.trim() && !profileData.frameworks.includes(frameworkInput.trim())) {
      updateData({
        frameworks: [...profileData.frameworks, frameworkInput.trim()],
      })
      setFrameworkInput("")
    }
  }

  const removeFramework = (framework: string) => {
    updateData({
      frameworks: profileData.frameworks.filter((f) => f !== framework),
    })
  }

  const addInterest = () => {
    if (interestInput.trim() && !profileData.developmentInterests.includes(interestInput.trim())) {
      updateData({
        developmentInterests: [...profileData.developmentInterests, interestInput.trim()],
      })
      setInterestInput("")
    }
  }

  const removeInterest = (interest: string) => {
    updateData({
      developmentInterests: profileData.developmentInterests.filter((i) => i !== interest),
    })
  }

  const addSkill = (skill: string = skillInput.trim()) => {
    if(profileData.skills == null){
        return updateData({skills:[skill]})
    }
    if (skill && !profileData.skills.includes(skill)) {
      updateData({
        skills: [...profileData.skills, skill],
      })
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    updateData({
      skills: profileData.skills.filter((s) => s !== skill),
    })
  }

  const handleSubmit = async(e: React.FormEvent) => {
    console.log("Form submitted")
    e.preventDefault()
    setSaving(true)
    try{
        const res = await updateProfile(profileData as any)
        toast.success("Changes saved successfully")
        router.refresh()
    }catch(error:any){
        toast.error(error.message)

    }finally{setSaving(false)}
  }
  

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl w-[800px] shadow-lg overflow-hidden">
      <div className="bg-secondary p-6 text-white">
        <h1 className="text-2xl font-bold">Technical Profile</h1>
        <p className="text-white/80">Update your profile information</p>
        <div className="flex gap-2">
          <Link className="text-xs underline hover:opacity-70" href={`/platform/profile/${profileData?.id}`}>View Live Profile</Link>
          <Link className="text-xs underline hover:opacity-70" href={`/platform/lookingfor`}>Update Preferences</Link>

        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Basic Information Section */}
        <section>
          <div className="border-b border-gray-200 pb-2 mb-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={profileData.firstName}
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
                value={profileData.lastName}
                onChange={(e) => updateData({ lastName: e.target.value })}
                placeholder="Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="currentRole" className="block text-sm font-medium text-gray-700">
                Current Role
              </label>
              <Select value={profileData.currentRole} onValueChange={(value) => updateData({ currentRole: value })}>
                <SelectTrigger id="currentRole" className="w-full">
                  <SelectValue placeholder="Select your current role" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {constants.roles.map((role) => (
                    <SelectItem className="bg-white hover:bg-secondary/10 hover:cursor-pointer" key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Experience Level
              </label>
              <Select value={profileData.experience} onValueChange={(value) => updateData({ experience: value })}>
                <SelectTrigger id="experience" className="w-full">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent className="bg-white">
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
              <Select value={profileData.timezone} onValueChange={(value) => updateData({ timezone: value })}>
                <SelectTrigger id="timezone" className="w-full">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {constants.timezones.map((timezone) => (
                    <SelectItem className="bg-white hover:bg-secondary/10 hover:cursor-pointer" key={timezone} value={timezone}>
                      {timezone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Social Profiles Section */}
        <section>
          <div className="border-b border-gray-200 pb-2 mb-6">
            <h2 className="text-xl font-semibold">Social Profiles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  value={profileData.githubUrl}
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
                  value={profileData.portfolioUrl}
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
                  value={profileData.linkedInUrl}
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
                  value={profileData.twitterUrl}
                  onChange={(e) => updateData({ twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/username"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Technical Skills Section */}
        <section>
          <div className="border-b border-gray-200 pb-2 mb-6">
            <h2 className="text-xl font-semibold">Technical Skills</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="programmingLanguages" className="block text-sm font-medium text-gray-700">
                Programming Languages
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profileData?.programmingLanguages?.map((language) => (
                  <span
                    key={language}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {language}</span>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  id="programmingLanguages"
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  placeholder="e.g. JavaScript, Python, C#"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addLanguage()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Common languages:</p>
                <div className="flex flex-wrap gap-2">
                  {constants.languages.map((language) => (
                    <span
                      key={language}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-300 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        if (!profileData.programmingLanguages.includes(language)) {
                          updateData({
                            programmingLanguages: [...profileData.programmingLanguages, language],
                          })
                        }
                      }}
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="frameworks" className="block text-sm font-medium text-gray-700">
                Frameworks & Libraries
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profileData?.frameworks?.map((framework) => (
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
                      <X className="h-3 w-3" />
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

              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Common frameworks:</p>
                <div className="flex flex-wrap gap-2">
                  {constants.frameworks.map((framework) => (
                    <span
                      key={framework}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-300 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        if (!profileData.frameworks.includes(framework)) {
                          updateData({
                            frameworks: [...profileData.frameworks, framework],
                          })
                        }
                      }}
                    >
                      {framework}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information Section */}
        <section>
          <div className="border-b border-gray-200 pb-2 mb-6">
            <h2 className="text-xl font-semibold">Additional Information</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <Select value={profileData.industry} onValueChange={(value) => updateData({ industry: value })}>
                <SelectTrigger id="industry" className="w-full">
                  <SelectValue placeholder="Select your preferred industry" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {constants.industries.map((industry) => (
                    <SelectItem className="bg-white hover:bg-secondary/10 hover:cursor-pointer" key={industry} value={industry}>
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
                {profileData.developmentInterests.map((interest) => (
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

              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Common interests:</p>
                <div className="flex flex-wrap gap-2">
                  {constants.interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-300 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        if (!profileData.developmentInterests.includes(interest)) {
                          updateData({
                            developmentInterests: [...profileData.developmentInterests, interest],
                          })
                        }
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Additional Skills</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {profileData?.skills?.map((skill) => (
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

              <div className="mt-2">
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
        </section>

        {/* Final Details Section */}
        <section>
          <div className="border-b border-gray-200 pb-2 mb-6">
            <h2 className="text-xl font-semibold">Final Details</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                About You
              </label>
              <textarea
                id="description"
                value={profileData.description}
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
                {constants.availability.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={option}
                      name="availability"
                      type="radio"
                      value={option}
                      checked={profileData.availability === option}
                      onChange={() => updateData({ availability: option })}
                      className="h-4 w-4 text-secondary active:ring-secondary focus:ring-secondary border-gray-300"
                    />
                    <label htmlFor={option} className="ml-3 block text-sm font-medium text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-6 flex justify-end">
          <button
          disabled={saving}
            type="submit"
            className="flex disabled:opacity-50 items-center gap-2 px-6 py-3 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
          >{!saving ? (
            <div className="flex items-center gap-2">

              <Save className="h-5 w-5" />
              Save Profile
            </div>

          ):(

              <LoaderCircle className="h-5 w-5 animate-spin" />

          )}
          </button>
        </div>
      </div>
    </form>
  )
}

