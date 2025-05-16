"use client";

import React from "react";
import { useFieldArray, Control } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import { PlusCircle, Trash2, AlertCircle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

type DisabilityInputProps = {
  control: Control<any>;
};

const bodyAreas = [
  { value: "Other", label: "Other" },
  { value: "Left Arm", label: "Left Arm" },
  { value: "Right Arm", label: "Right Arm" },
  { value: "Left Leg", label: "Left Leg" },
  { value: "Right Leg", label: "Right Leg" },
  { value: "Left Ear", label: "Left Ear" },
  { value: "Right Ear", label: "Right Ear" },
  { value: "Left Eye", label: "Left Eye" },
  { value: "Right Eye", label: "Right Eye" },
  { value: "Back", label: "Back" },
  { value: "Neck", label: "Neck" },
  { value: "Mental Health", label: "Mental Health" },
  { value: "Respiratory", label: "Respiratory" },
  { value: "Digestive", label: "Digestive" },
  { value: "Cardiovascular", label: "Cardiovascular" }
];

const DisabilityInput: React.FC<DisabilityInputProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "disabilities"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Disabilities</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-primary/20 hover:bg-primary/30 h-10 w-10 rounded-full p-0"
                aria-label="Disability rating information">
                <HelpCircle className="text-primary size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Enter each service-connected disability with its VA-assigned percentage. The
                calculator uses the VA combined ratings table, not simple addition.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {fields.length === 0 && (
        <Alert className="mb-6">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Add at least one disability to calculate your VA compensation.
          </AlertDescription>
        </Alert>
      )}

      <AnimatePresence>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card mb-6 rounded-md border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Disability {index + 1}</h3>
              <Button
                onClick={() => remove(index)}
                className="bg-destructive hover:bg-destructive/90 h-10 w-10 rounded-full p-0"
                aria-label={`Remove disability ${index + 1}`}>
                <Trash2 className="size-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Disability Percentage"
                  type="number"
                  name={`disabilities.${index}.percentage`}
                  control={control}
                  min={0}
                  max={100}
                  step={10}
                  helpText="VA ratings are typically in increments of 10 (0, 10, 20, etc.)"
                />

                <Select
                  label="Affected Area"
                  name={`disabilities.${index}.area`}
                  options={bodyAreas}
                  control={control}
                  defaultValue="Other"
                />
              </div>

              <div>
                <Input
                  label="Description (optional)"
                  type="text"
                  name={`disabilities.${index}.description`}
                  control={control}
                  placeholder="e.g., PTSD, Tinnitus, Knee Injury"
                  helpText="Add a description to help identify this disability"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        <Button
          onClick={() => append({ percentage: 0, area: "Other", description: "" })}
          className="bg-primary hover:bg-primary/90 h-12 px-6">
          <PlusCircle className="mr-2 size-5" />
          Add Disability
        </Button>

        {fields.length > 0 && (
          <p className="text-muted-foreground text-sm">
            {fields.length} {fields.length === 1 ? "disability" : "disabilities"} added
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default DisabilityInput;
