import React from "react";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

type SelectProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  control: Control<any>;
  defaultValue?: string;
};

const Select: React.FC<SelectProps> = ({ label, name, options, control, defaultValue }) => (
  <FormField
    control={control}
    name={name}
    defaultValue={defaultValue}
    render={({ field }) => (
      <FormItem className="mb-4">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <UISelect onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
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
        <FormMessage />
      </FormItem>
    )}
  />
);

export default Select;
