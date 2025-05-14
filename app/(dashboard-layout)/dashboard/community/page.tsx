"use client";

import { useState } from "react";
import { CommunityProvider } from "@/app/community/lib/community-provider";
import PostList from "@/app/community/components/shared/PostList";
import PostSorting from "@/app/community/components/shared/PostSorting";
import CreatePostCard from "@/app/community/components/shared/CreatePostCard";
import CommunitySidebar from "@/app/community/components/shared/CommunitySidebar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SearchIcon } from "lucide-react";

export default function DashboardCommunityPage() {
  const [sortOption, setSortOption] = useState<"hot" | "new" | "top">("hot");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <CommunityProvider>
      <div className="container max-w-full px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-bold">Community</h1>
          <p className="text-muted-foreground text-lg">
            Explore discussions and connect with others
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main content area - takes more space */}
          <div className="space-y-6 lg:col-span-3">
            {/* Search and sort controls */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <SearchIcon className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full pl-10 text-base"
                />
              </div>

              <PostSorting
                currentSort={sortOption}
                onSortChange={setSortOption}
                className="flex-shrink-0"
              />
            </div>

            {/* Create post card */}
            <CreatePostCard className="mb-6" />

            {/* Posts list */}
            <div>
              <PostList sortOption={sortOption} searchTerm={searchTerm} />
            </div>
          </div>

          {/* Sidebar - takes less space */}
          <div className="space-y-6">
            {/* About section - now above the sticky communities sidebar */}
            <Card className="border shadow-sm">
              <div className="border-b p-4">
                <h3 className="text-lg font-semibold">About Community</h3>
              </div>
              <div className="p-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Welcome to our community platform! Connect with others, share ideas, and engage in
                  meaningful discussions about VA claims, benefits, and support.
                </p>

                <div className="mt-4 space-y-0 text-sm">
                  <div className="flex items-center justify-between border-t py-3">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">Jan 2023</span>
                  </div>
                  <div className="flex items-center justify-between border-t py-3">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-medium">5,200</span>
                  </div>
                  <div className="flex items-center justify-between border-t py-3">
                    <span className="text-muted-foreground">Daily Posts</span>
                    <span className="font-medium">42</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Communities sidebar - now below the about section */}
            <div className="bg-background sticky top-6 z-10">
              <CommunitySidebar />
            </div>
          </div>
        </div>
      </div>
    </CommunityProvider>
  );
}
