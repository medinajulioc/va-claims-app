"use client";

import Link from "next/link";
import { Community } from "../lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link href={`/community/${community.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        {community.bannerUrl && (
          <div
            className="h-32 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${community.bannerUrl})` }}
            aria-label={`${community.name} banner image`}
          />
        )}

        <div className="p-4">
          <div className="flex items-center gap-3">
            {community.imageUrl ? (
              <div
                className="h-12 w-12 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${community.imageUrl})` }}
                aria-label={`${community.name} community image`}
              />
            ) : (
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-lg">
                {community.name.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <h3 className="font-semibold">{community.name}</h3>
              <div className="text-muted-foreground flex items-center text-xs">
                <Users className="mr-1 h-3 w-3" />
                <span>{community.members} members</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">{community.description}</p>

          {community.tags && community.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {community.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {community.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{community.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
