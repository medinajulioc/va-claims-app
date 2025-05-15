"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { Community } from "../lib/types";
import { currentUserState } from "../lib/recoilAtoms";
import { formatDate } from "../lib/utils";
import { useRecoilValueCompat } from "../lib/recoil-compat";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CommunityHeaderProps {
  community: Community;
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  const [error, setError] = React.useState<string | null>(null);

  // Use our compatibility hook with proper error handling
  let currentUser = null;

  try {
    currentUser = useRecoilValueCompat(currentUserState);

    // Reset error state if successful
    if (error) setError(null);
  } catch (err) {
    console.error("Failed to load user data:", err);
    // We'll handle the empty state gracefully
  }

  const isJoined = currentUser?.joinedCommunities?.includes(community.id);

  return (
    <div className="mb-6 overflow-hidden rounded-lg border shadow-sm">
      {community.bannerUrl && (
        <div
          className="h-32 w-full bg-cover bg-center sm:h-48"
          style={{ backgroundImage: `url(${community.bannerUrl})` }}
          aria-label={`${community.name} banner image`}
        />
      )}

      <div className="flex flex-col p-4 sm:flex-row sm:items-center">
        <div className="mb-4 flex items-center sm:mb-0">
          {community.imageUrl ? (
            <div
              className="mr-4 h-16 w-16 rounded-full bg-cover bg-center sm:h-20 sm:w-20"
              style={{ backgroundImage: `url(${community.imageUrl})` }}
              aria-label={`${community.name} community image`}
            />
          ) : (
            <div className="bg-primary text-primary-foreground mr-4 flex h-16 w-16 items-center justify-center rounded-full text-xl sm:h-20 sm:w-20">
              {community.name.substring(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{community.name}</h1>
            <div className="text-muted-foreground flex items-center text-sm">
              <Users className="mr-1 h-4 w-4" />
              <span>{community.members?.length || "0"} members</span>
            </div>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {community.description}
            </p>
          </div>
        </div>

        <Button className="ml-auto">Join</Button>
      </div>
    </div>
  );
}
