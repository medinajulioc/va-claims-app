"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function VeteranInfoForm() {
  const form = useFormContext();

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Veteran Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="veteranName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Veteran's Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Enter the veteran's full legal name</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="veteranSSN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Security Number</FormLabel>
                      <FormControl>
                        <Input placeholder="123-45-6789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Enter the veteran's SSN for identification</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="veteranDateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Provide the veteran's date of birth</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="veteranPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="555-123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Provide a contact phone number</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="veteranEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="example@mail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Enter an email address if available</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="veteranAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Enter the veteran's current mailing address</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
