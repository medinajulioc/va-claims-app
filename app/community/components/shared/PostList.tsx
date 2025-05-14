"use client";

import { usePosts, useCommunities } from "../../lib/mock-data-adapter";
import PostCard from "../PostCard";
import { Card } from "@/components/ui/card";
import { MessageSquareOff, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "../../lib/types";

interface PostListProps {
  communityId?: string; // Optional to filter by community
  limit?: number; // Optional to limit number of posts
  sortOption?: "hot" | "new" | "top";
  searchTerm?: string; // Optional search term
}

export default function PostList({
  communityId,
  limit,
  sortOption = "hot",
  searchTerm = ""
}: PostListProps) {
  // Get posts and communities from our mock data adapter
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: communities } = useCommunities();

  // Filter posts by community if provided
  let filteredPosts = communityId
    ? posts.filter((post) => post.communityId === communityId)
    : posts;

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

  // Sort posts based on sortOption
  const sortedPosts = [...filteredPosts].sort((a, b) => {
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

  // Apply limit if provided
  const displayPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts;

  // Get community names for display
  const communityMap = Object.fromEntries(
    communities.map((community) => [community.id, community.name])
  );

  // Loading state
  if (postsLoading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // No posts found state
  if (displayPosts.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-4 border p-8 text-center shadow-sm">
        {searchTerm ? (
          <>
            <Search className="text-muted-foreground h-12 w-12" />
            <h3 className="text-xl font-semibold">No matching posts found</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              We couldn't find any posts matching "{searchTerm}". Try different keywords or browse
              all posts.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Clear Search
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
    </div>
  );
}
