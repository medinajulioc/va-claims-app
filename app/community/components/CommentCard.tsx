"use client";

import { useState } from "react";
import { Comment } from "../lib/types";
import { formatRelativeTime, formatNumber } from "../lib/utils";
import { commentsState, currentUserState } from "../lib/recoilAtoms";
import { useRecoilValueCompat, useSetRecoilStateCompat } from "../lib/recoil-compat";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const [error, setError] = useState<string | null>(null);

  // Use our compatibility hook with proper error handling
  let comments: Comment[] = [];
  let currentUser = null;
  let setComments = (newComments: Comment[]) => {};

  try {
    comments = useRecoilValueCompat<Comment[]>(commentsState);
    currentUser = useRecoilValueCompat(currentUserState);
    setComments = useSetRecoilStateCompat(commentsState);

    // Reset error state if successful
    if (error) setError(null);
  } catch (err) {
    console.error("Failed to load comment data:", err);
    // We'll handle the empty state gracefully
  }

  const handleVote = (value: number) => {
    if (!currentUser) return;

    try {
      const updatedComments = comments.map((c) => {
        if (c.id === comment.id) {
          return {
            ...c,
            voteStatus: c.voteStatus + value
          };
        }
        return c;
      });

      setComments(updatedComments);
    } catch (err) {
      console.error("Error updating vote:", err);
      setError("Failed to update vote. Please try again.");
    }
  };

  return (
    <div className="bg-muted rounded-lg p-4">
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-muted-foreground mb-2 flex items-center text-sm">
        <span className="font-medium">{comment.username}</span>
        <span className="mx-1">•</span>
        <span>{formatRelativeTime(comment.createdAt)}</span>
      </div>

      <div className="mb-3">{comment.content}</div>

      <div className="flex items-center text-sm">
        <div className="text-muted-foreground flex items-center space-x-1">
          <Button
            onClick={() => handleVote(1)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            aria-label="Upvote">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </Button>

          <span className="font-medium">{formatNumber(comment.voteStatus)}</span>

          <Button
            onClick={() => handleVote(-1)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            aria-label="Downvote">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="text-muted-foreground ml-4 h-auto p-0">
          Reply
        </Button>

        {currentUser?.id === comment.userId && (
          <Button variant="ghost" size="sm" className="text-muted-foreground ml-4 h-auto p-0">
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
