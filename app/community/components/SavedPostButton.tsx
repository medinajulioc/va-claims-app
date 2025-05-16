"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface SavedPostButtonProps {
  postId: string;
  initialSaved?: boolean;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export function SavedPostButton({
  postId,
  initialSaved = false,
  variant = "ghost",
  size = "sm",
  className = "",
  showText = false
}: SavedPostButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Check localStorage on mount to see if this post was saved
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    setIsSaved(savedPosts.includes(postId));
  }, [postId]);

  const toggleSaved = async () => {
    try {
      setIsUpdating(true);

      // In a real app, this would be an API call
      // For now, we'll use localStorage to simulate persistence
      const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");

      let updatedSavedPosts;
      if (isSaved) {
        updatedSavedPosts = savedPosts.filter((id: string) => id !== postId);
      } else {
        updatedSavedPosts = [...savedPosts, postId];
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      localStorage.setItem("savedPosts", JSON.stringify(updatedSavedPosts));
      setIsSaved(!isSaved);

      toast({
        title: isSaved ? "Post removed from saved items" : "Post saved successfully",
        description: isSaved
          ? "The post has been removed from your saved items."
          : "You can find this post in your saved items.",
        duration: 3000
      });
    } catch (error) {
      console.error("Error toggling saved status:", error);
      toast({
        title: "Error",
        description: "There was a problem saving this post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "gap-1.5 transition-all",
        isSaved && "text-primary hover:text-primary/80",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved();
      }}
      disabled={isUpdating}>
      {isSaved ? (
        <BookmarkCheck className={cn("h-[1.2em] w-[1.2em]", isUpdating && "animate-pulse")} />
      ) : (
        <Bookmark className={cn("h-[1.2em] w-[1.2em]", isUpdating && "animate-pulse")} />
      )}
      {showText && <span className="text-sm">{isSaved ? "Saved" : "Save"}</span>}
    </Button>
  );
}

export default SavedPostButton;
