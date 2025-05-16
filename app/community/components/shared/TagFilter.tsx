"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  className?: string;
}

export function TagFilter({ tags, selectedTags, onTagSelect, className = "" }: TagFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    tagRefs.current = tagRefs.current.slice(0, tags.length + 1);
  }, [tags]);

  // Check if we need to show scroll controls
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    };

    checkScroll();
    scrollRef.current?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      scrollRef.current?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [tags]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const { clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.6; // Scroll 60% of visible width

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        if (index < tags.length) {
          setFocusedIndex(index + 1);
          tagRefs.current[index + 1]?.focus();
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (index > 0) {
          setFocusedIndex(index - 1);
          tagRefs.current[index - 1]?.focus();
        }
        break;
      case "Enter":
      case " ": // Space
        e.preventDefault();
        if (index === 0) {
          // Clear all selected tags
          if (selectedTags.length > 0) {
            selectedTags.forEach((tag) => onTagSelect(tag));
          }
        } else {
          // Toggle the tag
          onTagSelect(tags[index - 1]);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={cn("relative flex items-center", className)}
      role="region"
      aria-label="Filter posts by tags">
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="bg-background/90 absolute left-0 z-10 h-8 w-8 rounded-full shadow-sm"
          onClick={() => scroll("left")}
          aria-label="Scroll tags left">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      <div
        ref={scrollRef}
        className="no-scrollbar scrollbar-hide flex w-full gap-2 overflow-x-auto px-2 py-2"
        role="tablist"
        aria-orientation="horizontal">
        <div
          ref={(el) => (tagRefs.current[0] = el)}
          tabIndex={0}
          role="tab"
          aria-selected={selectedTags.length === 0}
          onKeyDown={(e) => handleKeyDown(e, 0)}
          className={cn(
            "cursor-pointer whitespace-nowrap transition-all hover:opacity-80",
            "focus-visible:outline-ring rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          )}>
          <Badge
            variant={selectedTags.length === 0 ? "default" : "outline"}
            onClick={() => {
              if (selectedTags.length > 0) {
                // Clear all selected tags by calling onTagSelect with each selected tag
                selectedTags.forEach((tag) => onTagSelect(tag));
              }
            }}>
            All Topics
          </Badge>
        </div>

        {tags.map((tag, index) => (
          <div
            key={tag}
            ref={(el) => (tagRefs.current[index + 1] = el)}
            tabIndex={0}
            role="tab"
            aria-selected={selectedTags.includes(tag)}
            onKeyDown={(e) => handleKeyDown(e, index + 1)}
            className={cn(
              "cursor-pointer whitespace-nowrap transition-all hover:opacity-80",
              "focus-visible:outline-ring rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            )}>
            <Badge
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              onClick={() => onTagSelect(tag)}>
              {tag}
            </Badge>
          </div>
        ))}
      </div>

      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="bg-background/90 absolute right-0 z-10 h-8 w-8 rounded-full shadow-sm"
          onClick={() => scroll("right")}
          aria-label="Scroll tags right">
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

export default TagFilter;
