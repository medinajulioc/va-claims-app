"use client";

import { useState } from "react";
import { Community } from "../lib/types";
import { currentUserState } from "../lib/recoilAtoms";
import { formatDate } from "../lib/utils";
import { useRecoilValueCompat } from "../lib/recoil-compat";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CommunityHeaderProps {
  community: Community;
}

export default function CommunityHeader({ community }: CommunityHeaderProps) {
  const [error, setError] = useState<string | null>(null);

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
    <Card className="mb-6">
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600">
        {community.imageUrl && (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${community.imageUrl})` }}
          />
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold">{community.name}</h1>
            <p className="text-muted-foreground mb-4">{community.description}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {community.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="text-muted-foreground flex items-center text-sm">
              <div className="mr-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>{community.members} members</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Created {formatDate(community.createdAt)}</span>
              </div>
            </div>
          </div>

          {currentUser && (
            <Button
              variant={isJoined ? "outline" : "default"}
              className={isJoined ? "font-medium" : "font-medium"}>
              {isJoined ? "Joined" : "Join"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
