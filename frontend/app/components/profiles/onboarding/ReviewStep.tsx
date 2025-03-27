import { ProfileData } from "./OnboardingForm"


interface ReviewStepProps {
  data: ProfileData
}

export function ReviewStep({ data }: ReviewStepProps) {
  

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Review Your Profile</h2>
          <p className="text-gray-500 mb-6">Please review your information before submitting.</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {data.firstName} {data.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Role</p>
                <p className="font-medium">{data.currentRole || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience Level</p>
                <p className="font-medium">{data.experience || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timezone</p>
                <p className="font-medium">{data.timezone || "Not specified"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">GitHub</p>
                <p className="font-medium">
                  {data.githubUrl ? (
                    <a
                      href={data.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline"
                    >
                      {data.githubUrl}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Portfolio</p>
                <p className="font-medium">
                  {data.portfolioUrl ? (
                    <a
                      href={data.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline"
                    >
                      {data.portfolioUrl}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">LinkedIn</p>
                <p className="font-medium">
                  {data.linkedInUrl ? (
                    <a
                      href={data.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline"
                    >
                      {data.linkedInUrl}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Twitter</p>
                <p className="font-medium">
                  {data.twitterUrl ? (
                    <a
                      href={data.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline"
                    >
                      {data.twitterUrl}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Technical Skills</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Programming Languages</p>
                <div className="flex flex-wrap gap-2">
                  {data.programmingLanguages.length > 0 ? (
                    data.programmingLanguages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm italic">None specified</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Frameworks & Libraries</p>
                <div className="flex flex-wrap gap-2">
                  {data.frameworks && data.frameworks.length > 0 ? (
                    data.frameworks.map((framework) => (
                      <span
                        key={framework}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {framework}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm italic">None specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium">{data.industry || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className="font-medium">
                  {data?.availability}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Development Interests</p>
              <div className="flex flex-wrap gap-2">
                {data.developmentInterests && data.developmentInterests.length > 0 ? (
                  data.developmentInterests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-sm italic">None specified</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Additional Skills</p>
              <div className="flex flex-wrap gap-2">
                {data.skills && data.skills.length > 0 ? (
                  data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm italic">None specified</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium border-b pb-2">About You</h3>
            <p className="whitespace-pre-line">{data.description || "No description provided."}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

