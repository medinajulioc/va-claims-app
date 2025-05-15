"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function StatementForm() {
  const form = useFormContext();

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Statement</CardTitle>
        <CardDescription>
          Provide a detailed statement in support of your claim. Be specific about your condition,
          how it affects you, and how it relates to your military service.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <FormField
                control={form.control}
                name="statement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Statement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about your condition, symptoms, how it affects your daily life, and how it relates to your military service..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              Be as detailed as possible about your condition and how it affects your daily life
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
