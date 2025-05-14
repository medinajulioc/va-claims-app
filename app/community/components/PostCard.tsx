"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRelativeTime, formatNumber } from "../lib/utils";
import { useVotePost } from "../lib/mock-data-adapter";
import { Post } from "../lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2, Bookmark, ChevronUp, ChevronDown } from "lucide-react";

interface PostCardProps {
  post: Post;
  communityName?: string; // Optional community name for display
}

export default function PostCard({ post, communityName }: PostCardProps) {
  const [error, setError] = useState<string | null>(null);
  const [voteStatus, setVoteStatus] = useState(post.voteStatus);
  const { votePost } = useVotePost();

  const handleVote = (value: number) => {
    try {
      // Update local state immediately for responsive UI
      setVoteStatus((prev) => prev + value);

      // Update in mock data store
      votePost(post.id, value);

      // Reset error state if successful
      if (error) setError(null);
    } catch (err) {
      console.error("Error updating vote:", err);
      setError("Failed to update vote. Please try again.");

      // Revert local state on error
      setVoteStatus(post.voteStatus);
    }
  };

  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="flex">
        {/* Vote buttons */}
        <div className="bg-muted/50 flex w-12 flex-col items-center border-r py-3">
          <Button
            onClick={() => handleVote(1)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Upvote">
            <ChevronUp className="h-5 w-5" />
          </Button>

          <span className="my-1 font-medium">{formatNumber(voteStatus)}</span>

          <Button
            onClick={() => handleVote(-1)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Downvote">
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>

        {/* Post content */}
        <CardContent className="flex-1 p-4">
          <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-2 text-xs">
            {communityName && (
              <Link href={`/community/${post.communityId}`}>
                <Badge variant="outline" className="hover:bg-secondary">
                  {communityName}
                </Badge>
              </Link>
            )}
            <span>Posted by {post.username}</span>
            <span className="mx-1">•</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>

          <Link href={`/community/${post.communityId}/posts/${post.id}`}>
            <h2 className="mb-2 text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400">
              {post.title}
            </h2>
          </Link>

          <div className="mb-3 line-clamp-3">{post.content}</div>

          {post.imageUrl && (
            <div className="mb-3">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="max-h-60 w-full rounded-md object-cover"
              />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <Link
              href={`/community/${post.communityId}/posts/${post.id}`}
              className="hover:text-foreground hover:bg-muted flex items-center gap-1.5 rounded-md px-2 py-1">
              <MessageSquare className="h-4 w-4" />
              <span>{formatNumber(post.commentCount)} comments</span>
            </Link>

            <Button variant="ghost" size="sm" className="h-auto gap-1.5 px-2 py-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>

            <Button variant="ghost" size="sm" className="h-auto gap-1.5 px-2 py-1">
              <Bookmark className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
