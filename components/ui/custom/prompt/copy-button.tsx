"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CopyButtonProps {
  text: string;
  className?: string;
  compact?: boolean;
  showOnHover?: boolean;
}

export function CopyButton({
  text,
  className,
  compact = false,
  showOnHover = true
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(!showOnHover);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className={cn("relative", showOnHover && "group")}
      onMouseEnter={() => showOnHover && setIsVisible(true)}
      onMouseLeave={() => showOnHover && setIsVisible(false)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={compact ? "icon" : "sm"}
              onClick={handleCopy}
              className={cn(
                "h-8 w-8 rounded-md transition-opacity",
                showOnHover && !isVisible ? "opacity-0" : "opacity-100",
                showOnHover && "group-hover:opacity-100",
                className
              )}>
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {!compact && <span className="ml-2">{isCopied ? "Copied!" : "Copy"}</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">{isCopied ? "Copied!" : "Copy to clipboard"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
