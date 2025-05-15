"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircleIcon } from "lucide-react";

interface FormTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  icon?: boolean;
}

export function FormTooltip({ content, children, side = "right", icon = false }: FormTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="relative inline-block">
            {children}
            {icon && <HelpCircleIcon className="text-muted-foreground ml-1 inline-block h-4 w-4" />}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="bg-primary text-primary-foreground max-w-[260px]"
          sideOffset={5}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
