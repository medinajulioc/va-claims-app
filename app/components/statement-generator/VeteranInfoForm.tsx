"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";
import { FormTooltip } from "./FormTooltip";
import { UserIcon } from "lucide-react";

export function VeteranInfoForm() {
  const form = useFormContext();

  const formFields = [
    {
      name: "veteranName",
      label: "Veteran's Full Name",
      placeholder: "John Doe",
      tooltip: "Enter the veteran's full legal name as it appears on military records",
      type: "text"
    },
    {
      name: "veteranSSN",
      label: "Social Security Number",
      placeholder: "123-45-6789",
      tooltip: "Enter the veteran's SSN for identification (will be masked in final document)",
      type: "text"
    },
    {
      name: "veteranDateOfBirth",
      label: "Date of Birth",
      placeholder: "",
      tooltip: "Provide the veteran's date of birth",
      type: "date"
    },
    {
      name: "veteranPhone",
      label: "Phone Number",
      placeholder: "555-123-4567",
      tooltip: "Provide a contact phone number where the VA can reach you",
      type: "tel"
    },
    {
      name: "veteranEmail",
      label: "Email (Optional)",
      placeholder: "example@mail.com",
      tooltip: "Enter an email address for VA correspondence",
      type: "email"
    },
    {
      name: "veteranAddress",
      label: "Address",
      placeholder: "123 Main St, Anytown, USA",
      tooltip: "Enter the veteran's current mailing address where VA correspondence should be sent",
      type: "text",
      fullWidth: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <UserIcon className="text-primary mr-2 h-5 w-5" />
          Veteran Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          {formFields.map((field) => (
            <motion.div
              key={field.name}
              className={field.fullWidth ? "md:col-span-2" : ""}
              variants={itemVariants}>
              <FormField
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      <FormTooltip content={field.tooltip} icon>
                        {field.label}
                      </FormTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={field.placeholder}
                        type={field.type}
                        {...formField}
                        className="focus:ring-primary/20 transition-all duration-200 focus:ring-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
