"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function ClaimantInfoForm() {
  const form = useFormContext();

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Claimant Information</CardTitle>
        <CardDescription>
          If you are providing a statement on behalf of a veteran, please provide your information
          below. Leave blank if you are the veteran.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="claimantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Claimant's Full Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Enter your full legal name if you're not the veteran</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="claimantSSN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSN (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="123-45-6789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                Enter your Social Security Number if you're not the veteran
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="claimantPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="555-123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Provide your contact phone number</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="claimantEmail"
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
              <TooltipContent>Enter your email address if available</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="claimantAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Enter your current mailing address</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
