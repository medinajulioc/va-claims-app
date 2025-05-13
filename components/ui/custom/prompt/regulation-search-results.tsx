"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegulationSummary } from "@/lib/services/ecfr-service/types";
import { ExternalLink } from "lucide-react";

interface RegulationSearchResultsProps {
  results: RegulationSummary[];
  onSelectRegulation?: (regulation: RegulationSummary) => void;
}

export function RegulationSearchResults({
  results,
  onSelectRegulation
}: RegulationSearchResultsProps) {
  if (results.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-sm">No regulations found matching your query.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Relevant Regulations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((regulation) => (
          <div key={regulation.id} className="border-b pb-3 last:border-0 last:pb-0">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium">{regulation.heading}</h4>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-6 w-6" asChild>
                  <a href={regulation.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open in new tab</span>
                  </a>
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground mt-1 line-clamp-3 text-sm">{regulation.content}</p>
            {onSelectRegulation && (
              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-xs"
                onClick={() => onSelectRegulation(regulation)}>
                Include in response
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
