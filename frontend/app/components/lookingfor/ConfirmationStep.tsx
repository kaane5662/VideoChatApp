
// import { OnboardingData } from "@/app/platform/lookingfor/page"
import { Check } from "lucide-react"
import { OnboardingData } from "./OnboardingForm"

interface StepProps {
  formData: OnboardingData
  updateFormData: (field: keyof OnboardingData, value: any) => void
}

export default function ConfirmationStep({ formData }: StepProps) {
  

  

  return (
    <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold ">Confirm Your Information</h2>
            <p className="text-slate-500 ">Please review your information before submitting.</p>

        </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Availability</h3>
          <p className="text-slate-900">{formData.availability}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Description</h3>
          <p className="text-slate-900 whitespace-pre-line">{formData.description}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Role</h3>
          <p className="text-slate-900">{formData.role}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Frameworks</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {formData.frameworks.map((framework) => (
              <span
                key={framework}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-black"
              >
                {framework}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Extra Skills</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-black"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Industry</h3>
          <p className="text-slate-900">{formData.industry}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Experience</h3>
          <p className="text-slate-900">{formData.experience}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center text-green-600">
        <Check className="w-5 h-5 mr-2" />
        <span>All required information has been provided</span>
      </div>
    </div>
  )
}

