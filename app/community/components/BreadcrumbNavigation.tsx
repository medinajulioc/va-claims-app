"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
  homeHref?: string;
  homeLabel?: string;
  items?: {
    href?: string;
    label: string;
    current?: boolean;
  }[];
}

export function BreadcrumbNavigation({
  className,
  homeHref = "/dashboard/community",
  homeLabel = "Community",
  items = []
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // If no items are provided, generate them from the pathname
  const breadcrumbItems =
    items.length > 0 ? items : generateBreadcrumbsFromPath(pathname, homeHref, homeLabel);

  return (
    <nav className={cn("flex text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="text-muted-foreground mx-1 h-4 w-4" aria-hidden="true" />
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  {index === 0 && <Home className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-1",
                    isLast ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                  aria-current={isLast ? "page" : undefined}>
                  {index === 0 && <Home className="h-3.5 w-3.5" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Helper function to generate breadcrumbs from path
function generateBreadcrumbsFromPath(pathname: string, homeHref: string, homeLabel: string) {
  // Start with home
  const breadcrumbs = [{ href: homeHref, label: homeLabel }];

  // Skip if we're on the home page
  if (pathname === homeHref) {
    return breadcrumbs;
  }

  // Split the path and process each segment
  const pathSegments = pathname
    .replace(/^\/dashboard\/community/, "") // Remove the base path
    .split("/")
    .filter(Boolean);

  let currentPath = homeHref;

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Format the segment for display
    let label = segment;

    // Handle special cases
    if (segment === "posts") {
      label = "Posts";
    } else if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      // This looks like a UUID
      label = "Post Details";
    } else if (!isNaN(Number(segment))) {
      // This is a numeric ID
      if (pathSegments[index - 1] === "posts") {
        label = "Post Details";
      } else {
        label = "Community";
      }
    }

    // Add to breadcrumbs
    breadcrumbs.push({
      href: index < pathSegments.length - 1 ? currentPath : undefined,
      label,
      current: index === pathSegments.length - 1
    });
  });

  return breadcrumbs;
}

export default BreadcrumbNavigation;
