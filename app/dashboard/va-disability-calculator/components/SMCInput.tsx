"use client";

import React from "react";
import { Control } from "react-hook-form";
import { motion } from "framer-motion";
import Select from "./Select";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Button from "./Button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

type SMCInputProps = {
  control: Control<any>;
};

const smcOptions = [
  { value: "none", label: "None" },
  { value: "K", label: "SMC-K: Loss of use (+$136.06)" },
  { value: "L", label: "SMC-L: Aid and attendance ($4,767.34)" },
  { value: "M", label: "SMC-M: Higher aid level ($5,264.58)" },
  { value: "N", label: "SMC-N: Severe disability ($5,768.77)" },
  { value: "O", label: "SMC-O: Maximum aid ($6,466.32)" },
  { value: "R1", label: "SMC-R1: Aid and attendance ($9,292.77)" },
  { value: "R2", label: "SMC-R2: Personal health care ($10,540.79)" }
];

// Map of SMC levels to detailed descriptions for the tooltips
const smcDescriptions = {
  K: "For loss or loss of use of a creative organ, one hand, one foot, or both buttocks; or for blindness of one eye or complete loss of breast tissue.",
  L: "For conditions requiring regular aid and attendance, such as inability to dress, bathe, or feed oneself.",
  M: "For more severe conditions than SMC-L, such as requiring daily health care services.",
  N: "For very severe conditions like loss of both arms, both legs, or blindness in both eyes.",
  O: "For the most severe combinations of disabilities, often requiring 24-hour care.",
  R1: "For veterans who need regular aid and attendance plus additional care.",
  R2: "For veterans requiring a higher level of care, often with 24-hour professional nursing."
};

const SMCInput: React.FC<SMCInputProps> = ({ control }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="mb-6">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Special Monthly Compensation</h2>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="bg-primary/20 hover:bg-primary/30 h-10 w-10 rounded-full p-0"
              aria-label="SMC information">
              <HelpCircle className="text-primary size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              Special Monthly Compensation (SMC) is additional tax-free compensation for veterans
              with specific severe disabilities or combinations of disabilities.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <InfoIcon className="size-5 text-amber-500" />
      <AlertDescription className="text-amber-800">
        Only select an SMC level if you have been officially awarded Special Monthly Compensation by
        the VA.
      </AlertDescription>
    </Alert>

    <div className="space-y-6">
      <Select
        label="SMC Level"
        name="smcLevel"
        options={smcOptions.map((option) => ({
          ...option,
          label: (
            <div className="flex w-full items-center justify-between">
              <span>{option.label}</span>
              {option.value !== "none" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="hover:bg-primary/10 h-6 w-6 rounded-full bg-transparent p-0"
                        aria-label={`SMC ${option.value} information`}>
                        <InfoIcon className="text-primary size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>{smcDescriptions[option.value as keyof typeof smcDescriptions]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ) as unknown as string
        }))}
        control={control}
        defaultValue="none"
        helpText="Select your current VA-awarded SMC level"
      />

      <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <InfoIcon className="mt-1 size-5 flex-shrink-0 text-blue-500" />
          <div>
            <h4 className="mb-2 font-medium text-blue-800">What qualifies for SMC?</h4>
            <p className="mb-3 text-sm text-blue-700">
              Special Monthly Compensation is awarded for specific severe disabilities such as loss
              of limbs, blindness, need for aid and attendance, or being permanently housebound.
            </p>
            <a
              href="https://www.va.gov/disability/eligibility/special-claims/special-monthly-compensation/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm font-medium text-blue-600 hover:underline">
              Learn more about SMC eligibility and rates
            </a>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default SMCInput;
