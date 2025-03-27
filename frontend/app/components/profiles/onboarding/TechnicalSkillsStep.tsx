"use client"

import { useState } from "react"
import { ProfileData } from "./OnboardingForm"
import { X } from "lucide-react"
import { constants } from "@/app/helpers/constants"


interface TechnicalSkillsStepProps {
  data: ProfileData
  updateData: (data: Partial<ProfileData>) => void
}

export function TechnicalSkillsStep({ data, updateData }: TechnicalSkillsStepProps) {
  const [languageInput, setLanguageInput] = useState("")
  const [frameworkInput, setFrameworkInput] = useState("")

  const addLanguage = (language: any=null) => {
    if(language)
        updateData({
            programmingLanguages: [...data.programmingLanguages,language],
        })
    if (languageInput.trim() && !data.programmingLanguages.includes(languageInput.trim())) {
      updateData({
        programmingLanguages: [...data.programmingLanguages, languageInput.trim()],
      })
      setLanguageInput("")
    }
  }

  const removeLanguage = (language: string) => {
    updateData({
      programmingLanguages: data.programmingLanguages.filter((l) => l !== language),
    })
  }

  const addFramework = (framework:any=null) => {
    if(framework)
        updateData({
            frameworks: [...data.frameworks, framework],
        })
    if (frameworkInput.trim() && !data.frameworks.includes(frameworkInput.trim())) {
      updateData({
        frameworks: [...data.frameworks, frameworkInput.trim()],
      })
      setFrameworkInput("")
    }
  }

  const removeFramework = (framework: string) => {
    updateData({
      frameworks: data.frameworks.filter((f) => f !== framework),
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Technical Skills</h2>
          <p className="text-gray-500 mb-6">Tell us about your technical expertise.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <label htmlFor="programmingLanguages" className="block text-sm font-medium text-gray-700">
              Programming Languages
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.programmingLanguages.map((language) => (
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
                    <X/>
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
            <p className="text-sm text-gray-500">Press Enter or click Add to add a language</p>
            <div className="flex flex-wrap gap-2">
                {constants.languages.map((language) => (
                <span
                    key={language}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-300 cursor-pointer hover:bg-gray-100"
                    onClick={()=>addLanguage(language)}
                >
                    {language}
                </span>
                ))}
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="frameworks" className="block text-sm font-medium text-gray-700">
              Frameworks & Libraries
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.frameworks.map((framework) => (
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
            <div className="mt-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}

