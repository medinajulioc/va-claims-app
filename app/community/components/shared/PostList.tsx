"use client";

import { useState, useEffect } from "react";
import { usePosts, useCommunities } from "../../lib/mock-data-adapter";
import PostCard from "../PostCard";
import { Card } from "@/components/ui/card";
import { MessageSquareOff, Search, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "../../lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface PostListProps {
  communityId?: string; // Optional to filter by community
  limit?: number; // Optional to limit number of posts
  sortOption?: "hot" | "new" | "top";
  searchTerm?: string; // Optional search term
  timeFilter?: "all" | "today" | "week" | "month" | "year"; // Optional time filter
  selectedTags?: string[]; // Optional selected tags for filtering
  customPosts?: Post[]; // Optional custom posts list for For You feed
}

// Enhanced skeleton loader for posts
function PostCardSkeleton() {
  // Generate a random width to make the skeleton more natural
  const randomWidth = (min: number, max: number) =>
    `${Math.floor(Math.random() * (max - min + 1)) + min}%`;

  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="flex">
        {/* Vote buttons skeleton */}
        <div className="bg-muted/30 flex w-12 flex-col items-center border-r py-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="my-2 h-5 w-6" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Post content skeleton */}
        <div className="flex-1 p-5">
          <div className="mb-3 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-1.5 h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="mb-3 h-7 w-3/4" />
          <div className="mb-5 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function PostList({
  communityId,
  limit,
  sortOption = "hot",
  searchTerm = "",
  timeFilter = "all",
  selectedTags = [],
  customPosts
}: PostListProps) {
  // Get posts and communities from our mock data adapter
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: communities } = useCommunities();

  // State for progressive loading
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(5);
  }, [sortOption, searchTerm, timeFilter, selectedTags, communityId, customPosts]);

  // Use custom posts if provided, otherwise filter and sort the posts
  let filteredPosts: Post[] = [];

  if (customPosts) {
    filteredPosts = customPosts;
  } else {
    // Filter posts by community if provided
    filteredPosts = communityId ? posts.filter((post) => post.communityId === communityId) : posts;

    // Filter by search term if provided
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerSearchTerm) ||
          post.content.toLowerCase().includes(lowerSearchTerm) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Filter by tags if any are selected
    if (selectedTags.length > 0) {
      filteredPosts = filteredPosts.filter((post) => {
        // Skip posts without tags
        if (!post.tags || post.tags.length === 0) return false;

        // Check if any of the post's tags match any of the selected tags
        return post.tags.some((tag) =>
          selectedTags.some((selectedTag) => tag.toLowerCase() === selectedTag.toLowerCase())
        );
      });
    }

    // Filter by time if provided
    if (timeFilter !== "all") {
      const now = new Date();
      let cutoffDate: Date;

      switch (timeFilter) {
        case "today":
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          cutoffDate = new Date(0); // Beginning of time
      }

      filteredPosts = filteredPosts.filter((post) => new Date(post.createdAt) >= cutoffDate);
    }

    // Sort posts based on sortOption (skip if using customPosts)
    filteredPosts = [...filteredPosts].sort((a, b) => {
      if (sortOption === "new") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === "top") {
        return b.voteStatus - a.voteStatus;
      } else {
        // "hot" - combination of recency and votes
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        const aScore = a.voteStatus * 0.7 + (aDate / 1000 / 3600) * 0.3;
        const bScore = b.voteStatus * 0.7 + (bDate / 1000 / 3600) * 0.3;
        return bScore - aScore;
      }
    });
  }

  // Handler for loading more posts
  const handleLoadMore = () => {
    setIsLoadingMore(true);

    // Simulate network delay
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
      setIsLoadingMore(false);
    }, 800);
  };

  // Get community names for display
  const communityMap = Object.fromEntries(
    communities.map((community) => [community.id, community.name])
  );

  // Initial loading state
  if (postsLoading && !customPosts) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // No posts found state
  if (filteredPosts.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-4 border p-8 text-center shadow-sm">
        {searchTerm || selectedTags.length > 0 ? (
          <>
            <Search className="text-muted-foreground h-12 w-12" />
            <h3 className="text-xl font-semibold">No matching posts found</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {searchTerm && selectedTags.length > 0 ? (
                <>
                  We couldn't find any posts matching "{searchTerm}" with the selected tags. Try
                  different keywords or tags.
                </>
              ) : searchTerm ? (
                <>
                  We couldn't find any posts matching "{searchTerm}". Try different keywords or
                  browse all posts.
                </>
              ) : (
                <>
                  We couldn't find any posts with the selected tags. Try selecting different tags or
                  browse all posts.
                </>
              )}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Clear Filters
            </Button>
          </>
        ) : customPosts ? (
          <>
            <MessageSquareOff className="text-muted-foreground h-12 w-12" />
            <h3 className="text-xl font-semibold">No personalized posts</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              We couldn't find any posts matching your interests. Try joining more communities or
              exploring different topics.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Explore Communities
            </Button>
          </>
        ) : (
          <>
            <MessageSquareOff className="text-muted-foreground h-12 w-12" />
            <h3 className="text-xl font-semibold">No posts yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {communityId
                ? "This community doesn't have any posts yet. Be the first to start a conversation!"
                : "There are no posts to display. Create a post to get the conversation started!"}
            </p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </>
        )}
      </Card>
    );
  }

  // Select posts based on limit or display count
  const displayPosts = limit ? filteredPosts.slice(0, limit) : filteredPosts.slice(0, displayCount);

  const hasMoreToLoad = !limit && displayCount < filteredPosts.length;

  // Display posts
  return (
    <div className="space-y-6">
      {displayPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          communityName={!communityId ? communityMap[post.communityId] : undefined}
        />
      ))}

      {/* Load more button */}
      {hasMoreToLoad && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            className="w-full max-w-xs"
            disabled={isLoadingMore}
            onClick={handleLoadMore}>
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              `Load More (${filteredPosts.length - displayCount} remaining)`
            )}
          </Button>
        </div>
      )}

      {/* Show loading skeletons while loading more */}
      {isLoadingMore && (
        <div className="space-y-6 pt-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <PostCardSkeleton key={`more-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}
