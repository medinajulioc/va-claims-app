"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlameIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";

interface PostSortingProps {
  currentSort: "hot" | "new" | "top";
  onSortChange: (sort: "hot" | "new" | "top") => void;
  className?: string;
}

export default function PostSorting({
  currentSort,
  onSortChange,
  className = ""
}: PostSortingProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Tabs
        value={currentSort}
        onValueChange={(value) => onSortChange(value as "hot" | "new" | "top")}
        className="w-full sm:w-auto">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          <TabsTrigger value="hot">
            <span className="flex items-center gap-1.5">
              <FlameIcon className="h-4 w-4" />
              Hot
            </span>
          </TabsTrigger>
          <TabsTrigger value="new">
            <span className="flex items-center gap-1.5">
              <SparklesIcon className="h-4 w-4" />
              New
            </span>
          </TabsTrigger>
          <TabsTrigger value="top">
            <span className="flex items-center gap-1.5">
              <TrendingUpIcon className="h-4 w-4" />
              Top
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
