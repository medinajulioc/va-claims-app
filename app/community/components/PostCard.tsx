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
import PlaceholderImage from "./shared/PlaceholderImage";
import "./shared/CommunityLinks.css";

interface PostCardProps {
  post: Post;
  communityName?: string; // Optional community name for display
}

// Function to determine a consistent placeholder variant based on post ID
function getPlaceholderVariant(
  postId: string
): "default" | "blue" | "green" | "amber" | "red" | "purple" {
  // Use the last character of the post ID to determine variant
  const lastChar = postId.slice(-1);
  const charCode = lastChar.charCodeAt(0);

  switch (charCode % 6) {
    case 0:
      return "default";
    case 1:
      return "blue";
    case 2:
      return "green";
    case 3:
      return "amber";
    case 4:
      return "red";
    case 5:
      return "purple";
    default:
      return "default";
  }
}

export default function PostCard({ post, communityName }: PostCardProps) {
  const [error, setError] = useState<string | null>(null);
  const [voteStatus, setVoteStatus] = useState(post.voteStatus);
  const { votePost } = useVotePost();
  const placeholderVariant = getPlaceholderVariant(post.id);

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
    <Card className="overflow-hidden border bg-white/90 shadow-sm dark:bg-black/30">
      <div className="flex">
        {/* Vote buttons */}
        <div className="bg-muted/30 flex w-12 flex-col items-center border-r py-3">
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
              <Link href={`/community/${post.communityId}`} className="community-link">
                <Badge variant="outline" className="hover:bg-secondary">
                  {communityName}
                </Badge>
              </Link>
            )}
            <span>Posted by {post.username}</span>
            <span className="mx-1">•</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>

          <Link
            href={`/community/${post.communityId}/posts/${post.id}`}
            className="post-title-link block">
            <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
          </Link>

          <div className="mb-3 line-clamp-3">{post.content}</div>

          {post.imageUrl && (
            <div className="mb-3">
              <PlaceholderImage
                src={post.imageUrl}
                alt={post.title}
                type="post"
                variant={placeholderVariant}
                width={1280}
                height={720}
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
              className="action-link flex items-center gap-1.5 rounded-md px-2 py-1">
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
