"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { communitiesState, postsState, currentUserState } from "../lib/recoilAtoms";
import { RecoilRootCompat } from "../lib/recoil-compat";
import type { Community, Post, User } from "../lib/types";
import { MinimalTiptapEditor } from "@/components/ui/custom/minimal-tiptap";
import type { Content } from "@tiptap/react";
import { FileUploadDialog } from "@/app/dashboard/(auth)/file-manager/components/file-upload-dialog";
import useFileManagerStore from "@/store/useFileManagerStore";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { useCommunities, useCurrentUser, usePosts, useCreatePost } from "../lib/mock-data-adapter";
import { MessageLengthIndicator } from "@/components/ui/custom/prompt/message-length-indicator";

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
      <div className="flex justify-center p-4">
        <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-gray-300"></div>
      </div>
    );
  }

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

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border p-6 text-center dark:border-gray-700">
        <h2 className="mb-2 text-xl font-bold">Login Required</h2>
        <p className="mb-4">You need to be logged in to create a post.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Create New Post</h1>

      {actionError && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-100">
          {actionError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <label htmlFor="community" className="mb-2 block font-medium">
            Community
          </label>
          <select
            id="community"
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            required
            className="w-full rounded-lg border bg-white p-2 dark:border-gray-600 dark:bg-gray-700">
            <option value="">Select a community</option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <label htmlFor="title" className="font-medium">
              Title
            </label>
            <MessageLengthIndicator currentLength={title.length} maxLength={maxTitleLength} />
          </div>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= maxTitleLength) {
                setTitle(e.target.value);
              }
            }}
            required
            className="w-full rounded-lg border bg-white p-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Enter a descriptive title"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block font-medium">
            Content
          </label>
          <MinimalTiptapEditor
            value={content}
            onChange={setContent}
            placeholder="Write your post content here..."
            className="min-h-40"
          />
        </div>

        <div>
          <label htmlFor="tags" className="mb-2 block font-medium">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border bg-white p-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="e.g., disability, benefits, claims"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Image (optional)</label>
          <div className="space-y-4">
            <FileUploadDialog
              customTrigger={
                <Button type="button" variant="outline" className="w-full rounded-full">
                  <Paperclip className="mr-2 h-4 w-4" />
                  {imageUrl ? "Change File" : "Attach File"}
                </Button>
              }
            />

            {imageUrl && (
              <div className="mt-2 rounded-lg border p-2 dark:border-gray-600">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Selected image:</p>
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-4 rounded-lg border px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary rounded-lg px-4 py-2 text-white hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? "Posting..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Wrapper component that provides the RecoilRootCompat context
export default function NewPostPage() {
  return (
    <RecoilRootCompat>
      <NewPostContent />
    </RecoilRootCompat>
  );
}
