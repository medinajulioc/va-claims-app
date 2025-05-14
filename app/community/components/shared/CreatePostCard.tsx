"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCommunities, useCurrentUser } from "../../lib/mock-data-adapter";
import { useCommunityContext } from "../../lib/community-provider";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface CreatePostCardProps {
  communityId?: string; // Optional pre-selected community
  className?: string;
}

export default function CreatePostCard({ communityId, className = "" }: CreatePostCardProps) {
  const router = useRouter();
  const { isDashboard } = useCommunityContext();
  const { data: communities } = useCommunities();
  const { user: currentUser } = useCurrentUser();
  const [selectedCommunity, setSelectedCommunity] = useState(communityId || "");
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [postText, setPostText] = useState("");

  // Check if we're in development mode
  useEffect(() => {
    setIsDevelopment(
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    );
  }, []);

  // Handle creating a new post
  const handleCreatePost = () => {
    if (selectedCommunity) {
      router.push(`/community/${selectedCommunity}/posts/new`);
    } else if (communityId) {
      router.push(`/community/${communityId}/posts/new`);
    } else {
      router.push("/community/new");
    }
  };

  // If user is not logged in and not in development mode, show sign-in prompt
  if (!currentUser && !isDevelopment) {
    return (
      <Card className={`border shadow-sm ${className}`}>
        <div className="flex flex-col items-center gap-3 p-6">
          <p className="text-muted-foreground text-center">Sign in to create posts</p>
          <Link href="/dashboard/login/v1">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Get user initials for avatar fallback
  const userInitials = currentUser ? currentUser.username.substring(0, 2).toUpperCase() : "ME";

  // In development mode or when user is logged in, show post creation UI
  return (
    <Card className={`border shadow-sm ${className}`}>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/avatars/01.png" alt={currentUser?.username || "User"} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>

          <Input
            type="text"
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            onClick={handleCreatePost}
            className="bg-muted/50 text-foreground hover:bg-muted flex-1 cursor-pointer rounded-md border px-4 py-2.5 transition-colors"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!communityId && (
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="bg-background focus:ring-primary/20 rounded-md border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none">
              <option value="">Select community</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          )}

          <Button onClick={handleCreatePost} size="sm" className="ml-auto gap-1.5">
            <PlusIcon className="h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>
    </Card>
  );
}
