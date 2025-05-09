"use client";

import { SystemPrompt } from "../types";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Check, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptListItemProps {
  prompt: SystemPrompt;
  isSelected: boolean;
  onClick: () => void;
}

export function PromptListItem({ prompt, isSelected, onClick }: PromptListItemProps) {
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };

  // Get status badge info
  const getStatusBadge = () => {
    if (prompt.deployedVersion) {
      return {
        label: "Deployed",
        icon: <Check className="mr-1 h-3 w-3" />,
        variant: "success" as const
      };
    } else if (prompt.isActive) {
      return {
        label: "Active",
        icon: null,
        variant: "default" as const
      };
    } else {
      return {
        label: "Inactive",
        icon: <Clock className="mr-1 h-3 w-3" />,
        variant: "outline" as const
      };
    }
  };

  const statusBadge = getStatusBadge();

  // Get category badge color
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "general":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "claims":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "legal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "administrative":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "custom":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer p-3 transition-colors",
        isSelected
          ? "bg-muted border-l-primary border-l-4"
          : "hover:bg-muted/50 border-l-4 border-l-transparent"
      )}
      onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">{prompt.name}</h4>
          <p className="text-muted-foreground line-clamp-2 text-xs">{prompt.description}</p>
        </div>

        <Badge variant={statusBadge.variant} className="ml-2 h-5">
          {statusBadge.icon}
          {statusBadge.label}
        </Badge>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-medium",
              getCategoryColor(prompt.category)
            )}>
            {prompt.category}
          </span>

          {prompt.tags.length > 0 && (
            <div className="text-muted-foreground flex items-center text-xs">
              <Tag className="mx-1 h-3 w-3" />
              <span className="max-w-[100px] truncate">
                {prompt.tags.slice(0, 2).join(", ")}
                {prompt.tags.length > 2 && "..."}
              </span>
            </div>
          )}
        </div>

        <span className="text-muted-foreground text-xs">{formatDate(prompt.updatedAt)}</span>
      </div>
    </div>
  );
}
