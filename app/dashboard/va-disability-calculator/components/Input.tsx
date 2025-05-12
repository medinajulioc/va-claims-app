import React from "react";
import { Input as UIInput } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

type InputProps = {
  label: string;
  type: string;
  name: string;
  control: Control<any>;
  defaultValue?: string | number;
};

const Input: React.FC<InputProps> = ({ label, type, name, control, defaultValue }) => (
  <FormField
    control={control}
    name={name}
    defaultValue={defaultValue}
    render={({ field }) => (
      <FormItem className="mb-4">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <UIInput type={type} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default Input;
