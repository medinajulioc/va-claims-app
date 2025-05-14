"use client";

import { useState } from "react";
import { useCommunities } from "../lib/mock-data-adapter";
import CommunityCard from "./CommunityCard";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface CommunitiesGridProps {
  limit?: number;
  className?: string;
}

export default function CommunitiesGrid({ limit, className = "" }: CommunitiesGridProps) {
  const [filter, setFilter] = useState("");
  const { data: communities, isLoading } = useCommunities();

  // Filter communities based on search input
  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(filter.toLowerCase()) ||
      community.description.toLowerCase().includes(filter.toLowerCase()) ||
      (community.tags &&
        community.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())))
  );

  // Apply limit if specified
  const displayCommunities = limit ? filteredCommunities.slice(0, limit) : filteredCommunities;

  return (
    <div className={className}>
      <div className="relative mb-6">
        <SearchIcon className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search communities..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : displayCommunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">
            {filter ? "No communities found matching your search." : "No communities found."}
          </p>
        </div>
      )}
    </div>
  );
}
