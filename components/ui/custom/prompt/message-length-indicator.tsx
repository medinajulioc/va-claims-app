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
  const percentage = (currentLength / maxLength) * 100;

  // Only show warning colors when approaching limit
  const textColorClass = percentage > 90 ? "text-destructive" : "text-muted-foreground";

  return (
    <div className={cn("flex items-center text-xs", textColorClass, className)}>
      <span>
        {currentLength}/{maxLength}
      </span>
    </div>
  );
}
