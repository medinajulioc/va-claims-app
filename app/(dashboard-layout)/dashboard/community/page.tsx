"use client";

import { useState, useEffect } from "react";
import { CommunityProvider } from "@/app/community/lib/community-provider";
import PostList from "@/app/community/components/shared/PostList";
import PostSorting from "@/app/community/components/shared/PostSorting";
import CreatePostCard from "@/app/community/components/shared/CreatePostCard";
import CommunitySidebar from "@/app/community/components/shared/CommunitySidebar";
import TagFilter from "@/app/community/components/shared/TagFilter";
import NotificationIndicator from "@/app/community/components/NotificationIndicator";
import ForYouFeed from "@/app/community/components/ForYouFeed";
import BreadcrumbNavigation from "@/app/community/components/BreadcrumbNavigation";
import TrendingTopics from "@/app/community/components/TrendingTopics";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SearchIcon } from "lucide-react";
import { CreatePostProvider } from "@/app/community/components/CreatePostProvider";
import { usePosts } from "@/app/community/lib/mock-data-adapter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardCommunityPage() {
  const [sortOption, setSortOption] = useState<"hot" | "new" | "top">("hot");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week" | "month" | "year">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "for-you">("all");

  // Get all posts to extract available tags
  const { data: posts } = usePosts();

  // Extract unique tags from all posts
  useEffect(() => {
    const tagSet = new Set<string>();

    posts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => tagSet.add(tag));
      }
    });

    // Sort tags alphabetically
    const sortedTags = Array.from(tagSet).sort();
    setAvailableTags(sortedTags);
  }, [posts]);

  // Toggle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <CommunityProvider>
      <CreatePostProvider>
        <div className="container max-w-full px-4 py-6 md:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <div className="mb-4">
            <BreadcrumbNavigation />
          </div>

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-3 text-4xl font-bold">Community</h1>
              <p className="text-muted-foreground text-lg">
                Explore discussions and connect with others
              </p>
            </div>
            <div className="flex items-center">
              <NotificationIndicator />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Main content area - takes more space */}
            <div className="space-y-6 lg:col-span-3">
              {/* Search and sort controls - now sticky */}
              <div className="bg-background/95 sticky top-0 z-20 -mx-4 px-4 py-3 backdrop-blur-sm transition-all sm:rounded-xl md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1">
                    <SearchIcon className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-11 w-full pl-10 text-base shadow-sm transition-shadow focus-visible:shadow-md"
                      aria-label="Search posts"
                    />
                  </div>

                  <PostSorting
                    currentSort={sortOption}
                    onSortChange={setSortOption}
                    currentTimeFilter={timeFilter}
                    onTimeFilterChange={setTimeFilter}
                    className="flex-shrink-0"
                  />
                </div>

                {/* Feed type tabs */}
                <div className="mb-4">
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as "all" | "for-you")}
                    className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-2 sm:w-[300px]">
                      <TabsTrigger
                        value="all"
                        className="transition-all data-[state=active]:shadow-sm">
                        All Posts
                      </TabsTrigger>
                      <TabsTrigger
                        value="for-you"
                        className="transition-all data-[state=active]:shadow-sm">
                        For You
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Tag filtering - only show in All Posts tab */}
                {activeTab === "all" && (
                  <div className="mb-2">
                    <TagFilter
                      tags={availableTags}
                      selectedTags={selectedTags}
                      onTagSelect={handleTagSelect}
                    />
                  </div>
                )}
              </div>

              {/* Create post card */}
              <CreatePostCard className="mb-6 shadow-sm transition-shadow hover:shadow-md" />

              {/* Posts list - conditionally show either regular posts or personalized feed */}
              {activeTab === "all" ? (
                <div>
                  <PostList
                    sortOption={sortOption}
                    searchTerm={searchTerm}
                    timeFilter={timeFilter}
                    selectedTags={selectedTags}
                  />
                </div>
              ) : (
                <ForYouFeed />
              )}
            </div>

            {/* Sidebar - takes less space */}
            <div className="space-y-6">
              {/* About section - now above the sticky communities sidebar */}
              <Card className="border shadow-sm transition-shadow hover:shadow-md">
                <div className="border-b p-4">
                  <h3 className="text-lg font-semibold">About Community</h3>
                </div>
                <div className="p-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Welcome to our community platform! Connect with others, share ideas, and engage
                    in meaningful discussions about VA claims, benefits, and support.
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

              {/* Trending Topics section */}
              <TrendingTopics className="shadow-sm transition-shadow hover:shadow-md" />

              {/* Communities sidebar - now below the about section */}
              <div className="sticky top-24 z-10">
                <CommunitySidebar className="shadow-sm transition-shadow hover:shadow-md" />
              </div>
            </div>
          </div>
        </div>
      </CreatePostProvider>
    </CommunityProvider>
  );
}
