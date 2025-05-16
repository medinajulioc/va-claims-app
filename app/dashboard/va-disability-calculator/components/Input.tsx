import React from "react";
import { Input as UIInput } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Control } from "react-hook-form";

type InputProps = {
  label: string;
  type: string;
  name: string;
  control: Control<any>;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  className?: string;
};

const Input: React.FC<InputProps> = ({
  label,
  type,
  name,
  control,
  defaultValue,
  min,
  max,
  step,
  placeholder,
  helpText,
  disabled,
  className
}) => (
  <FormField
    control={control}
    name={name}
    defaultValue={defaultValue}
    render={({ field }) => (
      <FormItem className={`mb-4 ${className || ""}`}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <UIInput
            type={type}
            {...field}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            disabled={disabled}
            aria-describedby={helpText ? `${name}-description` : undefined}
          />
        </FormControl>
        {helpText && <FormDescription id={`${name}-description`}>{helpText}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

export default Input;
