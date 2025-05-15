# VA Disability Calculator - Complete Guide for Next.js 15 with TypeScript and Tailwind CSS v4

## Introduction

This guide provides step-by-step instructions to integrate the VA Disability Calculator into your existing Next.js project using the App Router. The calculator is accessible at `/va-disability-calculator` and includes the official 2025 VA compensation rates, the “whole person theory” calculation, and a disclaimer.

## Technologies Used

- **Next.js 15**: Server-side rendering and App Router.
- **TypeScript**: Type safety and maintainability.
- **Tailwind CSS v4**: Utility-first styling.
- **Framer Motion**: Subtle animations.
- **React Hook Form**: Efficient form handling.

## Setup Instructions

### 1. Install Dependencies

Run the following command in your project’s root directory to install required dependencies:

```bash
npm install framer-motion react-hook-form
```

Tailwind CSS is configured in our project. Do not break the app ui or ux and if you need anything, follow the [Tailwind CSS Next.js guide](https://tailwindcss.com/docs/guides/nextjs).

### 2. Directory Structure

Create the following structure in your `app` directory:

- `app/va-disability-calculator/page.tsx`
- `app/va-disability-calculator/components/`
  - `Button.tsx`
  - `Input.tsx`
  - `Select.tsx`
  - `DisabilityInput.tsx`
  - `DependentsInput.tsx`
  - `SMCInput.tsx`
  - `CalculationSummary.tsx`

### 3. Add Components

Implement the components in `app/va-disability-calculator/components/` as follows:

#### Button.tsx

```tsx
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", type = "button" }) => (
  <button
    type={type}
    className={`rounded bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 ${className}`}
    onClick={onClick}>
    {children}
  </button>
);

export default Button;
```

#### Input.tsx

```tsx
import React from "react";

type InputProps = {
  label: string;
  type: string;
  name: string;
  register: any;
  errors: any;
};

const Input: React.FC<InputProps> = ({ label, type, name, register, errors }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      {...register(name)}
      className="mt-1 block w-full rounded-md border p-2 focus:ring focus:ring-blue-300"
    />
    {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>}
  </div>
);

export default Input;
```

#### Select.tsx

```tsx
import React from "react";

type SelectProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  register: any;
  errors: any;
};

const Select: React.FC<SelectProps> = ({ label, name, options, register, errors }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      {...register(name)}
      className="mt-1 block w-full rounded-md border p-2 focus:ring focus:ring-blue-300">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>}
  </div>
);

export default Select;
```

#### DisabilityInput.tsx

```tsx
import React from "react";
import { useFieldArray, UseFormRegister, FieldErrors } from "react-hook-form";
import { motion } from "framer-motion";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

type DisabilityInputProps = {
  register: UseFormRegister<any>;
  control: any;
  errors: FieldErrors;
};

const DisabilityInput: React.FC<DisabilityInputProps> = ({ register, control, errors }) => {
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
          <Input
            label={`Disability ${index + 1} Percentage`}
            type="number"
            name={`disabilities.${index}.percentage`}
            register={register}
            errors={errors}
          />
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
            register={register}
            errors={errors}
          />
          <Button onClick={() => remove(index)} className="bg-red-500 hover:bg-red-600">
            Remove
          </Button>
        </motion.div>
      ))}
      <Button onClick={() => append({ percentage: 0, area: "Other" })}>Add Disability</Button>
    </motion.div>
  );
};

export default DisabilityInput;
```

#### DependentsInput.tsx

```tsx
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { motion } from "framer-motion";
import Input from "./Input";
import Select from "./Select";

type DependentsInputProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
};

const DependentsInput: React.FC<DependentsInputProps> = ({ register, errors }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mb-6">
    <h2 className="mb-4 text-xl font-semibold">Dependents</h2>
    <Input label="Spouse (Yes/No)" type="text" name="spouse" register={register} errors={errors} />
    <Input
      label="Children Under 18"
      type="number"
      name="childrenUnder18"
      register={register}
      errors={errors}
    />
    <Input
      label="Children Over 18 in School"
      type="number"
      name="childrenOver18"
      register={register}
      errors={errors}
    />
    <Select
      label="Dependent Parents"
      name="dependentParents"
      options={[
        { value: "0", label: "0" },
        { value: "1", label: "1" },
        { value: "2", label: "2" }
      ]}
      register={register}
      errors={errors}
    />
  </motion.div>
);

export default DependentsInput;
```

#### SMCInput.tsx

```tsx
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { motion } from "framer-motion";
import Select from "./Select";

type SMCInputProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
};

const SMCInput: React.FC<SMCInputProps> = ({ register, errors }) => (
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
      register={register}
      errors={errors}
    />
  </motion.div>
);

export default SMCInput;
```

#### CalculationSummary.tsx

```tsx
import React from "react";
import { motion } from "framer-motion";

type CalculationSummaryProps = {
  combinedRating: number;
  compensation: number;
};

const CalculationSummary: React.FC<CalculationSummaryProps> = ({
  combinedRating,
  compensation
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="mt-6 rounded-lg bg-gray-100 p-4 text-center text-lg font-semibold text-gray-800">
    <p>Combined Rating: {combinedRating}%</p>
    <p>Monthly Compensation: ${compensation.toFixed(2)}</p>
  </motion.div>
);

export default CalculationSummary;
```

### 4. Implement the Main Page

Add the following code to `app/va-disability-calculator/page.tsx`:

#### page.tsx

```tsx
import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import DisabilityInput from "./components/DisabilityInput";
import DependentsInput from "./components/DependentsInput";
import SMCInput from "./components/SMCInput";
import CalculationSummary from "./components/CalculationSummary";
import Button from "./components/Button";

// Official 2025 VA Base Rates (subset for brevity)
const baseRates: { [key: number]: { [key: string]: number } } = {
  10: { alone: 171.23 },
  20: { alone: 338.49 },
  30: {
    alone: 537.42,
    with_spouse: 601.42,
    with_spouse_and_one_child: 648.42,
    with_one_child: 579.42,
    with_one_parent: 588.42,
    with_two_parents: 639.42,
    with_spouse_and_one_parent: 652.42,
    with_spouse_and_two_parents: 703.42
  },
  100: {
    alone: 3737.85,
    with_spouse: 3947.85,
    with_spouse_and_one_child: 4088.85,
    with_one_child: 3878.85
  }
  // Add rates for 40%, 50%, 60%, 70%, 80%, 90% as needed
};

// Additional Rates for 2025 (subset)
const additionalRates: { [key: number]: { [key: string]: number } } = {
  30: {
    child_under_18: 31.0,
    child_over_18: 102.0,
    spouse_aid: 58.0,
    additional_child: 31.0,
    each_parent: 51.0
  },
  100: {
    child_under_18: 97.8,
    child_over_18: 314.0,
    spouse_aid: 191.0,
    additional_child: 97.8,
    each_parent: 151.0
  }
};

// SMC Rates for 2025
const smcRates: { [key: string]: number } = {
  none: 0,
  K: 136.06,
  L: 4767.34,
  M: 5264.58,
  N: 5768.77,
  O: 6466.32,
  R1: 9292.77,
  R2: 10540.79
};

type FormData = {
  disabilities: { percentage: number; area: string }[];
  spouse: string;
  childrenUnder18: number;
  childrenOver18: number;
  dependentParents: string;
  smcLevel: string;
};

const VADisabilityCalculator = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      disabilities: [{ percentage: 0, area: "Other" }],
      spouse: "No",
      childrenUnder18: 0,
      childrenOver18: 0,
      dependentParents: "0",
      smcLevel: "none"
    }
  });
  const [result, setResult] = React.useState<{
    combinedRating: number;
    compensation: number;
  } | null>(null);

  // VA "Whole Person Theory" Formula
  const calculateCombinedRating = (percentages: number[]): number => {
    const sorted = [...percentages].sort((a, b) => b - a);
    let combined = 0;
    let remainingEfficiency = 100;
    for (const p of sorted) {
      const disabilityEffect = (p / 100) * remainingEfficiency;
      combined += disabilityEffect;
      remainingEfficiency -= disabilityEffect;
    }
    const combinedRating = Math.round(combined / 10) * 10;
    return Math.min(combinedRating, 100); // Cap at 100%
  };

  const calculateCompensation = (data: FormData, combinedRating: number): number => {
    if (combinedRating === 0) return 0;

    const rates = baseRates[combinedRating] || baseRates[30]; // Fallback to 30% if rating not found
    const addRates = additionalRates[combinedRating] || additionalRates[30];
    let baseKey = "alone";
    if (data.spouse.toLowerCase() === "yes") {
      baseKey =
        data.childrenUnder18 > 0 || data.childrenOver18 > 0
          ? "with_spouse_and_one_child"
          : "with_spouse";
    } else if (data.childrenUnder18 > 0 || data.childrenOver18 > 0) {
      baseKey = "with_one_child";
    }
    let compensation = rates[baseKey] || rates["alone"];

    // Additional dependents
    const totalChildren = data.childrenUnder18 + data.childrenOver18;
    if (totalChildren > 1) {
      compensation += (totalChildren - 1) * addRates["additional_child"];
    }
    compensation += data.childrenUnder18 * addRates["child_under_18"];
    compensation += data.childrenOver18 * addRates["child_over_18"];
    compensation += parseInt(data.dependentParents) * addRates["each_parent"];
    if (data.spouse.toLowerCase() === "yes" && combinedRating >= 30) {
      compensation += addRates["spouse_aid"];
    }

    // Add SMC if applicable
    compensation += smcRates[data.smcLevel];

    return compensation;
  };

  const onSubmit = (data: FormData) => {
    const percentages = data.disabilities.map((d) => Math.min(d.percentage, 100));
    const combinedRating = calculateCombinedRating(percentages);
    const compensation = calculateCompensation(data, combinedRating);
    setResult({ combinedRating, compensation });
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <header className="mb-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800">
          VA Disability Calculator (2025 Rates)
        </motion.h1>
      </header>
      <main className="rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DisabilityInput register={register} control={control} errors={errors} />
          <DependentsInput register={register} errors={errors} />
          <SMCInput register={register} errors={errors} />
          <Button type="submit" className="mt-4 w-full">
            Calculate
          </Button>
        </form>
        {result && (
          <CalculationSummary
            combinedRating={result.combinedRating}
            compensation={result.compensation}
          />
        )}
      </main>
      <footer className="mt-6 text-center text-sm text-gray-500">
        <p>
          Reminder: These are estimations, and you should always verify with the VA for exact
          figures, especially in complex scenarios.
        </p>
      </footer>
    </div>
  );
};

export default VADisabilityCalculator;
```

### 5. Update Tailwind Configuration

Ensure Tailwind CSS processes the new files by updating `tailwind.config.js`:

```js
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: []
};
```

## How to Use the Calculator

1. **Add Disabilities**: Input each disability’s percentage and affected area. Use "Add Disability" for multiple entries.
2. **Enter Dependents**: Specify spouse, children under/over 18, and dependent parents.
3. **Select SMC Level**: Choose a Special Monthly Compensation level if applicable.
4. **Calculate**: Click "Calculate" to see the combined rating and monthly compensation.

## Notes on Calculations

- **Combined Rating**: Calculated using the VA’s “whole person theory” formula, capping at 100%.
- **Compensation**: Based on official 2025 VA rates, including base rates, additional rates for dependents, and SMC.

## Updating Rates Annually

Modify the `baseRates`, `additionalRates`, and `smcRates` objects in `page.tsx` with current VA rates as they change each year.
