import { cn } from '@/lib/utils';

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-between w-full max-w-2xl mx-auto px-2 py-3">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLast = index === steps.length - 1;
        const isLineActive = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-start flex-1 last:flex-none">
            {/* Step Column (Circle + Label) */}
            <div className="flex flex-col items-center w-[120px] flex-shrink-0">
              {/* Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold transition-all duration-200 border-2',
                  isCompleted
                    ? 'bg-[#0f8b4b] border-[#0f8b4b] text-white '
                    : isActive
                      ? 'bg-white border-[#0f8b4b] text-[#0f8b4b] shadow-[0_0_0_4px_rgba(15,139,75,0.15)] font-bold'
                      : 'bg-white border-[#d8e1da] text-[#45504b]',
                )}
              >
                {step.id}
              </div>
              {/* Label */}
              <span
                className={cn(
                  'text-[11px] text-center leading-snug mt-2 font-inter max-w-[110px] break-words',
                  isActive ? 'text-[#0f8b4b] font-bold' : 'text-[#45504b] font-medium',
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Segment Line (rendered after each step except the last one) */}
            {!isLast && (
              <div className="flex-1 h-[2px] mt-4 min-w-[24px]">
                <div
                  className={cn(
                    'h-full w-full rounded-md transition-colors duration-300',
                    isLineActive ? 'bg-[#0f8b4b]' : 'bg-[#e2e8f0]',
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
