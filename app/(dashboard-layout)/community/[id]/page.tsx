"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { communitiesState, postsState } from "@/app/community/lib/recoilAtoms";
import CommunityHeader from "@/app/community/components/CommunityHeader";
import PostCard from "@/app/community/components/PostCard";
import { useRecoilValueCompat } from "@/app/community/lib/recoil-compat";
import type { Community, Post } from "@/app/community/lib/types";
import { useCreatePostModal } from "@/app/community/components/CreatePostProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";

export default function CommunityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { openCreatePostModal } = useCreatePostModal();

  // Use our compatibility hook with proper error handling
  let communities: Community[] = [];
  let posts: Post[] = [];

  try {
    communities = useRecoilValueCompat<Community[]>(communitiesState);
    posts = useRecoilValueCompat<Post[]>(postsState);

    // Reset error state if successful
    if (error) setError(null);
  } catch (err) {
    console.error("Failed to load data:", err);
    setError("Unable to load community data. Please try refreshing the page.");
  }

  // Safe find with optional chaining
  const community = communities?.find((c) => c.id === params.id);
  // Safe filter with optional chaining
  const communityPosts = posts?.filter((post) => post.communityId === params.id) || [];

  const filteredPosts = communityPosts.filter(
    (post) =>
      post?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post?.tags && post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (error) {
    return (
      <div className="p-4">
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.push("/community")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Back to Communities
        </button>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="p-4 text-center">
        <h2 className="mb-2 text-xl font-bold">Community Not Found</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The community you're looking for doesn't exist or couldn't be loaded.
        </p>
        <button
          onClick={() => router.push("/community")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Back to Communities
        </button>
      </div>
    );
  }

  return (
    <div>
      <CommunityHeader community={community} />

      <div className="mt-8 mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold">Posts</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button 
            onClick={() => openCreatePostModal(params.id)}
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="rounded-lg border p-6 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No posts found. Be the first to create a post!
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 