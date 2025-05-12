"use client";

import React from "react";
import { Control } from "react-hook-form";
import { motion } from "framer-motion";
import Select from "./Select";

type SMCInputProps = {
  control: Control<any>;
};

const SMCInput: React.FC<SMCInputProps> = ({ control }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="mb-6">
    <h2 className="mb-4 text-xl font-semibold">Special Monthly Compensation</h2>
    <Select
      label="SMC Level"
      name="smcLevel"
      options={[
        { value: "none", label: "None" },
        { value: "K", label: "SMC-K: Loss of use (+$136.06)" },
        { value: "L", label: "SMC-L: Aid and attendance ($4,767.34)" },
        { value: "M", label: "SMC-M: Higher aid level ($5,264.58)" },
        { value: "N", label: "SMC-N: Severe disability ($5,768.77)" },
        { value: "O", label: "SMC-O: Maximum aid ($6,466.32)" },
        { value: "R1", label: "SMC-R1: Aid and attendance ($9,292.77)" },
        { value: "R2", label: "SMC-R2: Personal health care ($10,540.79)" }
      ]}
      control={control}
      defaultValue="none"
    />
  </motion.div>
);

export default SMCInput;
