"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function ServiceHistoryForm() {
  const form = useFormContext();

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Service History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch of Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Army">Army</SelectItem>
                          <SelectItem value="Navy">Navy</SelectItem>
                          <SelectItem value="Air Force">Air Force</SelectItem>
                          <SelectItem value="Marines">Marines</SelectItem>
                          <SelectItem value="Coast Guard">Coast Guard</SelectItem>
                          <SelectItem value="Space Force">Space Force</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Select the branch of military service</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="serviceDates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Dates</FormLabel>
                      <FormControl>
                        <Input placeholder="2000-2004" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>Enter the dates of military service</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <FormField
                  control={form.control}
                  name="deployments"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Deployments (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Iraq, 2003; Afghanistan, 2010" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>List any deployments including locations and dates</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
