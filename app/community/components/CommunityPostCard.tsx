import React from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Post } from "../lib/types";

interface CommunityPostCardProps {
  post: Post;
  className?: string;
}

export function CommunityPostCard({ post, className }: CommunityPostCardProps) {
  // Format the post date
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <div
      className={cn(
        "bg-card overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md",
        className
      )}>
      <div className="flex flex-col md:flex-row">
        {post.imageUrl && (
          <div className="relative h-48 w-full md:h-auto md:w-1/3">
            <Link href={`/community/${post.communityId}/posts/${post.id}`}>
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </Link>
          </div>
        )}

        <div className={cn("flex flex-1 flex-col p-4", !post.imageUrl && "w-full")}>
          <div className="mb-2">
            {post.tags && post.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {post.tags.map((tag, index) => (
                  <Badge variant="secondary" key={index} className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Link href={`/community/${post.communityId}/posts/${post.id}`}>
              <h3 className="hover:text-primary line-clamp-2 text-xl font-semibold transition-colors">
                {post.title}
              </h3>
            </Link>
          </div>

          <div className="text-muted-foreground mb-4 line-clamp-3 text-sm">
            {typeof post.content === "string" ? post.content : JSON.stringify(post.content)}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link href={`/profile/${post.author.id}`}>
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="mr-2 h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-primary text-primary-foreground mr-2 flex h-6 w-6 items-center justify-center rounded-full text-xs">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
              <span className="text-muted-foreground text-xs">
                Posted by{" "}
                <Link href={`/profile/${post.author.id}`} className="font-medium hover:underline">
                  {post.author.name}
                </Link>{" "}
                • {formattedDate}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Like</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MessageCircle className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
