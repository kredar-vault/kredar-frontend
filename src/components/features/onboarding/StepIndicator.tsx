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
    <div className="flex items-start justify-between w-full">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-start flex-1">
            {/* Step + label */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              {/* Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                  isCompleted || isActive
                    ? 'bg-[#0f8b4b] text-white'
                    : 'bg-transparent text-[#45504b]',
                )}
              >
                {step.id}
              </div>
              {/* Label */}
              <span
                className={cn(
                  'text-xs text-center leading-tight whitespace-nowrap',
                  isActive ? 'text-[#081b10] font-medium' : 'text-[#45504b]',
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last step) */}
            {!isLast && (
              <div className="flex-1 mx-2 mt-4">
                <div
                  className={cn(
                    'h-px w-full transition-colors',
                    isCompleted ? 'bg-[#0f8b4b]' : 'bg-[#d8e1da]',
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
