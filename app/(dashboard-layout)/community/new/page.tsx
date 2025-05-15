"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { communitiesState, postsState, currentUserState } from "@/app/community/lib/recoilAtoms";
import type { Community, Post, User } from "@/app/community/lib/types";
import { MinimalTiptapEditor } from "@/components/ui/custom/minimal-tiptap";
import type { Content } from "@tiptap/react";
import { FileUploadDialog } from "@/app/dashboard/(auth)/file-manager/components/file-upload-dialog";
import useFileManagerStore from "@/store/useFileManagerStore";
import { Button } from "@/components/ui/button";
import { Paperclip, ArrowLeft } from "lucide-react";
import { useCommunities, useCurrentUser, usePosts, useCreatePost } from "@/app/community/lib/mock-data-adapter";
import { MessageLengthIndicator } from "@/components/ui/custom/prompt/message-length-indicator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecoilRootCompat } from "@/app/community/lib/recoil-compat";
import { useRecoilValueCompat } from "@/app/community/lib/recoil-compat";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function NewPostContent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Content>("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const maxTitleLength = 100;

  // Use direct mock data adapter hooks instead of recoil
  const { data: communities, isLoading: communitiesLoading } = useCommunities();
  const { user: currentUser, isLoading: userLoading } = useCurrentUser();
  const { createPost } = useCreatePost();

  // Get the most recent uploaded file to use as post image
  const { files } = useFileManagerStore();

  // Loading state
  const isLoading = communitiesLoading || userLoading;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content || !selectedCommunity) return;

    setIsSubmitting(true);
    setActionError("");

    try {
      // Convert TipTap content to a string if it's not already
      const contentString = typeof content === "string" ? content : JSON.stringify(content);

      const newPost = {
        communityId: selectedCommunity,
        title: title.trim(),
        content: contentString,
        imageUrl: imageUrl || undefined,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      };

      // Use the createPost function from the hook
      createPost(newPost);
      router.push(`/community/${selectedCommunity}`);
    } catch (err) {
      console.error("Error creating post:", err);
      setActionError("Failed to create post. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
            <p>{error}</p>
          </div>
          <Button variant="default" onClick={() => router.push("/community")}>
            Back to Communities
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You need to be logged in to create a post.</p>
          <Button variant="default" onClick={() => router.push("/login")}>
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/community">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to communities</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Post</h1>
      </div>

      {actionError && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {actionError}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="community">Community</Label>
              <Select 
                value={selectedCommunity} 
                onValueChange={setSelectedCommunity}
                required
              >
                <SelectTrigger id="community">
                  <SelectValue placeholder="Select a community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="title">Title</Label>
                <MessageLengthIndicator currentLength={title.length} maxLength={maxTitleLength} />
              </div>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= maxTitleLength) {
                    setTitle(e.target.value);
                  }
                }}
                required
                placeholder="Enter a descriptive title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="rounded-md border">
                <MinimalTiptapEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your post content here..."
                  className="min-h-40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., disability, benefits, claims"
              />
            </div>

            <div className="space-y-2">
              <Label>Image (optional)</Label>
              <div className="space-y-4">
                <FileUploadDialog
                  customTrigger={
                    <Button type="button" variant="outline" className="w-full">
                      <Paperclip className="mr-2 h-4 w-4" />
                      {imageUrl ? "Change File" : "Attach File"}
                    </Button>
                  }
                />

                {imageUrl && (
                  <div className="mt-2 rounded-lg border p-2">
                    <p className="mb-2 text-sm text-muted-foreground">Selected image:</p>
                    <div className="relative h-40 w-full overflow-hidden rounded-md">
                      <img src={imageUrl} alt="Post image" className="h-full w-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => setImageUrl("")}>
                        <span className="sr-only">Remove image</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/community")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim() || !content || !selectedCommunity}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <RecoilRootCompat>
      <NewPostContent />
    </RecoilRootCompat>
  );
} 