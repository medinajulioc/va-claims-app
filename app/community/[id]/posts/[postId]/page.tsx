"use client";

import React, { useState } from "react";
import {
  communitiesState,
  postsState,
  commentsState,
  currentUserState
} from "../../../lib/recoilAtoms";
import CommentCard from "../../../components/CommentCard";
import Link from "next/link";
import { formatDate } from "../../../lib/utils";
import { useRecoilValueCompat, useSetRecoilStateCompat } from "../../../lib/recoil-compat";
import type { Community, Post, Comment, User } from "../../../lib/types";
import { useRouter } from "next/navigation";
import { MinimalTiptapEditor } from "@/components/ui/custom/minimal-tiptap";
import type { Content } from "@tiptap/react";

export default function PostDetailPage({ params }: { params: { id: string; postId: string } }) {
  const router = useRouter();
  const [commentText, setCommentText] = useState<Content>("");
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Use our compatibility hook with proper error handling
  let communities: Community[] = [];
  let posts: Post[] = [];
  let comments: Comment[] = [];
  let currentUser: User | null = null;
  let setComments: (newComments: Comment[]) => void = () => {};

  try {
    communities = useRecoilValueCompat<Community[]>(communitiesState);
    posts = useRecoilValueCompat<Post[]>(postsState);
    comments = useRecoilValueCompat<Comment[]>(commentsState);
    currentUser = useRecoilValueCompat<User | null>(currentUserState);
    setComments = useSetRecoilStateCompat(commentsState);

    // Reset error state if successful
    if (error) setError(null);
  } catch (err) {
    console.error("Failed to load data:", err);
    setError("Unable to load post data. Please try refreshing the page.");
  }

  // Safe find/filter with optional chaining
  const community = communities?.find((c) => c.id === params.id);
  const post = posts?.find((p) => p.id === params.postId);
  const postComments = comments?.filter((comment) => comment.postId === params.postId) || [];

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

  if (!post || !community) {
    return (
      <div className="p-4 text-center">
        <h2 className="mb-2 text-xl font-bold">Post Not Found</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The post you're looking for doesn't exist or couldn't be loaded.
        </p>
        <button
          onClick={() => router.push("/community")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Back to Communities
        </button>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!commentText || !currentUser) return;

    setActionError("");

    try {
      // Convert TipTap content to a string if it's not already
      const contentString =
        typeof commentText === "string" ? commentText : JSON.stringify(commentText);

      const newComment = {
        id: `comment-${Date.now()}`,
        postId: post.id,
        userId: currentUser.id,
        username: currentUser.username,
        content: contentString,
        createdAt: new Date(),
        voteStatus: 0
      };

      setComments([...comments, newComment]);
      setCommentText(""); // Reset comment text
    } catch (err) {
      console.error("Error adding comment:", err);
      setActionError("Failed to add comment. Please try again.");
    }
  };

  // Check if comment is empty for button disabling
  const isCommentEmpty = () => {
    if (!commentText) return true;
    if (typeof commentText === "string") return commentText.trim() === "";
    // For JSON content, check if it's just an empty paragraph
    if (typeof commentText === "object" && commentText.type === "doc") {
      const content = commentText.content;
      if (!content || content.length === 0) return true;
      if (
        content.length === 1 &&
        content[0].type === "paragraph" &&
        (!content[0].content || content[0].content.length === 0)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          href={`/community/${community.id}`}
          className="mb-4 inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400">
          <svg
            className="mr-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to {community.name}
        </Link>

        <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Posted by {post.username} • {formatDate(post.createdAt)}
              </span>
            </div>
          </div>

          <h1 className="mb-4 text-2xl font-bold">{post.title}</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {post.imageUrl && (
            <div className="mt-4">
              <img
                src={post.imageUrl}
                alt="Post image"
                className="max-h-96 rounded-lg object-contain"
              />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold">Comments ({postComments.length})</h2>

        {actionError && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-100">
            {actionError}
          </div>
        )}

        {currentUser ? (
          <div className="mb-6 rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3">
              <MinimalTiptapEditor
                value={commentText}
                onChange={setCommentText}
                placeholder="Write a comment..."
                className="min-h-24"
              />
            </div>
            <button
              onClick={handleAddComment}
              disabled={isCommentEmpty()}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400">
              Post Comment
            </button>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
            <p>You need to be logged in to comment.</p>
          </div>
        )}

        <div className="space-y-4">
          {postComments.length > 0 ? (
            postComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
          ) : (
            <div className="rounded-lg border p-4 text-center dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
