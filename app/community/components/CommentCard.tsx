"use client";

import { useState } from "react";
import { Comment } from "../lib/types";
import { formatRelativeTime, formatNumber } from "../lib/utils";
import { commentsState, currentUserState } from "../lib/recoilAtoms";
import { useRecoilValueCompat, useSetRecoilStateCompat } from "../lib/recoil-compat";

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
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
      {error && <div className="mb-2 text-sm text-red-500">{error}</div>}

      <div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <span className="font-medium text-gray-900 dark:text-gray-100">{comment.username}</span>
        <span className="mx-1">•</span>
        <span>{formatRelativeTime(comment.createdAt)}</span>
      </div>

      <div className="mb-3 text-gray-800 dark:text-gray-200">{comment.content}</div>

      <div className="flex items-center text-sm">
        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
          <button
            onClick={() => handleVote(1)}
            className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
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
          </button>

          <span className="font-medium">{formatNumber(comment.voteStatus)}</span>

          <button
            onClick={() => handleVote(-1)}
            className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
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
          </button>
        </div>

        <button className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          Reply
        </button>

        {currentUser?.id === comment.userId && (
          <button className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
