"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { schemas, stepFields } from "@/app/lib/statement-generator/schemas";
import { VeteranInfoForm } from "./VeteranInfoForm";
import { ServiceHistoryForm } from "./ServiceHistoryForm";
import { TraumaticEventsForm } from "./TraumaticEventsForm";
import { ClaimantInfoForm } from "./ClaimantInfoForm";
import { ConditionDetailsForm } from "./ConditionDetailsForm";
import { StatementForm } from "./StatementForm";
import { ReviewForm } from "./ReviewForm";
import { MockDataLoader } from "./MockDataLoader";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { StepProgress } from "./StepProgress";
import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon } from "lucide-react";

const stepsConfig = {
  "21-0781": ["Veteran Information", "Service History", "Traumatic Events", "Review"],
  "21-10210": [
    "Veteran Information",
    "Claimant Information",
    "Service History",
    "Condition Details",
    "Review"
  ],
  "21-4138": ["Veteran Information", "Statement", "Review"]
};

const stepDescriptions = {
  "Veteran Information": "Enter the veteran's personal and contact information",
  "Service History": "Provide details about military service periods and branches",
  "Traumatic Events": "Describe PTSD-related traumatic events during service",
  "Claimant Information": "Enter information about the person filing the claim",
  "Condition Details": "Describe the medical condition and its relation to service",
  Statement: "Provide a detailed statement for your VA claim",
  Review: "Review and export your generated statement"
};

const formTypeDescriptions = {
  "21-0781":
    "VA Form 21-0781 is used for PTSD statements related to personal trauma during service.",
  "21-10210": "VA Form 21-10210 is used for lay/witness statements to support disability claims.",
  "21-4138": "VA Form 21-4138 is a general statement in support of any VA claim."
};

// Helper function to create default values for a schema
const createDefaultValues = (formType: "21-0781" | "21-10210" | "21-4138") => {
  // Extract all field names from the schema
  const schemaShape = schemas[formType].shape;

  // Create an object with empty strings for all fields
  return Object.keys(schemaShape).reduce(
    (defaults, field) => {
      defaults[field] = "";
      return defaults;
    },
    {} as Record<string, string>
  );
};

export function MultiStepForm() {
  const [formType, setFormType] = useState<"21-0781" | "21-10210" | "21-4138">("21-10210");
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for backward, 1 for forward

  const methods = useForm({
    resolver: zodResolver(schemas[formType]),
    defaultValues: createDefaultValues(formType),
    mode: "onChange"
  });

  const steps = stepsConfig[formType];

  const nextStep = async () => {
    const fields = stepFields[formType][currentStep];
    const isValid = await methods.trigger(fields);
    if (isValid && currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setDirection(-1);
      setCurrentStep(step);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll use mock data to simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      let mockGeneratedText = "";
      if (formType === "21-0781") {
        mockGeneratedText = `I, ${data.veteranName}, served in the ${data.branch} from ${data.serviceDates}. During my service, I experienced the following traumatic event(s): ${data.traumaticEvents}. These experiences have significantly impacted my mental health and daily functioning.`;
      } else if (formType === "21-10210") {
        mockGeneratedText = `I, ${data.claimantName || data.veteranName}, am providing this statement regarding ${data.claimantName ? data.veteranName : "my"} service-connected ${data.disability}. ${data.claimantName ? data.veteranName : "I"} served in the ${data.branch} from ${data.serviceDates}${data.deployments ? ` with deployments to ${data.deployments}` : ""}. This condition is related to military service in the following way: ${data.relationToService}${data.traumaticEvents ? `\n\nRelevant events include: ${data.traumaticEvents}` : ""}`;
      } else {
        mockGeneratedText = `I, ${data.veteranName}, am submitting this statement in support of my VA claim: ${data.statement}`;
      }

      setGeneratedText(mockGeneratedText);
      setDirection(1);
      setCurrentStep(steps.length - 1);
    } catch (error) {
      console.error("Error generating documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call a PDF generation service
      // For now, we'll just simulate a download
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      alert(
        "In a production environment, this would download a filled PDF form. For now, this is just a simulation."
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormTypeChange = (value: string) => {
    // Reset form when changing form type
    methods.reset(createDefaultValues(value as "21-0781" | "21-10210" | "21-4138"));
    setGeneratedText("");
    setCurrentStep(0);
    setFormType(value as "21-0781" | "21-10210" | "21-4138");
  };

  // Animation variants
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-2xl">
        <Card className="mb-6 p-4">
          <div className="mb-1 flex items-center">
            <FileTextIcon className="text-primary mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Select Form Type</span>
          </div>
          <Select onValueChange={handleFormTypeChange} defaultValue={formType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select VA Form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="21-0781">VA Form 21-0781 (PTSD Statement)</SelectItem>
              <SelectItem value="21-10210">VA Form 21-10210 (Lay/Witness Statement)</SelectItem>
              <SelectItem value="21-4138">VA Form 21-4138 (General Statement)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground mt-2 text-xs">{formTypeDescriptions[formType]}</p>
        </Card>

        <StepProgress
          steps={steps}
          currentStep={currentStep}
          stepDescriptions={stepDescriptions}
          onStepClick={goToStep}
        />

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}>
              {formType === "21-0781" && (
                <>
                  {currentStep === 0 && <VeteranInfoForm />}
                  {currentStep === 1 && <ServiceHistoryForm />}
                  {currentStep === 2 && <TraumaticEventsForm />}
                  {currentStep === 3 && (
                    <ReviewForm
                      generatedText={generatedText}
                      handleExportPDF={handleExportPDF}
                      isLoading={isLoading}
                    />
                  )}
                </>
              )}
              {formType === "21-10210" && (
                <>
                  {currentStep === 0 && <VeteranInfoForm />}
                  {currentStep === 1 && <ClaimantInfoForm />}
                  {currentStep === 2 && <ServiceHistoryForm />}
                  {currentStep === 3 && <ConditionDetailsForm />}
                  {currentStep === 4 && (
                    <ReviewForm
                      generatedText={generatedText}
                      handleExportPDF={handleExportPDF}
                      isLoading={isLoading}
                    />
                  )}
                </>
              )}
              {formType === "21-4138" && (
                <>
                  {currentStep === 0 && <VeteranInfoForm />}
                  {currentStep === 1 && <StatementForm />}
                  {currentStep === 2 && (
                    <ReviewForm
                      generatedText={generatedText}
                      handleExportPDF={handleExportPDF}
                      isLoading={isLoading}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0 || isLoading}
              variant="outline"
              className="min-w-[120px] transition-all duration-200 hover:translate-x-[-4px]">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <MockDataLoader formType={formType} />

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isLoading}
                className="min-w-[120px] transition-all duration-200 hover:translate-x-[4px]">
                Next
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[180px] transition-all duration-200 hover:scale-105">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate Statement"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
