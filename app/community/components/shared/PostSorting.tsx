"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FlameIcon,
  SparklesIcon,
  TrendingUpIcon,
  Clock,
  CalendarDays,
  Calendar,
  CalendarIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostSortingProps {
  currentSort: "hot" | "new" | "top";
  onSortChange: (sort: "hot" | "new" | "top") => void;
  currentTimeFilter?: "all" | "today" | "week" | "month" | "year";
  onTimeFilterChange?: (filter: "all" | "today" | "week" | "month" | "year") => void;
  className?: string;
}

export default function PostSorting({
  currentSort,
  onSortChange,
  currentTimeFilter = "all",
  onTimeFilterChange,
  className = ""
}: PostSortingProps) {
  // Time filter labels
  const timeFilterLabels = {
    all: "All Time",
    today: "Today",
    week: "This Week",
    month: "This Month",
    year: "This Year"
  };

  // Time filter icons
  const timeFilterIcons = {
    all: null,
    today: <Clock className="mr-2 h-4 w-4" />,
    week: <CalendarDays className="mr-2 h-4 w-4" />,
    month: <Calendar className="mr-2 h-4 w-4" />,
    year: <CalendarIcon className="mr-2 h-4 w-4" />
  };

  // Handler for time filter changes
  const handleTimeFilterChange = (filter: "all" | "today" | "week" | "month" | "year") => {
    if (onTimeFilterChange) {
      onTimeFilterChange(filter);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Tabs
        value={currentSort}
        onValueChange={(value) => onSortChange(value as "hot" | "new" | "top")}
        className="w-full sm:w-auto">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          <TabsTrigger value="hot" className="transition-all data-[state=active]:shadow-sm">
            <span className="flex items-center gap-1.5">
              <FlameIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Hot</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="new" className="transition-all data-[state=active]:shadow-sm">
            <span className="flex items-center gap-1.5">
              <SparklesIcon className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="top" className="transition-all data-[state=active]:shadow-sm">
            <span className="flex items-center gap-1.5">
              <TrendingUpIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Top</span>
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {onTimeFilterChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs font-medium shadow-sm transition-shadow hover:shadow-md">
              {timeFilterIcons[currentTimeFilter]}
              <span className="hidden sm:inline">{timeFilterLabels[currentTimeFilter]}</span>
              <span className="inline sm:hidden">Time</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs font-normal">Filter by time</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleTimeFilterChange("all")}
              className={cn(
                "gap-2",
                currentTimeFilter === "all" && "bg-accent text-accent-foreground"
              )}>
              All Time
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleTimeFilterChange("today")}
              className={cn(
                "gap-2",
                currentTimeFilter === "today" && "bg-accent text-accent-foreground"
              )}>
              <Clock className="h-4 w-4" />
              Today
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleTimeFilterChange("week")}
              className={cn(
                "gap-2",
                currentTimeFilter === "week" && "bg-accent text-accent-foreground"
              )}>
              <CalendarDays className="h-4 w-4" />
              This Week
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleTimeFilterChange("month")}
              className={cn(
                "gap-2",
                currentTimeFilter === "month" && "bg-accent text-accent-foreground"
              )}>
              <Calendar className="h-4 w-4" />
              This Month
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleTimeFilterChange("year")}
              className={cn(
                "gap-2",
                currentTimeFilter === "year" && "bg-accent text-accent-foreground"
              )}>
              <CalendarIcon className="h-4 w-4" />
              This Year
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
