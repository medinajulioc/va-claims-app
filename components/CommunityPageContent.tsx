"use client";

import { useState, useEffect, useCallback } from "react";
import { useRecoilValueCompat } from "@/app/community/lib/recoil-compat";
import CommunityCard from "@/app/community/components/CommunityCard";
import type { Community } from "@/app/community/lib/types";

export default function CommunityPageContent() {
  // State with proper typing
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);

  // Use our compatibility hook with proper typing
  const recoilCommunities = useRecoilValueCompat<Community[]>({ key: "communitiesState" });

  // Handle data loading and errors in useEffect
  useEffect(() => {
    // Short timeout to ensure hydration is complete
    const timer = setTimeout(() => {
      try {
        if (Array.isArray(recoilCommunities) && recoilCommunities.length > 0) {
          setCommunities(recoilCommunities);
          setError(null);
        } else {
          setError("Unable to load communities. Please try refreshing the page.");
        }
      } catch (err) {
        console.error("Error loading communities:", err);
        setError("An error occurred while loading communities.");
      } finally {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [recoilCommunities]);

  // Memoized filter function for better performance
  const filteredCommunities = useCallback(() => {
    if (!communities.length) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    return communities.filter(
      (community) =>
        community?.name?.toLowerCase().includes(lowerSearchTerm) ||
        community?.description?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [communities, searchTerm])();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Communities</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join discussions with veterans and experts about VA claims, benefits, and more.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search communities"
            className="w-full rounded-lg border bg-white p-3 pl-10 dark:border-gray-700 dark:bg-gray-800"
          />
          <span className="absolute top-3 left-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>
      </div>

      {error && (
        <div
          className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          role="alert">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12" aria-label="Loading communities">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : (
        <>
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center" role="status">
              <p className="text-gray-500 dark:text-gray-400">
                No communities found matching your search.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
