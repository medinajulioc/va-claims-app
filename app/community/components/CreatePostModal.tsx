"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { MinimalTiptapEditor } from "@/components/ui/custom/minimal-tiptap";
import type { Content } from "@tiptap/react";
import { FileUploadDialog } from "@/app/dashboard/(auth)/file-manager/components/file-upload-dialog";
import useFileManagerStore from "@/store/useFileManagerStore";
import { Button } from "@/components/ui/button";
import { Paperclip, Loader2, X } from "lucide-react";
import {
  useCommunities,
  useCurrentUser,
  useCreatePost
} from "@/app/community/lib/mock-data-adapter";
import { MessageLengthIndicator } from "@/components/ui/custom/prompt/message-length-indicator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCommunityId?: string;
}

export function CreatePostModal({ open, onOpenChange, defaultCommunityId }: CreatePostModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Content>("");
  const [selectedCommunity, setSelectedCommunity] = useState(defaultCommunityId || "");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const maxTitleLength = 100;

  // Use direct mock data adapter hooks
  const { data: communities, isLoading: communitiesLoading } = useCommunities();
  const { user: currentUser, isLoading: userLoading } = useCurrentUser();
  const { createPost } = useCreatePost();

  // Get the most recent uploaded file to use as post image
  const { files } = useFileManagerStore();

  // Reset form when modal is opened
  useEffect(() => {
    if (open) {
      setTitle("");
      setContent("");
      setSelectedCommunity(defaultCommunityId || "");
      setTags("");
      setImageUrl("");
      setActionError(null);
    }
  }, [open, defaultCommunityId]);

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

      // Close the modal
      onOpenChange(false);

      // Navigate to the community page
      router.push(`/community/${selectedCommunity}`);
    } catch (err) {
      console.error("Error creating post:", err);
      setActionError("Failed to create post. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Loading state
  const isLoading = communitiesLoading || userLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Post</DialogTitle>
          <DialogClose className="absolute top-4 right-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        {actionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-community">Community</Label>
                <Select value={selectedCommunity} onValueChange={setSelectedCommunity} required>
                  <SelectTrigger id="modal-community">
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
                  <Label htmlFor="modal-title">Title</Label>
                  <MessageLengthIndicator currentLength={title.length} maxLength={maxTitleLength} />
                </div>
                <Input
                  id="modal-title"
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
                <Label htmlFor="modal-content">Content</Label>
                <div className="rounded-md border">
                  <MinimalTiptapEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your post content here..."
                    className="min-h-32"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-tags">Tags (comma separated)</Label>
                <Input
                  id="modal-tags"
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
                      <p className="text-muted-foreground mb-2 text-sm">Selected image:</p>
                      <div className="relative h-40 w-full overflow-hidden rounded-md">
                        <img
                          src={imageUrl}
                          alt="Post image"
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => setImageUrl("")}>
                          <span className="sr-only">Remove image</span>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content || !selectedCommunity}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
