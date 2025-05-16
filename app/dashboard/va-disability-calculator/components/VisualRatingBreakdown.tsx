"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Button from "./Button";

type VisualRatingBreakdownProps = {
  disabilities: { percentage: number; area: string; description?: string }[];
  combinedRating: number;
};

const VisualRatingBreakdown: React.FC<VisualRatingBreakdownProps> = ({
  disabilities,
  combinedRating
}) => {
  // Filter out 0% disabilities
  const validDisabilities = disabilities.filter((d) => Number(d.percentage) > 0);

  // Sort by percentage (highest first)
  const sortedDisabilities = [...validDisabilities].sort(
    (a, b) => Number(b.percentage) - Number(a.percentage)
  );

  // Calculate the efficiency loss at each step
  const efficiencySteps: {
    percentage: number;
    area: string;
    description?: string;
    remainingEfficiency: number;
    efficiencyLoss: number;
    cumulativeRating: number;
  }[] = [];

  let remainingEfficiency = 100;
  let cumulativeRating = 0;

  sortedDisabilities.forEach((disability, index) => {
    const percentage = Number(disability.percentage);
    const efficiencyLoss = (percentage / 100) * remainingEfficiency;
    cumulativeRating += efficiencyLoss;

    efficiencySteps.push({
      percentage,
      area: disability.area,
      description: disability.description,
      remainingEfficiency: remainingEfficiency - efficiencyLoss,
      efficiencyLoss,
      cumulativeRating: Math.round(cumulativeRating)
    });

    remainingEfficiency -= efficiencyLoss;
  });

  if (validDisabilities.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary text-xl font-semibold">
            How Your Rating Is Calculated
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-secondary hover:bg-secondary/90 h-9 w-9 p-0"
                  aria-label="Rating calculation information">
                  <HelpCircle className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4">
                <p className="text-sm">
                  The VA uses the "whole person theory" to calculate combined ratings. Each
                  disability affects your remaining capacity, not your total capacity.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-muted-foreground">
            <p>Your disabilities are combined in order from highest to lowest percentage:</p>
          </div>

          <div className="space-y-5">
            {efficiencySteps.map((step, index) => (
              <div key={index} className="bg-muted/10 space-y-2 rounded-lg p-4">
                <div className="flex flex-col text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-1 flex items-center gap-2 sm:mb-0">
                    <span className="text-base font-medium">
                      {step.percentage}% {step.area}
                      {step.description ? ` (${step.description})` : ""}
                    </span>
                    {index === 0 && (
                      <span className="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-xs font-medium">
                        Starting point
                      </span>
                    )}
                  </div>
                  <span className="font-semibold">
                    {index > 0 ? `${efficiencySteps[index - 1].cumulativeRating}% → ` : ""}
                    {step.cumulativeRating}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={step.cumulativeRating}
                    className="h-3"
                    aria-label={`Combined rating after disability ${index + 1}: ${step.cumulativeRating}%`}
                  />
                </div>
                {index < efficiencySteps.length - 1 && (
                  <div className="text-muted-foreground pl-4 text-xs">
                    <span className="font-medium">Remaining efficiency:</span>{" "}
                    {step.remainingEfficiency.toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border-primary/10 mt-2 rounded-lg border p-4">
            <div className="flex justify-between font-medium">
              <span className="text-base">Final Combined Rating (rounded to nearest 10%):</span>
              <span className="text-primary text-xl font-bold">{combinedRating}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualRatingBreakdown;
