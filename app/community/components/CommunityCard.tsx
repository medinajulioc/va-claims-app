"use client";

import Link from "next/link";
import { Community } from "../lib/types";
import { formatNumber } from "../lib/utils";

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  // Safely access community properties with nullish coalescing
  const {
    id = "",
    name = "Unnamed Community",
    description = "No description available",
    members = 0,
    imageUrl,
    tags = []
  } = community || {};

  // Get community initials for fallback image
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Link href={`/community/${id}`} className="block h-full" aria-label={`View ${name} community`}>
      <div className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="relative h-32 bg-gray-100 dark:bg-gray-700">
          {imageUrl ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
              role="img"
              aria-label={`${name} community banner`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
              <span className="text-2xl font-bold text-white">{initials || "??"}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
          <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>{formatNumber(members)} members</span>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    +{tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
