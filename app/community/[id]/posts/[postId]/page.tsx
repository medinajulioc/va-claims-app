"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import {
  usePosts,
  useCommunities,
  useComments,
  useCreateComment,
  useCurrentUser
} from "@/app/community/lib/mock-data-adapter";
import { CommunityProvider } from "@/app/community/lib/community-provider";
import { formatRelativeTime } from "@/app/community/lib/utils";
import CommunitySidebar from "@/app/community/components/shared/CommunitySidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, MessageSquare, Share2, Bookmark } from "lucide-react";
import Link from "next/link";

interface PostDetailPageProps {
  params: {
    id: string;
    postId: string;
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id: communityId, postId } = params;
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get data from our mock data adapter
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: communities, isLoading: communitiesLoading } = useCommunities();
  const { data: comments, isLoading: commentsLoading } = useComments(postId);
  const { user: currentUser } = useCurrentUser();
  const { createComment, isLoading: commentSubmitting } = useCreateComment();

  // Find the post and community
  const post = posts.find((p) => p.id === postId);
  const community = communities.find((c) => c.id === communityId);

  // If post or community not found and not loading, show 404
  useEffect(() => {
    if (!postsLoading && !communitiesLoading && (!post || !community)) {
      notFound();
    }
  }, [post, community, postsLoading, communitiesLoading]);

  // Handle comment submission
  const handleSubmitComment = () => {
    if (!commentContent.trim()) return;

    try {
      createComment(postId, commentContent);
      setCommentContent("");
      setError(null);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment. Please try again.");
    }
  };

  // Show loading state
  if (postsLoading || communitiesLoading || !post || !community) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <CommunityProvider>
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Main content area */}
          <div className="space-y-6 md:col-span-2 lg:col-span-3">
            {/* Post detail */}
            <Card className="overflow-hidden">
              <div className="flex">
                {/* Vote buttons */}
                <div className="bg-muted flex w-12 flex-col items-center py-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label="Upvote">
                    <ChevronUp className="h-5 w-5" />
                  </Button>

                  <span className="my-1 font-medium">{post.voteStatus}</span>

                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label="Downvote">
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>

                {/* Post content */}
                <div className="flex-1 p-4">
                  <div className="text-muted-foreground mb-2 flex items-center text-xs">
                    <Link href={`/community/${communityId}`}>
                      <Badge variant="outline" className="hover:bg-secondary mr-2">
                        {community.name}
                      </Badge>
                    </Link>
                    <span>Posted by {post.username}</span>
                    <span className="mx-1">•</span>
                    <span>{formatRelativeTime(post.createdAt)}</span>
                  </div>

                  <h1 className="mb-4 text-2xl font-semibold">{post.title}</h1>

                  <div className="mb-4 whitespace-pre-wrap">{post.content}</div>

                  {post.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="max-h-96 rounded-md object-contain"
                      />
                    </div>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                    <div className="hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-md px-2 py-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{comments.length} comments</span>
                    </div>

                    <Button variant="ghost" size="sm" className="h-auto px-2 py-1">
                      <Share2 className="mr-1 h-4 w-4" />
                      <span>Share</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="h-auto px-2 py-1">
                      <Bookmark className="mr-1 h-4 w-4" />
                      <span>Save</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Comment form */}
            <Card className="p-4">
              <h2 className="mb-4 text-lg font-semibold">Comments</h2>

              {currentUser ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      {currentUser.imageUrl ? (
                        <img
                          src={currentUser.imageUrl}
                          alt={currentUser.username}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full">
                          {currentUser.username.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{currentUser.username}</p>
                    </div>
                  </div>

                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="min-h-[100px]"
                  />

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!commentContent.trim() || commentSubmitting}>
                      {commentSubmitting ? "Submitting..." : "Comment"}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center">Sign in to leave a comment</p>
              )}

              {/* Comments list */}
              <div className="mt-6 space-y-4">
                {commentsLoading ? (
                  <div className="flex h-20 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-t pt-4">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full">
                            {comment.username.substring(0, 2).toUpperCase()}
                          </div>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{comment.username}</p>
                            <span className="text-muted-foreground text-xs">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About this community */}
            <Card className="p-4">
              <h3 className="mb-2 font-semibold">About {community.name}</h3>
              <p className="text-muted-foreground text-sm">{community.description}</p>

              <div className="mt-4 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(community.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between border-t py-1">
                  <span className="text-muted-foreground">Members</span>
                  <span>{community.members}</span>
                </div>
              </div>

              <div className="mt-4 border-t pt-3">
                <Link
                  href={`/community/${communityId}`}
                  className="text-primary text-sm hover:underline">
                  View Community
                </Link>
              </div>
            </Card>

            {/* Other communities */}
            <CommunitySidebar />
          </div>
        </div>
      </main>
    </CommunityProvider>
  );
}
