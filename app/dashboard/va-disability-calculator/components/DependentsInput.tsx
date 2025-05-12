"use client";

import React from "react";
import { Control } from "react-hook-form";
import { motion } from "framer-motion";
import Input from "./Input";
import Select from "./Select";

type DependentsInputProps = {
  control: Control<any>;
};

const DependentsInput: React.FC<DependentsInputProps> = ({ control }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mb-6">
    <h2 className="mb-4 text-xl font-semibold">Dependents</h2>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Select
        label="Spouse"
        name="spouse"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" }
        ]}
        control={control}
        defaultValue="No"
      />
      <Input
        label="Children Under 18"
        type="number"
        name="childrenUnder18"
        control={control}
        defaultValue={0}
      />
      <Input
        label="Children Over 18 in School"
        type="number"
        name="childrenOver18"
        control={control}
        defaultValue={0}
      />
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
      />
    </div>
  </motion.div>
);

export default DependentsInput;
