"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRelativeTime, formatNumber } from "../lib/utils";
import { useVotePost } from "../lib/mock-data-adapter";
import { Post } from "../lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import PlaceholderImage from "./shared/PlaceholderImage";
import SavedPostButton from "./SavedPostButton";
import "./shared/CommunityLinks.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

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
  const [userVote, setUserVote] = useState<number>(0); // -1 for downvote, 0 for none, 1 for upvote
  const [isSharing, setIsSharing] = useState(false);
  const { votePost } = useVotePost();
  const placeholderVariant = getPlaceholderVariant(post.id);

  const handleVote = (value: number) => {
    try {
      // If clicking the same vote button, remove the vote
      if (userVote === value) {
        setVoteStatus(voteStatus - value);
        setUserVote(0);
        votePost(post.id, -value);
      } else {
        // If changing vote, adjust by the difference
        const adjustment = value - userVote;
        setVoteStatus(voteStatus + adjustment);
        setUserVote(value);
        votePost(post.id, adjustment);
      }

      // Reset error state if successful
      if (error) setError(null);
    } catch (err) {
      console.error("Error updating vote:", err);
      setError("Failed to update vote. Please try again.");

      // Revert local state on error
      setVoteStatus(post.voteStatus);
      setUserVote(0);
    }
  };

  const handleShare = () => {
    setIsSharing(true);

    // Simulate copying to clipboard
    navigator.clipboard
      .writeText(`${window.location.origin}/community/${post.communityId}/posts/${post.id}`)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          duration: 2000
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast({
          title: "Failed to copy link",
          variant: "destructive",
          duration: 2000
        });
      })
      .finally(() => {
        setTimeout(() => setIsSharing(false), 1000);
      });
  };

  return (
    <TooltipProvider>
      <Card className="overflow-hidden border bg-white/90 shadow-sm transition-all hover:shadow-md dark:bg-black/30">
        <div className="flex">
          {/* Vote buttons */}
          <div className="bg-muted/30 flex w-12 flex-col items-center border-r py-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleVote(1)}
                  size="sm"
                  variant="ghost"
                  className={cn("h-8 w-8 p-0 transition-colors", userVote === 1 && "text-primary")}
                  aria-label="Upvote">
                  <ChevronUp className={cn("h-5 w-5", userVote === 1 && "fill-primary")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Upvote</p>
              </TooltipContent>
            </Tooltip>

            <span
              className={cn(
                "my-1 font-medium transition-colors",
                userVote === 1 && "text-primary",
                userVote === -1 && "text-destructive"
              )}>
              {formatNumber(voteStatus)}
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleVote(-1)}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 p-0 transition-colors",
                    userVote === -1 && "text-destructive"
                  )}
                  aria-label="Downvote">
                  <ChevronDown className={cn("h-5 w-5", userVote === -1 && "fill-destructive")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Downvote</p>
              </TooltipContent>
            </Tooltip>
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
              <h2 className="hover:text-primary mb-2 text-xl font-semibold transition-colors">
                {post.title}
              </h2>
            </Link>

            <div className="mb-3 line-clamp-3">{post.content}</div>

            {post.imageUrl && (
              <div className="mb-3 overflow-hidden rounded-md">
                <PlaceholderImage
                  src={post.imageUrl}
                  alt={post.title}
                  type="post"
                  variant={placeholderVariant}
                  width={1280}
                  height={720}
                  className="transition-transform hover:scale-[1.02]"
                />
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-muted/50 hover:bg-muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {error && (
              <div className="text-destructive mb-3 flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              <Link
                href={`/community/${post.communityId}/posts/${post.id}`}
                className="action-link hover:bg-muted flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span>{formatNumber(post.commentCount)} comments</span>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-auto gap-1.5 px-2 py-1 transition-colors",
                  isSharing && "text-primary"
                )}
                onClick={handleShare}>
                <Share2 className={cn("h-4 w-4", isSharing && "text-primary")} />
                <span>Share</span>
              </Button>

              <SavedPostButton
                postId={post.id}
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1"
                showText={true}
              />
            </div>
          </CardContent>
        </div>
      </Card>
    </TooltipProvider>
  );
}
