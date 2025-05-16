"use client";

import React from "react";
import { Control } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import Input from "./Input";
import Select from "./Select";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Button from "./Button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

type DependentsInputProps = {
  control: Control<any>;
  showSpouseAid?: boolean;
};

const DependentsInput: React.FC<DependentsInputProps> = ({ control, showSpouseAid = false }) => {
  const watchSpouse = showSpouseAid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dependents</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-primary/20 hover:bg-primary/30 h-10 w-10 rounded-full p-0"
                aria-label="Dependents information">
                <HelpCircle className="text-primary size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Veterans with disability ratings of 30% or higher receive additional compensation
                for dependents. Include all qualifying dependents for accurate payment calculations.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Select
            label="Do you have a spouse?"
            name="spouse"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            control={control}
            defaultValue="No"
            helpText="Additional compensation is provided for veterans with spouses"
          />

          <AnimatePresence>
            {watchSpouse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden">
                <FormField
                  control={control}
                  name="spouseAid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Spouse requires Aid and Attendance</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          Additional compensation if your spouse requires regular aid and attendance
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="Children Under 18"
            type="number"
            name="childrenUnder18"
            control={control}
            defaultValue={0}
            min={0}
            max={20}
            helpText="Children under 18 years of age"
          />

          <Input
            label="Children 18-23 in School"
            type="number"
            name="childrenOver18"
            control={control}
            defaultValue={0}
            min={0}
            max={20}
            helpText="Children between 18-23 years attending school"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <Select
            label="Dependent Parents"
            name="dependentParents"
            options={[
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" }
            ]}
            control={control}
            defaultValue="0"
            helpText="Parents who depend on you financially"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DependentsInput;
