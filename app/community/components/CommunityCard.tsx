"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Community } from "../lib/types";

interface CommunityCardProps {
  community: Community;
  className?: string;
}

export function CommunityCard({ community, className }: CommunityCardProps) {
  // Format member count
  const memberCount = Array.isArray(community.members)
    ? community.members.length
    : community.members;

  // Format date
  const formattedDate = new Date(community.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short"
  });

  return (
    <div
      className={cn(
        "group bg-card overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md",
        className
      )}>
      <Link href={`/community/${community.id}`} className="block">
        <div
          className="from-primary/80 to-secondary/80 h-32 w-full bg-gradient-to-r bg-cover bg-center"
          style={community.bannerUrl ? { backgroundImage: `url(${community.bannerUrl})` } : {}}>
          {!community.bannerUrl && (
            <div className="flex h-full items-center justify-center">
              <span className="text-xl font-bold text-white/90">{community.name}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {community.imageUrl ? (
              <div
                className="border-background mr-3 h-12 w-12 rounded-full border-4 bg-cover bg-center"
                style={{ backgroundImage: `url(${community.imageUrl})` }}
              />
            ) : (
              <div className="bg-primary text-primary-foreground border-background mr-3 flex h-12 w-12 items-center justify-center rounded-full border-4 text-lg font-bold">
                {community.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <Link href={`/community/${community.id}`}>
              <h2 className="hover:text-primary truncate text-lg font-semibold transition-colors">
                {community.name}
              </h2>
            </Link>

            <div className="text-muted-foreground flex flex-wrap items-center text-xs">
              <div className="mr-3 flex items-center">
                <Users className="mr-1 h-3.5 w-3.5" />
                <span>{memberCount} members</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-1 h-3.5 w-3.5" />
                <span>Active since {formattedDate}</span>
              </div>
            </div>

            <p className="text-muted-foreground mt-2 line-clamp-2 text-xs">
              {community.description}
            </p>
          </div>
        </div>

        {community.tags && community.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {community.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
            {community.tags.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{community.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hover:bg-primary hover:text-primary-foreground w-full text-xs transition-colors duration-200">
            <Link href={`/community/${community.id}`}>View Community</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
