"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExternalLink, X } from "lucide-react";
import { ecfrService } from "@/lib/services/ecfr-service";
import { Citation } from "@/lib/services/ecfr-service/types";

interface CfrCitationProps {
  title: number;
  part: number;
  section: string;
  displayText?: string;
}

export function CfrCitation({ title, part, section, displayText }: CfrCitationProps) {
  const [citation, setCitation] = useState<Citation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!isOpen && !citation) {
      setIsLoading(true);
      setError(null);

      try {
        const citationData = await ecfrService.getCitation(title, part, section);
        setCitation(citationData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load citation");
        console.error("Error fetching citation:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const displayLabel = displayText || `${title} CFR ${part}.${section}`;
  const citationUrl = `https://www.ecfr.gov/current/title-${title}/part-${part}/section-${part}.${section}`;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="text-primary h-auto p-0 font-normal underline"
          onClick={handleClick}>
          {displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-0 shadow-none">
          <div className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                {title} CFR {part}.{section}
              </h4>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-6 w-6" asChild>
                  <a href={citationUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open in new tab</span>
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-muted-foreground py-2 text-sm">Loading citation...</div>
            ) : error ? (
              <div className="text-destructive py-2 text-sm">{error}</div>
            ) : citation ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{citation.text}</p>
                <p className="text-muted-foreground text-sm">{citation.context}</p>
              </div>
            ) : null}
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
