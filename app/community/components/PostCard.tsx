"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "../lib/types";
import { formatRelativeTime, formatNumber } from "../lib/utils";
import { postsState } from "../lib/recoilAtoms";
import { useRecoilValueCompat, useSetRecoilStateCompat } from "../lib/recoil-compat";

interface PostCardProps {
  post: Post;
  communityName?: string;
}

export default function PostCard({ post, communityName }: PostCardProps) {
  const [error, setError] = useState<string | null>(null);

  // Use our compatibility hook with proper error handling
  let posts: Post[] = [];
  let setPosts = (newPosts: Post[]) => {};

  try {
    posts = useRecoilValueCompat<Post[]>(postsState);
    setPosts = useSetRecoilStateCompat(postsState);

    // Reset error state if successful
    if (error) setError(null);
  } catch (err) {
    console.error("Failed to load post data:", err);
    // We'll handle the empty state gracefully
  }

  const handleVote = (value: number) => {
    try {
      const updatedPosts = posts.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            voteStatus: p.voteStatus + value
          };
        }
        return p;
      });
      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error updating vote:", err);
      setError("Failed to update vote. Please try again.");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {error && (
        <div className="bg-red-100 p-2 text-center text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex">
        {/* Vote buttons */}
        <div className="flex w-12 flex-col items-center bg-gray-50 py-2 dark:bg-gray-900">
          <button
            onClick={() => handleVote(1)}
            className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Upvote">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 dark:text-gray-400"
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

          <span className="my-1 font-medium text-gray-800 dark:text-gray-200">
            {formatNumber(post.voteStatus)}
          </span>

          <button
            onClick={() => handleVote(-1)}
            className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Downvote">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 dark:text-gray-400"
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

        {/* Post content */}
        <div className="flex-1 p-4">
          <div className="mb-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            {communityName && (
              <>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {communityName}
                </span>
                <span className="mx-1">•</span>
              </>
            )}
            <span>Posted by {post.username}</span>
            <span className="mx-1">•</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>

          <Link href={`/community/${post.communityId}/posts/${post.id}`}>
            <h2 className="mb-2 text-xl font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
              {post.title}
            </h2>
          </Link>

          <div className="mb-3 line-clamp-3 text-gray-700 dark:text-gray-300">{post.content}</div>

          {post.imageUrl && (
            <div className="mb-3">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="max-h-60 rounded-md object-cover"
              />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Link
              href={`/community/${post.communityId}/posts/${post.id}`}
              className="mr-4 flex items-center hover:text-gray-700 dark:hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post.commentCount} comments</span>
            </Link>

            <button className="mr-4 flex items-center hover:text-gray-700 dark:hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </button>

            <button className="flex items-center hover:text-gray-700 dark:hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
