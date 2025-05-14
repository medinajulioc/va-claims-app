"use client";

import { useState } from "react";
import { CommunityProvider } from "./lib/community-provider";
import PostList from "./components/shared/PostList";
import PostSorting from "./components/shared/PostSorting";
import CreatePostCard from "./components/shared/CreatePostCard";
import CommunitySidebar from "./components/shared/CommunitySidebar";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function CommunityPage() {
  const [sortOption, setSortOption] = useState<"hot" | "new" | "top">("hot");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <CommunityProvider>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">Explore discussions and connect with others</p>
        </div>

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
            <CreatePostCard />

            {/* Posts list */}
            <PostList sortOption={sortOption} searchTerm={searchTerm} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CommunitySidebar />

            {/* About section */}
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">About Community</h3>
              <p className="text-muted-foreground text-sm">
                Welcome to our community platform! Connect with others, share ideas, and engage in
                meaningful discussions.
              </p>

              <div className="mt-4 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Created</span>
                  <span>Jan 2023</span>
                </div>
                <div className="flex items-center justify-between border-t py-1">
                  <span className="text-muted-foreground">Members</span>
                  <span>5.2k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </CommunityProvider>
  );
}
