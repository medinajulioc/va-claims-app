"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface MessageLengthIndicatorProps {
  currentLength: number;
  maxLength: number;
  className?: string;
}

export function MessageLengthIndicator({
  currentLength,
  maxLength,
  className
}: MessageLengthIndicatorProps) {
  // Calculate percentage of max length used
  const percentage = (currentLength / maxLength) * 100;

  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 70) return "text-green-500";
    if (percentage < 90) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div
      className={cn("text-muted-foreground mt-1 flex items-center justify-end text-xs", className)}>
      <span className={cn(getColor())}>
        {currentLength} / {maxLength}
      </span>
    </div>
  );
}
