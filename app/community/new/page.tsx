"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { communitiesState, postsState, currentUserState } from "../lib/recoilAtoms";
import { useRecoilValueCompat, useSetRecoilStateCompat } from "../lib/recoil-compat";
import type { Community, Post, User } from "../lib/types";
import { MinimalTiptapEditor } from "@/components/ui/custom/minimal-tiptap";
import type { Content } from "@tiptap/react";
import { FileUploadDialog } from "@/app/dashboard/(auth)/file-manager/components/file-upload-dialog";
import useFileManagerStore from "@/store/useFileManagerStore";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Content>("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Get the most recent uploaded file to use as post image
  const { files } = useFileManagerStore();

  // Use our compatibility hook with proper error handling
  let communities: Community[] = [];
  let posts: Post[] = [];
  let currentUser: User | null = null;
  let setPosts: (newPosts: Post[]) => void = () => {};

  try {
    communities = useRecoilValueCompat<Community[]>(communitiesState);
    posts = useRecoilValueCompat<Post[]>(postsState);
    currentUser = useRecoilValueCompat<User | null>(currentUserState);
    setPosts = useSetRecoilStateCompat(postsState);

    // Reset error state if successful
    if (error) setError(null);
  } catch (err) {
    console.error("Failed to load data:", err);
    setError("Unable to load community data. Please try refreshing the page.");
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

  // Update imageUrl when a new file is uploaded
  React.useEffect(() => {
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
        id: `post-${Date.now()}`,
        communityId: selectedCommunity,
        title: title.trim(),
        content: contentString,
        userId: currentUser.id,
        username: currentUser.username,
        createdAt: new Date(),
        voteStatus: 0,
        commentCount: 0,
        imageUrl: imageUrl || undefined,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      };

      setPosts([...posts, newPost]);
      router.push(`/community/${selectedCommunity}`);
    } catch (err) {
      console.error("Error creating post:", err);
      setActionError("Failed to create post. Please try again.");
      setIsSubmitting(false);
    }
  };

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
          <label htmlFor="title" className="mb-2 block font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
                <Button type="button" variant="outline" className="w-full">
                  <Image className="mr-2 h-4 w-4" />
                  {imageUrl ? "Change Image" : "Add Image"}
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
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400">
            {isSubmitting ? "Posting..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
