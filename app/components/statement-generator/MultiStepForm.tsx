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

export function MultiStepForm() {
  const [formType, setFormType] = useState<"21-0781" | "21-10210" | "21-4138">("21-10210");
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    resolver: zodResolver(schemas[formType]),
    defaultValues: {},
    mode: "onChange"
  });

  const steps = stepsConfig[formType];

  const nextStep = async () => {
    const fields = stepFields[formType][currentStep];
    const isValid = await methods.trigger(fields);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
    methods.reset();
    setGeneratedText("");
    setCurrentStep(0);
    setFormType(value as "21-0781" | "21-10210" | "21-4138");
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-2xl">
        <Select onValueChange={handleFormTypeChange} defaultValue={formType}>
          <SelectTrigger className="mb-6">
            <SelectValue placeholder="Select VA Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="21-0781">VA Form 21-0781 (PTSD Statement)</SelectItem>
            <SelectItem value="21-10210">VA Form 21-10210 (Lay/Witness Statement)</SelectItem>
            <SelectItem value="21-4138">VA Form 21-4138 (General Statement)</SelectItem>
          </SelectContent>
        </Select>

        <div className="mb-6 flex flex-col justify-between sm:flex-row">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 p-2 text-center ${
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              } m-1 text-sm sm:rounded-md sm:text-base`}>
              {step}
            </div>
          ))}
        </div>

        <form onSubmit={methods.handleSubmit(onSubmit)}>
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

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0 || isLoading}
              variant="outline">
              Previous
            </Button>

            <MockDataLoader formType={formType} />

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Statement"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
