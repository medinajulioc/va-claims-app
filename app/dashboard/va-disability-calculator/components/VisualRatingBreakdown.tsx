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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">How Your Rating Is Calculated</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-secondary hover:bg-secondary/90 h-8 w-8 p-0"
                  aria-label="Rating calculation information">
                  <HelpCircle className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  The VA uses the "whole person theory" to calculate combined ratings. Each
                  disability affects your remaining capacity, not your total capacity.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            <p>Your disabilities are combined in order from highest to lowest percentage:</p>
          </div>

          <div className="space-y-3">
            {efficiencySteps.map((step, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {step.percentage}% {step.area}
                      {step.description ? ` (${step.description})` : ""}
                    </span>
                    {index === 0 && (
                      <span className="bg-muted rounded px-2 py-0.5 text-xs">Starting point</span>
                    )}
                  </div>
                  <span>
                    {index > 0 ? `${efficiencySteps[index - 1].cumulativeRating}% → ` : ""}
                    {step.cumulativeRating}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={step.cumulativeRating}
                    className="h-2"
                    aria-label={`Combined rating after disability ${index + 1}: ${step.cumulativeRating}%`}
                  />
                </div>
                {index < efficiencySteps.length - 1 && (
                  <div className="text-muted-foreground pl-4 text-xs">
                    Remaining efficiency: {step.remainingEfficiency.toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t pt-2 text-sm">
            <div className="flex justify-between font-medium">
              <span>Final Combined Rating (rounded to nearest 10%):</span>
              <span>{combinedRating}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualRatingBreakdown;
