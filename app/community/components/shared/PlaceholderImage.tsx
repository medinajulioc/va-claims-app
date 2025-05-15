"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PlaceholderImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  type?: "post" | "avatar" | "banner";
  variant?: "default" | "blue" | "green" | "amber" | "red" | "purple";
}

export default function PlaceholderImage({
  src,
  alt,
  className = "max-h-60 w-full rounded-md object-cover",
  width = 600,
  height = 400,
  type = "post",
  variant = "default"
}: PlaceholderImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);

  // Get appropriate placeholder based on type and variant
  const getPlaceholder = (): string => {
    // For variant-specific placeholders
    if (variant !== "default") {
      if (type === "post") return `/images/community/post-placeholder-${variant}.svg`;
      if (type === "avatar")
        return `/images/community/community-placeholder-${variant === "blue" ? "blue" : "default"}.svg`;
      if (type === "banner")
        return `/images/community/community-banner-${variant === "blue" ? "blue" : "default"}.svg`;
    }

    // For default variants
    if (type === "post") return "/images/community/post-placeholder.svg";
    if (type === "avatar") return "/images/community/community-placeholder.svg";
    if (type === "banner") return "/images/community/community-banner.svg";

    // Fallback to generic placeholder
    return "/images/community/post-placeholder.svg";
  };

  // Reset the state when the src prop changes
  useEffect(() => {
    setImgSrc(src);
    setIsPlaceholder(false);
    setFallbackAttempted(false);
  }, [src]);

  const handleError = () => {
    if (!isPlaceholder) {
      // First error - use the specific placeholder
      const placeholder = getPlaceholder();
      setImgSrc(placeholder);
      setIsPlaceholder(true);
    } else if (!fallbackAttempted) {
      // If the placeholder itself fails, try the default SVG placeholder
      setImgSrc("/images/community/post-placeholder.svg");
      setFallbackAttempted(true);
    } else {
      // If even that fails, use null to trigger the inline fallback
      setImgSrc(undefined);
    }
  };

  // If we don't have a source or all placeholders failed
  if (!imgSrc || (fallbackAttempted && !imgSrc)) {
    return (
      <div className={`bg-secondary/40 flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M21 15l-5-5L5 21"></path>
          </svg>
          <span className="mt-2 text-xs">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      width={width}
      height={height}
    />
  );
}
