"use client";

import React from "react";
import { Markdown } from "@/components/ui/custom/prompt/markdown";
import { CfrCitation } from "@/components/ui/custom/prompt/cfr-citation";
import { extractCfrCitations } from "@/lib/utils/cfr-utils";

interface CfrMarkdownProps {
  children: string;
  className?: string;
}

export function CfrMarkdown({ children, className }: CfrMarkdownProps) {
  // Process the markdown to replace CFR citations with interactive components
  const processedMarkdown = React.useMemo(() => {
    if (!children) return "";

    // Extract all CFR citations from the text
    const citations = extractCfrCitations(children);

    if (citations.length === 0) {
      return children;
    }

    // Replace each citation with a custom component placeholder
    let result = children;

    // Sort citations by length of the match (longest first) to avoid nested replacements
    const sortedCitations = [...citations].sort((a, b) => b.fullMatch.length - a.fullMatch.length);

    // Replace each citation with a placeholder
    sortedCitations.forEach((citation, index) => {
      const placeholder = `__CFR_CITATION_${index}__`;
      result = result.replace(citation.fullMatch, placeholder);
    });

    return {
      text: result,
      citations: sortedCitations
    };
  }, [children]);

  // Custom components for the markdown renderer
  const components = React.useMemo(() => {
    if (typeof processedMarkdown !== "object") {
      return {};
    }

    return {
      // This is a custom component that will replace text nodes
      text: ({ children }: { children: string }) => {
        // Check if the text contains any of our placeholders
        if (!children.includes("__CFR_CITATION_")) {
          return <>{children}</>;
        }

        // Split the text by our placeholders and replace them with components
        const parts = children.split(/(__CFR_CITATION_\d+__)/g);

        return (
          <>
            {parts.map((part, i) => {
              const match = part.match(/__CFR_CITATION_(\d+)__/);
              if (match) {
                const index = parseInt(match[1], 10);
                const citation = processedMarkdown.citations[index];

                if (citation) {
                  return (
                    <CfrCitation
                      key={i}
                      title={citation.title}
                      part={citation.part}
                      section={citation.section}
                      displayText={citation.fullMatch}
                    />
                  );
                }
              }
              return part;
            })}
          </>
        );
      }
    };
  }, [processedMarkdown]);

  if (typeof processedMarkdown !== "object") {
    return <Markdown className={className}>{processedMarkdown}</Markdown>;
  }

  return (
    <Markdown className={className} components={components}>
      {processedMarkdown.text}
    </Markdown>
  );
}
