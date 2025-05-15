"use client";

import { useState } from "react";
import Link from "next/link";
import { useCommunities } from "../../lib/mock-data-adapter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import PlaceholderImage from "./PlaceholderImage";
import "./CommunityLinks.css";
import { useCreatePostModal } from "../CreatePostProvider";

interface CommunitySidebarProps {
  className?: string;
}

// Function to determine a consistent placeholder variant based on community ID
function getPlaceholderVariant(id: string): "default" | "blue" | "green" {
  const lastChar = id.slice(-1);
  const charCode = lastChar.charCodeAt(0);

  switch (charCode % 3) {
    case 0:
      return "default";
    case 1:
      return "blue";
    case 2:
      return "green";
    default:
      return "default";
  }
}

export default function CommunitySidebar({ className = "" }: CommunitySidebarProps) {
  const [filter, setFilter] = useState("");
  const { data: communities, isLoading } = useCommunities();
  const { openCreatePostModal } = useCreatePostModal();

  // Filter communities based on search input
  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(filter.toLowerCase()) ||
      community.description.toLowerCase().includes(filter.toLowerCase()) ||
      (community.tags &&
        community.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())))
  );

  // Sort by member count for "Popular" display
  const sortedCommunities = [...filteredCommunities].sort((a, b) => b.members - a.members);

  return (
    <Card className={`border bg-white/95 shadow-sm dark:bg-black/25 ${className}`}>
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Communities</h2>
          <Button size="sm" className="h-8 gap-1 px-3" onClick={() => openCreatePostModal()}>
            <PlusIcon className="h-4 w-4" />
            Create
          </Button>
        </div>

        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            type="text"
            placeholder="Find a community..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 focus-visible:ring-1"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : (
        <div className="scrollbar-thin max-h-[400px] overflow-y-auto p-2">
          {sortedCommunities.length > 0 ? (
            <div className="space-y-1">
              {sortedCommunities.map((community) => {
                const variant = getPlaceholderVariant(community.id);
                return (
                  <Link
                    key={community.id}
                    href={`/community/${community.id}`}
                    className="community-link hover:bg-accent/20 flex items-center gap-3 rounded-md p-2.5 transition-colors">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                      {community.imageUrl ? (
                        <PlaceholderImage
                          src={community.imageUrl}
                          alt={`${community.name} community image`}
                          className="h-full w-full object-cover"
                          width={800}
                          height={800}
                          type="avatar"
                          variant={variant}
                        />
                      ) : (
                        <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                          {community.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate leading-tight font-medium">{community.name}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {community.members.toLocaleString()} members
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-muted/30 m-2 rounded-md p-4 text-center">
              <p className="text-muted-foreground text-sm">
                {filter ? "No communities found matching your search." : "No communities found."}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="border-t p-4">
        <Link
          href="/community"
          className="community-link-accent flex items-center justify-center text-sm font-medium transition-colors hover:underline">
          View all communities
        </Link>
      </div>
    </Card>
  );
}
