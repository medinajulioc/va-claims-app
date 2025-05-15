"use client";

import { motion } from "framer-motion";
import { CheckCircle2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StepProgressProps {
  steps: string[];
  currentStep: number;
  stepDescriptions: Record<string, string>;
  onStepClick: (index: number) => void;
}

export function StepProgress({
  steps,
  currentStep,
  stepDescriptions,
  onStepClick
}: StepProgressProps) {
  return (
    <TooltipProvider>
      <div className="mb-8">
        {/* Step indicators */}
        <div className="mb-1 flex justify-between">
          {steps.map((step, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled={index > currentStep}
                  onClick={() => index <= currentStep && onStepClick(index)}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    index === currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : index < currentStep
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/30 bg-muted text-muted-foreground"
                  }`}>
                  {index < currentStep ? (
                    <CheckCircle2Icon className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                  {index === currentStep && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(var(--primary), 0.2)",
                          "0 0 0 4px rgba(var(--primary), 0)",
                          "0 0 0 0 rgba(var(--primary), 0)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-center">
                {stepDescriptions[step]}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-muted relative mt-5 h-1 w-full">
          <motion.div
            className="bg-primary absolute top-0 left-0 h-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step labels */}
        <div className="mt-2 flex justify-between text-xs">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-20 text-center ${
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
              style={{ transform: "translateX(-50%)" }}>
              {step}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
