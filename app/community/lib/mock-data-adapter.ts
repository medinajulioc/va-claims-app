"use client";

import { useRecoilValueCompat, useSetRecoilStateCompat } from "./recoil-compat";
import { postsState, communitiesState, currentUserState, commentsState } from "./recoilAtoms";
import type { Post, Community, User, Comment } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

// MOCK DATA ADAPTERS
// These hooks provide a consistent interface that can be replaced with real API calls later
// without changing the components that use them

/**
 * Hook to access all posts with mock data
 */
export function usePosts() {
  // MOCK: Using Recoil for mock data
  const posts = useRecoilValueCompat<Post[]>(postsState);

  return {
    data: posts || [],
    isLoading: false,
    error: null
  };

  // FUTURE IMPLEMENTATION:
  // const { data, isLoading, error } = useQuery(['posts'], fetchPosts);
  // return { data: data || [], isLoading, error };
}

/**
 * Hook to access all communities with mock data
 */
export function useCommunities() {
  // MOCK: Using Recoil for mock data
  const communities = useRecoilValueCompat<Community[]>(communitiesState);

  return {
    data: communities || [],
    isLoading: false,
    error: null
  };
}

/**
 * Hook to access the current user with mock session
 */
export function useCurrentUser() {
  // MOCK: Using Recoil for mock user session
  const currentUser = useRecoilValueCompat<User | null>(currentUserState);
  const setCurrentUser = useSetRecoilStateCompat(currentUserState);

  // In development mode, ensure we always have a mock user
  useEffect(() => {
    const isDevelopment =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (isDevelopment && (!currentUser || !currentUser.imageUrl)) {
      // Set a mock user for development with proper avatar path
      setCurrentUser({
        id: "mock-user-1",
        username: "DeveloperUser",
        email: "dev@example.com",
        imageUrl: `${process.env.ASSETS_URL}/avatars/01.png`,
        joinedCommunities: ["1", "2", "3", "4", "5"]
      });
    }
  }, [currentUser, setCurrentUser]);

  return {
    user: currentUser,
    isLoading: false,
    error: null
  };

  // FUTURE IMPLEMENTATION:
  // const { data: session, status } = useSession();
  // return {
  //   user: session?.user || null,
  //   isLoading: status === 'loading',
  //   error: null
  // };
}

/**
 * Hook to access comments for a specific post
 */
export function useComments(postId?: string) {
  const allComments = useRecoilValueCompat<Comment[]>(commentsState);

  const filteredComments = postId
    ? allComments.filter((comment) => comment.postId === postId)
    : allComments;

  return {
    data: filteredComments,
    isLoading: false,
    error: null
  };
}

/**
 * Hook to create a new post with mock data
 */
export function useCreatePost() {
  const setPosts = useSetRecoilStateCompat(postsState);
  const posts = useRecoilValueCompat<Post[]>(postsState);
  const currentUser = useRecoilValueCompat<User | null>(currentUserState);

  // MOCK: Function to create a post with mock data
  return {
    createPost: (
      newPost: Omit<
        Post,
        "id" | "createdAt" | "voteStatus" | "commentCount" | "userId" | "username"
      >
    ) => {
      if (!currentUser) throw new Error("User must be logged in to create a post");

      const post: Post = {
        ...newPost,
        id: `post-${uuidv4()}`,
        userId: currentUser.id,
        username: currentUser.username,
        createdAt: new Date(),
        voteStatus: 0,
        commentCount: 0
      };

      setPosts([...posts, post]);
      return post;
    },
    isLoading: false,
    error: null
  };

  // FUTURE IMPLEMENTATION:
  // const mutation = useMutation(createPostAPI);
  // return {
  //   createPost: mutation.mutate,
  //   isLoading: mutation.isLoading,
  //   error: mutation.error
  // };
}

/**
 * Hook to create a new comment with mock data
 */
export function useCreateComment() {
  const setComments = useSetRecoilStateCompat(commentsState);
  const comments = useRecoilValueCompat<Comment[]>(commentsState);
  const currentUser = useRecoilValueCompat<User | null>(currentUserState);

  return {
    createComment: (postId: string, content: string) => {
      if (!currentUser) throw new Error("User must be logged in to comment");

      const newComment: Comment = {
        id: `comment-${uuidv4()}`,
        postId,
        userId: currentUser.id,
        username: currentUser.username,
        content,
        createdAt: new Date(),
        voteStatus: 0
      };

      setComments([...comments, newComment]);
      return newComment;
    },
    isLoading: false,
    error: null
  };
}

/**
 * Hook to vote on a post with mock data
 */
export function useVotePost() {
  const setPosts = useSetRecoilStateCompat(postsState);
  const posts = useRecoilValueCompat<Post[]>(postsState);

  return {
    votePost: (postId: string, value: number) => {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            voteStatus: post.voteStatus + value
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    },
    isLoading: false,
    error: null
  };
}
