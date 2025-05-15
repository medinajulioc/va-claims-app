"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function TraumaticEventsForm() {
  const form = useFormContext();

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Traumatic Events</CardTitle>
        <CardDescription>
          Describe the traumatic event(s) that occurred during your military service. Include dates,
          locations, and details of the incident(s).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <FormField
                control={form.control}
                name="traumaticEvents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traumatic Event Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what happened, when and where it occurred, and how it has affected you..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              Be as specific as possible about what happened, including dates, locations, and names
              if available
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
