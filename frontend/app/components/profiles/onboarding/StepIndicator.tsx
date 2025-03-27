interface StepIndicatorProps {
    currentStep: number
    totalSteps: number
  }
  
  export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${
                  currentStep > index + 1
                    ? "bg-secondary text-white"
                    : currentStep === index + 1
                      ? "bg-secondary text-white ring-4 ring-secondary/20"
                      : "bg-gray-200 text-gray-600"
                }`}
            >
              {index + 1}
            </div>
  
            {index < totalSteps - 1 && (
              <div
                className={`h-1 w-full min-w-[2rem] sm:min-w-[4rem] mx-1
                  ${currentStep > index + 1 ? "bg-secondary" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>
    )
  }
  
  