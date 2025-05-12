"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

type CalculationSummaryProps = {
  combinedRating: number;
  compensation: number;
};

const CalculationSummary: React.FC<CalculationSummaryProps> = ({
  combinedRating,
  compensation
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="mt-6">
    <Card>
      <CardContent className="p-6 text-center">
        <h3 className="mb-4 text-xl font-semibold">Calculation Results</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">Combined Rating</p>
            <p className="text-3xl font-bold">{combinedRating}%</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">Monthly Compensation</p>
            <p className="text-3xl font-bold">${compensation.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default CalculationSummary;
