"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CommunityPostCard } from "@/app/community/components/CommunityPostCard";
import { CommunityMemberCard } from "@/app/community/components/CommunityMemberCard";
import { CommunityHeader } from "@/app/community/components/CommunityHeader";
import { Button } from "@/components/ui/button";
import { MessageLengthIndicator } from "@/components/ui/custom/prompt/message-length-indicator";
import { Input } from "@/components/ui/input";
import { FileUploadDialog } from "@/app/dashboard/(auth)/file-manager/components/file-upload-dialog";
import useFileManagerStore from "@/store/useFileManagerStore";
import {
  useCommunity,
  usePosts,
  useCurrentUser,
  useCreatePost
} from "@/app/community/lib/mock-data-adapter";
import { Send, Paperclip, X } from "lucide-react";
import { MinimalTiptapEditor } from "@/components/ui/custom/minimal-tiptap/minimal-tiptap";
import type { Content } from "@tiptap/react";

// New Community Post Input component that mimics the chat interface
function CommunityPostInput({ communityId }: { communityId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Content>("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxTitleLength = 100;
  const { files } = useFileManagerStore();
  const { createPost } = useCreatePost();
  const router = useSearchParams();

  // Update imageUrl when a new file is uploaded
  useEffect(() => {
    if (files.length > 0) {
      // Get the most recently added file with an image type
      const latestImageFile = [...files]
        .reverse()
        .find(
          (file) =>
            file.type.startsWith("image/") ||
            file.name.endsWith(".jpg") ||
            file.name.endsWith(".png") ||
            file.name.endsWith(".jpeg")
        );

      if (latestImageFile && latestImageFile.url) {
        setImageUrl(latestImageFile.url);
      }
    }
  }, [files]);

  const handleSubmit = () => {
    if (!title.trim() || !content) return;

    setIsSubmitting(true);

    try {
      // Convert TipTap content to a string if it's not already
      const contentString = typeof content === "string" ? content : JSON.stringify(content);

      const newPost = {
        communityId,
        title: title.trim(),
        content: contentString,
        imageUrl: imageUrl || undefined,
        tags: []
      };

      // Use the createPost function from the hook
      createPost(newPost);

      // Reset form after submission
      setTitle("");
      setContent("");
      setImageUrl("");
      setIsSubmitting(false);
    } catch (err) {
      console.error("Error creating post:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2 mb-6 w-full">
      <div className="border-border/80 bg-background/80 dark:bg-background/40 rounded-lg border p-3 shadow-sm">
        <div className="mb-2">
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="post-title" className="text-sm font-medium">
              Title
            </label>
            <MessageLengthIndicator currentLength={title.length} maxLength={maxTitleLength} />
          </div>
          <Input
            id="post-title"
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= maxTitleLength) {
                setTitle(e.target.value);
              }
            }}
            placeholder="What's on your mind?"
            className="border-border/60 bg-background/60 focus-visible:border-primary/80 h-10"
          />
        </div>

        <div className="relative">
          <MinimalTiptapEditor
            value={content}
            onChange={setContent}
            placeholder="Share your thoughts, questions, or insights..."
            className="border-border/60 bg-background/60 min-h-32"
          />
        </div>

        {imageUrl && (
          <div className="mt-3 rounded-md border p-2">
            <div className="relative mb-1 flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Attached Image</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setImageUrl("")}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative h-32 w-full overflow-hidden rounded-md">
              <img src={imageUrl} alt="Post image" className="h-full w-full object-cover" />
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileUploadDialog
              customTrigger={
                <Button type="button" variant="ghost" size="icon" className="rounded-full">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach File</span>
                </Button>
              }
            />
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !content || isSubmitting}
            className="gap-1 rounded-full">
            <Send className="h-4 w-4" />
            <span>Post</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage({ params }: { params: { id: string } }) {
  const {
    data: community,
    isLoading: communityLoading,
    error: communityError
  } = useCommunity(params.id);
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts(params.id);
  const { user, isLoading: userLoading } = useCurrentUser();

  // Error and loading states
  const isLoading = communityLoading || postsLoading || userLoading;
  const error = communityError || postsError;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="mt-8 flex justify-center">
          <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-gray-300"></div>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <p>Error loading community: {error || "Community not found"}</p>
        </div>
        <Link href="/community" className="mt-4 inline-block text-blue-500 hover:underline">
          Back to Communities
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <CommunityHeader community={community} />

      {user && <CommunityPostInput communityId={params.id} />}

      {!user && (
        <div className="mb-6 text-center">
          <p className="text-muted-foreground mb-2 text-sm">
            You need to be logged in to post in this community.
          </p>
        </div>
      )}

      <div className="my-6">
        <h2 className="mb-4 text-xl font-bold">Recent Posts</h2>
        <div className="grid gap-4">
          {posts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center dark:border-gray-700">
              <p className="text-muted-foreground">
                No posts in this community yet. Be the first to post!
              </p>
            </div>
          ) : (
            posts.map((post) => <CommunityPostCard key={post.id} post={post} />)
          )}
        </div>
      </div>

      <div className="my-6">
        <h2 className="mb-4 text-xl font-bold">Members</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {community.members.map((member) => (
            <CommunityMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
