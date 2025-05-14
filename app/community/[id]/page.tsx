"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useCommunities } from "../lib/mock-data-adapter";
import { CommunityProvider } from "../lib/community-provider";
import PostList from "../components/shared/PostList";
import PostSorting from "../components/shared/PostSorting";
import CreatePostCard from "../components/shared/CreatePostCard";
import CommunitySidebar from "../components/shared/CommunitySidebar";
import { Input } from "@/components/ui/input";
import { SearchIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CommunityDetailPageProps {
  params: {
    id: string;
  };
}

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { id } = params;
  const { data: communities, isLoading } = useCommunities();
  const [sortOption, setSortOption] = useState<"hot" | "new" | "top">("hot");
  const [searchTerm, setSearchTerm] = useState("");

  // Find the community by ID
  const community = communities.find((c) => c.id === id);

  // If community not found and not loading, show 404
  useEffect(() => {
    if (!isLoading && !community) {
      notFound();
    }
  }, [community, isLoading]);

  // Show loading state
  if (isLoading || !community) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <CommunityProvider>
      <main className="container mx-auto px-4 py-6">
        {/* Community header */}
        <Card className="mb-6 overflow-hidden">
          {community.bannerUrl && (
            <div
              className="h-32 w-full bg-cover bg-center sm:h-48"
              style={{ backgroundImage: `url(${community.bannerUrl})` }}
              aria-label={`${community.name} banner image`}
            />
          )}

          <div className="flex flex-col p-4 sm:flex-row sm:items-center">
            <div className="mb-4 flex items-center sm:mb-0">
              {community.imageUrl ? (
                <div
                  className="mr-4 h-16 w-16 rounded-full bg-cover bg-center sm:h-20 sm:w-20"
                  style={{ backgroundImage: `url(${community.imageUrl})` }}
                  aria-label={`${community.name} community image`}
                />
              ) : (
                <div className="bg-primary text-primary-foreground mr-4 flex h-16 w-16 items-center justify-center rounded-full text-xl sm:h-20 sm:w-20">
                  {community.name.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{community.name}</h1>
                <div className="text-muted-foreground flex items-center text-sm">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{community.members} members</span>
                </div>
              </div>
            </div>

            <Button className="ml-auto">Join</Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Main content area */}
          <div className="space-y-6 md:col-span-2 lg:col-span-3">
            {/* Search and sort controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <SearchIcon className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <PostSorting
                currentSort={sortOption}
                onSortChange={setSortOption}
                className="flex-shrink-0"
              />
            </div>

            {/* Create post card */}
            <CreatePostCard communityId={id} />

            {/* Posts list */}
            <PostList communityId={id} sortOption={sortOption} searchTerm={searchTerm} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About this community */}
            <Card className="p-4">
              <h3 className="mb-2 font-semibold">About {community.name}</h3>
              <p className="text-muted-foreground text-sm">{community.description}</p>

              <div className="mt-4 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(community.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between border-t py-1">
                  <span className="text-muted-foreground">Members</span>
                  <span>{community.members}</span>
                </div>
              </div>

              {community.rules && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="mb-2 font-medium">Community Rules</h4>
                  <ol className="list-decimal pl-4 text-sm">
                    {community.rules.map((rule, index) => (
                      <li key={index} className="mb-1">
                        {rule}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </Card>

            {/* Other communities */}
            <CommunitySidebar />
          </div>
        </div>
      </main>
    </CommunityProvider>
  );
}
