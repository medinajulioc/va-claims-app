"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Calculator, Copy, Save, Printer, HelpCircle, PieChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import DisabilityInput from "./DisabilityInput";
import DependentsInput from "./DependentsInput";
import SMCInput from "./SMCInput";
import CalculationSummary from "./CalculationSummary";
import Button from "./Button";
import FAQAccordion from "./FAQAccordion";
import VisualRatingBreakdown from "./VisualRatingBreakdown";

// Official 2025 VA Base Rates (subset for brevity)
const baseRates: { [key: number]: { [key: string]: number } } = {
  10: { alone: 171.23 },
  20: { alone: 338.49 },
  30: {
    alone: 537.42,
    with_spouse: 601.42,
    with_spouse_and_one_child: 648.42,
    with_one_child: 579.42,
    with_one_parent: 588.42,
    with_two_parents: 639.42,
    with_spouse_and_one_parent: 652.42,
    with_spouse_and_two_parents: 703.42
  },
  40: {
    alone: 772.23,
    with_spouse: 855.23,
    with_spouse_and_one_child: 917.23,
    with_one_child: 830.23,
    with_one_parent: 839.23,
    with_two_parents: 906.23,
    with_spouse_and_one_parent: 922.23,
    with_spouse_and_two_parents: 989.23
  },
  50: {
    alone: 1096.69,
    with_spouse: 1198.69,
    with_spouse_and_one_child: 1275.69,
    with_one_child: 1169.69,
    with_one_parent: 1179.69,
    with_two_parents: 1262.69,
    with_spouse_and_one_parent: 1281.69,
    with_spouse_and_two_parents: 1364.69
  },
  60: {
    alone: 1390.62,
    with_spouse: 1511.62,
    with_spouse_and_one_child: 1603.62,
    with_one_child: 1478.62,
    with_one_parent: 1489.62,
    with_two_parents: 1588.62,
    with_spouse_and_one_parent: 1610.62,
    with_spouse_and_two_parents: 1709.62
  },
  70: {
    alone: 1754.95,
    with_spouse: 1894.95,
    with_spouse_and_one_child: 2001.95,
    with_one_child: 1857.95,
    with_one_parent: 1869.95,
    with_two_parents: 1984.95,
    with_spouse_and_one_parent: 2009.95,
    with_spouse_and_two_parents: 2124.95
  },
  80: {
    alone: 2035.96,
    with_spouse: 2194.96,
    with_spouse_and_one_child: 2316.96,
    with_one_child: 2153.96,
    with_one_parent: 2165.96,
    with_two_parents: 2296.96,
    with_spouse_and_one_parent: 2324.96,
    with_spouse_and_two_parents: 2455.96
  },
  90: {
    alone: 2289.52,
    with_spouse: 2467.52,
    with_spouse_and_one_child: 2604.52,
    with_one_child: 2422.52,
    with_one_parent: 2434.52,
    with_two_parents: 2580.52,
    with_spouse_and_one_parent: 2612.52,
    with_spouse_and_two_parents: 2758.52
  },
  100: {
    alone: 3737.85,
    with_spouse: 3947.85,
    with_spouse_and_one_child: 4088.85,
    with_one_child: 3878.85,
    with_one_parent: 3890.85,
    with_two_parents: 4043.85,
    with_spouse_and_one_parent: 4100.85,
    with_spouse_and_two_parents: 4253.85
  }
};

// Additional Rates for 2025 (subset)
const additionalRates: { [key: number]: { [key: string]: number } } = {
  30: {
    child_under_18: 31.0,
    child_over_18: 102.0,
    spouse_aid: 58.0,
    additional_child: 31.0,
    each_parent: 51.0
  },
  40: {
    child_under_18: 41.0,
    child_over_18: 136.0,
    spouse_aid: 77.0,
    additional_child: 41.0,
    each_parent: 67.0
  },
  50: {
    child_under_18: 51.0,
    child_over_18: 170.0,
    spouse_aid: 96.0,
    additional_child: 51.0,
    each_parent: 83.0
  },
  60: {
    child_under_18: 61.0,
    child_over_18: 204.0,
    spouse_aid: 115.0,
    additional_child: 61.0,
    each_parent: 99.0
  },
  70: {
    child_under_18: 71.0,
    child_over_18: 238.0,
    spouse_aid: 134.0,
    additional_child: 71.0,
    each_parent: 115.0
  },
  80: {
    child_under_18: 81.0,
    child_over_18: 272.0,
    spouse_aid: 153.0,
    additional_child: 81.0,
    each_parent: 131.0
  },
  90: {
    child_under_18: 91.0,
    child_over_18: 306.0,
    spouse_aid: 172.0,
    additional_child: 91.0,
    each_parent: 146.0
  },
  100: {
    child_under_18: 97.8,
    child_over_18: 314.0,
    spouse_aid: 191.0,
    additional_child: 97.8,
    each_parent: 151.0
  }
};

// SMC Rates for 2025
const smcRates: { [key: string]: number } = {
  none: 0,
  K: 136.06,
  L: 4767.34,
  M: 5264.58,
  N: 5768.77,
  O: 6466.32,
  R1: 9292.77,
  R2: 10540.79
};

type FormData = {
  disabilities: { percentage: number; area: string; description: string }[];
  spouse: string;
  spouseAid: boolean;
  childrenUnder18: number;
  childrenOver18: number;
  dependentParents: string;
  smcLevel: string;
  scenario: string;
};

export default function VADisabilityCalculator() {
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<
    {
      name: string;
      data: FormData;
      result: { combinedRating: number; compensation: number };
    }[]
  >([]);

  const form = useForm<FormData>({
    defaultValues: {
      disabilities: [{ percentage: 0, area: "Other", description: "" }],
      spouse: "No",
      spouseAid: false,
      childrenUnder18: 0,
      childrenOver18: 0,
      dependentParents: "0",
      smcLevel: "none",
      scenario: "Current"
    }
  });

  const [result, setResult] = useState<{
    combinedRating: number;
    compensation: number;
    breakdown: { baseRate: number; dependentsAmount: number; smcAmount: number };
  } | null>(null);

  const watchSpouse = form.watch("spouse");
  const watchDisabilities = form.watch("disabilities");

  // VA "Whole Person Theory" Formula
  const calculateCombinedRating = (percentages: number[]): number => {
    if (percentages.length === 0 || percentages.every((p) => p === 0)) return 0;

    const sorted = [...percentages].sort((a, b) => b - a);
    let combined = 0;
    let remainingEfficiency = 100;

    for (const p of sorted) {
      const disabilityEffect = (p / 100) * remainingEfficiency;
      combined += disabilityEffect;
      remainingEfficiency -= disabilityEffect;
    }

    const combinedRating = Math.round(combined / 10) * 10;
    return Math.min(combinedRating, 100); // Cap at 100%
  };

  const calculateCompensation = (
    data: FormData,
    combinedRating: number
  ): {
    total: number;
    breakdown: { baseRate: number; dependentsAmount: number; smcAmount: number };
  } => {
    if (combinedRating === 0)
      return {
        total: 0,
        breakdown: { baseRate: 0, dependentsAmount: 0, smcAmount: 0 }
      };

    // Find the closest rating tier (10, 20, 30, etc.)
    const ratingTiers = Object.keys(baseRates)
      .map(Number)
      .sort((a, b) => a - b);
    let ratingTier = ratingTiers.find((tier) => tier >= combinedRating) || 100;
    if (ratingTier > combinedRating && ratingTier > 10) {
      ratingTier = ratingTiers[ratingTiers.indexOf(ratingTier) - 1];
    }

    const rates = baseRates[ratingTier] || baseRates[30]; // Fallback to 30% if rating not found
    const addRates = additionalRates[ratingTier] || additionalRates[30];

    let baseKey = "alone";
    if (data.spouse === "Yes") {
      baseKey =
        parseInt(data.childrenUnder18.toString()) > 0 ||
        parseInt(data.childrenOver18.toString()) > 0
          ? "with_spouse_and_one_child"
          : "with_spouse";
    } else if (
      parseInt(data.childrenUnder18.toString()) > 0 ||
      parseInt(data.childrenOver18.toString()) > 0
    ) {
      baseKey = "with_one_child";
    }

    const baseRate = rates[baseKey] || rates["alone"];
    let dependentsAmount = 0;

    // Additional dependents
    const totalChildren =
      parseInt(data.childrenUnder18.toString()) + parseInt(data.childrenOver18.toString());
    if (totalChildren > 1) {
      dependentsAmount += (totalChildren - 1) * addRates["additional_child"];
    }

    // Add spouse aid if applicable
    if (data.spouse === "Yes" && data.spouseAid) {
      dependentsAmount += addRates["spouse_aid"] || 0;
    }

    // Add SMC
    const smcAmount = smcRates[data.smcLevel];

    return {
      total: baseRate + dependentsAmount + smcAmount,
      breakdown: { baseRate, dependentsAmount, smcAmount }
    };
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsCalculating(true);

      // Simulate calculation delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 600));

      const percentages = data.disabilities.map((d) =>
        Math.min(parseInt(d.percentage.toString()), 100)
      );

      const combinedRating = calculateCombinedRating(percentages);
      const { total: compensation, breakdown } = calculateCompensation(data, combinedRating);

      setResult({ combinedRating, compensation, breakdown });

      toast({
        title: "Calculation Complete",
        description: `Your combined rating is ${combinedRating}% with monthly compensation of $${compensation.toFixed(2)}`
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "There was a problem calculating your disability benefits. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    form.reset({
      disabilities: [{ percentage: 0, area: "Other", description: "" }],
      spouse: "No",
      spouseAid: false,
      childrenUnder18: 0,
      childrenOver18: 0,
      dependentParents: "0",
      smcLevel: "none",
      scenario: "Current"
    });
    setResult(null);
    setShowAdvancedOptions(false);
  };

  const handleCopyResults = () => {
    if (!result) return;

    const resultText = `
VA Disability Calculation Results:
Combined Rating: ${result.combinedRating}%
Monthly Compensation: $${result.compensation.toFixed(2)}

Breakdown:
- Base Rate: $${result.breakdown.baseRate.toFixed(2)}
- Dependents: $${result.breakdown.dependentsAmount.toFixed(2)}
- SMC: $${result.breakdown.smcAmount.toFixed(2)}
    `.trim();

    navigator.clipboard.writeText(resultText);
    toast({
      title: "Results Copied",
      description: "Calculation results have been copied to clipboard"
    });
  };

  const handleSaveCalculation = () => {
    if (!result) return;

    const name = form.getValues("scenario") || `Calculation ${savedCalculations.length + 1}`;

    setSavedCalculations([
      ...savedCalculations,
      {
        name,
        data: form.getValues(),
        result: {
          combinedRating: result.combinedRating,
          compensation: result.compensation
        }
      }
    ]);

    toast({
      title: "Calculation Saved",
      description: `"${name}" has been saved for future reference`
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const loadSavedCalculation = (index: number) => {
    const saved = savedCalculations[index];
    if (saved) {
      form.reset(saved.data);
      setResult({
        combinedRating: saved.result.combinedRating,
        compensation: saved.result.compensation,
        breakdown: { baseRate: 0, dependentsAmount: 0, smcAmount: 0 } // Placeholder
      });
    }
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 print:space-y-2">
      <div className="flex flex-row items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">VA Disability Calculator</h1>
        <div className="flex items-center space-x-2">
          <Calculator className="text-primary size-6" />
        </div>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="saved">Saved Calculations</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-4 space-y-6">
          <Card className="shadow-md print:shadow-none">
            <CardContent className="p-6 sm:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-primary text-2xl font-semibold">
                      2025 VA Disability Compensation Calculator
                    </h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="bg-secondary hover:bg-secondary/90 h-9 w-9 p-0"
                            onClick={() =>
                              window.open(
                                "https://www.va.gov/disability/compensation-rates/",
                                "_blank"
                              )
                            }
                            aria-label="Official VA rates information">
                            <HelpCircle className="size-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View official VA rates</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Calculate your combined VA disability rating and monthly compensation based on
                    the official 2025 rates.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="bg-card/50 rounded-lg border p-6 shadow-sm">
                      <DisabilityInput control={form.control} />
                    </div>

                    <div className="bg-card/50 rounded-lg border p-6 shadow-sm">
                      <DependentsInput
                        control={form.control}
                        showSpouseAid={watchSpouse === "Yes"}
                      />
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium">Advanced Options</h3>
                      <Button
                        type="button"
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        className="bg-secondary hover:bg-secondary/90 h-9 px-4">
                        {showAdvancedOptions ? "Hide Options" : "Show Options"}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showAdvancedOptions && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-card/50 overflow-hidden rounded-lg border p-6 shadow-sm">
                          <div className="space-y-6">
                            <SMCInput control={form.control} />
                            <div>
                              <Input
                                label="Scenario Name (optional)"
                                type="text"
                                name="scenario"
                                control={form.control}
                                placeholder="e.g., Current Rating, After Appeal, etc."
                                helpText="Name this calculation to save it for comparison"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex w-full flex-col gap-4 sm:flex-row">
                      <Button
                        type="submit"
                        className="h-12 flex-1 text-base font-medium"
                        disabled={isCalculating}>
                        {isCalculating ? "Calculating..." : "Calculate Benefits"}
                      </Button>
                      <Button
                        type="button"
                        className="bg-secondary hover:bg-secondary/90 h-12 flex-1 text-base font-medium"
                        onClick={handleReset}>
                        Reset Form
                      </Button>
                    </div>
                  </form>
                </Form>

                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="mt-10">
                      <CalculationSummary
                        combinedRating={result.combinedRating}
                        compensation={result.compensation}
                        breakdown={result.breakdown}
                      />

                      {watchDisabilities.length > 1 && result.combinedRating > 0 && (
                        <div className="mt-8">
                          <VisualRatingBreakdown
                            disabilities={watchDisabilities}
                            combinedRating={result.combinedRating}
                          />
                        </div>
                      )}

                      <div className="mt-8 flex flex-wrap gap-3 print:hidden">
                        <Button
                          type="button"
                          className="bg-secondary hover:bg-secondary/90 h-10"
                          onClick={handleCopyResults}>
                          <Copy className="mr-2 size-4" />
                          Copy Results
                        </Button>
                        <Button
                          type="button"
                          className="bg-secondary hover:bg-secondary/90 h-10"
                          onClick={handleSaveCalculation}>
                          <Save className="mr-2 size-4" />
                          Save Calculation
                        </Button>
                        <Button
                          type="button"
                          className="bg-secondary hover:bg-secondary/90 h-10"
                          onClick={handlePrint}>
                          <Printer className="mr-2 size-4" />
                          Print Results
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          <Card className="shadow-md">
            <CardContent className="p-6 sm:p-8">
              {savedCalculations.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium">Saved Calculations</h3>
                  <div className="divide-y rounded-lg border">
                    {savedCalculations.map((calc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 sm:p-6">
                        <div>
                          <p className="text-lg font-medium">{calc.name}</p>
                          <p className="text-muted-foreground mt-1">
                            Rating:{" "}
                            <span className="font-semibold">{calc.result.combinedRating}%</span> |
                            Compensation:{" "}
                            <span className="font-semibold">
                              ${calc.result.compensation.toFixed(2)}
                            </span>
                          </p>
                        </div>
                        <Button
                          onClick={() => loadSavedCalculation(index)}
                          className="bg-primary hover:bg-primary/90">
                          Load Calculation
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="bg-muted/30 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
                    <Save className="text-muted-foreground size-8" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">No Saved Calculations</h3>
                  <p className="text-muted-foreground mx-auto max-w-md">
                    Use the "Save Calculation" button after calculating your benefits to save your
                    results for future reference.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="mt-4 space-y-6">
          <Card className="shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-primary mb-6 text-xl font-semibold">
                About VA Disability Calculations
              </h3>
              <div className="space-y-6">
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="mb-2 text-lg font-medium">Combined Rating</h4>
                  <p className="text-muted-foreground">
                    VA uses the "whole person theory" to calculate combined ratings. This is not a
                    simple addition of percentages. Each disability affects your remaining capacity.
                  </p>
                </div>
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="mb-2 text-lg font-medium">Compensation Rates</h4>
                  <p className="text-muted-foreground">
                    Monthly payments are based on your combined rating percentage, number of
                    dependents, and any Special Monthly Compensation entitlements.
                  </p>
                </div>
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="mb-2 text-lg font-medium">Official Resources</h4>
                  <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                    <li>
                      <a
                        href="https://www.va.gov/disability/compensation-rates/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline">
                        Official VA Compensation Rates
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.va.gov/disability/about-disability-ratings/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline">
                        About VA Disability Ratings
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.va.gov/disability/eligibility/special-claims/special-monthly-compensation/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline">
                        Special Monthly Compensation
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                  <h4 className="mb-2 text-lg font-medium">Disclaimer</h4>
                  <p className="text-muted-foreground text-sm">
                    This calculator provides estimates based on the 2025 VA compensation rates.
                    Always verify official amounts with the VA for your specific situation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Accordion Section */}
          <FAQAccordion />
        </TabsContent>
      </Tabs>
    </div>
  );
}
