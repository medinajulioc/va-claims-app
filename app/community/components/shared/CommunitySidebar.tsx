"use client";

import { useState } from "react";
import Link from "next/link";
import { useCommunities, useCurrentUser } from "../../lib/mock-data-adapter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  SearchIcon,
  TrendingUp,
  Users,
  MessageSquare,
  Check,
  UserPlus,
  Bookmark
} from "lucide-react";
import { Input } from "@/components/ui/input";
import PlaceholderImage from "./PlaceholderImage";
import "./CommunityLinks.css";
import { useCreatePostModal } from "../CreatePostProvider";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

// Improved function to categorize communities based on tags
function categorizeCommunities(communities: any[]) {
  const categories: Record<string, any[]> = {
    "Disability Claims": [],
    Healthcare: [],
    "Benefits & Education": [],
    "Mental Health": [],
    "Transition Support": [],
    "Family & Caregivers": [],
    "General Discussion": []
  };

  communities.forEach((community) => {
    if (!community.tags || community.tags.length === 0) {
      categories["General Discussion"].push(community);
      return;
    }

    const tags = community.tags.map((tag: string) => tag.toLowerCase());

    if (
      tags.some(
        (tag: string) =>
          tag.includes("disability") || tag.includes("claim") || tag.includes("rating")
      )
    ) {
      categories["Disability Claims"].push(community);
    } else if (
      tags.some(
        (tag: string) =>
          tag.includes("health") ||
          tag.includes("medical") ||
          tag.includes("care") ||
          tag.includes("treatment")
      )
    ) {
      categories["Healthcare"].push(community);
    } else if (
      tags.some(
        (tag: string) =>
          tag.includes("benefit") ||
          tag.includes("education") ||
          tag.includes("gi bill") ||
          tag.includes("scholarship")
      )
    ) {
      categories["Benefits & Education"].push(community);
    } else if (
      tags.some(
        (tag: string) =>
          tag.includes("mental") ||
          tag.includes("ptsd") ||
          tag.includes("depression") ||
          tag.includes("anxiety")
      )
    ) {
      categories["Mental Health"].push(community);
    } else if (
      tags.some(
        (tag: string) =>
          tag.includes("transition") ||
          tag.includes("civilian") ||
          tag.includes("employment") ||
          tag.includes("job")
      )
    ) {
      categories["Transition Support"].push(community);
    } else if (
      tags.some(
        (tag: string) =>
          tag.includes("family") ||
          tag.includes("spouse") ||
          tag.includes("caregiver") ||
          tag.includes("dependent")
      )
    ) {
      categories["Family & Caregivers"].push(community);
    } else {
      categories["General Discussion"].push(community);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach((key) => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
}

export default function CommunitySidebar({ className = "" }: CommunitySidebarProps) {
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"popular" | "categories" | "joined">("popular");
  const { data: communities, isLoading } = useCommunities();
  const { user } = useCurrentUser();
  const { openCreatePostModal } = useCreatePostModal();

  // Filter communities based on search input
  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(filter.toLowerCase()) ||
      community.description.toLowerCase().includes(filter.toLowerCase()) ||
      (community.tags &&
        community.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())))
  );

  // Get user's joined communities
  const joinedCommunities = filteredCommunities.filter((community) =>
    user?.joinedCommunities?.includes(community.id)
  );

  // Sort by member count for "Popular" display
  const sortedCommunities = [...filteredCommunities].sort((a, b) => b.members - a.members);

  // Categorize communities for the categories tab
  const categorizedCommunities = categorizeCommunities(filteredCommunities);

  // Generate random activity metrics for visual indicators
  const getActivityMetric = (communityId: string): "high" | "medium" | "low" => {
    const id = parseInt(communityId, 10) || 0;
    const value = (id * 7) % 3;
    return value === 0 ? "high" : value === 1 ? "medium" : "low";
  };

  // Check if user has joined a community
  const hasJoined = (communityId: string): boolean => {
    return user?.joinedCommunities?.includes(communityId) || false;
  };

  // Mock function to join/leave a community (would be replaced with real API call)
  const toggleJoinCommunity = (communityId: string, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation(); // Prevent event bubbling

    // In a real implementation, this would call an API
    console.log(`Toggle join status for community ${communityId}`);

    // For now, just log the action that would happen
    if (hasJoined(communityId)) {
      console.log(`User would leave community ${communityId}`);
    } else {
      console.log(`User would join community ${communityId}`);
    }
  };

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

      <div className="border-b p-2">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "popular" | "categories" | "joined")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="popular" className="text-xs">
              Popular
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs">
              Categories
            </TabsTrigger>
            <TabsTrigger value="joined" className="text-xs">
              Joined
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : (
        <div className="scrollbar-thin max-h-[400px] overflow-y-auto p-2">
          {activeTab === "popular" &&
            (sortedCommunities.length > 0 ? (
              <div className="space-y-1">
                {sortedCommunities.map((community) => {
                  const variant = getPlaceholderVariant(community.id);
                  const activity = getActivityMetric(community.id);
                  const isJoined = hasJoined(community.id);

                  return (
                    <TooltipProvider key={community.id}>
                      <Link
                        href={`/community/${community.id}`}
                        className="community-link hover:bg-accent/20 group flex items-center gap-3 rounded-md p-2.5 transition-all hover:shadow-sm">
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

                          {/* Activity indicator */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "absolute right-0 bottom-0 h-3 w-3 rounded-full border border-white",
                                  activity === "high"
                                    ? "bg-green-500"
                                    : activity === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-gray-400"
                                )}></div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs">
                              {activity === "high"
                                ? "Very active"
                                : activity === "medium"
                                  ? "Moderately active"
                                  : "Low activity"}
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate leading-tight font-medium">{community.name}</p>
                          <div className="text-muted-foreground flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {community.members.toLocaleString()}
                            </span>

                            {/* Random post count based on community id */}
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {((parseInt(community.id) * 17) % 100) + 5}
                            </span>
                          </div>
                        </div>

                        {/* Join/Leave button */}
                        <Button
                          variant={isJoined ? "ghost" : "outline"}
                          size="sm"
                          className={cn(
                            "h-8 px-2 opacity-0 transition-opacity group-hover:opacity-100",
                            isJoined && "text-green-600"
                          )}
                          onClick={(e) => toggleJoinCommunity(community.id, e)}>
                          {isJoined ? (
                            <Check className="mr-1 h-4 w-4" />
                          ) : (
                            <UserPlus className="mr-1 h-4 w-4" />
                          )}
                          <span className="sr-only md:not-sr-only md:inline-block">
                            {isJoined ? "Joined" : "Join"}
                          </span>
                        </Button>

                        {/* Trending indicator for some communities */}
                        {parseInt(community.id) % 3 === 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-primary hidden group-hover:flex">
                                <TrendingUp className="h-4 w-4" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs">
                              Trending community
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </Link>
                    </TooltipProvider>
                  );
                })}
              </div>
            ) : (
              <div className="bg-muted/30 m-2 rounded-md p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {filter ? "No communities found matching your search." : "No communities found."}
                </p>
              </div>
            ))}

          {activeTab === "categories" && (
            <div className="space-y-4">
              {Object.entries(categorizedCommunities).map(([category, comms]) => (
                <div key={category} className="space-y-1">
                  <div className="mb-1 px-2 py-1">
                    <Badge variant="outline" className="bg-muted/50 font-medium">
                      {category}
                    </Badge>
                  </div>

                  {comms.map((community) => {
                    const variant = getPlaceholderVariant(community.id);
                    const isJoined = hasJoined(community.id);

                    return (
                      <Link
                        key={community.id}
                        href={`/community/${community.id}`}
                        className="community-link hover:bg-accent/20 group flex items-center gap-2 rounded-md p-2 transition-all hover:shadow-sm">
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border">
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
                            <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs">
                              {community.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm leading-tight">{community.name}</p>
                        </div>

                        {/* Join/Leave button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100",
                            isJoined ? "text-green-600" : "text-gray-500"
                          )}
                          onClick={(e) => toggleJoinCommunity(community.id, e)}>
                          {isJoined ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <UserPlus className="h-4 w-4" />
                          )}
                          <span className="sr-only">{isJoined ? "Joined" : "Join"}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {activeTab === "joined" &&
            (joinedCommunities.length > 0 ? (
              <div className="space-y-1">
                {joinedCommunities.map((community) => {
                  const variant = getPlaceholderVariant(community.id);
                  const activity = getActivityMetric(community.id);

                  return (
                    <TooltipProvider key={community.id}>
                      <Link
                        href={`/community/${community.id}`}
                        className="community-link hover:bg-accent/20 group flex items-center gap-3 rounded-md p-2.5 transition-all hover:shadow-sm">
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

                          {/* Activity indicator */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "absolute right-0 bottom-0 h-3 w-3 rounded-full border border-white",
                                  activity === "high"
                                    ? "bg-green-500"
                                    : activity === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-gray-400"
                                )}></div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs">
                              {activity === "high"
                                ? "Very active"
                                : activity === "medium"
                                  ? "Moderately active"
                                  : "Low activity"}
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate leading-tight font-medium">{community.name}</p>
                          <div className="text-muted-foreground flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {community.members.toLocaleString()}
                            </span>

                            {/* Random post count based on community id */}
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {((parseInt(community.id) * 17) % 100) + 5}
                            </span>
                          </div>
                        </div>

                        {/* Leave button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-green-600 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={(e) => toggleJoinCommunity(community.id, e)}>
                          <Check className="mr-1 h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:inline-block">Joined</span>
                        </Button>
                      </Link>
                    </TooltipProvider>
                  );
                })}
              </div>
            ) : (
              <div className="bg-muted/30 m-2 rounded-md p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {filter
                    ? "No joined communities found matching your search."
                    : "You haven't joined any communities yet."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setActiveTab("popular")}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Find communities to join
                </Button>
              </div>
            ))}
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
