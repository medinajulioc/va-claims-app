import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "../lib/types";

interface CommunityMemberCardProps {
  member: User;
  className?: string;
}

export function CommunityMemberCard({ member, className }: CommunityMemberCardProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-lg border p-3 shadow-sm transition-all hover:shadow-md",
        className
      )}>
      <Link href={`/profile/${member.id}`} className="flex items-center">
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="mr-3 h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="bg-primary text-primary-foreground mr-3 flex h-10 w-10 items-center justify-center rounded-full">
            {member.name.charAt(0).toUpperCase()}
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/profile/${member.id}`} className="hover:underline">
          <p className="truncate font-medium">{member.name}</p>
        </Link>
        <div className="text-muted-foreground flex items-center text-xs">
          {member.role === "moderator" && (
            <div className="mr-2 flex items-center text-amber-500">
              <Award className="mr-1 h-3 w-3" />
              <span>Moderator</span>
            </div>
          )}
          {member.joinedAt && <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>}
        </div>
      </div>

      <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 rounded-full">
        <UserPlus className="h-4 w-4" />
        <span className="sr-only">Follow</span>
      </Button>
    </div>
  );
}
