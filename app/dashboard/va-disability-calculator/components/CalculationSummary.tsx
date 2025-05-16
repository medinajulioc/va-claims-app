"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

type CalculationSummaryProps = {
  combinedRating: number;
  compensation: number;
  breakdown?: {
    baseRate: number;
    dependentsAmount: number;
    smcAmount: number;
  };
};

const CalculationSummary: React.FC<CalculationSummaryProps> = ({
  combinedRating,
  compensation,
  breakdown = { baseRate: 0, dependentsAmount: 0, smcAmount: 0 }
}) => {
  const annualCompensation = compensation * 12;

  // Calculate percentages for the breakdown chart
  const total = breakdown.baseRate + breakdown.dependentsAmount + breakdown.smcAmount;
  const baseRatePercent = total > 0 ? (breakdown.baseRate / total) * 100 : 0;
  const dependentsPercent = total > 0 ? (breakdown.dependentsAmount / total) * 100 : 0;
  const smcPercent = total > 0 ? (breakdown.smcAmount / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}>
      <Card className="border-primary/20 overflow-hidden border-2 shadow-md print:border-0 print:shadow-none">
        <div className="bg-primary/10 p-5 text-center">
          <h3 className="text-primary text-2xl font-semibold">Calculation Results</h3>
        </div>
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-muted-foreground font-medium">Combined Rating</p>
              <div className="relative">
                <svg className="size-40 md:size-44" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="10"
                    strokeDasharray={`${combinedRating * 2.83} ${283 - combinedRating * 2.83}`}
                    strokeDashoffset="70.75"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{combinedRating}%</span>
                </div>
              </div>
              <Badge
                variant={combinedRating >= 100 ? "destructive" : "outline"}
                className="mt-2 px-4 py-1 text-sm font-medium">
                {combinedRating >= 100 ? "Maximum Rating" : "VA Combined Rating"}
              </Badge>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              <p className="text-muted-foreground font-medium">Monthly Compensation</p>
              <div className="flex items-baseline">
                <p className="text-primary text-4xl font-bold">${compensation.toFixed(2)}</p>
                <p className="text-muted-foreground ml-2 text-sm">per month</p>
              </div>
              <p className="text-muted-foreground">
                Annual: <span className="font-semibold">${annualCompensation.toFixed(2)}</span>
              </p>

              <Separator className="my-5" />

              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium">Base Rate</span>
                    <span className="font-semibold">${breakdown.baseRate.toFixed(2)}</span>
                  </div>
                  <Progress value={baseRatePercent} className="h-2" />
                </div>

                {breakdown.dependentsAmount > 0 && (
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">Dependents</span>
                      <span className="font-semibold">
                        ${breakdown.dependentsAmount.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={dependentsPercent} className="h-2" />
                  </div>
                )}

                {breakdown.smcAmount > 0 && (
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">SMC</span>
                      <span className="font-semibold">${breakdown.smcAmount.toFixed(2)}</span>
                    </div>
                    <Progress value={smcPercent} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-muted/30 mt-8 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-3">
              <InfoIcon className="text-primary/70 mt-0.5 size-5 flex-shrink-0" />
              <div>
                <p className="text-muted-foreground">
                  These calculations are based on the official 2025 VA disability compensation
                  rates. Your actual payment may vary based on individual circumstances. Always
                  verify with the VA.
                </p>
                <p className="text-muted-foreground mt-3">
                  <span className="font-medium">Payment dates:</span> 1st of each month for the
                  previous month's entitlement.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CalculationSummary;
