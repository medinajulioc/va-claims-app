import React from "react";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Control } from "react-hook-form";

type SelectProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  control: Control<any>;
  defaultValue?: string;
  helpText?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

const Select: React.FC<SelectProps> = ({
  label,
  name,
  options,
  control,
  defaultValue,
  helpText,
  disabled,
  className,
  placeholder = "Select an option"
}) => (
  <FormField
    control={control}
    name={name}
    defaultValue={defaultValue}
    render={({ field }) => (
      <FormItem className={`mb-4 ${className || ""}`}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <UISelect onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
            <SelectTrigger aria-describedby={helpText ? `${name}-description` : undefined}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </UISelect>
        </FormControl>
        {helpText && <FormDescription id={`${name}-description`}>{helpText}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

export default Select;
