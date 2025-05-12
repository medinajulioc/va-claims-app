"use client";

import React from "react";
import { useFieldArray, Control } from "react-hook-form";
import { motion } from "framer-motion";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import { PlusCircle, Trash2 } from "lucide-react";

type DisabilityInputProps = {
  control: Control<any>;
};

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
      <h2 className="mb-4 text-xl font-semibold">Disabilities</h2>
      {fields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mb-4 flex items-end gap-4">
          <div className="flex-1">
            <Input
              label={`Disability ${index + 1} Percentage`}
              type="number"
              name={`disabilities.${index}.percentage`}
              control={control}
            />
          </div>
          <div className="flex-1">
            <Select
              label="Affected Area"
              name={`disabilities.${index}.area`}
              options={[
                { value: "Other", label: "Other" },
                { value: "Left Arm", label: "Left Arm" },
                { value: "Right Arm", label: "Right Arm" },
                { value: "Left Leg", label: "Left Leg" },
                { value: "Right Leg", label: "Right Leg" },
                { value: "Left Ear", label: "Left Ear" },
                { value: "Right Ear", label: "Right Ear" },
                { value: "Left Eye", label: "Left Eye" },
                { value: "Right Eye", label: "Right Eye" }
              ]}
              control={control}
              defaultValue="Other"
            />
          </div>
          <Button
            onClick={() => remove(index)}
            className="bg-destructive hover:bg-destructive/90 mb-4">
            <Trash2 className="mr-2 size-4" />
            Remove
          </Button>
        </motion.div>
      ))}
      <Button onClick={() => append({ percentage: 0, area: "Other" })} className="mt-2">
        <PlusCircle className="mr-2 size-4" />
        Add Disability
      </Button>
    </motion.div>
  );
};

export default DisabilityInput;
