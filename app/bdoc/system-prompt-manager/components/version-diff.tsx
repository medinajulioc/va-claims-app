"use client";

import { useMemo } from "react";
import { diffLines, Change } from "diff";
import { cn } from "@/lib/utils";

interface VersionDiffProps {
  oldText: string;
  newText: string;
  className?: string;
}

export function VersionDiff({ oldText, newText, className }: VersionDiffProps) {
  // Compute the diff between old and new text
  const diff = useMemo(() => {
    return diffLines(oldText, newText);
  }, [oldText, newText]);

  return (
    <div className={cn("bg-muted/30 overflow-hidden rounded-md border", className)}>
      <div className="bg-background border-b px-4 py-2 font-mono text-xs">
        <span className="text-muted-foreground">Diff</span>
      </div>
      <div className="relative p-4 font-mono text-sm whitespace-pre-wrap">
        {diff.map((part, index) => (
          <div
            key={index}
            className={cn("-mr-4 py-0.5 pr-4 pl-2", {
              "border-l-2 border-l-red-500/50 bg-red-500/10": part.removed,
              "border-l-2 border-l-green-500/50 bg-green-500/10": part.added
            })}>
            <span className="text-muted-foreground mr-2 select-none">
              {part.added ? "+" : part.removed ? "-" : " "}
            </span>
            {part.value}
          </div>
        ))}
      </div>
    </div>
  );
}
