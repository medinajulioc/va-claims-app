"use client";

import { useState } from "react";
import Link from "next/link";
import { usePosts, useCommunities } from "../lib/mock-data-adapter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock, MessageSquare } from "lucide-react";
import PlaceholderImage from "./shared/PlaceholderImage";
import { formatRelativeTime } from "../lib/utils";
import { cn } from "@/lib/utils";
import type { Post } from "../lib/types";

interface RelatedContentProps {
  currentPostId?: string;
  communityId?: string;
  tags?: string[];
  className?: string;
}

export function RelatedContent({
  currentPostId,
  communityId,
  tags = [],
  className = ""
}: RelatedContentProps) {
  const [activeTab, setActiveTab] = useState<"related" | "trending" | "recent">("related");
  const { data: posts } = usePosts();
  const { data: communities } = useCommunities();

  // Get community info
  const communityInfo = communityId ? communities.find((c) => c.id === communityId) : undefined;

  // Filter out current post
  const filteredPosts = posts.filter((post) => post.id !== currentPostId);

  // Get related posts based on active tab
  const getDisplayPosts = (): Post[] => {
    let selectedPosts: Post[] = [];

    if (activeTab === "related") {
      // Find posts with similar tags or in the same community
      selectedPosts = filteredPosts.filter((post) => {
        // Same community is a strong signal
        if (communityId && post.communityId === communityId) {
          return true;
        }

        // Tag overlap is also a good signal
        if (tags.length > 0 && post.tags && post.tags.length > 0) {
          return post.tags.some((tag) => tags.includes(tag));
        }

        return false;
      });
    } else if (activeTab === "trending") {
      // Sort by vote status (highest first)
      selectedPosts = [...filteredPosts].sort((a, b) => b.voteStatus - a.voteStatus);
    } else {
      // Sort by date (newest first)
      selectedPosts = [...filteredPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Return top 3 posts
    return selectedPosts.slice(0, 3);
  };

  const displayPosts = getDisplayPosts();

  // Get placeholder variant based on post ID
  const getPlaceholderVariant = (id: string): "default" | "blue" | "green" => {
    const lastChar = id.slice(-1);
    const charCode = lastChar.charCodeAt(0);
    return charCode % 3 === 0 ? "default" : charCode % 3 === 1 ? "blue" : "green";
  };

  return (
    <Card className={cn("overflow-hidden border shadow-sm", className)}>
      <CardHeader className="bg-muted/20 border-b p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Discover More</CardTitle>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
            <TabsList className="h-8 p-1">
              <TabsTrigger value="related" className="text-xs">
                <Sparkles className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Related</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-xs">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-xs">
                <Clock className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Recent</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {displayPosts.length > 0 ? (
          <div className="space-y-4">
            {displayPosts.map((post) => {
              const postCommunity = communities.find((c) => c.id === post.communityId);

              return (
                <Link
                  key={post.id}
                  href={`/community/${post.communityId}/posts/${post.id}`}
                  className="group block">
                  <div className="hover:bg-accent/10 flex gap-3 rounded-md p-2 transition-colors">
                    {post.imageUrl && (
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                        <PlaceholderImage
                          src={post.imageUrl}
                          alt={post.title}
                          width={64}
                          height={64}
                          type="post"
                          variant={getPlaceholderVariant(post.id)}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 space-y-1 overflow-hidden">
                      <h3 className="hover:text-primary line-clamp-1 font-medium transition-colors">
                        {post.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs">
                        {postCommunity && (
                          <Badge variant="outline" className="border-transparent px-1 py-0">
                            {postCommunity.name}
                          </Badge>
                        )}
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post.commentCount}
                        </span>
                        <span className="text-muted-foreground">
                          {formatRelativeTime(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No{" "}
            {activeTab === "related" ? "related" : activeTab === "trending" ? "trending" : "recent"}{" "}
            posts found
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RelatedContent;
