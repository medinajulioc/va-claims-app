"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function ConditionDetailsForm() {
  const form = useFormContext();

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Condition Details</CardTitle>
        <CardDescription>
          Provide information about the condition and its relationship to military service.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          <div className="space-y-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="disability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disability or Condition</FormLabel>
                      <FormControl>
                        <Input placeholder="PTSD, Back Injury, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Enter the medical condition or disability</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="relationToService"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relation to Military Service</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain how this condition is related to military service..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                Describe how this condition is connected to military service
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="traumaticEvents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevant Events (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any specific events related to this condition..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                Describe any specific events that contributed to this condition
              </TooltipContent>
            </Tooltip>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <FormField
                    control={form.control}
                    name="witnessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Witness Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  Enter the name of anyone who witnessed the events or condition
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <FormField
                    control={form.control}
                    name="witnessRelationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to Veteran (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Friend, Family Member, Fellow Service Member"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>Describe your relationship to the veteran</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <FormField
                    control={form.control}
                    name="witnessPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Witness Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="555-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>Provide the witness's contact phone number</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <FormField
                    control={form.control}
                    name="witnessEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Witness Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="example@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>Enter the witness's email address if available</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
