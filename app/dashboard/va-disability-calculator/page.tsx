"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Calculator } from "lucide-react";
import DisabilityInput from "./components/DisabilityInput";
import DependentsInput from "./components/DependentsInput";
import SMCInput from "./components/SMCInput";
import CalculationSummary from "./components/CalculationSummary";
import Button from "./components/Button";

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
  disabilities: { percentage: number; area: string }[];
  spouse: string;
  childrenUnder18: number;
  childrenOver18: number;
  dependentParents: string;
  smcLevel: string;
};

export default function Page() {
  const form = useForm<FormData>({
    defaultValues: {
      disabilities: [{ percentage: 0, area: "Other" }],
      spouse: "No",
      childrenUnder18: 0,
      childrenOver18: 0,
      dependentParents: "0",
      smcLevel: "none"
    }
  });

  const [result, setResult] = React.useState<{
    combinedRating: number;
    compensation: number;
  } | null>(null);

  // VA "Whole Person Theory" Formula
  const calculateCombinedRating = (percentages: number[]): number => {
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

  const calculateCompensation = (data: FormData, combinedRating: number): number => {
    if (combinedRating === 0) return 0;

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

    let compensation = rates[baseKey] || rates["alone"];

    // Additional dependents
    const totalChildren =
      parseInt(data.childrenUnder18.toString()) + parseInt(data.childrenOver18.toString());
    if (totalChildren > 1) {
      compensation += (totalChildren - 1) * addRates["additional_child"];
    }

    // Add SMC if applicable
    compensation += smcRates[data.smcLevel];

    return compensation;
  };

  const onSubmit = (data: FormData) => {
    const percentages = data.disabilities.map((d) =>
      Math.min(parseInt(d.percentage.toString()), 100)
    );
    const combinedRating = calculateCombinedRating(percentages);
    const compensation = calculateCompensation(data, combinedRating);
    setResult({ combinedRating, compensation });
  };

  const handleReset = () => {
    form.reset({
      disabilities: [{ percentage: 0, area: "Other" }],
      spouse: "No",
      childrenUnder18: 0,
      childrenOver18: 0,
      dependentParents: "0",
      smcLevel: "none"
    });
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">VA Disability Calculator</h1>
        <div className="flex items-center space-x-2">
          <Calculator className="text-muted-foreground size-5" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <div className="mb-6">
              <h2 className="text-lg font-medium">2025 VA Disability Compensation Calculator</h2>
              <p className="text-muted-foreground">
                Calculate your combined VA disability rating and monthly compensation based on the
                official 2025 rates.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DisabilityInput control={form.control} />
                <DependentsInput control={form.control} />
                <SMCInput control={form.control} />
                <div className="flex w-full gap-4">
                  <Button type="submit" className="flex-1">
                    Calculate
                  </Button>
                  <Button
                    type="button"
                    className="bg-secondary hover:bg-secondary/90 flex-1"
                    onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </Form>

            {result && (
              <CalculationSummary
                combinedRating={result.combinedRating}
                compensation={result.compensation}
              />
            )}
          </motion.div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">About VA Disability Calculations</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Combined Rating</h4>
              <p className="text-muted-foreground">
                VA uses the "whole person theory" to calculate combined ratings. This is not a
                simple addition of percentages. Each disability affects your remaining capacity.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Compensation Rates</h4>
              <p className="text-muted-foreground">
                Monthly payments are based on your combined rating percentage, number of dependents,
                and any Special Monthly Compensation entitlements.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Disclaimer</h4>
              <p className="text-muted-foreground text-sm">
                This calculator provides estimates based on the 2025 VA compensation rates. Always
                verify official amounts with the VA for your specific situation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium">How does VA Math work?</h4>
              <p className="text-muted-foreground">
                VA doesn't simply add your disability percentages together. Instead, they use the
                "Whole Person Theory" which considers how each disability affects your remaining
                capacity. For example, if you have a 30% disability, you are considered 70%
                efficient. If you have another 20% disability, it only applies to your remaining 70%
                efficiency (20% of 70% = 14%), making your combined rating 44%, which rounds to 40%.
              </p>
            </div>

            <div>
              <h4 className="font-medium">What is Special Monthly Compensation (SMC)?</h4>
              <p className="text-muted-foreground">
                SMC is additional tax-free compensation for veterans with specific severe
                disabilities or combinations of disabilities. These include loss of use of
                extremities, blindness, deafness, need for aid and attendance, or being housebound.
                SMC rates (labeled K through T) provide higher compensation than the regular
                schedule.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Why did my combined rating not increase as expected?</h4>
              <p className="text-muted-foreground">
                Due to the VA's combined rating formula, adding a new disability often results in a
                smaller increase than expected. For example, if you already have a 70% rating and
                add a 10% disability, your combined rating will only increase to 73%, which rounds
                to 70% (no change). This is known as the "VA Math" problem.
              </p>
            </div>

            <div>
              <h4 className="font-medium">What are bilateral factors?</h4>
              <p className="text-muted-foreground">
                When you have disabilities affecting both arms, both legs, or paired skeletal
                muscles, the VA applies a "bilateral factor." This adds 10% of the combined value of
                these disabilities before proceeding with the regular combined rating calculation,
                recognizing the greater impact when both sides are affected.
              </p>
            </div>

            <div>
              <h4 className="font-medium">How often do VA compensation rates change?</h4>
              <p className="text-muted-foreground">
                VA compensation rates typically adjust annually based on the Cost of Living
                Adjustment (COLA) determined by the Social Security Administration. These
                adjustments usually take effect on December 1st and are reflected in the January
                payment.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Can my VA disability rating decrease?</h4>
              <p className="text-muted-foreground">
                Yes, the VA can propose to reduce your disability rating if they determine your
                condition has improved. However, ratings that have been in place for 5+ years are
                considered "stabilized" and require substantial evidence of improvement. Ratings in
                place for 20+ years are generally protected from reduction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
